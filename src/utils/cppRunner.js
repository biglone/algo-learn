const RUN_CPP_ENDPOINT = '/api/run/cpp'

export async function runCppCode({ code, input = '' }) {
    const response = await fetch(RUN_CPP_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, input }),
    })

    let payload = null
    try {
        payload = await response.json()
    } catch {
        payload = null
    }

    if (!response.ok) {
        const message = payload?.message || `C++ 服务请求失败（${response.status}）`
        throw new Error(message)
    }

    return payload
}

export function parseCppRunResult(result) {
    const compile = result?.compile || {}
    if (!compile.success) {
        const stderr = [compile.stderr, compile.stdout, compile.error].filter(Boolean).join('\n').trim()
        if (compile.timedOut) {
            return {
                type: 'error',
                statusText: '编译超时，请精简代码后重试。',
                stdout: '',
                stderr: stderr || '编译超时。',
            }
        }
        if (compile.outputLimited) {
            return {
                type: 'error',
                statusText: '编译输出过长，已中断。',
                stdout: '',
                stderr: stderr || '编译日志过长。',
            }
        }
        return {
            type: 'error',
            statusText: '编译失败，请检查语法错误。',
            stdout: '',
            stderr: stderr || '编译失败。',
        }
    }

    const run = result?.run || {}
    const stdout = (run.stdout || '').trimEnd()
    const stderr = [run.stderr, run.error].filter(Boolean).join('\n').trim()

    if (run.timedOut) {
        return {
            type: 'error',
            statusText: '运行超时，请检查死循环或复杂度。',
            stdout,
            stderr: stderr || '运行超时。',
        }
    }

    if (run.outputLimited) {
        return {
            type: 'error',
            statusText: '输出过长，已中断运行。',
            stdout,
            stderr: stderr || '输出过长。',
        }
    }

    if (!run.success) {
        return {
            type: 'error',
            statusText: '运行失败，请检查错误输出。',
            stdout,
            stderr: stderr || '运行失败。',
        }
    }

    return {
        type: 'ready',
        statusText: '运行完成。使用 cout 输出结果。',
        stdout,
        stderr,
    }
}

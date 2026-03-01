const RUNNER_ENDPOINTS = {
    cpp: '/api/run/cpp',
    go: '/api/run/go',
    rust: '/api/run/rust',
}

const LANGUAGE_LABELS = {
    cpp: 'C++',
    go: 'Go',
    rust: 'Rust',
}

export function getCompiledLanguageLabel(language) {
    return LANGUAGE_LABELS[language] || '编译型语言'
}

export async function runCompiledCode({ language, code, input = '' }) {
    const endpoint = RUNNER_ENDPOINTS[language]
    if (!endpoint) {
        throw new Error('不支持的编译型语言。')
    }

    const response = await fetch(endpoint, {
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
        const message = payload?.message || `${getCompiledLanguageLabel(language)} 服务请求失败（${response.status}）`
        throw new Error(message)
    }

    return payload
}

export function parseCompiledRunResult(result, language = 'cpp') {
    const label = getCompiledLanguageLabel(language)
    const compile = result?.compile || {}
    if (!compile.success) {
        const stderr = [compile.stderr, compile.stdout, compile.error].filter(Boolean).join('\n').trim()
        if (compile.timedOut) {
            return {
                type: 'error',
                statusText: `编译超时，请精简 ${label} 代码后重试。`,
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
        statusText: `运行完成。使用 ${language === 'go' ? 'fmt.Print' : language === 'rust' ? 'println!' : 'cout'} 输出结果。`,
        stdout,
        stderr,
    }
}

export async function runCppCode({ code, input = '' }) {
    return runCompiledCode({ language: 'cpp', code, input })
}

export async function runGoCode({ code, input = '' }) {
    return runCompiledCode({ language: 'go', code, input })
}

export async function runRustCode({ code, input = '' }) {
    return runCompiledCode({ language: 'rust', code, input })
}

export function parseCppRunResult(result) {
    return parseCompiledRunResult(result, 'cpp')
}

export function parseGoRunResult(result) {
    return parseCompiledRunResult(result, 'go')
}

export function parseRustRunResult(result) {
    return parseCompiledRunResult(result, 'rust')
}

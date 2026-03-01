const http = require('node:http')
const os = require('node:os')
const path = require('node:path')
const fs = require('node:fs/promises')
const { spawn } = require('node:child_process')

const PORT = Number(process.env.PORT || 8080)
const HOST = process.env.HOST || '0.0.0.0'

const MAX_BODY_BYTES = 512 * 1024
const MAX_CODE_BYTES = 256 * 1024
const MAX_INPUT_BYTES = 128 * 1024
const MAX_OUTPUT_BYTES = 256 * 1024

const COMPILE_TIMEOUT_MS = 20_000
const RUN_TIMEOUT_MS = 3_000

function sendJson(res, status, payload) {
    const content = JSON.stringify(payload)
    res.writeHead(status, {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(content),
    })
    res.end(content)
}

function sendText(res, status, content) {
    res.writeHead(status, {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Length': Buffer.byteLength(content),
    })
    res.end(content)
}

function readRequestBody(req, maxBytes) {
    return new Promise((resolve, reject) => {
        const chunks = []
        let total = 0

        req.on('data', chunk => {
            total += chunk.length
            if (total > maxBytes) {
                reject(new Error('body_too_large'))
                req.destroy()
                return
            }
            chunks.push(chunk)
        })

        req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
        req.on('error', reject)
    })
}

function safeTrimEnd(value) {
    return typeof value === 'string' ? value.trimEnd() : ''
}

function toPublicResult(result) {
    return {
        success: result.success,
        exitCode: result.exitCode,
        signal: result.signal,
        timedOut: result.timedOut,
        outputLimited: result.outputLimited,
        stdout: safeTrimEnd(result.stdout),
        stderr: safeTrimEnd(result.stderr),
        error: result.error || '',
    }
}

function runCommand(command, args, options) {
    const { cwd, input = '', timeoutMs, maxOutputBytes } = options

    return new Promise(resolve => {
        let stdoutSize = 0
        let stderrSize = 0
        let outputLimited = false
        let timedOut = false
        let internalError = ''

        const stdoutChunks = []
        const stderrChunks = []

        const child = spawn(command, args, { cwd, stdio: ['pipe', 'pipe', 'pipe'] })

        const maybeStopForOutputLimit = () => {
            if (!outputLimited && (stdoutSize > maxOutputBytes || stderrSize > maxOutputBytes)) {
                outputLimited = true
                child.kill('SIGKILL')
            }
        }

        const appendChunk = (chunk, chunks, currentSize) => {
            if (!Buffer.isBuffer(chunk)) {
                chunk = Buffer.from(chunk)
            }
            const nextSize = currentSize + chunk.length
            if (currentSize < maxOutputBytes) {
                const allowed = Math.max(0, maxOutputBytes - currentSize)
                chunks.push(chunk.subarray(0, allowed))
            }
            return nextSize
        }

        child.stdout.on('data', chunk => {
            stdoutSize = appendChunk(chunk, stdoutChunks, stdoutSize)
            maybeStopForOutputLimit()
        })

        child.stderr.on('data', chunk => {
            stderrSize = appendChunk(chunk, stderrChunks, stderrSize)
            maybeStopForOutputLimit()
        })

        child.on('error', error => {
            internalError = error instanceof Error ? error.message : 'spawn failed'
        })

        const timer = setTimeout(() => {
            timedOut = true
            child.kill('SIGKILL')
        }, timeoutMs)

        if (input) {
            child.stdin.write(input)
        }
        child.stdin.end()

        child.on('close', (code, signal) => {
            clearTimeout(timer)
            const stdout = Buffer.concat(stdoutChunks).toString('utf8')
            const stderr = Buffer.concat(stderrChunks).toString('utf8')
            const success = !timedOut && !outputLimited && !internalError && code === 0

            resolve({
                success,
                exitCode: typeof code === 'number' ? code : null,
                signal: signal || null,
                timedOut,
                outputLimited,
                stdout,
                stderr,
                error: internalError,
            })
        })
    })
}

async function handleRunGo(req, res) {
    let bodyText = ''
    try {
        bodyText = await readRequestBody(req, MAX_BODY_BYTES)
    } catch (error) {
        if (error instanceof Error && error.message === 'body_too_large') {
            sendJson(res, 413, { error: 'request_too_large', message: '请求体过大。' })
            return
        }
        sendJson(res, 400, { error: 'bad_request', message: '无法读取请求体。' })
        return
    }

    let payload = null
    try {
        payload = bodyText ? JSON.parse(bodyText) : {}
    } catch {
        sendJson(res, 400, { error: 'invalid_json', message: '请求体必须是 JSON。' })
        return
    }

    const code = typeof payload.code === 'string' ? payload.code : ''
    const input = typeof payload.input === 'string' ? payload.input : ''

    if (!code.trim()) {
        sendJson(res, 400, { error: 'empty_code', message: 'code 不能为空。' })
        return
    }
    if (Buffer.byteLength(code, 'utf8') > MAX_CODE_BYTES) {
        sendJson(res, 413, { error: 'code_too_large', message: '代码内容过大。' })
        return
    }
    if (Buffer.byteLength(input, 'utf8') > MAX_INPUT_BYTES) {
        sendJson(res, 413, { error: 'input_too_large', message: '输入内容过大。' })
        return
    }

    let workspace = ''

    try {
        workspace = await fs.mkdtemp(path.join(os.tmpdir(), 'algo-go-runner-'))
        await fs.writeFile(path.join(workspace, 'main.go'), code, 'utf8')

        const compileRaw = await runCommand('go', ['build', '-o', 'main', 'main.go'], {
            cwd: workspace,
            timeoutMs: COMPILE_TIMEOUT_MS,
            maxOutputBytes: MAX_OUTPUT_BYTES,
        })
        const compile = toPublicResult(compileRaw)

        if (!compile.success) {
            sendJson(res, 200, { ok: false, stage: 'compile', compile, run: null })
            return
        }

        const runRaw = await runCommand('./main', [], {
            cwd: workspace,
            input,
            timeoutMs: RUN_TIMEOUT_MS,
            maxOutputBytes: MAX_OUTPUT_BYTES,
        })
        const run = toPublicResult(runRaw)

        sendJson(res, 200, {
            ok: run.success,
            stage: run.success ? 'done' : 'run',
            compile,
            run,
        })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'unknown error'
        sendJson(res, 500, {
            error: 'runner_internal_error',
            message: 'Go 运行服务内部错误。',
            detail: message,
        })
    } finally {
        if (workspace) {
            await fs.rm(workspace, { recursive: true, force: true }).catch(() => {})
        }
    }
}

const server = http.createServer((req, res) => {
    const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`)

    if (req.method === 'GET' && url.pathname === '/health') {
        sendText(res, 200, 'ok')
        return
    }

    if (req.method === 'POST' && url.pathname === '/run/go') {
        handleRunGo(req, res).catch(error => {
            const message = error instanceof Error ? error.message : 'unknown error'
            sendJson(res, 500, {
                error: 'runner_internal_error',
                message: 'Go 运行服务内部错误。',
                detail: message,
            })
        })
        return
    }

    if (req.method === 'OPTIONS') {
        res.writeHead(204)
        res.end()
        return
    }

    sendJson(res, 404, { error: 'not_found', message: '接口不存在。' })
})

server.listen(PORT, HOST, () => {
    // eslint-disable-next-line no-console
    console.log(`go-runner listening on ${HOST}:${PORT}`)
})

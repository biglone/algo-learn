import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { algorithms, categories } from '../data/algorithms'
import Visualizer from '../components/Visualizer'
import { useProgress } from '../hooks/useProgress'
import { getCompiledLanguageLabel, parseCompiledRunResult, runCompiledCode } from '../utils/cppRunner'
import './Algorithm.css'

const difficultyLabel = { easy: '入门', medium: '进阶', hard: '困难' }
const PYODIDE_VERSION = '0.26.4'
const PYODIDE_INDEX_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`
const PYODIDE_SCRIPT_URL = `${PYODIDE_INDEX_URL}pyodide.js`

let pyodideLoadPromise = null

function injectScriptOnce(src) {
    return new Promise((resolve, reject) => {
        const existing = document.querySelector(`script[data-runtime="${src}"]`)
        if (existing) {
            if (existing.dataset.loaded === 'true') {
                resolve()
                return
            }
            existing.addEventListener('load', () => resolve(), { once: true })
            existing.addEventListener('error', () => reject(new Error('加载运行时脚本失败')), { once: true })
            return
        }

        const script = document.createElement('script')
        script.src = src
        script.async = true
        script.dataset.runtime = src
        script.addEventListener('load', () => {
            script.dataset.loaded = 'true'
            resolve()
        }, { once: true })
        script.addEventListener('error', () => reject(new Error('加载运行时脚本失败')), { once: true })
        document.body.appendChild(script)
    })
}

async function getPyodideInstance() {
    if (window.__algoLearnPyodide) return window.__algoLearnPyodide

    if (!pyodideLoadPromise) {
        pyodideLoadPromise = (async () => {
            if (typeof window.loadPyodide !== 'function') {
                await injectScriptOnce(PYODIDE_SCRIPT_URL)
            }
            if (typeof window.loadPyodide !== 'function') {
                throw new Error('Pyodide 初始化失败')
            }
            const instance = await window.loadPyodide({ indexURL: PYODIDE_INDEX_URL })
            window.__algoLearnPyodide = instance
            return instance
        })().catch(err => {
            pyodideLoadPromise = null
            throw err
        })
    }

    return pyodideLoadPromise
}

function pyGlobalToString(pyodide, name) {
    const value = pyodide.globals.get(name)
    if (typeof value === 'string') return value
    const text = value?.toString ? value.toString() : ''
    if (value && typeof value.destroy === 'function') value.destroy()
    return text
}

function toCamelCase(text = '') {
    const parts = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, ' ')
        .trim()
        .split(/\s+/)
        .filter(Boolean)

    if (parts.length === 0) return 'solve'

    const [first, ...rest] = parts
    const base = first + rest.map(part => part[0].toUpperCase() + part.slice(1)).join('')
    if (/^[0-9]/.test(base)) return `solve${base}`
    return base
}

function toPascalCase(text = '') {
    const base = toCamelCase(text)
    return base[0] ? `${base[0].toUpperCase()}${base.slice(1)}` : 'Solve'
}

function toSnakeCase(text = '') {
    const normalized = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '')
    if (!normalized) return 'solve'
    if (/^[0-9]/.test(normalized)) return `solve_${normalized}`
    return normalized
}

function getAlgorithmCppTemplate(algo) {
    const methodName = toCamelCase(algo?.nameEn || algo?.name || 'solve')
    return `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    // TODO: 按题意补全参数与返回值
    void ${methodName}() {
        // TODO: 实现 ${algo?.name || '该算法'} 的 C++ 版本
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    // TODO: 读取输入并调用 Solution 方法
    // 示例:
    // Solution sol;
    // sol.${methodName}();

    return 0;
}
`
}

function getAlgorithmGoTemplate(algo) {
    const methodName = toPascalCase(algo?.nameEn || algo?.name || 'solve')
    return `package main

type Solution struct{}

// TODO: 按题意补全参数与返回值
func (s *Solution) ${methodName}() {
    // TODO: 实现 ${algo?.name || '该算法'} 的 Go 版本
}

func main() {
    // TODO: 读取输入并调用 Solution 方法
    // 示例:
    // sol := Solution{}
    // sol.${methodName}()
}
`
}

function getAlgorithmRustTemplate(algo) {
    const methodName = toSnakeCase(algo?.nameEn || algo?.name || 'solve')
    return `struct Solution;

impl Solution {
    // TODO: 按题意补全参数与返回值
    fn ${methodName}(&self) {
        // TODO: 实现 ${algo?.name || '该算法'} 的 Rust 版本
    }
}

fn main() {
    // TODO: 读取输入并调用 Solution 方法
    // 示例:
    // let sol = Solution;
    // sol.${methodName}();
}
`
}

function getAlgorithmTemplate(algo, language) {
    if (!algo) return ''
    if (language === 'cpp') return algo.code.cpp || getAlgorithmCppTemplate(algo)
    if (language === 'go') return algo.code.go || getAlgorithmGoTemplate(algo)
    if (language === 'rust') return algo.code.rust || getAlgorithmRustTemplate(algo)
    return algo.code[language] || ''
}

function getEditorLanguageLabel(language) {
    if (language === 'javascript') return 'JavaScript'
    if (language === 'python') return 'Python'
    return getCompiledLanguageLabel(language)
}

function getRuntimeTip(language) {
    if (language === 'python') {
        return <>当前支持 Python 在线执行。代码中的 <code>input()</code> 将读取下方输入框；请使用 <code>print(...)</code> 输出结果。</>
    }
    if (language === 'cpp') {
        return <>当前使用 C++17 在线执行。输入会写入 <code>cin</code>，请使用 <code>cout</code> 输出结果。</>
    }
    if (language === 'go') {
        return <>当前使用 Go 在线执行。输入会写入 <code>os.Stdin</code>，请使用 <code>fmt.Print</code> 或 <code>fmt.Println</code> 输出结果。</>
    }
    if (language === 'rust') {
        return <>当前使用 Rust 在线执行。输入会写入 <code>stdin</code>，请使用 <code>println!</code> 输出结果。</>
    }
    return null
}

function getIdleRuntimeStatus(language) {
    if (language === 'python') return '输入样例后可直接运行 Python。'
    if (language === 'cpp' || language === 'go' || language === 'rust') {
        return `输入样例后可直接编译并运行 ${getCompiledLanguageLabel(language)}。`
    }
    return '切换到 Python、C++、Go 或 Rust 后可在线运行代码。'
}

// ─── Copy Toast ──────────────────────────────────────────────
function CopyButton({ text }) {
    const [copied, setCopied] = useState(false)
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch {
            /* fallback: not available in http */
        }
    }
    return (
        <button className={`copy-btn${copied ? ' copied' : ''}`} onClick={handleCopy} title="复制代码">
            {copied ? '✓ 已复制' : '复制'}
        </button>
    )
}

export default function Algorithm() {
    const { id } = useParams()
    const [lang, setLang] = useState('javascript')
    const [activeStep, setActiveStep] = useState(0)
    const [editableCode, setEditableCode] = useState({ javascript: '', python: '', cpp: '', go: '', rust: '' })
    const [stdinText, setStdinText] = useState('')
    const [stdoutText, setStdoutText] = useState('')
    const [stderrText, setStderrText] = useState('')
    const [runtimeStatus, setRuntimeStatus] = useState({ type: 'idle', text: getIdleRuntimeStatus('javascript') })
    const [isRunning, setIsRunning] = useState(false)
    const { visitAlgo, isVisited } = useProgress()
    const algo = algorithms.find(a => a.id === id)

    useEffect(() => { setActiveStep(0) }, [id])
    useEffect(() => { if (algo) visitAlgo(algo.id) }, [algo?.id])
    useEffect(() => {
        if (!algo) return
        setEditableCode({
            javascript: getAlgorithmTemplate(algo, 'javascript'),
            python: getAlgorithmTemplate(algo, 'python'),
            cpp: getAlgorithmTemplate(algo, 'cpp'),
            go: getAlgorithmTemplate(algo, 'go'),
            rust: getAlgorithmTemplate(algo, 'rust'),
        })
        setStdinText('')
        setStdoutText('')
        setStderrText('')
    }, [algo?.id])

    useEffect(() => {
        setStdoutText('')
        setStderrText('')
        setRuntimeStatus({ type: 'idle', text: getIdleRuntimeStatus(lang) })
    }, [lang, algo?.id])

    if (!algo) {
        return (
            <div className="algo-not-found">
                <h2>算法未找到</h2>
                <Link to="/learn" className="btn btn-primary">返回列表</Link>
            </div>
        )
    }

    const cat = categories.find(c => c.id === algo.category)
    const catAlgos = algorithms.filter(a => a.category === algo.category)
    const currentIdx = catAlgos.findIndex(a => a.id === id)
    const prevAlgo = catAlgos[currentIdx - 1]
    const nextAlgo = catAlgos[currentIdx + 1]
    const canRun = lang === 'python' || lang === 'cpp' || lang === 'go' || lang === 'rust'

    const handleCodeChange = event => {
        const next = event.target.value
        setEditableCode(prev => ({ ...prev, [lang]: next }))
    }

    const resetCurrentCode = () => {
        const nextCode = getAlgorithmTemplate(algo, lang)
        setEditableCode(prev => ({ ...prev, [lang]: nextCode }))
    }

    const runPython = async () => {
        if (isRunning) return
        setIsRunning(true)
        setStdoutText('')
        setStderrText('')
        setRuntimeStatus({ type: 'loading', text: '正在初始化 Python 运行环境...' })

        try {
            const pyodide = await getPyodideInstance()
            pyodide.globals.set('__algo_code', editableCode.python)
            pyodide.globals.set('__algo_stdin', stdinText)

            setRuntimeStatus({ type: 'running', text: '运行中...' })

            await pyodide.runPythonAsync(`
import builtins
import io
import sys
import traceback

__runner_output = ''
__runner_error = ''
__runner_stderr = ''

_stdin_buffer = io.StringIO(__algo_stdin)
_stdout_buffer = io.StringIO()
_stderr_buffer = io.StringIO()
_origin_input = builtins.input
_origin_stdout = sys.stdout
_origin_stderr = sys.stderr

def _fake_input(prompt=''):
    line = _stdin_buffer.readline()
    if line == '':
        raise EOFError('EOF when reading a line')
    return line.rstrip('\\n')

try:
    builtins.input = _fake_input
    sys.stdout = _stdout_buffer
    sys.stderr = _stderr_buffer
    namespace = {"__name__": "__main__"}
    exec(__algo_code, namespace)
except Exception:
    __runner_error = traceback.format_exc()
finally:
    builtins.input = _origin_input
    sys.stdout = _origin_stdout
    sys.stderr = _origin_stderr
    __runner_output = _stdout_buffer.getvalue()
    __runner_stderr = _stderr_buffer.getvalue()
`)

            const stdout = pyGlobalToString(pyodide, '__runner_output').trimEnd()
            const stderr = pyGlobalToString(pyodide, '__runner_stderr').trimEnd()
            const runtimeError = pyGlobalToString(pyodide, '__runner_error').trimEnd()

            setStdoutText(stdout)
            setStderrText(stderr || runtimeError)
            setRuntimeStatus({
                type: runtimeError ? 'error' : 'ready',
                text: runtimeError ? '运行失败，请检查报错信息。' : '运行完成。使用 print(...) 查看输出。',
            })
        } catch (error) {
            const message = error instanceof Error ? error.message : '未知错误'
            setRuntimeStatus({ type: 'error', text: 'Python 运行环境启动失败。' })
            setStderrText(message)
        } finally {
            setIsRunning(false)
        }
    }

    const runCompiled = async language => {
        if (isRunning) return
        const languageLabel = getCompiledLanguageLabel(language)
        setIsRunning(true)
        setStdoutText('')
        setStderrText('')
        setRuntimeStatus({ type: 'loading', text: `正在调用 ${languageLabel} 编译服务...` })

        try {
            const result = await runCompiledCode({
                language,
                code: editableCode[language],
                input: stdinText,
            })
            const parsed = parseCompiledRunResult(result, language)
            setStdoutText(parsed.stdout)
            setStderrText(parsed.stderr)
            setRuntimeStatus({ type: parsed.type, text: parsed.statusText })
        } catch (error) {
            const message = error instanceof Error ? error.message : '未知错误'
            setRuntimeStatus({ type: 'error', text: `${languageLabel} 运行服务不可用。` })
            setStderrText(message)
        } finally {
            setIsRunning(false)
        }
    }

    const runCurrentCode = async () => {
        if (lang === 'python') return runPython()
        if (lang === 'cpp' || lang === 'go' || lang === 'rust') return runCompiled(lang)
        return null
    }

    return (
        <div className="algo-page">
            {/* Breadcrumb */}
            <div className="breadcrumb container">
                <Link to="/learn" className="breadcrumb-link">学习</Link>
                <span className="breadcrumb-sep">›</span>
                <Link to={`/learn/${algo.category}`} className="breadcrumb-link">{cat?.label}</Link>
                <span className="breadcrumb-sep">›</span>
                <span>{algo.name}</span>
            </div>

            <div className="algo-layout container">
                {/* Left: content */}
                <article className="algo-content">
                    {/* Header */}
                    <div className="algo-header">
                        <div className="algo-title-row">
                            <div>
                                <div className="algo-title-badges">
                                    <span className={`badge badge-${algo.difficulty}`}>{difficultyLabel[algo.difficulty]}</span>
                                    {algo.tags.map(t => <span key={t} className="tag">{t}</span>)}
                                </div>
                                <h1 className="algo-page-title">{algo.name}</h1>
                                <p className="algo-page-name-en">{algo.nameEn}</p>
                            </div>
                        </div>
                        <p className="algo-page-summary">{algo.summary}</p>
                    </div>

                    {/* Complexity */}
                    <div className="complexity-section glass-card">
                        <h3 className="complexity-title">📊 复杂度分析</h3>
                        <div className="complexity-grid">
                            <div className="complexity-item">
                                <span className="complexity-label">平均时间</span>
                                <code className="complexity-value">{algo.timeAvg}</code>
                            </div>
                            <div className="complexity-item">
                                <span className="complexity-label">最优时间</span>
                                <code className="complexity-value" style={{ color: 'var(--easy)' }}>{algo.timeBest}</code>
                            </div>
                            <div className="complexity-item">
                                <span className="complexity-label">最坏时间</span>
                                <code className="complexity-value" style={{ color: 'var(--hard)' }}>{algo.timeWorst}</code>
                            </div>
                            <div className="complexity-item">
                                <span className="complexity-label">空间复杂度</span>
                                <code className="complexity-value">{algo.space}</code>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="algo-description">
                        <h2 className="content-h2">💡 算法详解</h2>
                        {algo.description.split('\n\n').map((para, i) => {
                            if (para.startsWith('**') && para.includes('**\n')) {
                                const [title, ...rest] = para.split('\n')
                                return (
                                    <div key={i}>
                                        <h3 className="content-h3">{title.replace(/\*\*/g, '')}</h3>
                                        {rest.map((line, j) => {
                                            if (line.startsWith('- ')) return <li key={j} className="content-li">{line.slice(2)}</li>
                                            return <p key={j} className="content-p">{line}</p>
                                        })}
                                    </div>
                                )
                            }
                            return <p key={i} className="content-p">{para}</p>
                        })}
                    </div>

                    {/* Step by step */}
                    <div className="steps-section">
                        <h2 className="content-h2">🚶 执行步骤</h2>
                        <div className="steps-list">
                            {algo.steps.map((step, i) => (
                                <button
                                    key={i}
                                    className={`step-item${activeStep === i ? ' active' : ''}`}
                                    onClick={() => setActiveStep(i)}
                                >
                                    <span className={`step-num${activeStep === i ? ' active' : ''}`}>{i + 1}</span>
                                    <span className="step-text">{step}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Code */}
                    <div className="code-section">
                        <div className="code-header">
                            <h2 className="content-h2" style={{ margin: 0 }}>💻 代码实现</h2>
                            <div className="lang-tabs">
                                {['javascript', 'python', 'cpp', 'go', 'rust'].map(l => (
                                    <button
                                        key={l}
                                        className={`lang-tab${lang === l ? ' active' : ''}`}
                                        onClick={() => setLang(l)}
                                    >
                                        {getEditorLanguageLabel(l)}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="code-block">
                            <div className="code-topbar">
                                <div className="code-dots">
                                    <span style={{ background: '#ef4444' }} />
                                    <span style={{ background: '#f59e0b' }} />
                                    <span style={{ background: '#22c55e' }} />
                                </div>
                                <span className="code-lang">{getEditorLanguageLabel(lang)}</span>
                                <button className="copy-btn" onClick={resetCurrentCode} title="重置为模板代码">
                                    重置
                                </button>
                                <CopyButton text={editableCode[lang]} />
                            </div>
                            <textarea
                                className="code-editor"
                                value={editableCode[lang]}
                                onChange={handleCodeChange}
                                spellCheck={false}
                            />
                        </div>

                        <div className={`runtime-panel glass-card${canRun ? '' : ' disabled'}`}>
                            <div className="runtime-panel-top">
                                <h3 className="runtime-title">▶ 代码运行</h3>
                                <span className={`runtime-status runtime-status-${runtimeStatus.type}`}>
                                    {runtimeStatus.text}
                                </span>
                            </div>

                            {canRun ? (
                                <>
                                    <p className="runtime-tip">{getRuntimeTip(lang)}</p>
                                    <label className="runtime-label" htmlFor="code-stdin">
                                        标准输入（可选，按行输入）
                                    </label>
                                    <textarea
                                        id="code-stdin"
                                        className="runtime-io-input"
                                        value={stdinText}
                                        onChange={event => setStdinText(event.target.value)}
                                        placeholder="例如：\n5\n1 2 3 4 5"
                                        spellCheck={false}
                                    />
                                    <div className="runtime-actions">
                                        <button className="run-btn" onClick={runCurrentCode} disabled={isRunning}>
                                            {isRunning
                                                ? '运行中...'
                                                : (lang === 'python'
                                                    ? '运行 Python'
                                                    : `编译并运行 ${getCompiledLanguageLabel(lang)}`)}
                                        </button>
                                        <button
                                            className="copy-btn"
                                            onClick={() => { setStdoutText(''); setStderrText('') }}
                                            disabled={isRunning}
                                        >
                                            清空输出
                                        </button>
                                    </div>

                                    <div className="runtime-output-wrap">
                                        <div className="runtime-output-block">
                                            <p className="runtime-output-title">标准输出</p>
                                            <pre className="runtime-output">{stdoutText || '（暂无输出）'}</pre>
                                        </div>
                                        <div className="runtime-output-block">
                                            <p className="runtime-output-title">错误输出</p>
                                            <pre className={`runtime-output${stderrText ? ' is-error' : ''}`}>
                                                {stderrText || '（无错误）'}
                                            </pre>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <p className="runtime-tip">
                                    切换到 Python、C++、Go 或 Rust 后可在线运行代码。
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="algo-nav">
                        {prevAlgo ? (
                            <Link to={`/algorithm/${prevAlgo.id}`} className="algo-nav-btn glass-card">
                                <span className="nav-dir">← 上一个</span>
                                <span className="nav-name">{prevAlgo.name}</span>
                            </Link>
                        ) : <div />}
                        {nextAlgo ? (
                            <Link to={`/algorithm/${nextAlgo.id}`} className="algo-nav-btn glass-card" style={{ textAlign: 'right' }}>
                                <span className="nav-dir">下一个 →</span>
                                <span className="nav-name">{nextAlgo.name}</span>
                            </Link>
                        ) : <div />}
                    </div>
                </article>

                {/* Right: visualizer + sidebar */}
                <aside className="algo-sidebar">
                    <div className="viz-card glass-card">
                        <h3 className="viz-title">🎬 算法可视化</h3>
                        <Visualizer algo={algo} activeStep={activeStep} onStepChange={setActiveStep} />
                    </div>

                    {/* Related */}
                    <div className="related-section glass-card">
                        <h3 className="related-title">📂 同类算法</h3>
                        <div className="related-list">
                            {catAlgos.filter(a => a.id !== id).map(a => (
                                <Link key={a.id} to={`/algorithm/${a.id}`} className="related-item">
                                    <span className="related-name">{a.name}</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        {isVisited(a.id) && <span className="visited-badge">✓</span>}
                                        <span className={`badge badge-${a.difficulty}`} style={{ fontSize: '0.65rem' }}>
                                            {difficultyLabel[a.difficulty]}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    )
}

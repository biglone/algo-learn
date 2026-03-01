import { useEffect, useMemo, useState } from 'react'
import { getProblemGuide } from '../data/problemGuides'
import { getCompiledLanguageLabel, parseCompiledRunResult, runCompiledCode } from '../utils/cppRunner'
import './InterviewPlan.css'

const STORAGE_KEY = 'algo-learn-interview-plan-v1'
const LEETCODE_BASE_URL = 'https://leetcode.com/problems/'
const LEETCODE_ID_PATTERN = /^\d+$/
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

const GUIDE_LANGS = [
    { id: 'python', label: 'Python' },
    { id: 'cpp', label: 'C++' },
    { id: 'go', label: 'Go' },
    { id: 'rust', label: 'Rust' },
]

function getGuideIdleStatus(language) {
    if (language === 'python') return '输入样例后可直接运行 Python。'
    return `输入样例后可直接编译并运行 ${getCompiledLanguageLabel(language)}。`
}

function getGuideCodeByLanguage(guide, language) {
    if (!guide) return ''
    if (language === 'cpp') return guide.cppCode || ''
    if (language === 'go') return guide.goCode || ''
    if (language === 'rust') return guide.rustCode || ''
    return guide.pythonCode || ''
}

function getGuideRuntimeTip(language) {
    if (language === 'cpp') {
        return <>标准输入会写入程序的 <code>cin</code>；请使用 <code>cout</code> 查看输出（C++17）。</>
    }
    if (language === 'go') {
        return <>标准输入会写入程序的 <code>os.Stdin</code>；请使用 <code>fmt.Print</code> 或 <code>fmt.Println</code> 查看输出。</>
    }
    if (language === 'rust') {
        return <>标准输入会写入程序的 <code>stdin</code>；请使用 <code>println!</code> 查看输出。</>
    }
    return <>代码中的 <code>input()</code> 会读取下方输入框；请用 <code>print(...)</code> 查看输出。</>
}

function getGuideRunText(language) {
    if (language === 'python') return '运行 Python'
    return `编译并运行 ${getCompiledLanguageLabel(language)}`
}

const PLAN_DAYS = [
    {
        id: 'day-1',
        label: 'Day 1',
        theme: '数组 / 哈希',
        tasks: [
            { id: '1', title: 'Two Sum' },
            { id: '49', title: 'Group Anagrams' },
            { id: '128', title: 'Longest Consecutive Sequence' },
            { id: '238', title: 'Product of Array Except Self' },
        ],
    },
    {
        id: 'day-2',
        label: 'Day 2',
        theme: '双指针 / 滑动窗口',
        tasks: [
            { id: '3', title: 'Longest Substring Without Repeating Characters' },
            { id: '76', title: 'Minimum Window Substring' },
            { id: '209', title: 'Minimum Size Subarray Sum' },
            { id: '42', title: 'Trapping Rain Water' },
        ],
    },
    {
        id: 'day-3',
        label: 'Day 3',
        theme: '二分搜索',
        tasks: [
            { id: '704', title: 'Binary Search' },
            { id: '33', title: 'Search in Rotated Sorted Array' },
            { id: '153', title: 'Find Minimum in Rotated Sorted Array' },
            { id: '875', title: 'Koko Eating Bananas' },
        ],
    },
    {
        id: 'day-4',
        label: 'Day 4',
        theme: '栈 / 单调栈',
        tasks: [
            { id: '20', title: 'Valid Parentheses' },
            { id: '155', title: 'Min Stack' },
            { id: '739', title: 'Daily Temperatures' },
            { id: '84', title: 'Largest Rectangle in Histogram' },
        ],
    },
    {
        id: 'day-5',
        label: 'Day 5',
        theme: '链表',
        tasks: [
            { id: '206', title: 'Reverse Linked List' },
            { id: '21', title: 'Merge Two Sorted Lists' },
            { id: '141', title: 'Linked List Cycle' },
            { id: '142', title: 'Linked List Cycle II' },
            { id: '19', title: 'Remove Nth Node From End of List' },
        ],
    },
    {
        id: 'day-6',
        label: 'Day 6',
        theme: '树基础',
        tasks: [
            { id: '104', title: 'Maximum Depth of Binary Tree' },
            { id: '226', title: 'Invert Binary Tree' },
            { id: '102', title: 'Binary Tree Level Order Traversal' },
            { id: '543', title: 'Diameter of Binary Tree' },
            { id: '94', title: 'Binary Tree Inorder Traversal' },
        ],
    },
    {
        id: 'day-7',
        label: 'Day 7',
        theme: '树进阶 + 模拟',
        tasks: [
            { id: '98', title: 'Validate Binary Search Tree' },
            { id: '230', title: 'Kth Smallest Element in a BST' },
            { id: '236', title: 'Lowest Common Ancestor of a Binary Tree' },
            { id: '105', title: 'Construct Binary Tree from Preorder and Inorder Traversal' },
            { id: 'mock-60min', title: '60 分钟模拟面试' },
        ],
    },
    {
        id: 'day-8',
        label: 'Day 8',
        theme: '图基础',
        tasks: [
            { id: '200', title: 'Number of Islands' },
            { id: '133', title: 'Clone Graph' },
            { id: '207', title: 'Course Schedule' },
            { id: '210', title: 'Course Schedule II' },
            { id: '994', title: 'Rotting Oranges' },
        ],
    },
    {
        id: 'day-9',
        label: 'Day 9',
        theme: '最短路 / 并查集 / MST',
        tasks: [
            { id: '743', title: 'Network Delay Time' },
            { id: '684', title: 'Redundant Connection' },
            { id: '1584', title: 'Min Cost to Connect All Points' },
            { id: '1631', title: 'Path With Minimum Effort' },
        ],
    },
    {
        id: 'day-10',
        label: 'Day 10',
        theme: 'DP 一维 + 模拟',
        tasks: [
            { id: '70', title: 'Climbing Stairs' },
            { id: '198', title: 'House Robber' },
            { id: '213', title: 'House Robber II' },
            { id: '322', title: 'Coin Change' },
            { id: 'mock-60min-2', title: '60 分钟模拟面试' },
        ],
    },
    {
        id: 'day-11',
        label: 'Day 11',
        theme: 'DP 二维 / 字符串',
        tasks: [
            { id: '139', title: 'Word Break' },
            { id: '300', title: 'Longest Increasing Subsequence' },
            { id: '1143', title: 'Longest Common Subsequence' },
            { id: '72', title: 'Edit Distance' },
            { id: '516', title: 'Longest Palindromic Subsequence' },
        ],
    },
    {
        id: 'day-12',
        label: 'Day 12',
        theme: '回溯',
        tasks: [
            { id: '46', title: 'Permutations' },
            { id: '78', title: 'Subsets' },
            { id: '39', title: 'Combination Sum' },
            { id: '22', title: 'Generate Parentheses' },
            { id: '79', title: 'Word Search' },
        ],
    },
    {
        id: 'day-13',
        label: 'Day 13',
        theme: '堆 / 设计',
        tasks: [
            { id: '215', title: 'Kth Largest Element in an Array' },
            { id: '347', title: 'Top K Frequent Elements' },
            { id: '295', title: 'Find Median from Data Stream' },
            { id: '146', title: 'LRU Cache' },
        ],
    },
    {
        id: 'day-14',
        label: 'Day 14',
        theme: '综合 + 模拟',
        tasks: [
            { id: '11', title: 'Container With Most Water' },
            { id: '15', title: '3Sum' },
            { id: '121', title: 'Best Time to Buy and Sell Stock' },
            { id: '56', title: 'Merge Intervals' },
            { id: 'mock-90min', title: '90 分钟模拟面试' },
        ],
    },
]

function taskKey(dayId, taskId) {
    return `${dayId}:${taskId}`
}

function loadProgress() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        const parsed = raw ? JSON.parse(raw) : {}
        return parsed && typeof parsed === 'object' ? parsed : {}
    } catch {
        return {}
    }
}

function titleToLeetCodeSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
}

function getTaskLink(task) {
    if (!LEETCODE_ID_PATTERN.test(task.id)) return null
    return `${LEETCODE_BASE_URL}${titleToLeetCodeSlug(task.title)}/`
}

export default function InterviewPlan() {
    const [progress, setProgress] = useState(() => loadProgress())
    const [activeGuideRef, setActiveGuideRef] = useState(null)
    const [codeCopied, setCodeCopied] = useState(false)
    const [guideLang, setGuideLang] = useState('python')
    const [guideCodeByLang, setGuideCodeByLang] = useState({ python: '', cpp: '', go: '', rust: '' })
    const [guideInput, setGuideInput] = useState('')
    const [guideStdout, setGuideStdout] = useState('')
    const [guideStderr, setGuideStderr] = useState('')
    const [isRunning, setIsRunning] = useState(false)
    const [runtimeStatus, setRuntimeStatus] = useState({ type: 'idle', text: getGuideIdleStatus('python') })

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
        } catch {
            // ignore write failures
        }
    }, [progress])

    const allTasks = useMemo(() => {
        return PLAN_DAYS.flatMap(day => day.tasks.map(task => ({ ...task, dayId: day.id })))
    }, [])

    const total = allTasks.length
    const done = allTasks.reduce((acc, task) => (progress[taskKey(task.dayId, task.id)] ? acc + 1 : acc), 0)
    const percent = total > 0 ? Math.round((done / total) * 100) : 0
    const activeGuide = useMemo(() => {
        if (!activeGuideRef) return null
        const day = PLAN_DAYS.find(item => item.id === activeGuideRef.dayId)
        if (!day) return null
        const task = day.tasks.find(item => item.id === activeGuideRef.taskId)
        if (!task) return null
        return getProblemGuide(task, day.theme)
    }, [activeGuideRef])
    const guideRuntimeEnabled = !!activeGuide && (
        activeGuide.hasPythonCode
        || activeGuide.hasCppCode
        || activeGuide.hasGoCode
        || activeGuide.hasRustCode
    )
    const guideCode = guideCodeByLang[guideLang] || ''

    useEffect(() => {
        setCodeCopied(false)
        setGuideLang('python')
        setGuideCodeByLang({
            python: activeGuide?.hasPythonCode ? activeGuide.pythonCode : '',
            cpp: activeGuide?.hasCppCode ? activeGuide.cppCode : '',
            go: activeGuide?.hasGoCode ? activeGuide.goCode : '',
            rust: activeGuide?.hasRustCode ? activeGuide.rustCode : '',
        })
        setGuideInput('')
        setGuideStdout('')
        setGuideStderr('')
        setRuntimeStatus({ type: 'idle', text: getGuideIdleStatus('python') })
    }, [
        activeGuideRef?.dayId,
        activeGuideRef?.taskId,
        activeGuide?.hasPythonCode,
        activeGuide?.hasCppCode,
        activeGuide?.hasGoCode,
        activeGuide?.hasRustCode,
        activeGuide?.pythonCode,
        activeGuide?.cppCode,
        activeGuide?.goCode,
        activeGuide?.rustCode,
    ])

    useEffect(() => {
        if (!guideRuntimeEnabled) return
        setCodeCopied(false)
        setGuideStdout('')
        setGuideStderr('')
        setRuntimeStatus({ type: 'idle', text: getGuideIdleStatus(guideLang) })
    }, [guideLang, guideRuntimeEnabled])

    const toggleTask = (dayId, taskId) => {
        const key = taskKey(dayId, taskId)
        setProgress(prev => ({ ...prev, [key]: !prev[key] }))
    }

    const toggleGuide = (dayId, taskId) => {
        setActiveGuideRef(prev => {
            if (prev && prev.dayId === dayId && prev.taskId === taskId) return null
            return { dayId, taskId }
        })
    }

    const copyGuideCode = async () => {
        if (!guideRuntimeEnabled || !guideCode) return
        try {
            await navigator.clipboard.writeText(guideCode)
            setCodeCopied(true)
            window.setTimeout(() => setCodeCopied(false), 2000)
        } catch {
            // ignore clipboard failures
        }
    }

    const resetGuideCode = () => {
        if (!guideRuntimeEnabled) return
        const codeTemplate = getGuideCodeByLanguage(activeGuide, guideLang)
        setGuideCodeByLang(prev => ({ ...prev, [guideLang]: codeTemplate || '' }))
    }

    const runGuidePython = async () => {
        setIsRunning(true)
        setGuideStdout('')
        setGuideStderr('')
        setRuntimeStatus({ type: 'loading', text: '正在初始化 Python 运行环境...' })

        try {
            const pyodide = await getPyodideInstance()
            pyodide.globals.set('__interview_code', guideCodeByLang.python)
            pyodide.globals.set('__interview_stdin', guideInput)
            setRuntimeStatus({ type: 'running', text: '运行中...' })

            await pyodide.runPythonAsync(`
import builtins
import io
import sys
import traceback

__runner_output = ''
__runner_error = ''
__runner_stderr = ''

_stdin_buffer = io.StringIO(__interview_stdin)
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
    exec(__interview_code, namespace)
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

            setGuideStdout(stdout)
            setGuideStderr(stderr || runtimeError)
            setRuntimeStatus({
                type: runtimeError ? 'error' : 'ready',
                text: runtimeError ? '运行失败，请检查报错信息。' : '运行完成。使用 print(...) 查看输出。',
            })
        } catch (error) {
            const message = error instanceof Error ? error.message : '未知错误'
            setRuntimeStatus({ type: 'error', text: 'Python 运行环境启动失败。' })
            setGuideStderr(message)
        } finally {
            setIsRunning(false)
        }
    }

    const runGuideCompiled = async language => {
        const languageLabel = getCompiledLanguageLabel(language)
        setIsRunning(true)
        setGuideStdout('')
        setGuideStderr('')
        setRuntimeStatus({ type: 'loading', text: `正在调用 ${languageLabel} 编译服务...` })

        try {
            const result = await runCompiledCode({
                language,
                code: guideCodeByLang[language],
                input: guideInput,
            })
            const parsed = parseCompiledRunResult(result, language)
            setGuideStdout(parsed.stdout)
            setGuideStderr(parsed.stderr)
            setRuntimeStatus({ type: parsed.type, text: parsed.statusText })
        } catch (error) {
            const message = error instanceof Error ? error.message : '未知错误'
            setRuntimeStatus({ type: 'error', text: `${languageLabel} 运行服务不可用。` })
            setGuideStderr(message)
        } finally {
            setIsRunning(false)
        }
    }

    const runGuideCode = async () => {
        if (!guideRuntimeEnabled || isRunning) return
        if (guideLang === 'python') {
            await runGuidePython()
            return
        }
        await runGuideCompiled(guideLang)
    }

    const markDay = (dayId, checked) => {
        setProgress(prev => {
            const next = { ...prev }
            const day = PLAN_DAYS.find(item => item.id === dayId)
            if (!day) return next
            for (const task of day.tasks) {
                next[taskKey(dayId, task.id)] = checked
            }
            return next
        })
    }

    const resetAll = () => {
        if (!window.confirm('确定要清空所有打卡记录吗？')) return
        setProgress({})
    }

    return (
        <div className="interview-plan-page">
            <div className="container">
                <section className="interview-plan-header glass-card">
                    <div>
                        <h1 className="interview-plan-title">面试冲刺计划</h1>
                        <p className="interview-plan-subtitle">
                            14 天高频算法题清单，支持本地打卡。点击题目可直接跳转 LeetCode。建议每日执行：限时解题 → 复盘 → 1/3/7 天二刷。
                        </p>
                        <div className="interview-plan-meta">
                            <span>总任务：{total}</span>
                            <span>已完成：{done}</span>
                            <span>完成率：{percent}%</span>
                        </div>
                    </div>
                    <div className="interview-plan-actions">
                        <button className="plan-action-btn plan-action-clear" onClick={resetAll}>清空打卡</button>
                    </div>
                </section>

                <div className="interview-plan-progress">
                    <div className="interview-plan-progress-fill" style={{ width: `${percent}%` }} />
                </div>

                {activeGuide ? (
                    <section className="interview-guide-panel glass-card">
                        <div className="interview-guide-top">
                            <div>
                                <h2 className="interview-guide-title">原题协助 · {activeGuide.title}</h2>
                                <p className="interview-guide-meta">
                                    <span>{activeGuide.dayTheme}</span>
                                    <span>方法：{activeGuide.approach}</span>
                                    <span>时间：{activeGuide.time}</span>
                                    <span>空间：{activeGuide.space}</span>
                                </p>
                            </div>
                            <button className="plan-action-btn" onClick={() => setActiveGuideRef(null)}>收起</button>
                        </div>

                        <div className="interview-guide-grid">
                            <article className="interview-guide-card">
                                <h3>题目目标</h3>
                                <p>{activeGuide.target}</p>
                            </article>
                            <article className="interview-guide-card">
                                <h3>先想暴力解</h3>
                                <p>{activeGuide.brute}</p>
                            </article>
                            <article className="interview-guide-card wide">
                                <h3>突破点</h3>
                                <p>{activeGuide.breakthrough}</p>
                            </article>
                        </div>

                        <div className="interview-guide-steps">
                            <h3>最优解分步骤</h3>
                            <div className="guide-step-list">
                                {activeGuide.steps.map((step, idx) => (
                                    <div key={step} className="guide-step-item">
                                        <span className="guide-step-num">{idx + 1}</span>
                                        <p>{step}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="interview-guide-detail">
                            <h3>更细思考过程</h3>
                            <ul className="guide-bullet-list">
                                {activeGuide.thinkingFlow.map(item => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </div>

                        {guideRuntimeEnabled && (
                            <div className="interview-guide-code">
                                <div className="interview-guide-code-top">
                                    <div className="guide-code-head">
                                        <h3>{GUIDE_LANGS.find(item => item.id === guideLang)?.label || 'Python'} 参考代码（可编辑）</h3>
                                        <div className="guide-lang-tabs">
                                            {GUIDE_LANGS.map(item => (
                                                <button
                                                    key={item.id}
                                                    type="button"
                                                    className={`guide-lang-tab${guideLang === item.id ? ' active' : ''}`}
                                                    onClick={() => setGuideLang(item.id)}
                                                    disabled={isRunning}
                                                >
                                                    {item.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="guide-code-actions">
                                        <button
                                            type="button"
                                            className="guide-copy-btn"
                                            onClick={resetGuideCode}
                                            disabled={isRunning}
                                        >
                                            重置模板
                                        </button>
                                        <button
                                            type="button"
                                            className={`guide-copy-btn${codeCopied ? ' copied' : ''}`}
                                            onClick={copyGuideCode}
                                        >
                                            {codeCopied ? '已复制' : '复制代码'}
                                        </button>
                                    </div>
                                </div>
                                <textarea
                                    className="interview-guide-code-editor"
                                    value={guideCode}
                                    onChange={event => {
                                        const nextCode = event.target.value
                                        setGuideCodeByLang(prev => ({ ...prev, [guideLang]: nextCode }))
                                    }}
                                    spellCheck={false}
                                />
                                <div className="interview-guide-runtime">
                                    <div className="interview-guide-runtime-top">
                                        <h4>在线运行</h4>
                                        <span className={`guide-runtime-status guide-runtime-status-${runtimeStatus.type}`}>
                                            {runtimeStatus.text}
                                        </span>
                                    </div>
                                    <p className="interview-guide-runtime-tip">
                                        {getGuideRuntimeTip(guideLang)}
                                    </p>
                                    <label className="interview-guide-runtime-label" htmlFor="guide-code-stdin">
                                        标准输入（可选，按行）
                                    </label>
                                    <textarea
                                        id="guide-code-stdin"
                                        className="interview-guide-runtime-input"
                                        value={guideInput}
                                        onChange={event => setGuideInput(event.target.value)}
                                        placeholder="例如：\n5\n1 2 3 4 5"
                                        spellCheck={false}
                                    />
                                    <div className="interview-guide-runtime-actions">
                                        <button className="guide-run-btn" onClick={runGuideCode} disabled={isRunning}>
                                            {isRunning ? '运行中...' : getGuideRunText(guideLang)}
                                        </button>
                                        <button
                                            type="button"
                                            className="guide-copy-btn"
                                            onClick={() => { setGuideStdout(''); setGuideStderr('') }}
                                            disabled={isRunning}
                                        >
                                            清空输出
                                        </button>
                                    </div>
                                    <div className="interview-guide-runtime-outputs">
                                        <div className="interview-guide-runtime-output">
                                            <p>标准输出</p>
                                            <pre>{guideStdout || '（暂无输出）'}</pre>
                                        </div>
                                        <div className="interview-guide-runtime-output">
                                            <p>错误输出</p>
                                            <pre className={guideStderr ? 'is-error' : ''}>{guideStderr || '（无错误）'}</pre>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="interview-guide-grid">
                            <article className="interview-guide-card">
                                <h3>易错点</h3>
                                <ul className="guide-bullet-list">
                                    {activeGuide.pitfalls.map(item => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </ul>
                            </article>
                            <article className="interview-guide-card">
                                <h3>60 秒讲法</h3>
                                <p>{activeGuide.pitch}</p>
                            </article>
                        </div>
                    </section>
                ) : (
                    <section className="interview-guide-placeholder glass-card">
                        <h2>原题协助</h2>
                        <p>点击任意题目的「题解引导」，即可看到该题的分步思路（题目目标、暴力解、突破点、最优步骤、易错点和 60 秒讲法）。</p>
                    </section>
                )}

                <div className="interview-plan-grid">
                    {PLAN_DAYS.map(day => {
                        const dayDone = day.tasks.reduce(
                            (acc, task) => (progress[taskKey(day.id, task.id)] ? acc + 1 : acc),
                            0
                        )
                        const dayDoneAll = dayDone === day.tasks.length

                        return (
                            <article key={day.id} className={`interview-day-card glass-card${dayDoneAll ? ' done' : ''}`}>
                                <div className="interview-day-top">
                                    <div>
                                        <h2 className="interview-day-title">{day.label}</h2>
                                        <p className="interview-day-theme">{day.theme}</p>
                                    </div>
                                    <span className="interview-day-count">{dayDone}/{day.tasks.length}</span>
                                </div>

                                <div className="interview-day-actions">
                                    <button className="day-mini-btn" onClick={() => markDay(day.id, true)}>本日全勾选</button>
                                    <button className="day-mini-btn" onClick={() => markDay(day.id, false)}>清空本日</button>
                                </div>

                                <div className="interview-task-list">
                                    {day.tasks.map(task => {
                                        const key = taskKey(day.id, task.id)
                                        const checked = !!progress[key]
                                        const taskLink = getTaskLink(task)
                                        const guideOpen = !!activeGuideRef && activeGuideRef.dayId === day.id && activeGuideRef.taskId === task.id
                                        return (
                                            <div key={key} className={`interview-task-item${checked ? ' checked' : ''}`}>
                                                <input
                                                    type="checkbox"
                                                    checked={checked}
                                                    onChange={() => toggleTask(day.id, task.id)}
                                                />
                                                <span className="interview-task-id">{task.id}</span>
                                                {taskLink ? (
                                                    <a
                                                        className="interview-task-title interview-task-link"
                                                        href={taskLink}
                                                        target="_blank"
                                                        rel="noreferrer noopener"
                                                    >
                                                        {task.title}
                                                        <span className="interview-task-link-icon" aria-hidden="true">↗</span>
                                                    </a>
                                                ) : (
                                                    <span className="interview-task-title">{task.title}</span>
                                                )}
                                                <button
                                                    type="button"
                                                    className={`interview-guide-btn${guideOpen ? ' active' : ''}`}
                                                    onClick={() => toggleGuide(day.id, task.id)}
                                                >
                                                    {guideOpen ? '收起题解' : '题解引导'}
                                                </button>
                                            </div>
                                        )
                                    })}
                                </div>
                            </article>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

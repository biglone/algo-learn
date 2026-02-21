import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { algorithms, categories } from '../data/algorithms'
import Visualizer from '../components/Visualizer'
import { useProgress } from '../hooks/useProgress'
import './Algorithm.css'

const difficultyLabel = { easy: '入门', medium: '进阶', hard: '困难' }

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
    const { visitAlgo, isVisited } = useProgress()
    const algo = algorithms.find(a => a.id === id)

    useEffect(() => { setActiveStep(0) }, [id])
    useEffect(() => { if (algo) visitAlgo(algo.id) }, [algo?.id])

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
                                {['javascript', 'python'].map(l => (
                                    <button
                                        key={l}
                                        className={`lang-tab${lang === l ? ' active' : ''}`}
                                        onClick={() => setLang(l)}
                                    >
                                        {l === 'javascript' ? 'JavaScript' : 'Python'}
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
                                <span className="code-lang">{lang === 'javascript' ? 'JavaScript' : 'Python'}</span>
                                <CopyButton text={algo.code[lang]} />
                            </div>
                            <pre>{algo.code[lang]}</pre>
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

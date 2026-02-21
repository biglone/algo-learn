import { Link } from 'react-router-dom'
import { categories, algorithms } from '../data/algorithms'
import './Home.css'

const features = [
    { icon: '🎬', title: '动画可视化', desc: '每个算法都配有步进式动画，直观理解执行过程' },
    { icon: '💻', title: '双语代码', desc: 'JavaScript 和 Python 代码同步展示，对照学习' },
    { icon: '📊', title: '复杂度分析', desc: '时间/空间复杂度及推导过程，夯实理论基础' },
    { icon: '🗺', title: '学习路线', desc: '从简单到困难，循序渐进的结构化学习路径' },
    { icon: '🧠', title: '深度讲解', desc: '不只是代码，更有"为什么"的本质剖析' },
    { icon: '🎯', title: '练习题目', desc: '配套 LeetCode 题目，学完即练，学以致用' },
]

const difficultyLabel = { easy: '入门', medium: '进阶', hard: '困难' }

export default function Home() {
    const algoCount = algorithms.length
    const featuredAlgos = algorithms.filter(a =>
        ['bubble-sort', 'binary-search', 'merge-sort', 'bfs', 'fibonacci', 'stack'].includes(a.id)
    )

    return (
        <div className="home">
            {/* Hero */}
            <section className="hero">
                <div className="hero-bg">
                    <div className="hero-orb orb-1" />
                    <div className="hero-orb orb-2" />
                    <div className="hero-grid" />
                </div>
                <div className="container hero-content animate-fade-up">
                    <div className="hero-badge">✨ 从零到一 · 算法学习平台</div>
                    <h1 className="hero-title">
                        用动画学会<br />
                        <span className="gradient-text">数据结构与算法</span>
                    </h1>
                    <p className="hero-subtitle">
                        {algoCount}+ 核心算法，动态可视化演示，双语代码示例<br />
                        无论你是完全初学者还是在备战大厂面试，都能在这里找到答案
                    </p>
                    <div className="hero-actions">
                        <Link to="/learn" className="btn btn-primary">
                            🚀 立即开始学习
                        </Link>
                        <Link to="/learn/sorting" className="btn btn-ghost">
                            浏览算法 →
                        </Link>
                    </div>
                    <div className="hero-stats">
                        <div className="stat"><strong>{algoCount}+</strong><span>算法</span></div>
                        <div className="stat-divider" />
                        <div className="stat"><strong>5</strong><span>主题分类</span></div>
                        <div className="stat-divider" />
                        <div className="stat"><strong>2</strong><span>编程语言</span></div>
                        <div className="stat-divider" />
                        <div className="stat"><strong>免费</strong><span>开放学习</span></div>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">五大核心主题</h2>
                        <p className="section-sub">涵盖面试和竞赛最常考查的算法与数据结构</p>
                    </div>
                    <div className="categories-grid">
                        {categories.map((cat, i) => (
                            <Link
                                key={cat.id}
                                to={`/learn/${cat.id}`}
                                className="cat-card glass-card"
                                style={{ '--cat-color': cat.color, animationDelay: `${i * 0.08}s` }}
                            >
                                <span className="cat-icon">{cat.icon}</span>
                                <span className="cat-label">{cat.label}</span>
                                <span className="cat-count">
                                    {algorithms.filter(a => a.category === cat.id).length} 个算法
                                </span>
                                <span className="cat-arrow">→</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="section features-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">为什么选择 AlgoLearn？</h2>
                        <p className="section-sub">我们用更直观、更系统的方式让算法变得不再枯燥</p>
                    </div>
                    <div className="grid-3">
                        {features.map((f, i) => (
                            <div key={i} className="feature-card glass-card" style={{ animationDelay: `${i * 0.07}s` }}>
                                <span className="feature-icon">{f.icon}</span>
                                <h3 className="feature-title">{f.title}</h3>
                                <p className="feature-desc">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured algorithms */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">精选算法</h2>
                        <p className="section-sub">从最经典的算法开始，打好基础</p>
                    </div>
                    <div className="grid-3">
                        {featuredAlgos.map((algo, i) => (
                            <Link
                                key={algo.id}
                                to={`/algorithm/${algo.id}`}
                                className="algo-preview-card glass-card"
                                style={{ animationDelay: `${i * 0.07}s` }}
                            >
                                <div className="algo-preview-top">
                                    <span className={`badge badge-${algo.difficulty}`}>
                                        {difficultyLabel[algo.difficulty]}
                                    </span>
                                    <span className="algo-preview-complexity">{algo.timeAvg}</span>
                                </div>
                                <h3 className="algo-preview-name">{algo.name}</h3>
                                <p className="algo-preview-name-en">{algo.nameEn}</p>
                                <p className="algo-preview-summary">{algo.summary}</p>
                                <div className="algo-preview-tags">
                                    {algo.tags.slice(0, 3).map(t => (
                                        <span key={t} className="tag">{t}</span>
                                    ))}
                                </div>
                            </Link>
                        ))}
                    </div>
                    <div style={{ textAlign: 'center', marginTop: 40 }}>
                        <Link to="/learn" className="btn btn-ghost">查看全部算法 →</Link>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="section cta-section">
                <div className="container">
                    <div className="cta-card glass-card">
                        <div className="cta-orb" />
                        <h2 className="cta-title">准备好开始了吗？</h2>
                        <p className="cta-sub">无需注册，立刻开始你的算法学习之旅</p>
                        <Link to="/learn" className="btn btn-primary" style={{ fontSize: '1rem', padding: '12px 32px' }}>
                            🚀 从排序算法开始
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <p>© 2026 AlgoLearn · 从零到一算法学习平台</p>
                </div>
            </footer>
        </div>
    )
}

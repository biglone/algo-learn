import { useState, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { categories, algorithms } from '../data/algorithms'
import { useProgress } from '../hooks/useProgress'
import './Learn.css'

const difficultyLabel = { easy: '入门', medium: '进阶', hard: '困难' }
const total = algorithms.length

export default function Learn() {
    const { categoryId } = useParams()
    const [activeCategory, setActiveCategory] = useState(categoryId || 'sorting')
    const [search, setSearch] = useState('')
    const { isVisited, visitedCount } = useProgress()

    const filtered = useMemo(() => {
        return algorithms.filter(a => {
            const matchCat = a.category === activeCategory
            const matchSearch = !search ||
                a.name.includes(search) ||
                a.nameEn.toLowerCase().includes(search.toLowerCase()) ||
                a.tags.some(t => t.includes(search))
            return matchCat && matchSearch
        })
    }, [activeCategory, search])

    return (
        <div className="learn-page">
            {/* Sidebar */}
            <aside className="learn-sidebar">
                <div className="sidebar-search">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        placeholder="搜索算法…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="search-input"
                    />
                </div>
                <nav className="sidebar-nav">
                    {categories.map(cat => {
                        const count = algorithms.filter(a => a.category === cat.id).length
                        const visitedInCat = algorithms.filter(a => a.category === cat.id && isVisited(a.id)).length
                        return (
                            <button
                                key={cat.id}
                                className={`sidebar-item${activeCategory === cat.id ? ' active' : ''}`}
                                style={{ '--cat-color': cat.color }}
                                onClick={() => { setActiveCategory(cat.id); setSearch('') }}
                            >
                                <span className="sidebar-icon">{cat.icon}</span>
                                <span className="sidebar-label">{cat.label}</span>
                                <span className="sidebar-count">
                                    {visitedInCat > 0 && <span className="sidebar-visited">{visitedInCat}/</span>}
                                    {count}
                                </span>
                            </button>
                        )
                    })}
                </nav>

                <div className="sidebar-progress">
                    <p className="progress-label">学习进度</p>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${(visitedCount / total) * 100}%` }} />
                    </div>
                    <p className="progress-text">{visitedCount} / {total} 已完成</p>
                </div>
            </aside>

            {/* Main content */}
            <main className="learn-main">
                {(() => {
                    const cat = categories.find(c => c.id === activeCategory)
                    return (
                        <div className="learn-header">
                            <div className="learn-header-left">
                                <span className="learn-cat-icon" style={{ color: cat?.color }}>{cat?.icon}</span>
                                <div>
                                    <h1 className="learn-title">{cat?.label}</h1>
                                    <p className="learn-subtitle">
                                        {filtered.length} 个算法 · 从入门到精通
                                    </p>
                                </div>
                            </div>
                        </div>
                    )
                })()}

                {filtered.length === 0 ? (
                    <div className="empty-state">
                        <span>🔍</span>
                        <p>未找到匹配的算法</p>
                    </div>
                ) : (
                    <div className="algo-grid">
                        {filtered.map((algo, i) => (
                            <Link
                                key={algo.id}
                                to={`/algorithm/${algo.id}`}
                                className={`algo-card glass-card${isVisited(algo.id) ? ' visited' : ''}`}
                                style={{ animationDelay: `${i * 0.06}s` }}
                            >
                                <div className="algo-card-top">
                                    <span className={`badge badge-${algo.difficulty}`}>
                                        {difficultyLabel[algo.difficulty]}
                                    </span>
                                    <span className="algo-time">{algo.timeAvg}</span>
                                    {isVisited(algo.id) && <span className="card-visited-mark">✓</span>}
                                </div>
                                <h2 className="algo-name">{algo.name}</h2>
                                <p className="algo-name-en">{algo.nameEn}</p>
                                <p className="algo-summary">{algo.summary}</p>
                                <div className="algo-footer">
                                    <div className="algo-tags">
                                        {algo.tags.slice(0, 3).map(t => (
                                            <span key={t} className="tag">{t}</span>
                                        ))}
                                    </div>
                                    <span className="algo-arrow">→</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}

import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { algorithms, categories } from '../data/algorithms'
import './Complexity.css'

const difficultyLabel = { easy: '入门', medium: '进阶', hard: '困难' }
const SORT_FIELDS = ['name', 'timeAvg', 'timeBest', 'timeWorst', 'space', 'difficulty']
const SORT_LABELS = { name: '算法', timeAvg: '平均时间', timeBest: '最优时间', timeWorst: '最坏时间', space: '空间', difficulty: '难度' }

// Complexity order for sorting
function complexityOrder(val) {
    const normalized = String(val || '')
        .replace(/\s+/g, '')
        .replaceAll('·', '*')

    const map = {
        'O(1)': 1,
        'O(logn)': 2,
        'O(loglogn)': 2.2,
        'O(α(n))': 2.3,
        'O(h)': 2.4,
        'O(k)': 2.5,
        'O(L)': 2.6,
        'O(m)': 2.7,
        'O(n)': 3,
        'O(E)': 3.05,
        'O(n+L)': 3.1,
        'O(n+m)': 3.15,
        'O(n+k)': 3.2,
        'O(n*L)': 3.25,
        'O(V+E)': 3.3,
        'O(nlogn)': 4,
        'O(ElogE)': 4.2,
        'O((V+E)logV)': 4.3,
        'O(nlog²n)': 4.4,
        'O(d*(n+k))': 4.5,
        'O(VE)': 5,
        'O(mn)': 5.2,
        'O(nW)': 5.3,
        'O(n*W)': 5.3,
        'O(n²)': 6,
        'O(V²)': 6.2,
        'O(V³)': 7,
    }
    return map[val] ?? map[normalized] ?? 99
}

function difficultyOrder(d) { return { easy: 1, medium: 2, hard: 3 }[d] ?? 2 }

export default function Complexity() {
    const [sortField, setSortField] = useState('timeAvg')
    const [sortAsc, setSortAsc] = useState(true)
    const [filterCat, setFilterCat] = useState('all')

    const sorted = useMemo(() => {
        let list = filterCat === 'all' ? [...algorithms] : algorithms.filter(a => a.category === filterCat)
        list.sort((a, b) => {
            let va, vb
            if (sortField === 'difficulty') {
                va = difficultyOrder(a[sortField]); vb = difficultyOrder(b[sortField])
            } else if (sortField === 'name') {
                va = a.name; vb = b.name
                return sortAsc ? va.localeCompare(vb, 'zh') : vb.localeCompare(va, 'zh')
            } else {
                va = complexityOrder(a[sortField]); vb = complexityOrder(b[sortField])
            }
            return sortAsc ? va - vb : vb - va
        })
        return list
    }, [sortField, sortAsc, filterCat])

    const handleSort = (field) => {
        if (sortField === field) setSortAsc(a => !a)
        else { setSortField(field); setSortAsc(true) }
    }

    return (
        <div className="complexity-page">
            <div className="container">
                <div className="cplx-header">
                    <div>
                        <h1 className="cplx-title">📊 复杂度对比</h1>
                        <p className="cplx-subtitle">所有 {algorithms.length} 个算法的时间与空间复杂度一览</p>
                    </div>
                    <div className="cplx-filters">
                        <button
                            className={`cplx-filter-btn${filterCat === 'all' ? ' active' : ''}`}
                            onClick={() => setFilterCat('all')}
                        >全部</button>
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                className={`cplx-filter-btn${filterCat === cat.id ? ' active' : ''}`}
                                style={{ '--cat-color': cat.color }}
                                onClick={() => setFilterCat(cat.id)}
                            >
                                {cat.icon} {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="cplx-table-wrap glass-card">
                    <table className="cplx-table">
                        <thead>
                            <tr>
                                {SORT_FIELDS.map(f => (
                                    <th key={f} className={`cplx-th${sortField === f ? ' sorted' : ''}`} onClick={() => handleSort(f)}>
                                        {SORT_LABELS[f]}
                                        <span className="sort-icon">{sortField === f ? (sortAsc ? ' ↑' : ' ↓') : ' ↕'}</span>
                                    </th>
                                ))}
                                <th className="cplx-th">稳定性</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sorted.map((algo) => {
                                const cat = categories.find(c => c.id === algo.category)
                                const isStable = algo.tags.includes('稳定')
                                const isUnstable = algo.tags.includes('不稳定')
                                return (
                                    <tr key={algo.id} className="cplx-row">
                                        <td>
                                            <Link to={`/algorithm/${algo.id}`} className="cplx-algo-link">
                                                <span className="cplx-cat-dot" style={{ background: cat?.color }} />
                                                <span className="cplx-algo-name">{algo.name}</span>
                                                <span className="cplx-algo-en">{algo.nameEn}</span>
                                            </Link>
                                        </td>
                                        <td><ComplexityBadge val={algo.timeAvg} /></td>
                                        <td><ComplexityBadge val={algo.timeBest} type="best" /></td>
                                        <td><ComplexityBadge val={algo.timeWorst} type="worst" /></td>
                                        <td><ComplexityBadge val={algo.space} /></td>
                                        <td>
                                            <span className={`badge badge-${algo.difficulty}`}>
                                                {difficultyLabel[algo.difficulty]}
                                            </span>
                                        </td>
                                        <td>
                                            {isStable && <span className="stable-badge stable">稳定</span>}
                                            {isUnstable && <span className="stable-badge unstable">不稳定</span>}
                                            {!isStable && !isUnstable && <span className="stable-badge na">—</span>}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Legend */}
                <div className="cplx-legend">
                    <div className="cplx-legend-title">复杂度参考</div>
                    <div className="cplx-legend-items">
                        {[
                            { label: 'O(1)', color: '#22c55e', desc: '常数' },
                            { label: 'O(log n)', color: '#4ade80', desc: '对数' },
                            { label: 'O(n)', color: '#facc15', desc: '线性' },
                            { label: 'O(n log n)', color: '#f97316', desc: '线性对数' },
                            { label: 'O(n²)', color: '#ef4444', desc: '平方' },
                        ].map(item => (
                            <div key={item.label} className="cplx-legend-item">
                                <span className="cplx-legend-dot" style={{ background: item.color }} />
                                <code>{item.label}</code>
                                <span>{item.desc}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

function ComplexityBadge({ val, type }) {
    const order = complexityOrder(val)
    let color = '#94a3b8'
    if (order <= 1) color = '#22c55e'
    else if (order <= 2) color = '#4ade80'
    else if (order <= 3) color = '#facc15'
    else if (order <= 4) color = '#f97316'
    else color = '#ef4444'
    if (type === 'best') color = '#22c55e'
    if (type === 'worst' && order >= 5) color = '#ef4444'
    return <code className="cplx-val" style={{ color }}>{val}</code>
}

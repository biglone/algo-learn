import { useState, useEffect, useRef, useCallback } from 'react'
import './Visualizer.css'

// ─── Helpers ────────────────────────────────────────────────
function randomArray(n = 10) {
    return Array.from({ length: n }, () => Math.floor(Math.random() * 80) + 10)
}

// Speed config: label → interval ms
const SPEEDS = [
    { label: '0.5×', ms: 840 },
    { label: '1×', ms: 420 },
    { label: '2×', ms: 210 },
]

// ─── Step generators ────────────────────────────────────────
function getBubbleSteps(arr) {
    const a = [...arr], steps = [{ arr: [...a], comparing: [], done: [] }]
    const n = a.length, done = []
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            steps.push({ arr: [...a], comparing: [j, j + 1], done: [...done] })
            if (a[j] > a[j + 1]) {
                ;[a[j], a[j + 1]] = [a[j + 1], a[j]]
                steps.push({ arr: [...a], swapped: true, comparing: [j, j + 1], done: [...done] })
            }
        }
        done.unshift(n - 1 - i)
    }
    steps.push({ arr: [...a], done: [...Array(n).keys()], final: true })
    return steps
}

function getSelectionSteps(arr) {
    const a = [...arr], steps = [{ arr: [...a], comparing: [], done: [] }]
    const n = a.length, done = []
    for (let i = 0; i < n - 1; i++) {
        let minIdx = i
        for (let j = i + 1; j < n; j++) {
            steps.push({ arr: [...a], comparing: [minIdx, j], minIdx, boundary: i, done: [...done] })
            if (a[j] < a[minIdx]) minIdx = j
        }
        if (minIdx !== i) { ;[a[i], a[minIdx]] = [a[minIdx], a[i]] }
        done.push(i)
        steps.push({ arr: [...a], comparing: [], minIdx: -1, boundary: i, done: [...done] })
    }
    done.push(n - 1)
    steps.push({ arr: [...a], done: [...done], final: true })
    return steps
}

function getInsertionSteps(arr) {
    const a = [...arr]
    const steps = [{ arr: [...a], key: -1, keyIdx: -1, comparing: [], sorted: 0 }]
    const n = a.length
    for (let i = 1; i < n; i++) {
        const key = a[i]
        steps.push({ arr: [...a], key, keyIdx: i, comparing: [], sorted: i - 1, msg: `取出 key = ${key}` })
        let j = i - 1
        while (j >= 0 && a[j] > key) {
            steps.push({ arr: [...a], key, keyIdx: j + 1, comparing: [j, j + 1], sorted: i - 1, msg: `${a[j]} > ${key}，右移` })
            a[j + 1] = a[j]
            j--
            steps.push({ arr: [...a], key, keyIdx: j + 1, comparing: [], sorted: i - 1 })
        }
        a[j + 1] = key
        steps.push({ arr: [...a], key: -1, keyIdx: j + 1, comparing: [], sorted: i, inserted: j + 1, msg: `插入 ${key} 到位置 ${j + 1}` })
    }
    steps.push({ arr: [...a], done: true, final: true })
    return steps
}

function getMergeSteps(arr) {
    const steps = []
    const a = [...arr]
    steps.push({ arr: [...a], highlights: [], msg: '初始数组' })

    function mergeSort(arr, l, r) {
        if (l >= r) return
        const m = Math.floor((l + r) / 2)
        steps.push({ arr: [...a], highlights: [l, r], dividing: [l, m, r], msg: `分割 [${l}..${r}] → [${l}..${m}] + [${m + 1}..${r}]` })
        mergeSort(arr, l, m)
        mergeSort(arr, m + 1, r)
        merge(arr, l, m, r)
    }

    function merge(arr, l, m, r) {
        const left = arr.slice(l, m + 1)
        const right = arr.slice(m + 1, r + 1)
        let i = 0, j = 0, k = l
        steps.push({ arr: [...a], highlights: Array.from({ length: r - l + 1 }, (_, x) => l + x), msg: `合并 [${l}..${m}] 和 [${m + 1}..${r}]` })
        while (i < left.length && j < right.length) {
            if (left[i] <= right[j]) { arr[k++] = left[i++] }
            else { arr[k++] = right[j++] }
            for (let x = l; x <= r; x++) a[x] = arr[x]
            steps.push({ arr: [...a], merging: [l, r], highlights: Array.from({ length: r - l + 1 }, (_, x) => l + x), msg: `合并中...` })
        }
        while (i < left.length) { arr[k++] = left[i++]; for (let x = l; x <= r; x++) a[x] = arr[x] }
        while (j < right.length) { arr[k++] = right[j++]; for (let x = l; x <= r; x++) a[x] = arr[x] }
        steps.push({ arr: [...a], sorted: [l, r], highlights: Array.from({ length: r - l + 1 }, (_, x) => l + x), msg: `[${l}..${r}] 合并完成` })
    }

    mergeSort(a, 0, a.length - 1)
    steps.push({ arr: [...a], done: true, final: true, highlights: [] })
    return steps
}

function getQuickSteps(arr) {
    const a = [...arr]
    const steps = [{ arr: [...a], pivot: -1, left: -1, right: -1, done: [], msg: '初始数组' }]
    const done = new Set()

    function quickSort(low, high) {
        if (low >= high) {
            done.add(low)
            return
        }
        const pivotVal = a[high]
        steps.push({ arr: [...a], pivot: high, low, high, done: [...done], msg: `选择基准 pivot = ${pivotVal}（索引 ${high}）` })
        let i = low - 1
        for (let j = low; j < high; j++) {
            steps.push({ arr: [...a], pivot: high, comparing: j, boundary: i, low, high, done: [...done], msg: `比较 ${a[j]} 与 pivot ${pivotVal}` })
            if (a[j] <= pivotVal) {
                i++
                    ;[a[i], a[j]] = [a[j], a[i]]
                steps.push({ arr: [...a], pivot: high, swapped: [i, j], boundary: i, low, high, done: [...done], msg: `${a[j]} ≤ ${pivotVal}，交换` })
            }
        }
        ;[a[i + 1], a[high]] = [a[high], a[i + 1]]
        done.add(i + 1)
        steps.push({ arr: [...a], pivot: i + 1, pivotPlaced: i + 1, low, high, done: [...done], msg: `pivot ${pivotVal} 就位于索引 ${i + 1}` })
        quickSort(low, i)
        quickSort(i + 2, high)
    }

    quickSort(0, a.length - 1)
    for (let i = 0; i < a.length; i++) done.add(i)
    steps.push({ arr: [...a], done: [...done], final: true })
    return steps
}

function getSteps(algoId, arr) {
    if (algoId === 'bubble-sort') return getBubbleSteps(arr)
    if (algoId === 'selection-sort') return getSelectionSteps(arr)
    if (algoId === 'insertion-sort') return getInsertionSteps(arr)
    if (algoId === 'merge-sort') return getMergeSteps(arr)
    if (algoId === 'quick-sort') return getQuickSteps(arr)
    if (algoId === 'heap-sort') return getBubbleSteps(arr) // fallback with similar viz
    if (algoId === 'shell-sort') return getInsertionSteps(arr) // similar pattern
    if (algoId === 'counting-sort') return getSelectionSteps(arr) // generic sorting fallback
    if (algoId === 'radix-sort') return getSelectionSteps(arr) // generic sorting fallback
    if (algoId === 'bucket-sort') return getSelectionSteps(arr) // generic sorting fallback
    return [{ arr: [...arr], comparing: [], done: [] }]
}

// ─── Shared controls component ───────────────────────────────
function VizControls({ step, total, playing, onPlay, onPause, onReset, onBack, onForward, speedIdx, onSpeedChange }) {
    return (
        <div className="viz-controls-wrap">
            <div className="viz-speed">
                {SPEEDS.map((s, i) => (
                    <button
                        key={i}
                        className={`speed-btn${speedIdx === i ? ' active' : ''}`}
                        onClick={() => onSpeedChange(i)}
                    >{s.label}</button>
                ))}
            </div>
            <div className="viz-controls">
                <button className="viz-btn" onClick={onReset} title="重置">⟨⟨</button>
                <button className="viz-btn" onClick={onBack} disabled={step === 0}>‹</button>
                {playing
                    ? <button className="viz-btn viz-btn-play" onClick={onPause}>⏸</button>
                    : <button className="viz-btn viz-btn-play" onClick={onPlay} disabled={step >= total - 1}>▶</button>
                }
                <button className="viz-btn" onClick={onForward} disabled={step >= total - 1}>›</button>
            </div>
            <div className="viz-progress">
                <div className="viz-progress-bar" style={{ width: total ? `${(step / (total - 1)) * 100}%` : '0%' }} />
            </div>
            <div className="viz-step-label">步骤 {step + 1} / {total}</div>
        </div>
    )
}

function useVizPlayer(stepsLength, defaultSpeedIdx = 1) {
    const [step, setStep] = useState(0)
    const [playing, setPlaying] = useState(false)
    const [speedIdx, setSpeedIdx] = useState(defaultSpeedIdx)
    const timerRef = useRef(null)

    const play = useCallback(() => setPlaying(true), [])
    const pause = useCallback(() => setPlaying(false), [])
    const reset = useCallback(() => { setStep(0); setPlaying(false) }, [])
    const stepForward = useCallback(() => setStep(s => Math.min(s + 1, stepsLength - 1)), [stepsLength])
    const stepBack = useCallback(() => setStep(s => Math.max(s - 1, 0)), [])

    useEffect(() => {
        if (!playing) return clearInterval(timerRef.current)
        timerRef.current = setInterval(() => {
            setStep(s => {
                if (s >= stepsLength - 1) { setPlaying(false); return s }
                return s + 1
            })
        }, SPEEDS[speedIdx].ms)
        return () => clearInterval(timerRef.current)
    }, [playing, stepsLength, speedIdx])

    return { step, playing, speedIdx, play, pause, reset, stepForward, stepBack, setSpeedIdx, setStep }
}

// ─── Array Visualizer (sorting) ─────────────────────────────
function ArrayViz({ algoId }) {
    const [arr] = useState(() => randomArray())
    const [steps, setSteps] = useState([])
    const player = useVizPlayer(steps.length)

    useEffect(() => {
        const s = getSteps(algoId, arr)
        setSteps(s)
        player.setStep(0)
        player.pause()
    }, [algoId, arr])

    const current = steps[player.step] || { arr, comparing: [], done: [] }
    const maxVal = Math.max(...(current.arr || arr), 1)

    return (
        <div className="viz-container">
            {current.msg && <div className="viz-msg">{current.msg}</div>}
            <div className="array-bars">
                {(current.arr || arr).map((val, idx) => {
                    const isComparing = (current.comparing || []).includes(idx)
                    const isDone = (current.done || []).includes(idx) || current.final
                    const isMin = current.minIdx === idx
                    const isKey = current.keyIdx === idx
                    const isPivot = current.pivot === idx || current.pivotPlaced === idx
                    const isHighlight = (current.highlights || []).includes(idx)
                    let barClass = 'bar'
                    if (isDone) barClass += ' bar-done'
                    else if (isPivot) barClass += ' bar-pivot'
                    else if (isKey) barClass += ' bar-key'
                    else if (isComparing) barClass += ' bar-comparing'
                    else if (isMin) barClass += ' bar-min'
                    else if (isHighlight) barClass += ' bar-highlight'
                    return (
                        <div key={idx} className="bar-wrapper">
                            <div className={barClass} style={{ height: `${(val / maxVal) * 120}px` }} title={val} />
                            <span className="bar-label">{val}</span>
                        </div>
                    )
                })}
            </div>
            {current.final && <div className="viz-done-label">✓ 排序完成！</div>}
            <VizControls
                step={player.step} total={steps.length} playing={player.playing}
                onPlay={player.play} onPause={player.pause} onReset={player.reset}
                onBack={player.stepBack} onForward={player.stepForward}
                speedIdx={player.speedIdx} onSpeedChange={player.setSpeedIdx}
            />
            <div className="viz-legend">
                <span className="legend-item"><span className="legend-dot dot-default" />未处理</span>
                <span className="legend-item"><span className="legend-dot dot-comparing" />比较</span>
                <span className="legend-item"><span className="legend-dot dot-pivot" />基准/当前</span>
                <span className="legend-item"><span className="legend-dot dot-done" />有序</span>
            </div>
        </div>
    )
}

// ─── Search Visualizer ──────────────────────────────────────
function SearchViz({ algoId }) {
    const [arr] = useState(() => Array.from({ length: 12 }, (_, i) => (i + 1) * 7).sort((a, b) => a - b))
    const target = 49

    const steps = (() => {
        if (algoId === 'binary-search') {
            const s = []
            let lo = 0, hi = arr.length - 1
            s.push({ lo, hi, mid: -1, found: false })
            while (lo <= hi) {
                const mid = lo + Math.floor((hi - lo) / 2)
                s.push({ lo, hi, mid, found: arr[mid] === target })
                if (arr[mid] === target) break
                else if (arr[mid] < target) lo = mid + 1
                else hi = mid - 1
                s.push({ lo, hi, mid, found: false })
            }
            return s
        }
        const s = [{ current: -1, found: false }]
        for (let i = 0; i < arr.length; i++) {
            s.push({ current: i, found: arr[i] === target })
            if (arr[i] === target) break
        }
        return s
    })()

    const player = useVizPlayer(steps.length)
    const current = steps[player.step] || {}

    return (
        <div className="viz-container">
            <div className="search-target">目标值: <strong>{target}</strong></div>
            <div className="search-array">
                {arr.map((val, idx) => {
                    let cls = 'search-cell'
                    if (algoId === 'binary-search') {
                        if (idx === current.mid) cls += current.found ? ' cell-found' : ' cell-mid'
                        else if (idx >= current.lo && idx <= current.hi) cls += ' cell-range'
                        else cls += ' cell-eliminated'
                    } else {
                        if (idx === current.current) cls += current.found ? ' cell-found' : ' cell-mid'
                        else if (idx < (current.current ?? -1)) cls += ' cell-eliminated'
                    }
                    return (
                        <div key={idx} className={cls}>
                            <span className="cell-val">{val}</span>
                            <span className="cell-idx">{idx}</span>
                        </div>
                    )
                })}
            </div>
            {current.found && <div className="viz-done-label">✓ 找到目标！</div>}
            <VizControls
                step={player.step} total={steps.length} playing={player.playing}
                onPlay={player.play} onPause={player.pause} onReset={player.reset}
                onBack={player.stepBack} onForward={player.stepForward}
                speedIdx={player.speedIdx} onSpeedChange={player.setSpeedIdx}
            />
            <div className="viz-legend">
                <span className="legend-item"><span className="legend-dot dot-default" />待搜</span>
                <span className="legend-item"><span className="legend-dot dot-comparing" />当前</span>
                <span className="legend-item"><span className="legend-dot dot-done" />找到</span>
            </div>
        </div>
    )
}

// ─── Graph BFS/DFS Visualizer ───────────────────────────────
const GRAPH_NODES = {
    A: { x: 50, y: 15 }, B: { x: 22, y: 45 }, C: { x: 78, y: 45 },
    D: { x: 10, y: 80 }, E: { x: 36, y: 80 }, F: { x: 64, y: 80 }, G: { x: 90, y: 80 },
}
const GRAPH_EDGES = [['A', 'B'], ['A', 'C'], ['B', 'D'], ['B', 'E'], ['C', 'F'], ['C', 'G']]
const GRAPH_ADJ = { A: ['B', 'C'], B: ['D', 'E'], C: ['F', 'G'], D: [], E: [], F: [], G: [] }

function getGraphSteps(type) {
    const steps = []
    if (type === 'bfs') {
        const visited = new Set(), queue = ['A'], order = []
        steps.push({ visited: new Set(visited), queue: [...queue], current: null, order: [...order] })
        while (queue.length) {
            const node = queue.shift()
            if (visited.has(node)) continue
            visited.add(node); order.push(node)
            steps.push({ visited: new Set(visited), queue: [...queue], current: node, order: [...order] })
            for (const nb of GRAPH_ADJ[node] || []) {
                if (!visited.has(nb)) queue.push(nb)
            }
            steps.push({ visited: new Set(visited), queue: [...queue], current: node, order: [...order] })
        }
    } else {
        const visited = new Set(), stack = ['A'], order = []
        steps.push({ visited: new Set(visited), stack: [...stack], current: null, order: [...order] })
        while (stack.length) {
            const node = stack.pop()
            if (visited.has(node)) continue
            visited.add(node); order.push(node)
            steps.push({ visited: new Set(visited), stack: [...stack], current: node, order: [...order] })
            for (const nb of [...(GRAPH_ADJ[node] || [])].reverse()) {
                if (!visited.has(nb)) stack.push(nb)
            }
            steps.push({ visited: new Set(visited), stack: [...stack], current: node, order: [...order] })
        }
    }
    return steps
}

function GraphViz({ algoId }) {
    const isBfs = algoId === 'bfs'
    const [steps] = useState(() => getGraphSteps(isBfs ? 'bfs' : 'dfs'))
    const player = useVizPlayer(steps.length)
    const current = steps[player.step] || { visited: new Set(), current: null, order: [] }
    const ds = isBfs ? 'queue' : 'stack'

    return (
        <div className="viz-container">
            <svg viewBox="0 0 100 100" className="graph-svg">
                {GRAPH_EDGES.map(([a, b]) => (
                    <line key={a + b}
                        x1={`${GRAPH_NODES[a].x}%`} y1={`${GRAPH_NODES[a].y}%`}
                        x2={`${GRAPH_NODES[b].x}%`} y2={`${GRAPH_NODES[b].y}%`}
                        stroke="rgba(255,255,255,0.15)" strokeWidth="0.8"
                    />
                ))}
                {Object.entries(GRAPH_NODES).map(([id, pos]) => {
                    const isVisited = current.visited?.has(id)
                    const isCurrent = current.current === id
                    return (
                        <g key={id}>
                            <circle
                                cx={`${pos.x}%`} cy={`${pos.y}%`} r="6.5"
                                fill={isCurrent ? '#7c3aed' : isVisited ? '#06b6d4' : '#1c2538'}
                                stroke={isCurrent ? '#a78bfa' : isVisited ? '#38bdf8' : 'rgba(255,255,255,0.2)'}
                                strokeWidth="1"
                                style={{ transition: 'fill 0.3s, stroke 0.3s' }}
                            />
                            <text x={`${pos.x}%`} y={`${pos.y + 1.5}%`}
                                textAnchor="middle" fill="white" fontSize="4" fontWeight="bold">
                                {id}
                            </text>
                        </g>
                    )
                })}
            </svg>
            <div className="graph-info">
                <div className="graph-ds-label">{isBfs ? '队列' : '栈'}: [{
                    (isBfs ? current.queue : current.stack || []).join(', ')
                }]</div>
                <div className="graph-order">
                    访问顺序: {(current.order || []).map((n, i) => (
                        <span key={i} className="graph-order-node">{n}</span>
                    ))}
                </div>
            </div>
            <VizControls
                step={player.step} total={steps.length} playing={player.playing}
                onPlay={player.play} onPause={player.pause} onReset={player.reset}
                onBack={player.stepBack} onForward={player.stepForward}
                speedIdx={player.speedIdx} onSpeedChange={player.setSpeedIdx}
            />
        </div>
    )
}

// ─── DP Fibonacci Visualizer ────────────────────────────────
function DPViz() {
    const N = 10
    const fibs = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55]
    const steps = Array.from({ length: N + 1 }, (_, i) => ({ filled: i }))
    const player = useVizPlayer(steps.length)
    const current = steps[player.step]

    return (
        <div className="viz-container">
            <div className="dp-label">F(n) 递推表格</div>
            <div className="dp-table">
                {fibs.slice(0, N + 1).map((val, i) => (
                    <div key={i} className={`dp-cell${i <= current.filled ? ' dp-filled' : ''}${i === current.filled ? ' dp-current' : ''}`}>
                        <span className="dp-val">{i <= current.filled ? val : '?'}</span>
                        <span className="dp-idx">F({i})</span>
                    </div>
                ))}
            </div>
            {player.step >= 2 && (
                <div className="dp-formula">
                    F({player.step}) = F({player.step - 1}) + F({player.step - 2}) = {fibs[player.step - 1]} + {fibs[player.step - 2]} = <strong>{fibs[player.step]}</strong>
                </div>
            )}
            <VizControls
                step={player.step} total={steps.length} playing={player.playing}
                onPlay={player.play} onPause={player.pause} onReset={player.reset}
                onBack={player.stepBack} onForward={player.stepForward}
                speedIdx={player.speedIdx} onSpeedChange={player.setSpeedIdx}
            />
        </div>
    )
}

// ─── Stack Visualizer ───────────────────────────────────────
function StackViz() {
    const ops = [
        { op: 'push', val: 5 }, { op: 'push', val: 12 }, { op: 'push', val: 8 },
        { op: 'push', val: 3 }, { op: 'pop' }, { op: 'push', val: 20 }, { op: 'pop' }, { op: 'pop' },
    ]
    const steps = (() => {
        const s = [{ stack: [] }]; let stack = []
        ops.forEach(({ op, val }) => {
            if (op === 'push') stack = [...stack, val]
            else stack = stack.slice(0, -1)
            s.push({ stack: [...stack], lastOp: op, lastVal: val })
        })
        return s
    })()
    const player = useVizPlayer(steps.length)
    const current = steps[player.step]

    return (
        <div className="viz-container">
            <div className="stack-viz">
                <div className="stack-column">
                    {[...current.stack].reverse().map((val, i) => (
                        <div key={i} className={`stack-item${i === 0 ? ' stack-top' : ''}`}>
                            {i === 0 && <span className="stack-top-label">TOP</span>}
                            <span>{val}</span>
                        </div>
                    ))}
                    {current.stack.length === 0 && <div className="stack-empty">空</div>}
                </div>
                <div className="stack-ops">
                    {ops.map(({ op, val }, i) => (
                        <div key={i} className={`stack-op${i === player.step - 1 ? ' stack-op-active' : ''}${i < player.step - 1 ? ' stack-op-done' : ''}`}>
                            {op === 'push' ? `push(${val})` : 'pop()'}
                        </div>
                    ))}
                </div>
            </div>
            {current.lastOp && (
                <div className="viz-step-label">
                    操作: <code>{current.lastOp === 'push' ? `push(${current.lastVal})` : 'pop()'}</code>
                    &nbsp;→ 栈顶: <code>{current.stack[current.stack.length - 1] ?? '空'}</code>
                </div>
            )}
            <VizControls
                step={player.step} total={steps.length} playing={player.playing}
                onPlay={player.play} onPause={player.pause} onReset={player.reset}
                onBack={player.stepBack} onForward={player.stepForward}
                speedIdx={player.speedIdx} onSpeedChange={player.setSpeedIdx}
            />
        </div>
    )
}

// ─── Queue Visualizer ───────────────────────────────────────
function QueueViz() {
    const ops = [
        { op: 'enqueue', val: 'A' }, { op: 'enqueue', val: 'B' }, { op: 'enqueue', val: 'C' },
        { op: 'dequeue' }, { op: 'enqueue', val: 'D' }, { op: 'enqueue', val: 'E' },
        { op: 'dequeue' }, { op: 'dequeue' },
    ]
    const steps = (() => {
        const s = [{ queue: [] }]; let queue = []
        ops.forEach(({ op, val }) => {
            if (op === 'enqueue') queue = [...queue, val]
            else queue = queue.slice(1)
            s.push({ queue: [...queue], lastOp: op, lastVal: val })
        })
        return s
    })()
    const player = useVizPlayer(steps.length)
    const current = steps[player.step]

    return (
        <div className="viz-container">
            <div className="queue-viz">
                <div className="queue-labels">
                    {current.queue.length > 0 && (
                        <>
                            <span className="queue-end-label">FRONT</span>
                            <span className="queue-end-label" style={{ marginLeft: 'auto' }}>REAR</span>
                        </>
                    )}
                </div>
                <div className="queue-row">
                    {current.queue.length === 0
                        ? <div className="queue-empty">空队列</div>
                        : current.queue.map((val, i) => (
                            <div key={i} className={`queue-item${i === 0 ? ' queue-front' : ''}${i === current.queue.length - 1 ? ' queue-rear' : ''}`}>
                                {val}
                            </div>
                        ))
                    }
                </div>
                <div className="queue-arrows">
                    <span className="queue-arrow-label">← 出队 (dequeue)</span>
                    <span className="queue-arrow-label">入队 (enqueue) →</span>
                </div>
            </div>
            <div className="queue-ops-strip">
                {ops.map(({ op, val }, i) => (
                    <div key={i} className={`queue-op${i === player.step - 1 ? ' queue-op-active' : ''}${i < player.step - 1 ? ' queue-op-done' : ''}`}>
                        {op === 'enqueue' ? `enqueue(${val})` : 'dequeue()'}
                    </div>
                ))}
            </div>
            {current.lastOp && (
                <div className="viz-step-label">
                    操作: <code>{current.lastOp === 'enqueue' ? `enqueue(${current.lastVal})` : 'dequeue()'}</code>
                    &nbsp;→ 队列长度: <code>{current.queue.length}</code>
                </div>
            )}
            <VizControls
                step={player.step} total={steps.length} playing={player.playing}
                onPlay={player.play} onPause={player.pause} onReset={player.reset}
                onBack={player.stepBack} onForward={player.stepForward}
                speedIdx={player.speedIdx} onSpeedChange={player.setSpeedIdx}
            />
        </div>
    )
}

// ─── Hash Table Visualizer ──────────────────────────────────
const HASH_SIZE = 7
const HASH_OPS = [
    { op: 'set', key: 'name', val: 'Alice' },
    { op: 'set', key: 'age', val: '25' },
    { op: 'set', key: 'city', val: 'Beijing' },
    { op: 'set', key: 'job', val: 'Dev' },
    { op: 'get', key: 'age' },
    { op: 'set', key: 'lang', val: 'JS' },
    { op: 'delete', key: 'city' },
    { op: 'get', key: 'name' },
]

function hashFn(key) {
    let h = 0
    for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) % HASH_SIZE
    return h
}

function HashViz() {
    const steps = (() => {
        const s = [{ table: Array(HASH_SIZE).fill(null).map(() => []), activeIdx: -1, opResult: null }]
        let table = Array(HASH_SIZE).fill(null).map(() => [])
        HASH_OPS.forEach(({ op, key, val }) => {
            table = table.map(b => [...b])
            const idx = hashFn(key)
            let opResult = null
            if (op === 'set') {
                const bucket = table[idx]
                const existing = bucket.findIndex(p => p[0] === key)
                if (existing >= 0) bucket[existing] = [key, val]
                else bucket.push([key, val])
                opResult = `set(${key}) → 索引 ${idx}`
            } else if (op === 'get') {
                const found = table[idx].find(p => p[0] === key)
                opResult = `get(${key}) → ${found ? `"${found[1]}"` : 'undefined'}`
            } else if (op === 'delete') {
                table[idx] = table[idx].filter(p => p[0] !== key)
                opResult = `delete(${key}) → 索引 ${idx}`
            }
            s.push({ table: table.map(b => [...b]), activeIdx: idx, opResult, op, key })
        })
        return s
    })()
    const player = useVizPlayer(steps.length)
    const current = steps[player.step]

    return (
        <div className="viz-container">
            <div className="hash-grid">
                {current.table.map((bucket, i) => (
                    <div key={i} className={`hash-bucket${i === current.activeIdx ? ' hash-bucket-active' : ''}`}>
                        <span className="hash-idx">[{i}]</span>
                        <div className="hash-chain">
                            {bucket.length === 0
                                ? <span className="hash-empty">—</span>
                                : bucket.map((pair, j) => (
                                    <span key={j} className="hash-pair">
                                        {pair[0]}: <em>"{pair[1]}"</em>
                                        {j < bucket.length - 1 && <span className="hash-arrow">→</span>}
                                    </span>
                                ))
                            }
                        </div>
                    </div>
                ))}
            </div>
            {current.opResult && <div className="viz-msg">{current.opResult}</div>}
            <VizControls
                step={player.step} total={steps.length} playing={player.playing}
                onPlay={player.play} onPause={player.pause} onReset={player.reset}
                onBack={player.stepBack} onForward={player.stepForward}
                speedIdx={player.speedIdx} onSpeedChange={player.setSpeedIdx}
            />
        </div>
    )
}

// ─── Binary Tree Traversal Visualizer ───────────────────────
// Tree structure:      4
//                    /   \
//                   2     6
//                  / \   / \
//                 1   3 5   7
const TREE_NODES = [
    { id: 1, val: 4, x: 50, y: 10, left: 2, right: 3 },
    { id: 2, val: 2, x: 27, y: 35, left: 4, right: 5 },
    { id: 3, val: 6, x: 73, y: 35, left: 6, right: 7 },
    { id: 4, val: 1, x: 16, y: 65, left: null, right: null },
    { id: 5, val: 3, x: 38, y: 65, left: null, right: null },
    { id: 6, val: 5, x: 62, y: 65, left: null, right: null },
    { id: 7, val: 7, x: 84, y: 65, left: null, right: null },
]
const TREE_EDGES = [[1, 2], [1, 3], [2, 4], [2, 5], [3, 6], [3, 7]]

function getTreeSteps(type) {
    const steps = []
    const nodeMap = Object.fromEntries(TREE_NODES.map(n => [n.id, n]))

    function traverse(nodeId, visited) {
        if (!nodeId) return
        const node = nodeMap[nodeId]
        if (type === 'preorder') {
            visited = [...visited, nodeId]
            steps.push({ visited: [...visited], current: nodeId })
            traverse(node.left, visited)
            traverse(node.right, visited)
        } else if (type === 'inorder') {
            traverse(node.left, visited)
            visited = [...visited, nodeId]
            steps.push({ visited: [...visited], current: nodeId })
            traverse(node.right, visited)
        } else {
            traverse(node.left, visited)
            traverse(node.right, visited)
            visited = [...visited, nodeId]
            steps.push({ visited: [...visited], current: nodeId })
        }
    }

    steps.push({ visited: [], current: null })
    traverse(1, [])
    return steps
}

function TreeViz() {
    const [traversal, setTraversal] = useState('inorder')
    const [steps, setSteps] = useState(() => getTreeSteps('inorder'))
    const player = useVizPlayer(steps.length)
    const current = steps[player.step] || { visited: [], current: null }
    const nodeMap = Object.fromEntries(TREE_NODES.map(n => [n.id, n]))
    const visitedNodes = current.visited || []
    const visitOrder = visitedNodes.map(id => nodeMap[id]?.val)

    const changeTraversal = (t) => {
        setTraversal(t)
        setSteps(getTreeSteps(t))
        player.reset()
    }

    return (
        <div className="viz-container">
            <div className="tree-tabs">
                {['preorder', 'inorder', 'postorder'].map(t => (
                    <button
                        key={t}
                        className={`tree-tab${traversal === t ? ' active' : ''}`}
                        onClick={() => changeTraversal(t)}
                    >
                        {t === 'preorder' ? '前序' : t === 'inorder' ? '中序' : '后序'}
                    </button>
                ))}
            </div>
            <svg viewBox="0 0 100 80" className="tree-svg">
                {TREE_EDGES.map(([a, b]) => {
                    const na = nodeMap[a], nb = nodeMap[b]
                    return (
                        <line key={`${a}-${b}`}
                            x1={`${na.x}%`} y1={`${na.y + 4}%`}
                            x2={`${nb.x}%`} y2={`${nb.y - 4}%`}
                            stroke="rgba(255,255,255,0.2)" strokeWidth="0.8"
                        />
                    )
                })}
                {TREE_NODES.map(node => {
                    const isVisited = visitedNodes.includes(node.id)
                    const isCurrent = current.current === node.id
                    return (
                        <g key={node.id}>
                            <circle
                                cx={`${node.x}%`} cy={`${node.y}%`} r="5.5"
                                fill={isCurrent ? '#7c3aed' : isVisited ? '#06b6d4' : '#1c2538'}
                                stroke={isCurrent ? '#a78bfa' : isVisited ? '#38bdf8' : 'rgba(255,255,255,0.2)'}
                                strokeWidth="1"
                                style={{ transition: 'fill 0.35s, stroke 0.35s' }}
                            />
                            <text x={`${node.x}%`} y={`${node.y + 1.5}%`}
                                textAnchor="middle" fill="white" fontSize="4" fontWeight="bold">
                                {node.val}
                            </text>
                        </g>
                    )
                })}
            </svg>
            <div className="graph-order">
                访问顺序: {visitOrder.map((v, i) => <span key={i} className="graph-order-node">{v}</span>)}
            </div>
            <VizControls
                step={player.step} total={steps.length} playing={player.playing}
                onPlay={player.play} onPause={player.pause} onReset={player.reset}
                onBack={player.stepBack} onForward={player.stepForward}
                speedIdx={player.speedIdx} onSpeedChange={player.setSpeedIdx}
            />
        </div>
    )
}

// ─── Main dispatcher ─────────────────────────────────────────
export default function Visualizer({ algo }) {
    switch (algo.visualizerType) {
        case 'search': return <SearchViz algoId={algo.id} />
        case 'graph': return <GraphViz algoId={algo.id} />
        case 'dp': return <DPViz />
        case 'stack': return <StackViz />
        case 'queue': return <QueueViz />
        case 'hash': return <HashViz />
        case 'tree': return <TreeViz />
        default: return <ArrayViz algoId={algo.id} />
    }
}

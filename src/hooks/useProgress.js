// ============================================================
// useProgress — localStorage-based learning progress tracking
// ============================================================

import { useState, useCallback } from 'react'

const STORAGE_KEY = 'algo-learn-visited'

function loadVisited() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        return raw ? new Set(JSON.parse(raw)) : new Set()
    } catch {
        return new Set()
    }
}

function saveVisited(set) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]))
    } catch { /* ignore */ }
}

export function useProgress() {
    const [visited, setVisited] = useState(() => loadVisited())

    const visitAlgo = useCallback((id) => {
        setVisited(prev => {
            if (prev.has(id)) return prev
            const next = new Set(prev)
            next.add(id)
            saveVisited(next)
            return next
        })
    }, [])

    const isVisited = useCallback((id) => visited.has(id), [visited])

    return { visited, visitAlgo, isVisited, visitedCount: visited.size }
}

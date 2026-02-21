import { useEffect, useMemo, useState } from 'react'
import './InterviewPlan.css'

const STORAGE_KEY = 'algo-learn-interview-plan-v1'

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

export default function InterviewPlan() {
    const [progress, setProgress] = useState(() => loadProgress())

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

    const toggleTask = (dayId, taskId) => {
        const key = taskKey(dayId, taskId)
        setProgress(prev => ({ ...prev, [key]: !prev[key] }))
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
                            14 天高频算法题清单，支持本地打卡。建议每日执行：限时解题 → 复盘 → 1/3/7 天二刷。
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
                                        return (
                                            <label key={key} className={`interview-task-item${checked ? ' checked' : ''}`}>
                                                <input
                                                    type="checkbox"
                                                    checked={checked}
                                                    onChange={() => toggleTask(day.id, task.id)}
                                                />
                                                <span className="interview-task-id">{task.id}</span>
                                                <span className="interview-task-title">{task.title}</span>
                                            </label>
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

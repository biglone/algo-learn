const PROBLEM_GO_CODES = {}

function toPascalCase(title = '') {
    const parts = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, ' ')
        .trim()
        .split(/\s+/)
        .filter(Boolean)

    if (parts.length === 0) return 'Solve'

    const merged = parts.map(word => word[0].toUpperCase() + word.slice(1)).join('')
    if (/^[0-9]/.test(merged)) return `Solve${merged}`
    return merged
}

function getGenericGoCode(task) {
    const methodName = toPascalCase(task?.title || 'Solve')
    return `package main

type Solution struct{}

// TODO: 按题意补全参数与返回值
func (s *Solution) ${methodName}() {
    // TODO: 实现 ${task?.id || ''} ${task?.title || ''} 的 Go 解法
}

func main() {
    // TODO: 读取输入并调用 Solution 方法
    // 示例:
    // sol := Solution{}
    // sol.${methodName}()
}
`
}

export function getProblemGoCode(task) {
    if (!task || !task.id) return getGenericGoCode(task)
    return PROBLEM_GO_CODES[task.id] || getGenericGoCode(task)
}

export { PROBLEM_GO_CODES }

const PROBLEM_RUST_CODES = {}

function toSnakeCase(title = '') {
    const normalized = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '')
    if (!normalized) return 'solve'
    if (/^[0-9]/.test(normalized)) return `solve_${normalized}`
    return normalized
}

function getGenericRustCode(task) {
    const methodName = toSnakeCase(task?.title || 'solve')
    return `struct Solution;

impl Solution {
    // TODO: 按题意补全参数与返回值
    fn ${methodName}(&self) {
        // TODO: 实现 ${task?.id || ''} ${task?.title || ''} 的 Rust 解法
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

export function getProblemRustCode(task) {
    if (!task || !task.id) return getGenericRustCode(task)
    return PROBLEM_RUST_CODES[task.id] || getGenericRustCode(task)
}

export { PROBLEM_RUST_CODES }

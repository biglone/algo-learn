const PROBLEM_CPP_CODES = {}

function toCamelCase(title = '') {
    const parts = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, ' ')
        .trim()
        .split(/\s+/)
        .filter(Boolean)

    if (parts.length === 0) return 'solve'

    const [first, ...rest] = parts
    const base = first + rest.map(word => word[0].toUpperCase() + word.slice(1)).join('')
    if (/^[0-9]/.test(base)) return `solve${base}`
    return base
}

function getGenericCppCode(task) {
    const methodName = toCamelCase(task?.title || 'solve')
    return `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    // TODO: 按题意补全参数与返回值
    void ${methodName}() {
        // TODO: 实现 ${task?.id || ''} ${task?.title || ''} 的 C++ 解法
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    // TODO: 读取输入并调用 Solution 方法
    // 示例:
    // Solution sol;
    // sol.${methodName}();

    return 0;
}
`
}

export function getProblemCppCode(task) {
    if (!task || !task.id) return getGenericCppCode(task)
    return PROBLEM_CPP_CODES[task.id] || getGenericCppCode(task)
}

export { PROBLEM_CPP_CODES }

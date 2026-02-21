// ============================================================
// Algorithm Data — All algorithm metadata and content
// ============================================================

export const categories = [
  { id: 'sorting', label: '排序算法', icon: '↕', color: '#7c3aed' },
  { id: 'searching', label: '搜索算法', icon: '🔍', color: '#06b6d4' },
  { id: 'graph', label: '图算法', icon: '🕸', color: '#10b981' },
  { id: 'dp', label: '动态规划', icon: '⚡', color: '#f59e0b' },
  { id: 'structures', label: '数据结构', icon: '🗂', color: '#ef4444' },
]

export const algorithms = [
  // ─── Sorting ────────────────────────────────────────────────
  {
    id: 'bubble-sort',
    category: 'sorting',
    name: '冒泡排序',
    nameEn: 'Bubble Sort',
    difficulty: 'easy',
    timeAvg: 'O(n²)',
    timeBest: 'O(n)',
    timeWorst: 'O(n²)',
    space: 'O(1)',
    tags: ['排序', '比较', '稳定'],
    summary: '反复比较相邻元素，把最大值像气泡一样浮到末尾。',
    description: `冒泡排序是最基础的排序算法之一。它的核心思想非常简单：

**工作原理**
- 从数组第一个元素开始，依次比较相邻的两个元素
- 如果前面的数比后面的数大，则交换它们的位置
- 一轮遍历结束后，最大的数会"冒泡"到数组末尾
- 对剩余的 n-1 个元素重复上述过程
- 直到没有任何交换发生为止

**直观理解**
想象水里的气泡，大气泡总会比小气泡浮得更快。每一趟排序，当前最大的元素就像一个气泡，一步步移动到它应该在的位置。

**优化技巧**
可以添加一个标志位，如果某一趟没有发生任何交换，说明数组已经有序，可以提前退出。这使得最好情况的时间复杂度降到 O(n)。`,
    steps: [
      '从数组首位开始，比较 arr[0] 和 arr[1]',
      '若 arr[0] > arr[1]，交换两者位置',
      '向右移动，比较 arr[1] 和 arr[2]，重复上述判断',
      '一轮结束后，最大元素已到达末尾',
      '缩小范围，对前 n-1 个元素重复以上步骤',
      '直到没有交换发生，排序完成',
    ],
    code: {
      javascript: `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // 交换相邻元素
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    // 如果没有交换，提前退出
    if (!swapped) break;
  }
  return arr;
}`,
      python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        swapped = False
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                # 交换相邻元素
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        # 如果没有交换，提前退出
        if not swapped:
            break
    return arr`,
    },
    visualizerType: 'array',
  },
  {
    id: 'selection-sort',
    category: 'sorting',
    name: '选择排序',
    nameEn: 'Selection Sort',
    difficulty: 'easy',
    timeAvg: 'O(n²)',
    timeBest: 'O(n²)',
    timeWorst: 'O(n²)',
    space: 'O(1)',
    tags: ['排序', '比较', '不稳定'],
    summary: '每次从未排序部分找到最小元素，放到已排序末尾。',
    description: `选择排序的思路直观简洁：每轮从未排序的部分里"选出"最小的元素，放到正确位置。

**工作原理**
- 将数组分为已排序区（左侧）和未排序区（右侧）
- 每轮遍历未排序区，找出最小元素的索引
- 将最小元素与未排序区的第一个元素交换
- 已排序区向右扩展一个位置
- 重复，直到所有元素都在已排序区

**与冒泡排序的区别**
冒泡排序每一步都在交换，而选择排序每一轮只交换一次。因此选择排序的交换次数少，但比较次数相同，均为 O(n²)。

**局限性**
选择排序是不稳定排序，即相等元素的相对顺序可能改变。`,
    steps: [
      '设 i=0，将 arr[0] 视为当前最小值',
      '遍历 arr[1..n-1]，找到真正的最小值及其索引 minIdx',
      '将 arr[0] 与 arr[minIdx] 交换',
      '已排序区增加一个元素（arr[0]）',
      '令 i=1，在 arr[1..n-1] 中重复上述过程',
      '持续直到 i = n-1，排序完成',
    ],
    code: {
      javascript: `function selectionSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    // 找未排序区的最小值索引
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) minIdx = j;
    }
    // 将最小值换到已排序区末尾
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
  }
  return arr;
}`,
      python: `def selection_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        # 找未排序区的最小值索引
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        # 将最小值换到正确位置
        if min_idx != i:
            arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr`,
    },
    visualizerType: 'array',
  },
  {
    id: 'insertion-sort',
    category: 'sorting',
    name: '插入排序',
    nameEn: 'Insertion Sort',
    difficulty: 'easy',
    timeAvg: 'O(n²)',
    timeBest: 'O(n)',
    timeWorst: 'O(n²)',
    space: 'O(1)',
    tags: ['排序', '稳定', '在线'],
    summary: '像整理扑克牌一样，将每张新牌插入已排序的手牌中。',
    description: `插入排序模拟了我们日常整理扑克牌的方式：

**工作原理**
- 将第一个元素视为已排序序列
- 取出下一个元素（key）
- 将 key 与已排序部分从右往左逐一比较
- 比 key 大的元素依次右移
- 将 key 插入到正确的位置

**最优场景**
当数组接近有序时，插入排序非常高效，时间复杂度接近 O(n)，是处理"几乎有序"数据的首选。

**实际应用**
- 小规模数据（n < 20）时比快速排序更快
- 是 TimSort（Python/Java 默认排序）的核心组件之一
- 适合在线排序（数据流式输入）`,
    steps: [
      '从 i=1 开始，取 key = arr[1]',
      '将 key 与 arr[0] 比较，若 arr[0] > key，则 arr[0] 右移',
      '将 key 插入空出的位置',
      '取 key = arr[2]，从右向左依次比较并右移大于 key 的元素',
      '找到合适位置后插入 key',
      '重复直到处理完所有元素',
    ],
    code: {
      javascript: `function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    // 将比 key 大的元素依次右移
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    // 插入 key 到正确位置
    arr[j + 1] = key;
  }
  return arr;
}`,
      python: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        # 将比 key 大的元素依次右移
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        # 插入 key 到正确位置
        arr[j + 1] = key
    return arr`,
    },
    visualizerType: 'array',
  },
  {
    id: 'merge-sort',
    category: 'sorting',
    name: '归并排序',
    nameEn: 'Merge Sort',
    difficulty: 'medium',
    timeAvg: 'O(n log n)',
    timeBest: 'O(n log n)',
    timeWorst: 'O(n log n)',
    space: 'O(n)',
    tags: ['排序', '分治', '稳定', '递归'],
    summary: '分治思想：不断二分数组，排序后再合并。',
    description: `归并排序是分治思想的经典应用，也是排序稳定性与效率兼顾的优秀算法。

**核心思想：分而治之**
1. **分**：将数组从中间一分为二
2. **治**：递归地对两个子数组排序
3. **合**：将两个已排序的子数组合并为一个有序数组

**合并过程**
合并是归并排序的关键：用两个指针分别指向两个子数组头部，每次取较小的元素放入结果数组，直到某个子数组耗尽后将另一个直接追加。

**稳定性**
归并排序是稳定排序。因为合并时相等元素总是取左边（先来的先放），相对顺序得以保持。

**空间代价**
归并排序需要 O(n) 的额外空间来存储合并中间结果，这是其主要局限。`,
    steps: [
      '若数组长度 ≤ 1，直接返回（递归基）',
      '从中点将数组分为左半部分和右半部分',
      '递归对左半部分执行归并排序',
      '递归对右半部分执行归并排序',
      '合并两个已排序子数组：比较左右指针，取小者放入结果',
      '将剩余元素直接追加到结果末尾',
    ],
    code: {
      javascript: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  
  const mid = Math.floor(arr.length / 2);
  const left  = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  return [...result, ...left.slice(i), ...right.slice(j)];
}`,
      python: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    
    mid = len(arr) // 2
    left  = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    return result + left[i:] + right[j:]`,
    },
    visualizerType: 'array',
  },
  {
    id: 'quick-sort',
    category: 'sorting',
    name: '快速排序',
    nameEn: 'Quick Sort',
    difficulty: 'medium',
    timeAvg: 'O(n log n)',
    timeBest: 'O(n log n)',
    timeWorst: 'O(n²)',
    space: 'O(log n)',
    tags: ['排序', '分治', '不稳定', '递归'],
    summary: '选一个基准，小的放左边大的放右边，递归分治。',
    description: `快速排序是实践中最快的通用排序算法之一，现代编程语言的内置排序大多基于它的变体。

**核心思路**
1. 选择一个**基准元素（pivot）**
2. **分区**：将小于 pivot 的移到左边，大于 pivot 的移到右边，pivot 落在最终位置
3. 递归对左右子数组排序

**分区（Partition）的关键**
最常用的是 Lomuto 分区方案：选末尾元素为基准，用指针 i 记录"小于区域"的边界，遍历时修改边界。

**枢轴选择策略**
- 末尾元素：简单，但对有序数组退化为 O(n²)
- 随机选取：期望情况良好
- 三数取中：取首、中、尾的中位数，更稳定

**为什么实践中很快？**
虽然最坏是 O(n²)，但平均 O(n log n)，且常数小、缓存友好，比归并排序快约 2-3 倍。`,
    steps: [
      '选择末尾元素 pivot',
      '初始化分界指针 i = low - 1',
      '遍历 arr[low..high-1]，遇到 ≤ pivot 的元素则 i++ 并与当前元素交换',
      '遍历结束后，将 pivot 放到 i+1 位置（其最终位置）',
      '以 pivot 位置为界，递归处理左半部分',
      '递归处理右半部分，直到所有子数组长度 ≤ 1',
    ],
    code: {
      javascript: `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`,
      python: `def quick_sort(arr, low=0, high=None):
    if high is None:
        high = len(arr) - 1
    if low < high:
        pi = partition(arr, low, high)
        quick_sort(arr, low, pi - 1)
        quick_sort(arr, pi + 1, high)
    return arr

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1`,
    },
    visualizerType: 'array',
  },

  // ─── Searching ─────────────────────────────────────────────
  {
    id: 'linear-search',
    category: 'searching',
    name: '线性搜索',
    nameEn: 'Linear Search',
    difficulty: 'easy',
    timeAvg: 'O(n)',
    timeBest: 'O(1)',
    timeWorst: 'O(n)',
    space: 'O(1)',
    tags: ['搜索', '暴力', '顺序'],
    summary: '从头到尾逐一检查每个元素，直到找到目标。',
    description: `线性搜索是最简单也是最通用的搜索方式，无需数据有序。

**工作原理**
从数组的第一个元素开始，逐一与目标值比较，一旦找到相等的元素就返回其索引；遍历完整个数组还未找到则返回 -1。

**适用场景**
- 数组未排序时
- 数据量很小（n < 100）
- 只需要搜索一次（不值得预处理/排序）

**局限**
数据量大时效率低，平均需要比较 n/2 次。`,
    steps: [
      '从索引 i=0 开始',
      '比较 arr[i] 与目标值 target',
      '若相等，返回索引 i',
      '若不等，i++，继续下一个',
      '若遍历完所有元素仍未找到，返回 -1',
    ],
    code: {
      javascript: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1; // 未找到
}`,
      python: `def linear_search(arr, target):
    for i, val in enumerate(arr):
        if val == target:
            return i
    return -1  # 未找到`,
    },
    visualizerType: 'search',
  },
  {
    id: 'binary-search',
    category: 'searching',
    name: '二分搜索',
    nameEn: 'Binary Search',
    difficulty: 'easy',
    timeAvg: 'O(log n)',
    timeBest: 'O(1)',
    timeWorst: 'O(log n)',
    space: 'O(1)',
    tags: ['搜索', '有序', '分治'],
    summary: '在有序数组中每次折半，快速定位目标元素。',
    description: `二分搜索是效率极高的搜索算法，但要求**数组必须有序**。

**工作原理**
维护左右两个指针 low 和 high，每次取中点 mid：
- arr[mid] == target → 找到，返回 mid
- arr[mid] < target  → target 在右半部分，low = mid + 1
- arr[mid] > target  → target 在左半部分，high = mid - 1

重复直到 low > high（未找到）。

**为什么这么快？**
每次比较都排除一半元素，类似于猜数字游戏"高了/低了"的最优策略。搜索 10 亿个元素最多只需约 30 次比较！

**常见陷阱**
mid = (low + high) / 2 在某些语言中可能整数溢出。推荐用 mid = low + (high - low) / 2。`,
    steps: [
      '初始化 low=0, high=n-1',
      '计算 mid = low + (high - low) / 2',
      '若 arr[mid] === target，返回 mid',
      '若 arr[mid] < target，令 low = mid + 1（去右半区）',
      '若 arr[mid] > target，令 high = mid - 1（去左半区）',
      '若 low > high，目标不在数组中，返回 -1',
    ],
    code: {
      javascript: `function binarySearch(arr, target) {
  let low = 0, high = arr.length - 1;
  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1; // 未找到
}`,
      python: `def binary_search(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = low + (high - low) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1  # 未找到`,
    },
    visualizerType: 'search',
  },

  // ─── Graph ─────────────────────────────────────────────────
  {
    id: 'bfs',
    category: 'graph',
    name: '广度优先搜索',
    nameEn: 'BFS',
    difficulty: 'medium',
    timeAvg: 'O(V+E)',
    timeBest: 'O(1)',
    timeWorst: 'O(V+E)',
    space: 'O(V)',
    tags: ['图', '队列', '最短路径'],
    summary: '层层扩散，用队列探索图中所有节点，找最短路径。',
    description: `广度优先搜索（BFS）像水波纹一样从起点向外扩散，层层遍历图中的节点。

**工作原理**
1. 将起点放入队列，标记为已访问
2. 从队列取出节点，处理它
3. 将该节点所有未访问的邻居加入队列
4. 重复直到队列为空

**关键数据结构：队列（FIFO）**
队列保证了"先进先出"，确保我们总是先处理离起点近的节点。

**BFS 的核心应用**
- 找无权图中两点间的**最短路径**
- 判断图是否**连通**
- 求**最短步数**类问题（迷宫、棋盘）
- 社交网络中的"六度分隔"理论

**V** = 顶点数，**E** = 边数。`,
    steps: [
      '初始化队列，将起点 s 入队，标记已访问',
      '从队首取出节点 u',
      '对 u 的每个邻居 v：若未访问，标记已访问，入队',
      '记录 v 的父节点为 u（用于路径回溯）',
      '重复步骤 2-4，直到队列为空',
      '沿父节点链回溯，得到起点到终点的最短路径',
    ],
    code: {
      javascript: `function bfs(graph, start) {
  const visited = new Set([start]);
  const queue = [start];
  const order = [];

  while (queue.length > 0) {
    const node = queue.shift(); // 出队
    order.push(node);

    for (const neighbor of graph[node] || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor); // 入队
      }
    }
  }
  return order; // 节点访问顺序
}`,
      python: `from collections import deque

def bfs(graph, start):
    visited = {start}
    queue = deque([start])
    order = []

    while queue:
        node = queue.popleft()  # 出队
        order.append(node)

        for neighbor in graph.get(node, []):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)  # 入队
    
    return order  # 节点访问顺序`,
    },
    visualizerType: 'graph',
  },
  {
    id: 'dfs',
    category: 'graph',
    name: '深度优先搜索',
    nameEn: 'DFS',
    difficulty: 'medium',
    timeAvg: 'O(V+E)',
    timeBest: 'O(1)',
    timeWorst: 'O(V+E)',
    space: 'O(V)',
    tags: ['图', '栈', '递归', '回溯'],
    summary: '沿一条路走到底，再回溯探索其他分支。',
    description: `深度优先搜索（DFS）像走迷宫时的一种策略：沿着一条通道一直走，走不通了再退回来试别的路。

**工作原理（递归版）**
1. 访问当前节点，标记为已访问
2. 递归访问每个未访问的邻居
3. 所有邻居都访问完后，回溯到上层节点

**DFS vs BFS**
| | BFS | DFS |
|---|---|---|
| 策略 | 宽度优先 | 深度优先 |
| 数据结构 | 队列 | 栈/递归 |
| 最短路径 | ✅ | ❌ |
| 空间效率 | 低（要存层）| 高（递归栈）|

**DFS 的核心应用**
- 拓扑排序
- 检测图中的环
- 求连通分量
- 生成迷宫
- 回溯算法（八皇后、数独）`,
    steps: [
      '从起点 s 开始，标记 s 为已访问',
      '对 s 的第一个未访问邻居 v 递归调用 DFS(v)',
      '在 v 中，同样访问其未访问邻居',
      '直到当前节点没有未访问邻居，回溯',
      '回到 s，继续访问其下一个未访问邻居',
      '重复直到图中所有可达节点均被访问',
    ],
    code: {
      javascript: `function dfs(graph, start, visited = new Set()) {
  visited.add(start);
  console.log(start); // 处理当前节点

  for (const neighbor of graph[start] || []) {
    if (!visited.has(neighbor)) {
      dfs(graph, neighbor, visited);
    }
  }
  return visited;
}

// 迭代版（使用显式栈）
function dfsIterative(graph, start) {
  const visited = new Set();
  const stack = [start];
  while (stack.length) {
    const node = stack.pop();
    if (!visited.has(node)) {
      visited.add(node);
      for (const n of (graph[node] || []).reverse())
        stack.push(n);
    }
  }
}`,
      python: `def dfs(graph, start, visited=None):
    if visited is None:
        visited = set()
    visited.add(start)
    print(start)  # 处理当前节点
    
    for neighbor in graph.get(start, []):
        if neighbor not in visited:
            dfs(graph, neighbor, visited)
    return visited

# 迭代版（使用显式栈）
def dfs_iterative(graph, start):
    visited = set()
    stack = [start]
    while stack:
        node = stack.pop()
        if node not in visited:
            visited.add(node)
            for n in reversed(graph.get(node, [])):
                stack.append(n)`,
    },
    visualizerType: 'graph',
  },

  // ─── Dynamic Programming ───────────────────────────────────
  {
    id: 'fibonacci',
    category: 'dp',
    name: '斐波那契数列',
    nameEn: 'Fibonacci — DP',
    difficulty: 'easy',
    timeAvg: 'O(n)',
    timeBest: 'O(n)',
    timeWorst: 'O(n)',
    space: 'O(1)',
    tags: ['动态规划', '记忆化', '递推'],
    summary: '用 DP 消除重复计算，将指数复杂度降到线性。',
    description: `斐波那契数列是理解动态规划思想的绝佳入门案例。

**朴素递归的问题**
F(n) = F(n-1) + F(n-2) 的递归实现会导致大量重复计算。计算 F(5) 时，F(2) 被计算了 3 次，时间复杂度为 O(2ⁿ)。

**动态规划的两种思路**
1. **自顶向下（记忆化）**：还是用递归，但用哈希表缓存计算过的结果
2. **自底向上（制表法）**：从 F(0), F(1) 开始，逐步推导到 F(n)，更高效

**空间优化**
由于 F(n) 只依赖 F(n-1) 和 F(n-2)，不需要储存整个表，只需两个变量滚动更新，空间降为 O(1)。

**DP 三要素**
1. **状态定义**：dp[i] 表示第 i 个斐波那契数
2. **状态转移**：dp[i] = dp[i-1] + dp[i-2]
3. **初始值**：dp[0]=0, dp[1]=1`,
    steps: [
      '定义 dp[0]=0, dp[1]=1（边界条件）',
      '从 i=2 开始迭代到 n',
      '每步 dp[i] = dp[i-1] + dp[i-2]',
      '只需保留前两个值，用 a, b 滚动更新',
      '迭代 n 次后，b 即为 F(n)',
    ],
    code: {
      javascript: `// 自底向上 DP（空间优化）
function fibonacci(n) {
  if (n <= 1) return n;
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    [a, b] = [b, a + b];
  }
  return b;
}

// 记忆化递归
function fibMemo(n, memo = {}) {
  if (n <= 1) return n;
  if (memo[n]) return memo[n];
  memo[n] = fibMemo(n-1, memo) + fibMemo(n-2, memo);
  return memo[n];
}`,
      python: `# 自底向上 DP（空间优化）
def fibonacci(n):
    if n <= 1:
        return n
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    return b

# 记忆化递归
from functools import lru_cache

@lru_cache(maxsize=None)
def fib_memo(n):
    if n <= 1:
        return n
    return fib_memo(n - 1) + fib_memo(n - 2)`,
    },
    visualizerType: 'dp',
  },
  {
    id: 'knapsack',
    category: 'dp',
    name: '0/1 背包问题',
    nameEn: '0/1 Knapsack',
    difficulty: 'hard',
    timeAvg: 'O(nW)',
    timeBest: 'O(nW)',
    timeWorst: 'O(nW)',
    space: 'O(W)',
    tags: ['动态规划', '背包', '组合优化'],
    summary: '有限容量背包里装价值最大的物品组合。',
    description: `0/1 背包是动态规划中最经典的问题之一，大量实际优化问题都可以归约到它。

**问题描述**
有 n 件物品，each 有重量 w[i] 和价值 v[i]。背包最大承重为 W。每件物品只能选一次（拿或不拿），求能装入背包的最大价值。

**DP 状态定义**
dp[i][j] = 考虑前 i 件物品，背包容量为 j 时的最大价值

**状态转移方程**
- 不拿第 i 件：dp[i][j] = dp[i-1][j]
- 拿第 i 件（j >= w[i]）：dp[i][j] = dp[i-1][j-w[i]] + v[i]
- 取两者最大值

**空间优化**
将二维 dp 压缩为一维，反向遍历容量避免重复使用同一物品：dp[j] = max(dp[j], dp[j-w[i]] + v[i])`,
    steps: [
      '初始化 dp[0..W] = 0',
      '遍历每件物品 i（从 1 到 n）',
      '对每件物品，从 j=W 到 j=w[i] 反向遍历容量',
      '更新 dp[j] = max(dp[j], dp[j-w[i]] + v[i])',
      '继续下一件物品',
      '最终 dp[W] 即为最大价值',
    ],
    code: {
      javascript: `function knapsack(weights, values, capacity) {
  const n = weights.length;
  // 一维 DP 数组（空间优化）
  const dp = new Array(capacity + 1).fill(0);

  for (let i = 0; i < n; i++) {
    // 反向遍历避免重复选取
    for (let j = capacity; j >= weights[i]; j--) {
      dp[j] = Math.max(dp[j], dp[j - weights[i]] + values[i]);
    }
  }
  return dp[capacity]; // 最大价值
}`,
      python: `def knapsack(weights, values, capacity):
    n = len(weights)
    # 一维 DP 数组（空间优化）
    dp = [0] * (capacity + 1)
    
    for i in range(n):
        # 反向遍历避免重复选取
        for j in range(capacity, weights[i] - 1, -1):
            dp[j] = max(dp[j], dp[j - weights[i]] + values[i])
    
    return dp[capacity]  # 最大价值`,
    },
    visualizerType: 'dp',
  },

  // ─── Data Structures ───────────────────────────────────────
  {
    id: 'stack',
    category: 'structures',
    name: '栈',
    nameEn: 'Stack',
    difficulty: 'easy',
    timeAvg: 'O(1)',
    timeBest: 'O(1)',
    timeWorst: 'O(1)',
    space: 'O(n)',
    tags: ['数据结构', 'LIFO', '线性'],
    summary: '后进先出（LIFO）—— 只从顶部操作的线性结构。',
    description: `栈是一种遵循**后进先出（LIFO）**原则的线性数据结构，就像叠放的盘子。

**核心操作**
- **push(x)**：将元素 x 压入栈顶，O(1)
- **pop()**：弹出并返回栈顶元素，O(1)
- **peek()**：查看栈顶元素但不移除，O(1)
- **isEmpty()**：判断栈是否为空，O(1)

**经典应用场景**
- **函数调用栈**：每次调用函数入栈，返回时出栈
- **撤销操作（Ctrl+Z）**：操作记录压栈，撤销时弹出
- **括号匹配**：遇到左括号入栈，遇到右括号出栈匹配
- **表达式求值**：DFS 的迭代实现

**实现方式**
JavaScript 中直接用数组即可；Python 中 collections.deque 比 list 更高效。`,
    steps: [
      '创建一个空数组（或链表）作为底层存储',
      'push：将元素追加到数组末尾（O(1)）',
      'pop：移除并返回数组最后一个元素（O(1)）',
      'peek：读取最后一个元素但不移除',
      'isEmpty：检查数组长度是否为 0',
    ],
    code: {
      javascript: `class Stack {
  constructor() {
    this.items = [];
  }
  push(x) {
    this.items.push(x);
  }
  pop() {
    if (this.isEmpty()) throw new Error('Stack underflow');
    return this.items.pop();
  }
  peek() {
    return this.items[this.items.length - 1];
  }
  isEmpty() {
    return this.items.length === 0;
  }
  size() {
    return this.items.length;
  }
}

// 应用：括号匹配
function isValid(s) {
  const stack = new Stack();
  const map = { ')': '(', ']': '[', '}': '{' };
  for (const ch of s) {
    if ('([{'.includes(ch)) stack.push(ch);
    else if (stack.isEmpty() || stack.pop() !== map[ch])
      return false;
  }
  return stack.isEmpty();
}`,
      python: `class Stack:
    def __init__(self):
        self.items = []
    
    def push(self, x):
        self.items.append(x)
    
    def pop(self):
        if self.is_empty():
            raise IndexError("Stack underflow")
        return self.items.pop()
    
    def peek(self):
        return self.items[-1]
    
    def is_empty(self):
        return len(self.items) == 0
    
    def size(self):
        return len(self.items)

# 应用：括号匹配
def is_valid(s):
    stack = Stack()
    mapping = {')': '(', ']': '[', '}': '{'}
    for ch in s:
        if ch in '([{':
            stack.push(ch)
        elif stack.is_empty() or stack.pop() != mapping[ch]:
            return False
    return stack.is_empty()`,
    },
    visualizerType: 'stack',
  },
  {
    id: 'queue',
    category: 'structures',
    name: '队列',
    nameEn: 'Queue',
    difficulty: 'easy',
    timeAvg: 'O(1)',
    timeBest: 'O(1)',
    timeWorst: 'O(1)',
    space: 'O(n)',
    tags: ['数据结构', 'FIFO', '线性'],
    summary: '先进先出（FIFO）—— 从尾入队、从头出队。',
    description: `队列遵循**先进先出（FIFO）**原则，就像排队买票一样，先到的先服务。

**核心操作**
- **enqueue(x)**：从队尾加入元素，O(1)
- **dequeue()**：从队首移除并返回元素，O(1)
- **front/peek()**：查看队首元素，O(1)
- **isEmpty()**：判断队列是否为空，O(1)

**经典应用场景**
- **BFS（广度优先搜索）**：天然依赖队列的层序遍历
- **任务调度**：操作系统进程队列
- **打印队列**：打印任务按顺序执行
- **消息队列（Kafka/RabbitMQ）**：分布式系统核心组件

**实现注意**
用数组实现时，dequeue 操作（shift）需要 O(n)。推荐用**双端队列（deque）**或链表实现，保证所有操作 O(1)。`,
    steps: [
      '创建空队列（建议用 deque 或链表）',
      'enqueue：将元素添加到队列末尾',
      'dequeue：移除并返回队列头部元素',
      'front/peek：只读不删地访问队首',
      'isEmpty：检查队列是否为空',
    ],
    code: {
      javascript: `class Queue {
  constructor() {
    this.items = {};
    this.head = 0;
    this.tail = 0;
  }
  enqueue(x) {
    this.items[this.tail++] = x;
  }
  dequeue() {
    if (this.isEmpty()) throw new Error('Queue is empty');
    const item = this.items[this.head];
    delete this.items[this.head++];
    return item;
  }
  front() {
    return this.items[this.head];
  }
  isEmpty() {
    return this.head === this.tail;
  }
  size() {
    return this.tail - this.head;
  }
}`,
      python: `from collections import deque

class Queue:
    def __init__(self):
        self.items = deque()
    
    def enqueue(self, x):
        self.items.append(x)
    
    def dequeue(self):
        if self.is_empty():
            raise IndexError("Queue is empty")
        return self.items.popleft()
    
    def front(self):
        return self.items[0]
    
    def is_empty(self):
        return len(self.items) == 0
    
    def size(self):
        return len(self.items)`,
    },
    visualizerType: 'queue',
  },

  // ─── More Sorting ──────────────────────────────────────────
  {
    id: 'heap-sort',
    category: 'sorting',
    name: '堆排序',
    nameEn: 'Heap Sort',
    difficulty: 'medium',
    timeAvg: 'O(n log n)',
    timeBest: 'O(n log n)',
    timeWorst: 'O(n log n)',
    space: 'O(1)',
    tags: ['排序', '堆', '完全二叉树', '不稳定'],
    summary: '利用堆这种数据结构来排序，原地完成且时间复杂度稳定。',
    description: `堆排序结合了**堆**（一种完全二叉树）与排序的优雅思想。

**堆的核心概念**
- **最大堆**：每个节点的值都 ≥ 其子节点的值，堆顶始终是最大值
- 用数组表示堆：节点 i 的左子为 2i+1，右子为 2i+2，父节点为 ⌊(i-1)/2⌋

**堆排序两阶段**
1. **建堆**：将无序数组构造成最大堆，O(n)
2. **排序**：反复将堆顶（最大值）与末尾元素交换，堆大小减一，再调整（heapify），O(n log n)

**与归并/快排的比较**
- 时间复杂度同为 O(n log n)，但常数更大（缓存不友好）
- 空间复杂度 O(1)，优于归并排序
- **不稳定**，与快排一样`,
    steps: [
      '从最后一个非叶子节点开始，向上逐一执行 heapify，建立最大堆',
      'heapify：比较节点 i 与其左右子节点，找到最大者',
      '若最大者不是节点 i，则与 i 交换，并对被交换的子节点递归 heapify',
      '建堆完成：arr[0] 是最大值',
      '将 arr[0] 与末尾元素交换，堆大小减 1，对根节点重新 heapify',
      '重复步骤 5，直到堆大小为 1，排序完成',
    ],
    code: {
      javascript: `function heapSort(arr) {
  const n = arr.length;

  // 建最大堆
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }

  // 逐个提取堆顶元素
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]]; // 堆顶换到末尾
    heapify(arr, i, 0);                  // 重新堆化
  }
  return arr;
}

function heapify(arr, n, i) {
  let largest = i;
  const left = 2 * i + 1, right = 2 * i + 2;
  if (left  < n && arr[left]  > arr[largest]) largest = left;
  if (right < n && arr[right] > arr[largest]) largest = right;
  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest);
  }
}`,
      python: `def heap_sort(arr):
    n = len(arr)

    # 建最大堆
    for i in range(n // 2 - 1, -1, -1):
        heapify(arr, n, i)

    # 逐个提取堆顶
    for i in range(n - 1, 0, -1):
        arr[0], arr[i] = arr[i], arr[0]
        heapify(arr, i, 0)
    return arr

def heapify(arr, n, i):
    largest = i
    left, right = 2 * i + 1, 2 * i + 2
    if left  < n and arr[left]  > arr[largest]: largest = left
    if right < n and arr[right] > arr[largest]: largest = right
    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        heapify(arr, n, largest)`,
    },
    visualizerType: 'array',
  },
  {
    id: 'shell-sort',
    category: 'sorting',
    name: '希尔排序',
    nameEn: 'Shell Sort',
    difficulty: 'medium',
    timeAvg: 'O(n log² n)',
    timeBest: 'O(n log n)',
    timeWorst: 'O(n²)',
    space: 'O(1)',
    tags: ['排序', '插入', '间隔', '不稳定'],
    summary: '插入排序的升级版，通过逐渐缩小间隔来减少移动次数。',
    description: `希尔排序是**插入排序的改进版本**，由 Donald Shell 于 1959 年提出，也是第一个突破 O(n²) 的排序算法。

**核心思想：分组插入排序**
插入排序在数据接近有序时非常高效（O(n)）。希尔排序利用这一特性：
1. 先用**大间隔**对元素分组，组内插入排序（粗排）
2. 逐步缩小间隔，进行多轮插入排序
3. 最后间隔为 1 时，等价于普通插入排序，但此时数据已接近有序，非常快

**间隔序列的选择**
间隔序列影响性能，常见方案：
- Shell 原始：n/2, n/4, ..., 1
- Knuth 序列：1, 4, 13, 40, 121...（h = 3h+1）  
- Hibbard 序列：1, 3, 7, 15...

**为什么更快？**
大间隔使得元素可以"跳跃式"移动到接近正确的位置，避免了插入排序中元素只能逐步移动一格的问题。`,
    steps: [
      '选择初始间隔 gap = n/2',
      '对所有相距 gap 的元素组成的子序列分别进行插入排序',
      '缩小间隔 gap = gap/2，重复插入排序',
      '继续缩小，直到 gap = 1',
      '此时数组已接近有序，最后一趟插入排序极快',
      '排序完成',
    ],
    code: {
      javascript: `function shellSort(arr) {
  const n = arr.length;
  // 使用 Knuth 序列 h = 3h+1
  let gap = 1;
  while (gap < Math.floor(n / 3)) gap = 3 * gap + 1;

  while (gap >= 1) {
    // 对每个间隔组执行插入排序
    for (let i = gap; i < n; i++) {
      const key = arr[i];
      let j = i - gap;
      while (j >= 0 && arr[j] > key) {
        arr[j + gap] = arr[j];
        j -= gap;
      }
      arr[j + gap] = key;
    }
    gap = Math.floor(gap / 3);
  }
  return arr;
}`,
      python: `def shell_sort(arr):
    n = len(arr)
    # 使用 Knuth 序列
    gap = 1
    while gap < n // 3:
        gap = 3 * gap + 1

    while gap >= 1:
        for i in range(gap, n):
            key = arr[i]
            j = i - gap
            while j >= 0 and arr[j] > key:
                arr[j + gap] = arr[j]
                j -= gap
            arr[j + gap] = key
        gap //= 3
    return arr`,
    },
    visualizerType: 'array',
  },

  // ─── More Data Structures ──────────────────────────────────
  {
    id: 'hash-table',
    category: 'structures',
    name: '哈希表',
    nameEn: 'Hash Table',
    difficulty: 'medium',
    timeAvg: 'O(1)',
    timeBest: 'O(1)',
    timeWorst: 'O(n)',
    space: 'O(n)',
    tags: ['数据结构', '哈希', '字典', '键值对'],
    summary: '通过哈希函数将键映射到数组槽位，实现平均 O(1) 的查找。',
    description: `哈希表是现代编程中最重要的数据结构之一，JavaScript 的 Map/Object、Python 的 dict 底层都是哈希表。

**核心原理**
1. **哈希函数**：将任意键（字符串、数字等）映射为一个整数索引
2. **存储**：用索引在数组中存储键值对
3. **查找**：再次用哈希函数计算索引，直接访问该位置

**哈希冲突（Collision）**
不同的键可能产生相同的索引，这叫做哈希冲突。常见解决方案：
- **链地址法（Chaining）**：每个槽位存一个链表，冲突的键追加到链表
- **开放地址法**：发生冲突时，线性探测下一个空位

**负载因子（Load Factor）**
负载因子 = 已用槽位 / 总槽位数。超过 0.7 时需要**扩容重哈希**，保证性能。

**时间复杂度**
平均 O(1) 的增删查，但最坏情况（所有键冲突到同一槽）退化为 O(n)。`,
    steps: [
      '初始化固定大小的数组（桶数组）',
      '插入 key-value：用哈希函数计算 key 的索引',
      '若该槽为空，直接存入；若有冲突，用链表追加',
      '查找 key：计算索引，遍历该槽的链表找到匹配的 key',
      '删除 key：找到后从链表中移除节点',
      '若负载因子超阈值，扩容数组并重新哈希所有键',
    ],
    code: {
      javascript: `class HashTable {
  constructor(size = 53) {
    this.table = new Array(size);
    this.size = size;
  }

  // 简单哈希函数
  hash(key) {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = (hash * 31 + key.charCodeAt(i)) % this.size;
    }
    return hash;
  }

  set(key, value) {
    const idx = this.hash(key);
    if (!this.table[idx]) this.table[idx] = [];
    // 更新已有键 or 追加
    const pair = this.table[idx].find(p => p[0] === key);
    if (pair) pair[1] = value;
    else this.table[idx].push([key, value]);
  }

  get(key) {
    const idx = this.hash(key);
    const bucket = this.table[idx];
    if (!bucket) return undefined;
    return bucket.find(p => p[0] === key)?.[1];
  }

  delete(key) {
    const idx = this.hash(key);
    if (!this.table[idx]) return false;
    this.table[idx] = this.table[idx].filter(p => p[0] !== key);
    return true;
  }
}`,
      python: `class HashTable:
    def __init__(self, size=53):
        self.table = [None] * size
        self.size = size

    def _hash(self, key):
        h = 0
        for ch in key:
            h = (h * 31 + ord(ch)) % self.size
        return h

    def set(self, key, value):
        idx = self._hash(key)
        if self.table[idx] is None:
            self.table[idx] = []
        bucket = self.table[idx]
        for i, (k, _) in enumerate(bucket):
            if k == key:
                bucket[i] = (key, value)
                return
        bucket.append((key, value))

    def get(self, key):
        idx = self._hash(key)
        bucket = self.table[idx]
        if not bucket:
            return None
        for k, v in bucket:
            if k == key:
                return v
        return None

    def delete(self, key):
        idx = self._hash(key)
        if not self.table[idx]:
            return False
        self.table[idx] = [(k,v) for k,v in self.table[idx] if k != key]
        return True`,
    },
    visualizerType: 'hash',
  },
  {
    id: 'binary-tree',
    category: 'structures',
    name: '二叉树遍历',
    nameEn: 'Binary Tree Traversal',
    difficulty: 'medium',
    timeAvg: 'O(n)',
    timeBest: 'O(n)',
    timeWorst: 'O(n)',
    space: 'O(h)',
    tags: ['数据结构', '树', '递归', '深度优先'],
    summary: '三种深度优先遍历方式：前序、中序、后序，各有妙用。',
    description: `二叉树是最重要的树形数据结构，三种遍历方式各有不同的应用场景。

**树的基本概念**
- 每个节点最多有两个子节点：左子节点和右子节点
- **根节点**：树的起点
- **叶节点**：没有子节点的节点
- **树高 h**：从根到最深叶节点的路径长度

**三种深度优先遍历（DFS）**

| 遍历方式 | 访问顺序 | 典型应用 |
|--------|--------|---------|
| **前序**（Pre-order） | 根 → 左 → 右 | 复制树、序列化 |
| **中序**（In-order） | 左 → 根 → 右 | BST 得到有序序列 |
| **后序**（Post-order）| 左 → 右 → 根 | 删除树、表达式求值 |

**层序遍历（BFS）**
使用队列，一层层处理，适合求树的最小深度、锯齿形打印等。

**空间复杂度**
O(h)，h 为树高。最坏情况（退化为链表）O(n)，完全二叉树为 O(log n)。`,
    steps: [
      '前序遍历：访问根节点，再递归遍历左子树，最后右子树',
      '中序遍历：先递归遍历左子树，再访问根，最后右子树',
      '后序遍历：先递归遍历左子树，再右子树，最后访问根',
      '递归遍历时，遇到 null 节点返回（递归基）',
      '层序遍历：将根入队，循环取出节点并将其子节点入队',
      '层序可统计深度：每处理完一层的所有节点后深度 +1',
    ],
    code: {
      javascript: `class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val; this.left = left; this.right = right;
  }
}

// 前序遍历 (根-左-右)
function preorder(root, result = []) {
  if (!root) return result;
  result.push(root.val);      // 访问根
  preorder(root.left, result);
  preorder(root.right, result);
  return result;
}

// 中序遍历 (左-根-右) — BST 会得到升序序列
function inorder(root, result = []) {
  if (!root) return result;
  inorder(root.left, result);
  result.push(root.val);      // 访问根
  inorder(root.right, result);
  return result;
}

// 后序遍历 (左-右-根)
function postorder(root, result = []) {
  if (!root) return result;
  postorder(root.left, result);
  postorder(root.right, result);
  result.push(root.val);      // 访问根
  return result;
}

// 层序遍历 (BFS)
function levelOrder(root) {
  if (!root) return [];
  const result = [], queue = [root];
  while (queue.length) {
    const level = [];
    for (let i = queue.length; i > 0; i--) {
      const node = queue.shift();
      level.push(node.val);
      if (node.left)  queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(level);
  }
  return result;
}`,
      python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

# 前序遍历（根-左-右）
def preorder(root):
    if not root:
        return []
    return [root.val] + preorder(root.left) + preorder(root.right)

# 中序遍历（左-根-右）— BST 得到有序序列
def inorder(root):
    if not root:
        return []
    return inorder(root.left) + [root.val] + inorder(root.right)

# 后序遍历（左-右-根）
def postorder(root):
    if not root:
        return []
    return postorder(root.left) + postorder(root.right) + [root.val]

# 层序遍历（BFS）
from collections import deque
def level_order(root):
    if not root:
        return []
    result, queue = [], deque([root])
    while queue:
        level = []
        for _ in range(len(queue)):
            node = queue.popleft()
            level.append(node.val)
            if node.left:  queue.append(node.left)
            if node.right: queue.append(node.right)
        result.append(level)
    return result`,
    },
    visualizerType: 'tree',
  },

  // ─── More Sorting ──────────────────────────────────────────
  {
    id: 'counting-sort',
    category: 'sorting',
    name: '计数排序',
    nameEn: 'Counting Sort',
    difficulty: 'easy',
    timeAvg: 'O(n+k)',
    timeBest: 'O(n+k)',
    timeWorst: 'O(n+k)',
    space: 'O(k)',
    tags: ['排序', '线性', '非比较', '稳定'],
    summary: '统计每个值出现次数，按序输出，适合整数范围有限的场景。',
    description: `计数排序是一种**非比较排序**算法，打破了比较排序 O(n log n) 的下界，在特定场景下可以达到线性时间。

**核心思想**
不通过比较，而是直接**统计**每个数值出现的次数，然后按照数值大小依次输出。

**算法步骤**
1. 找出数组中的最大值 k
2. 创建计数数组 count[0..k]，初始化为 0
3. 遍历原数组，count[arr[i]]++
4. 按序输出：count[i] > 0 时输出 i，重复 count[i] 次

**稳定版本（前缀和）**
为保持稳定性，对 count 做前缀和，然后从右到左遍历原数组，将元素放到 output[count[arr[i]]-1] 处。

**适用场景**
- 数据为非负整数
- 数值范围 k 不太大（k ≈ n）
- 典型：对年龄排序、对成绩排序

**局限**
k 很大时（如排序 int 值），count 数组会非常大，空间浪费严重。`,
    steps: [
      '找到数组最大值 k',
      '创建长度为 k+1 的计数数组 count，全部初始化为 0',
      '遍历原数组，对每个元素 arr[i]，count[arr[i]]++',
      '对 count 做前缀和：count[i] += count[i-1]',
      '从右到左遍历原数组，将 arr[i] 放到 output[count[arr[i]]-1]，count[arr[i]]--',
      '将 output 复制回原数组，排序完成',
    ],
    code: {
      javascript: `function countingSort(arr) {
  if (arr.length === 0) return arr;
  const max = Math.max(...arr);
  const count = new Array(max + 1).fill(0);

  // 统计每个元素出现次数
  for (const val of arr) count[val]++;

  // 前缀和
  for (let i = 1; i <= max; i++) count[i] += count[i - 1];

  // 从右到左填充（保证稳定性）
  const output = new Array(arr.length);
  for (let i = arr.length - 1; i >= 0; i--) {
    output[count[arr[i]] - 1] = arr[i];
    count[arr[i]]--;
  }
  return output;
}`,
      python: `def counting_sort(arr):
    if not arr:
        return arr
    max_val = max(arr)
    count = [0] * (max_val + 1)

    # 统计出现次数
    for val in arr:
        count[val] += 1

    # 前缀和
    for i in range(1, len(count)):
        count[i] += count[i - 1]

    # 从右到左填充（保证稳定性）
    output = [0] * len(arr)
    for i in range(len(arr) - 1, -1, -1):
        output[count[arr[i]] - 1] = arr[i]
        count[arr[i]] -= 1
    return output`,
    },
    visualizerType: 'array',
  },
  {
    id: 'radix-sort',
    category: 'sorting',
    name: '基数排序',
    nameEn: 'Radix Sort',
    difficulty: 'medium',
    timeAvg: 'O(d·(n+k))',
    timeBest: 'O(d·(n+k))',
    timeWorst: 'O(d·(n+k))',
    space: 'O(n+k)',
    tags: ['排序', '线性', '非比较', '稳定', '按位'],
    summary: '从最低位到最高位逐位排序，每位用稳定排序，最终得到有序结果。',
    description: `基数排序是一种**非比较**的整数排序算法，将数字按位拆分，从低位到高位逐轮排序。

**LSD vs MSD**
- **LSD（最低有效位）**：从个位开始，依次到最高位。简单，最常用
- **MSD（最高有效位）**：从最高位开始，需要递归处理各桶

**为什么正确？**
每一轮对某一位进行**稳定排序**（如计数排序）。稳定性确保上一轮的排序结果在当前轮相同位数值时得以保留。最终最高位排好后，整体有序。

**时间复杂度分析**
d = 数字位数，每轮 O(n+k)，共 d 轮，总 O(d·(n+k))。当 d 为常数时，接近线性。

**适用场景**
- 整数或固定长度字符串排序
- 数值范围不限但位数有限
- 对手机号、身份证号排序`,
    steps: [
      '找出最大数，确定最大位数 d',
      '第 1 轮：按个位数字，用计数排序对整个数组排序',
      '第 2 轮：按十位数字，用稳定排序重新排列（保留个位的相对顺序）',
      '第 3 轮：按百位...依此类推，直到最高位',
      '每轮排序后，数组按当前位及所有低位联合有序',
      '处理完最高位后，排序完成',
    ],
    code: {
      javascript: `function radixSort(arr) {
  const max = Math.max(...arr);
  // 按每一位进行计数排序
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    countByDigit(arr, exp);
  }
  return arr;
}

function countByDigit(arr, exp) {
  const n = arr.length;
  const output = new Array(n);
  const count = new Array(10).fill(0);

  // 统计当前位数字出现次数
  for (let i = 0; i < n; i++) {
    count[Math.floor(arr[i] / exp) % 10]++;
  }
  // 前缀和
  for (let i = 1; i < 10; i++) count[i] += count[i - 1];
  // 从右到左放置（保持稳定性）
  for (let i = n - 1; i >= 0; i--) {
    const digit = Math.floor(arr[i] / exp) % 10;
    output[count[digit] - 1] = arr[i];
    count[digit]--;
  }
  for (let i = 0; i < n; i++) arr[i] = output[i];
}`,
      python: `def radix_sort(arr):
    max_val = max(arr)
    exp = 1
    while max_val // exp > 0:
        _count_by_digit(arr, exp)
        exp *= 10
    return arr

def _count_by_digit(arr, exp):
    n = len(arr)
    output = [0] * n
    count = [0] * 10

    for i in range(n):
        count[(arr[i] // exp) % 10] += 1
    for i in range(1, 10):
        count[i] += count[i - 1]
    for i in range(n - 1, -1, -1):
        digit = (arr[i] // exp) % 10
        output[count[digit] - 1] = arr[i]
        count[digit] -= 1
    for i in range(n):
        arr[i] = output[i]`,
    },
    visualizerType: 'array',
  },

  // ─── More Searching ────────────────────────────────────────
  {
    id: 'jump-search',
    category: 'searching',
    name: '跳跃搜索',
    nameEn: 'Jump Search',
    difficulty: 'easy',
    timeAvg: 'O(√n)',
    timeBest: 'O(1)',
    timeWorst: 'O(√n)',
    space: 'O(1)',
    tags: ['搜索', '有序', '跳跃', '块'],
    summary: '在有序数组中以 √n 为步长跳格，定位后线性细搜。',
    description: `跳跃搜索是线性搜索和二分搜索之间的折中方案，适用于**有序数组**。

**核心思想**
以固定步长 m（通常取 √n）向前跳跃，直到找到一个大于目标值的块，再在该块内线性搜索。

**为什么步长取 √n？**
设步长为 m，跳跃次数约为 n/m，细搜时间约为 m，总时间 n/m + m，当 m = √n 时取最小值 2√n，即 O(√n)。

**与二分搜索的对比**
| | 跳跃搜索 | 二分搜索 |
|---|---|---|
| 时间复杂度 | O(√n) | O(log n) |
| 跳跃方向 | 只向前 | 可前后 |
| 适用场景 | 回退代价大（磁带等）| 随机访问快速 |

**适用场景**
磁带存储等"只能向前"的顺序访问设备。`,
    steps: [
      '确定步长 m = ⌊√n⌋',
      '从 arr[0] 开始，每次跳 m 步到 arr[m], arr[2m]...',
      '当 arr[跳跃点] >= target 或到达数组末尾时停止',
      '在前一个跳跃点和当前跳跃点之间线性搜索',
      '找到目标则返回索引，否则返回 -1',
    ],
    code: {
      javascript: `function jumpSearch(arr, target) {
  const n = arr.length;
  const step = Math.floor(Math.sqrt(n));
  let prev = 0;
  let curr = step;

  // 跳跃阶段：找到目标可能所在的块
  while (curr < n && arr[curr] < target) {
    prev = curr;
    curr += step;
  }

  // 线性搜索阶段：在块内细搜
  for (let i = prev; i <= Math.min(curr, n - 1); i++) {
    if (arr[i] === target) return i;
  }
  return -1; // 未找到
}`,
      python: `import math

def jump_search(arr, target):
    n = len(arr)
    step = int(math.sqrt(n))
    prev, curr = 0, step

    # 跳跃阶段
    while curr < n and arr[curr] < target:
        prev = curr
        curr += step

    # 线性搜索阶段
    for i in range(prev, min(curr + 1, n)):
        if arr[i] == target:
            return i
    return -1  # 未找到`,
    },
    visualizerType: 'search',
  },
  {
    id: 'interpolation-search',
    category: 'searching',
    name: '插值搜索',
    nameEn: 'Interpolation Search',
    difficulty: 'medium',
    timeAvg: 'O(log log n)',
    timeBest: 'O(1)',
    timeWorst: 'O(n)',
    space: 'O(1)',
    tags: ['搜索', '有序', '均匀分布', '插值'],
    summary: '根据目标值估算位置，均匀分布时比二分更快。',
    description: `插值搜索是二分搜索的改进版，在数据**均匀分布**时可以达到 O(log log n)。

**核心思想：聪明地猜位置**
二分搜索总是选中点，而插值搜索根据目标值与范围的比例来估算：

\`\`\`
pos = low + (target - arr[low]) × (high - low) / (arr[high] - arr[low])
\`\`\`

就像在电话簿里找"Yang"开头的名字，你会直接翻到靠后的部分，而不是翻到中间。

**性能分析**
- 均匀分布：O(log log n) ≈ 只需约 4 次比较（10亿元素）
- 非均匀/最坏：O(n)（目标公式失效，退化为线性）

**适用场景**
- 均匀分布的有序数组（如温度传感器读数）
- 数值范围已知且分布规律`,
    steps: [
      '初始化 low=0, high=n-1',
      '计算估算位置 pos = low + (target-arr[low])*(high-low)/(arr[high]-arr[low])',
      '若 arr[pos] == target，返回 pos',
      '若 arr[pos] < target，令 low = pos + 1（去右边）',
      '若 arr[pos] > target，令 high = pos - 1（去左边）',
      '若 low > high 或超出范围，返回 -1（未找到）',
    ],
    code: {
      javascript: `function interpolationSearch(arr, target) {
  let low = 0, high = arr.length - 1;

  while (low <= high && target >= arr[low] && target <= arr[high]) {
    if (low === high) {
      return arr[low] === target ? low : -1;
    }

    // 按比例估算位置
    const pos = low + Math.floor(
      (target - arr[low]) * (high - low) / (arr[high] - arr[low])
    );

    if (arr[pos] === target) return pos;
    if (arr[pos] < target) low = pos + 1;
    else high = pos - 1;
  }
  return -1; // 未找到
}`,
      python: `def interpolation_search(arr, target):
    low, high = 0, len(arr) - 1

    while low <= high and arr[low] <= target <= arr[high]:
        if low == high:
            return low if arr[low] == target else -1

        # 按比例估算位置
        pos = low + (target - arr[low]) * (high - low) // (arr[high] - arr[low])

        if arr[pos] == target:
            return pos
        elif arr[pos] < target:
            low = pos + 1
        else:
            high = pos - 1
    return -1  # 未找到`,
    },
    visualizerType: 'search',
  },

  // ─── More Graph ────────────────────────────────────────────
  {
    id: 'dijkstra',
    category: 'graph',
    name: 'Dijkstra 最短路径',
    nameEn: "Dijkstra's Algorithm",
    difficulty: 'hard',
    timeAvg: 'O((V+E) log V)',
    timeBest: 'O(V²)',
    timeWorst: 'O((V+E) log V)',
    space: 'O(V)',
    tags: ['图', '最短路径', '贪心', '优先队列'],
    summary: '贪心算法求带权图中单源最短路径，每次选取最近的未访问节点。',
    description: `Dijkstra 算法由荷兰计算机科学家 Edsger Dijkstra 于 1956 年设计，是**求带权图单源最短路径**的经典算法。

**核心思想：贪心**
每次从未处理的节点中选取**距离源点最近**的节点，将其标记为"已确定"，并用它更新邻居的距离。

**算法步骤**
1. 初始化：源点距离为 0，其余节点距离为 ∞
2. 用优先队列（最小堆）存放 (距离, 节点)
3. 取出距离最小的节点 u，标记为已访问
4. 遍历 u 的所有邻居 v：若 dist[u] + weight(u,v) < dist[v]，更新 dist[v]
5. 重复直到队列为空

**局限性**
- **不能处理负权边**（用 Bellman-Ford 算法代替）
- 适用于**稀疏图**时配合优先队列效率最高

**实际应用**
GPS 导航、网络路由协议（OSPF）、地图最短路规划。`,
    steps: [
      '初始化 dist[source]=0，其余所有节点 dist=∞；将 (0, source) 入优先队列',
      '从优先队列取出 dist 最小的节点 u',
      '若 u 已访问，跳过（优先队列中可能有旧条目）',
      '标记 u 为已访问；遍历 u 的每条边 (u, v, w)',
      '若 dist[u] + w < dist[v]，更新 dist[v]，将 (dist[v], v) 加入队列',
      '重复步骤 2-5 直到队列为空，dist 数组即为单源最短路径',
    ],
    code: {
      javascript: `function dijkstra(graph, source) {
  // graph: { node: [[neighbor, weight], ...] }
  const dist = {};
  const visited = new Set();

  // 用最小堆（这里用简单数组模拟）
  const pq = [[0, source]]; // [distance, node]

  for (const node in graph) dist[node] = Infinity;
  dist[source] = 0;

  while (pq.length > 0) {
    // 取出当前距离最小的节点
    pq.sort((a, b) => a[0] - b[0]);
    const [d, u] = pq.shift();

    if (visited.has(u)) continue;
    visited.add(u);

    for (const [v, w] of (graph[u] || [])) {
      if (!visited.has(v) && dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        pq.push([dist[v], v]);
      }
    }
  }
  return dist; // 源点到每个节点的最短距离
}`,
      python: `import heapq

def dijkstra(graph, source):
    # graph: { node: [(neighbor, weight), ...] }
    dist = {node: float('inf') for node in graph}
    dist[source] = 0
    visited = set()
    pq = [(0, source)]  # (distance, node)

    while pq:
        d, u = heapq.heappop(pq)

        if u in visited:
            continue
        visited.add(u)

        for v, w in graph.get(u, []):
            if v not in visited and dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                heapq.heappush(pq, (dist[v], v))

    return dist  # 源点到每个节点的最短距离`,
    },
    visualizerType: 'graph',
  },

  // ─── More Graph ────────────────────────────────────────────
  {
    id: 'topological-sort',
    category: 'graph',
    name: '拓扑排序',
    nameEn: 'Topological Sort',
    difficulty: 'medium',
    timeAvg: 'O(V+E)',
    timeBest: 'O(V+E)',
    timeWorst: 'O(V+E)',
    space: 'O(V)',
    tags: ['图', '有向图', 'DAG', '依赖关系'],
    summary: '给有向无环图（DAG）的节点排出一个满足所有边方向的线性顺序。',
    description: `拓扑排序用于对**有向无环图（DAG）**的节点进行线性排序，使得对每条边 u→v，u 都排在 v 前面。

**经典应用**
- **课程选修**：先修课必须排在后修课前
- **构建系统**：编译依赖顺序（Makefile、Webpack）
- **任务调度**：有依赖关系的任务执行顺序
- **包管理器**：npm/pip 安装依赖的顺序

**两种实现方法**

**① Kahn 算法（BFS）**
不断移除入度为 0 的节点，将其加入结果，并更新其邻居的入度。

**② DFS 后序**
对每个节点做 DFS，所有邻居处理完后将当前节点压栈，最后栈的逆序即为拓扑序。

**检测环**
若 Kahn 算法处理完后结果数量 < 节点总数，说明图中存在环，拓扑排序不存在。`,
    steps: [
      '计算所有节点的入度（有多少条边指向它）',
      '将所有入度为 0 的节点加入队列',
      '从队列取出节点 u，加入结果序列',
      '将 u 的所有邻居的入度减 1',
      '若某邻居入度变为 0，将其加入队列',
      '重复直到队列为空；若结果长度 < 节点数，图中存在环',
    ],
    code: {
      javascript: `// Kahn 算法（BFS 版）
function topoSort(graph, numNodes) {
  // 计算入度
  const inDegree = new Array(numNodes).fill(0);
  for (const [u, neighbors] of Object.entries(graph)) {
    for (const v of neighbors) inDegree[v]++;
  }

  // 初始化队列（所有入度为 0 的节点）
  const queue = [];
  for (let i = 0; i < numNodes; i++) {
    if (inDegree[i] === 0) queue.push(i);
  }

  const result = [];
  while (queue.length > 0) {
    const u = queue.shift();
    result.push(u);
    for (const v of graph[u] || []) {
      inDegree[v]--;
      if (inDegree[v] === 0) queue.push(v);
    }
  }

  // 检测环
  if (result.length !== numNodes) return null; // 有环
  return result;
}`,
      python: `from collections import deque

# Kahn 算法（BFS 版）
def topo_sort(graph, num_nodes):
    # 计算入度
    in_degree = [0] * num_nodes
    for u in graph:
        for v in graph[u]:
            in_degree[v] += 1

    # 初始化队列
    queue = deque(i for i in range(num_nodes) if in_degree[i] == 0)
    result = []

    while queue:
        u = queue.popleft()
        result.append(u)
        for v in graph.get(u, []):
            in_degree[v] -= 1
            if in_degree[v] == 0:
                queue.append(v)

    # 检测环
    return result if len(result) == num_nodes else None`,
    },
    visualizerType: 'graph',
  },
  {
    id: 'union-find',
    category: 'graph',
    name: '并查集',
    nameEn: 'Union-Find (DSU)',
    difficulty: 'medium',
    timeAvg: 'O(α(n))',
    timeBest: 'O(1)',
    timeWorst: 'O(log n)',
    space: 'O(n)',
    tags: ['图', '数据结构', '连通分量', '路径压缩'],
    summary: '高效维护元素的分组关系，支持快速合并与查询同组。',
    description: `并查集（Disjoint Set Union，DSU）是一种高效维护**元素分组**的数据结构，支持两种核心操作：

**核心操作**
- **Find(x)**：找到 x 所属组的代表元素（根节点）
- **Union(x, y)**：将 x 和 y 所在的组合并

**两大优化**
1. **路径压缩**：Find 时将路径上所有节点直接指向根，大幅压缩树高
2. **按秩合并**：Union 时将较矮的树接到较高的树下，避免退化

两种优化结合后，单次操作均摊时间复杂度为 **O(α(n))**（Inverse Ackermann 函数，实际中 ≤ 4，接近 O(1)）。

**经典应用**
- **Kruskal 最小生成树**：判断加一条边是否形成环
- **动态连通性**：网络中节点是否连通
- **LeetCode 经典题**：岛屿数量、冗余连接、账户合并`,
    steps: [
      '初始化：每个元素的 parent[i] = i，rank[i] = 0',
      'Find(x)：若 parent[x] !== x，递归找根并路径压缩',
      '路径压缩：将 x 到根路径上的所有节点直接指向根',
      'Union(x,y)：分别找 x、y 的根 rx、ry',
      '若 rx == ry，已在同一组，无需合并',
      '按秩合并：将 rank 小的根指向 rank 大的根',
    ],
    code: {
      javascript: `class UnionFind {
  constructor(n) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = new Array(n).fill(0);
    this.count = n; // 连通分量数
  }

  // 带路径压缩的查找
  find(x) {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]); // 路径压缩
    }
    return this.parent[x];
  }

  // 按秩合并
  union(x, y) {
    const rx = this.find(x), ry = this.find(y);
    if (rx === ry) return false; // 已经连通
    if (this.rank[rx] < this.rank[ry]) {
      this.parent[rx] = ry;
    } else if (this.rank[rx] > this.rank[ry]) {
      this.parent[ry] = rx;
    } else {
      this.parent[ry] = rx;
      this.rank[rx]++;
    }
    this.count--;
    return true;
  }

  connected(x, y) {
    return this.find(x) === this.find(y);
  }
}`,
      python: `class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
        self.count = n  # 连通分量数

    # 带路径压缩的查找
    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])  # 路径压缩
        return self.parent[x]

    # 按秩合并
    def union(self, x, y):
        rx, ry = self.find(x), self.find(y)
        if rx == ry:
            return False  # 已连通
        if self.rank[rx] < self.rank[ry]:
            self.parent[rx] = ry
        elif self.rank[rx] > self.rank[ry]:
            self.parent[ry] = rx
        else:
            self.parent[ry] = rx
            self.rank[rx] += 1
        self.count -= 1
        return True

    def connected(self, x, y):
        return self.find(x) == self.find(y)`,
    },
    visualizerType: 'graph',
  },

  // ─── More Dynamic Programming ──────────────────────────────
  {
    id: 'lcs',
    category: 'dp',
    name: '最长公共子序列',
    nameEn: 'Longest Common Subsequence',
    difficulty: 'medium',
    timeAvg: 'O(mn)',
    timeBest: 'O(mn)',
    timeWorst: 'O(mn)',
    space: 'O(mn)',
    tags: ['动态规划', '字符串', '子序列', '二维DP'],
    summary: '找两个字符串中都出现且保持顺序的最长子序列。',
    description: `最长公共子序列（LCS）是字符串比较领域的经典 DP 问题，广泛应用于版本控制和生物信息学。

**什么是子序列？**
子序列不要求连续，只需保持**相对顺序**。如 "ace" 是 "abcde" 的子序列。

**DP 状态定义**
dp[i][j] = 字符串 s1 的前 i 个字符与 s2 的前 j 个字符的 LCS 长度

**状态转移**
- 若 s1[i-1] == s2[j-1]：dp[i][j] = dp[i-1][j-1] + 1（两者都用）
- 否则：dp[i][j] = max(dp[i-1][j], dp[i][j-1])（分别跳过一个）

**实际应用**
- **Git diff**：比较两个文件的差异
- **DNA 序列比对**：找两段基因的相似度
- **拼写检查**：字符串相似度计算
- **版本控制**：文件合并算法`,
    steps: [
      '创建 (m+1)×(n+1) 的 dp 表，边界全为 0',
      '遍历 i=1..m，j=1..n',
      '若 s1[i-1] == s2[j-1]，则 dp[i][j] = dp[i-1][j-1] + 1',
      '否则 dp[i][j] = max(dp[i-1][j], dp[i][j-1])',
      'dp[m][n] 即为 LCS 长度',
      '反向回溯 dp 表可还原具体的 LCS 字符串',
    ],
    code: {
      javascript: `function lcs(s1, s2) {
  const m = s1.length, n = s2.length;
  // 创建 DP 表
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1; // 字符匹配
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // 回溯还原 LCS 字符串
  let result = '', i = m, j = n;
  while (i > 0 && j > 0) {
    if (s1[i - 1] === s2[j - 1]) {
      result = s1[i - 1] + result;
      i--; j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }
  return { length: dp[m][n], sequence: result };
}`,
      python: `def lcs(s1, s2):
    m, n = len(s1), len(s2)
    # 创建 DP 表
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s1[i - 1] == s2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1  # 字符匹配
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])

    # 回溯还原 LCS 字符串
    result = []
    i, j = m, n
    while i > 0 and j > 0:
        if s1[i - 1] == s2[j - 1]:
            result.append(s1[i - 1])
            i -= 1; j -= 1
        elif dp[i - 1][j] > dp[i][j - 1]:
            i -= 1
        else:
            j -= 1
    return dp[m][n], ''.join(reversed(result))`,
    },
    visualizerType: 'dp',
  },
  {
    id: 'lis',
    category: 'dp',
    name: '最长递增子序列',
    nameEn: 'Longest Increasing Subsequence',
    difficulty: 'medium',
    timeAvg: 'O(n log n)',
    timeBest: 'O(n log n)',
    timeWorst: 'O(n log n)',
    space: 'O(n)',
    tags: ['动态规划', '二分搜索', '子序列', '贪心'],
    summary: '在数组中找出最长的严格递增子序列（不要求连续）。',
    description: `最长递增子序列（LIS）是 DP 中的经典问题，有两种复杂度不同的解法。

**O(n²) DP 解法**
dp[i] = 以 arr[i] 结尾的最长递增子序列长度
- 对每个 i，遍历 j < i，若 arr[j] < arr[i]，则 dp[i] = max(dp[i], dp[j]+1)
- 答案为 max(dp)

**O(n log n) 贪心 + 二分**
维护一个**耐心排序**数组 tails：
- tails[i] 表示长度为 i+1 的递增子序列的**最小末尾值**
- 对每个元素，二分找到 tails 中第一个 ≥ 当前值的位置并替换
- tails 的长度即为 LIS 长度

**为什么贪心有效？**
让更短子序列的末尾值尽可能小，保留了未来能延伸的最大可能性。

**实际应用**
- 最长不下降序列变体广泛用于算法竞赛
- 应用于股票涨跌分析、牌型分析（耐心排序游戏）`,
    steps: [
      '初始化空的 tails 数组',
      '遍历每个元素 num',
      '二分查找 tails 中第一个 >= num 的位置 pos',
      '若 pos == tails.length，将 num 追加到 tails（LIS 变长）',
      '否则，用 num 替换 tails[pos]（贪心维护最小末尾）',
      '最终 tails.length 即为 LIS 长度',
    ],
    code: {
      javascript: `// O(n log n) 贪心 + 二分
function lis(arr) {
  const tails = []; // tails[i] = 长度为 i+1 的 IS 的最小末尾

  for (const num of arr) {
    // 二分找第一个 >= num 的位置
    let lo = 0, hi = tails.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (tails[mid] < num) lo = mid + 1;
      else hi = mid;
    }
    tails[lo] = num; // 替换或追加
  }
  return tails.length; // LIS 长度
}

// O(n²) DP（便于理解）
function lisDp(arr) {
  const n = arr.length;
  const dp = new Array(n).fill(1);
  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (arr[j] < arr[i]) dp[i] = Math.max(dp[i], dp[j] + 1);
    }
  }
  return Math.max(...dp);
}`,
      python: `import bisect

# O(n log n) 贪心 + 二分
def lis(arr):
    tails = []  # tails[i] = 长度为 i+1 的 IS 的最小末尾
    for num in arr:
        pos = bisect.bisect_left(tails, num)  # 找第一个 >= num 的位置
        if pos == len(tails):
            tails.append(num)  # 延伸 LIS
        else:
            tails[pos] = num   # 贪心替换
    return len(tails)

# O(n²) DP（便于理解）
def lis_dp(arr):
    n = len(arr)
    dp = [1] * n
    for i in range(1, n):
        for j in range(i):
            if arr[j] < arr[i]:
                dp[i] = max(dp[i], dp[j] + 1)
    return max(dp)`,
    },
    visualizerType: 'dp',
  },
  {
    id: 'coin-change',
    category: 'dp',
    name: '硬币找零',
    nameEn: 'Coin Change',
    difficulty: 'medium',
    timeAvg: 'O(n·W)',
    timeBest: 'O(n·W)',
    timeWorst: 'O(n·W)',
    space: 'O(W)',
    tags: ['动态规划', '完全背包', '贪心陷阱', '最优子结构'],
    summary: '用最少数量的硬币凑成目标金额，每种硬币可用无限次。',
    description: `硬币找零是 DP 中的**完全背包**变体，也是说明贪心算法局限性的经典案例。

**贪心为什么不行？**
对于硬币 [1, 3, 4]，凑 6 元：
- 贪心：先选 4，再选 1+1 → 3 枚
- 最优：3+3 → 2 枚 ✓

贪心策略会陷入局部最优，必须用 DP 全局规划。

**DP 状态定义**
dp[j] = 凑成金额 j 所需的最少硬币数

**状态转移**
dp[j] = min(dp[j], dp[j - coin] + 1)，对每种面值 coin

**完全背包特征**
每种硬币可以重复使用，因此内层循环**正向**遍历（与 0/1 背包的反向不同）。

**变体问题**
- 方案数：改为 dp[j] += dp[j - coin]（"爬楼梯"变体）
- 最大价值：改为 max 而非 min`,
    steps: [
      '初始化 dp[0]=0，dp[1..amount] = ∞（无法凑成时为无穷大）',
      '遍历每种硬币 coin',
      '对 j 从 coin 到 amount 正向遍历（完全背包）',
      '更新 dp[j] = min(dp[j], dp[j - coin] + 1)',
      '遍历完所有硬币后，dp[amount] 即为答案',
      '若 dp[amount] 仍为 ∞，返回 -1（无法凑成）',
    ],
    code: {
      javascript: `function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0; // 凑成 0 元需要 0 枚

  for (const coin of coins) {
    for (let j = coin; j <= amount; j++) {
      // 用当前硬币后的方案数 + 1
      dp[j] = Math.min(dp[j], dp[j - coin] + 1);
    }
  }

  return dp[amount] === Infinity ? -1 : dp[amount];
}

// 示例：coins=[1,5,10,25], amount=36
// 最优：25+10+1 = 3 枚`,
      python: `def coin_change(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0  # 凑成 0 元需要 0 枚

    for coin in coins:
        for j in range(coin, amount + 1):
            # 用当前硬币后所需枚数 + 1
            dp[j] = min(dp[j], dp[j - coin] + 1)

    return dp[amount] if dp[amount] != float('inf') else -1

# 示例：coins=[1,5,10,25], amount=36
# 最优：25+10+1 = 3 枚`,
    },
    visualizerType: 'dp',
  },
  {
    id: 'edit-distance',
    category: 'dp',
    name: '编辑距离',
    nameEn: 'Edit Distance (Levenshtein)',
    difficulty: 'hard',
    timeAvg: 'O(mn)',
    timeBest: 'O(mn)',
    timeWorst: 'O(mn)',
    space: 'O(mn)',
    tags: ['动态规划', '字符串', '二维DP', '相似度'],
    summary: '计算将一个字符串变换为另一个所需的最少插入、删除、替换操作数。',
    description: `编辑距离（Levenshtein Distance）衡量两个字符串的**相似程度**，允许三种基本操作：插入、删除、替换，每次操作代价为 1。

**DP 状态定义**
dp[i][j] = 将 word1 的前 i 个字符转换为 word2 的前 j 个字符所需的最少操作数

**状态转移**
- 若 word1[i-1] == word2[j-1]：dp[i][j] = dp[i-1][j-1]（无需操作）
- 否则，取三者最小：
  - dp[i-1][j] + 1：删除 word1[i-1]
  - dp[i][j-1] + 1：在 word1 插入 word2[j-1]
  - dp[i-1][j-1] + 1：替换 word1[i-1] 为 word2[j-1]

**边界**
dp[0][j] = j（从空串到 word2 的前 j 个字符需要 j 次插入）
dp[i][0] = i（从 word1 的前 i 个字符到空串需要 i 次删除）

**实际应用**
- **拼写检查**：找最近似的正确单词
- **DNA 序列比对**：基因相似性分析
- **搜索引擎**：模糊搜索、"您是否要找…"`,
    steps: [
      '创建 (m+1)×(n+1) 的 dp 表',
      '初始化边界：dp[i][0]=i，dp[0][j]=j',
      '遍历 i=1..m，j=1..n',
      '若字符相同：dp[i][j] = dp[i-1][j-1]',
      '若字符不同：dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])',
      '返回 dp[m][n]，即最小编辑距离',
    ],
    code: {
      javascript: `function editDistance(word1, word2) {
  const m = word1.length, n = word2.length;
  const dp = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1]; // 字符相同，无需操作
      } else {
        dp[i][j] = 1 + Math.min(
          dp[i - 1][j],     // 删除
          dp[i][j - 1],     // 插入
          dp[i - 1][j - 1]  // 替换
        );
      }
    }
  }
  return dp[m][n];
}

// editDistance("horse", "ros") → 3`,
      python: `def edit_distance(word1, word2):
    m, n = len(word1), len(word2)
    # 初始化边界
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m + 1): dp[i][0] = i
    for j in range(n + 1): dp[0][j] = j

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i - 1] == word2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]  # 字符相同
            else:
                dp[i][j] = 1 + min(
                    dp[i - 1][j],     # 删除
                    dp[i][j - 1],     # 插入
                    dp[i - 1][j - 1]  # 替换
                )
    return dp[m][n]

# edit_distance("horse", "ros") → 3`,
    },
    visualizerType: 'dp',
  },

  // ─── More Data Structures ───────────────────────────────────
  {
    id: 'linked-list',
    category: 'structures',
    name: '链表',
    nameEn: 'Linked List',
    difficulty: 'easy',
    timeAvg: 'O(n)',
    timeBest: 'O(1)',
    timeWorst: 'O(n)',
    space: 'O(n)',
    tags: ['数据结构', '链式', '线性', '指针'],
    summary: '用指针串联节点的线性结构，插入/删除 O(1)，随机访问 O(n)。',
    description: `链表是与数组并列的基础线性数据结构，每个节点存储数据和指向下一个节点的引用。

**链表 vs 数组**
| | 链表 | 数组 |
|---|---|---|
| 随机访问 | O(n) | O(1) |
| 头部插入 | O(1) | O(n) |
| 中间插入 | O(1)*找到后 | O(n) |
| 内存 | 分散，有指针开销 | 连续，紧凑 |

**链表的三种形态**
- **单向链表**：每个节点指向下一个
- **双向链表**：每个节点有 prev 和 next 指针
- **循环链表**：末节点指向头节点

**高频算法题**
- 反转链表（递归/迭代）
- 找链表中间节点（快慢指针）
- 检测环（Floyd 判圈算法）
- 合并两个有序链表
- K 个一组翻转链表

**实际应用**
浏览器历史记录、LRU 缓存（双向链表+哈希表）、操作系统内存分配。`,
    steps: [
      '定义 ListNode 类：val（数据）+ next（指针）',
      '头插法：新节点.next = head；head = 新节点',
      '尾插法：遍历到末尾，tail.next = 新节点',
      '删除节点：找到前驱节点，prev.next = curr.next',
      '遍历：从 head 出发，不断 curr = curr.next，直到 null',
      '快慢指针技巧：slow 走一步，fast 走两步，可找中点或检测环',
    ],
    code: {
      javascript: `class ListNode {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}

class LinkedList {
  constructor() { this.head = null; }

  // 头插法 O(1)
  prepend(val) {
    this.head = new ListNode(val, this.head);
  }

  // 尾插法 O(n)
  append(val) {
    const node = new ListNode(val);
    if (!this.head) { this.head = node; return; }
    let curr = this.head;
    while (curr.next) curr = curr.next;
    curr.next = node;
  }

  // 反转链表 O(n)
  reverse() {
    let prev = null, curr = this.head;
    while (curr) {
      const next = curr.next;
      curr.next = prev;
      prev = curr;
      curr = next;
    }
    this.head = prev;
  }

  // 快慢指针找中间节点
  findMiddle() {
    let slow = this.head, fast = this.head;
    while (fast && fast.next) {
      slow = slow.next;
      fast = fast.next.next;
    }
    return slow; // 中点
  }
}`,
      python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class LinkedList:
    def __init__(self):
        self.head = None

    # 头插法 O(1)
    def prepend(self, val):
        self.head = ListNode(val, self.head)

    # 尾插法 O(n)
    def append(self, val):
        node = ListNode(val)
        if not self.head:
            self.head = node; return
        curr = self.head
        while curr.next:
            curr = curr.next
        curr.next = node

    # 反转链表 O(n)
    def reverse(self):
        prev, curr = None, self.head
        while curr:
            curr.next, prev, curr = prev, curr, curr.next
        self.head = prev

    # 快慢指针找中间节点
    def find_middle(self):
        slow = fast = self.head
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
        return slow  # 中点`,
    },
    visualizerType: 'stack',
  },
  {
    id: 'heap',
    category: 'structures',
    name: '堆 / 优先队列',
    nameEn: 'Heap / Priority Queue',
    difficulty: 'medium',
    timeAvg: 'O(log n)',
    timeBest: 'O(1)',
    timeWorst: 'O(log n)',
    space: 'O(n)',
    tags: ['数据结构', '完全二叉树', '优先队列', '贪心'],
    summary: '完全二叉树实现的优先队列，O(log n) 插入/删除，O(1) 获取最值。',
    description: `堆是一种特殊的**完全二叉树**，分为最小堆和最大堆，是实现优先队列的首选数据结构。

**堆的性质**
- **最小堆**：每个节点 ≤ 其所有子节点，堆顶是最小值
- **最大堆**：每个节点 ≥ 其所有子节点，堆顶是最大值
- 用**数组**表示：节点 i 的左子 = 2i+1，右子 = 2i+2，父节点 = ⌊(i-1)/2⌋

**核心操作**
| 操作 | 时间 | 说明 |
|---|---|---|
| 插入 | O(log n) | 尾部插入后上浮（swim） |
| 删除堆顶 | O(log n) | 堆顶换末尾后下沉（sink） |
| 查看堆顶 | O(1) | 直接返回 arr[0] |
| 建堆 | O(n) | 从最后一个非叶节点向上 heapify |

**经典应用**
- **堆排序**、**Top-K 问题**（找最大的 K 个数）
- **Dijkstra** 最短路径算法中的优先队列
- **中位数维护**：一个最大堆 + 一个最小堆
- **任务调度**：优先级调度系统`,
    steps: [
      '用数组存储堆，根节点在 arr[0]',
      '插入：将新元素加到末尾，执行 siftUp（与父比较，若更小则互换）',
      'siftUp：不断与父节点比较并上移，直到满足堆性质',
      '删除堆顶：将末尾元素移到堆顶，删除末尾，执行 siftDown',
      'siftDown：与左右子节点中较小者比较，若更大则互换，递归向下',
      '建堆：从 ⌊n/2⌋-1 下标开始向前，对每个节点执行 siftDown',
    ],
    code: {
      javascript: `class MinHeap {
  constructor() { this.heap = []; }

  // 父/子节点索引
  parent(i) { return Math.floor((i - 1) / 2); }
  left(i)   { return 2 * i + 1; }
  right(i)  { return 2 * i + 2; }
  swap(i, j) { [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]]; }

  // 插入：尾部追加后上浮
  push(val) {
    this.heap.push(val);
    this._siftUp(this.heap.length - 1);
  }

  // 删除堆顶：堆顶换末尾后下沉
  pop() {
    if (!this.heap.length) return null;
    this.swap(0, this.heap.length - 1);
    const min = this.heap.pop();
    this._siftDown(0);
    return min;
  }

  peek() { return this.heap[0]; }
  size() { return this.heap.length; }

  _siftUp(i) {
    while (i > 0 && this.heap[i] < this.heap[this.parent(i)]) {
      this.swap(i, this.parent(i));
      i = this.parent(i);
    }
  }

  _siftDown(i) {
    const n = this.heap.length;
    let smallest = i;
    const l = this.left(i), r = this.right(i);
    if (l < n && this.heap[l] < this.heap[smallest]) smallest = l;
    if (r < n && this.heap[r] < this.heap[smallest]) smallest = r;
    if (smallest !== i) {
      this.swap(i, smallest);
      this._siftDown(smallest);
    }
  }
}`,
      python: `import heapq

# Python 内置最小堆（heapq 模块）
class MinHeap:
    def __init__(self):
        self._heap = []

    def push(self, val):
        heapq.heappush(self._heap, val)  # O(log n)

    def pop(self):
        return heapq.heappop(self._heap)  # O(log n)

    def peek(self):
        return self._heap[0]  # O(1)

    def size(self):
        return len(self._heap)

# ── 最大堆：取反实现 ──
class MaxHeap:
    def __init__(self):
        self._heap = []

    def push(self, val):
        heapq.heappush(self._heap, -val)

    def pop(self):
        return -heapq.heappop(self._heap)

    def peek(self):
        return -self._heap[0]

# ── Top-K 最大值（只用大小为 K 的最小堆）──
def top_k(nums, k):
    return heapq.nlargest(k, nums)`,
    },
    visualizerType: 'stack',
  },
  {
    id: 'trie',
    category: 'structures',
    name: '字典树（前缀树）',
    nameEn: 'Trie',
    difficulty: 'medium',
    timeAvg: 'O(L)',
    timeBest: 'O(1)',
    timeWorst: 'O(L)',
    space: 'O(n·L)',
    tags: ['数据结构', '树', '字符串', '前缀', '自动补全'],
    summary: '以字符为边构建的多叉树，O(L) 时间完成字符串插入与前缀查询。',
    description: `字典树（Trie，也称前缀树）是专为字符串**批量查询**和**前缀匹配**设计的树形结构。

**核心思想**
将字符串按字符拆分，共享相同前缀。每条从根到节点的路径对应一个字符串前缀；到达标记了"结尾"的节点时，即找到了一个完整单词。

**结构示意**（插入 "cat", "car", "card", "care", "dog"）
\`\`\`
root
├── c → a → t (✓)
│         └── r (✓) → d (✓)
│                  └── e (✓)
└── d → o → g (✓)
\`\`\`

**时间复杂度**
- **L** = 字符串长度
- 插入、查找、前缀搜索：均为 O(L)，与字典中单词总数无关！

**典型应用**
- **搜索引擎自动补全**：输入前缀，快速返回所有候选词
- **拼写检查**：快速判断单词是否存在
- **IP 路由表**：最长前缀匹配
- **手机输入法联想词**`,
    steps: [
      '根节点 root 不存储字符，只有 children 和 isEnd 属性',
      '插入单词：从根出发，逐字符创建子节点',
      '若字符对应子节点存在则直接走，不存在则新建',
      '到达最后一个字符后，标记 isEnd = true',
      '查找单词：逐字符走，任何字符不存在则返回 false；到末尾检查 isEnd',
      '查找前缀：与查找类似，但不需要检查 isEnd，只要能走完前缀即可',
    ],
    code: {
      javascript: `class TrieNode {
  constructor() {
    this.children = {}; // 子节点映射
    this.isEnd = false; // 是否是单词结尾
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  // 插入单词 O(L)
  insert(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node.children[ch]) {
        node.children[ch] = new TrieNode();
      }
      node = node.children[ch];
    }
    node.isEnd = true;
  }

  // 搜索完整单词 O(L)
  search(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node.children[ch]) return false;
      node = node.children[ch];
    }
    return node.isEnd;
  }

  // 搜索前缀 O(L)
  startsWith(prefix) {
    let node = this.root;
    for (const ch of prefix) {
      if (!node.children[ch]) return false;
      node = node.children[ch];
    }
    return true;
  }

  // 返回所有以 prefix 开头的单词
  suggest(prefix) {
    let node = this.root;
    for (const ch of prefix) {
      if (!node.children[ch]) return [];
      node = node.children[ch];
    }
    const results = [];
    this._dfs(node, prefix, results);
    return results;
  }

  _dfs(node, current, results) {
    if (node.isEnd) results.push(current);
    for (const [ch, child] of Object.entries(node.children)) {
      this._dfs(child, current + ch, results);
    }
  }
}`,
      python: `class TrieNode:
    def __init__(self):
        self.children = {}  # 子节点映射
        self.is_end = False  # 是否单词结尾

class Trie:
    def __init__(self):
        self.root = TrieNode()

    # 插入单词 O(L)
    def insert(self, word):
        node = self.root
        for ch in word:
            if ch not in node.children:
                node.children[ch] = TrieNode()
            node = node.children[ch]
        node.is_end = True

    # 搜索完整单词 O(L)
    def search(self, word):
        node = self.root
        for ch in word:
            if ch not in node.children:
                return False
            node = node.children[ch]
        return node.is_end

    # 搜索前缀 O(L)
    def starts_with(self, prefix):
        node = self.root
        for ch in prefix:
            if ch not in node.children:
                return False
            node = node.children[ch]
        return True

    # 返回所有以 prefix 开头的单词
    def suggest(self, prefix):
        node = self.root
        for ch in prefix:
            if ch not in node.children:
                return []
            node = node.children[ch]
        results = []
        self._dfs(node, prefix, results)
        return results

    def _dfs(self, node, current, results):
        if node.is_end:
            results.append(current)
        for ch, child in node.children.items():
            self._dfs(child, current + ch, results)`,
    },
    visualizerType: 'tree',
  },

  // ─── Additional Sorting ────────────────────────────────────
  {
    id: 'bucket-sort',
    category: 'sorting',
    name: '桶排序',
    nameEn: 'Bucket Sort',
    difficulty: 'medium',
    timeAvg: 'O(n+k)',
    timeBest: 'O(n+k)',
    timeWorst: 'O(n²)',
    space: 'O(n+k)',
    tags: ['排序', '桶', '非比较', '分布假设'],
    summary: '按数值区间分桶，桶内排序后依次合并，分布均匀时接近线性。',
    description: `桶排序是一种利用数据分布特征的排序算法，特别适合“范围已知且分布较均匀”的场景。

**核心思想**
- 将数据按区间映射到多个桶中
- 每个桶内再做局部排序（常用插入排序或语言内置排序）
- 按桶编号顺序依次输出，得到全局有序结果

**为什么会快？**
当数据比较均匀时，每个桶中的元素数量较少，桶内排序成本低，总体复杂度可接近 O(n+k)。

**注意点**
- 桶划分策略（桶数量、桶宽）直接决定性能
- 若数据分布极不均匀，可能退化到 O(n²)
- 常用于浮点数、分数、评分等“值域可控”数据`,
    steps: [
      '扫描数组，得到最小值 min 与最大值 max',
      '按桶宽 bucketSize 计算桶数量 bucketCount',
      '遍历数组，将每个元素根据区间映射到对应桶',
      '对每个非空桶分别进行排序',
      '按桶序依次把元素拼接到结果数组',
      '返回合并后的有序数组',
    ],
    code: {
      javascript: `function bucketSort(arr, bucketSize = 5) {
  if (arr.length <= 1) return arr;

  const min = Math.min(...arr);
  const max = Math.max(...arr);
  const bucketCount = Math.floor((max - min) / bucketSize) + 1;
  const buckets = Array.from({ length: bucketCount }, () => []);

  // 分配到桶
  for (const num of arr) {
    const idx = Math.floor((num - min) / bucketSize);
    buckets[idx].push(num);
  }

  // 桶内排序并合并
  const result = [];
  for (const bucket of buckets) {
    bucket.sort((a, b) => a - b);
    result.push(...bucket);
  }
  return result;
}`,
      python: `def bucket_sort(arr, bucket_size=5):
    if len(arr) <= 1:
        return arr

    min_val, max_val = min(arr), max(arr)
    bucket_count = (max_val - min_val) // bucket_size + 1
    buckets = [[] for _ in range(bucket_count)]

    # 分配到桶
    for num in arr:
        idx = (num - min_val) // bucket_size
        buckets[idx].append(num)

    # 桶内排序并合并
    result = []
    for bucket in buckets:
        bucket.sort()
        result.extend(bucket)
    return result`,
    },
    visualizerType: 'array',
  },

  // ─── Additional Searching ─────────────────────────────────
  {
    id: 'exponential-search',
    category: 'searching',
    name: '指数搜索',
    nameEn: 'Exponential Search',
    difficulty: 'medium',
    timeAvg: 'O(log n)',
    timeBest: 'O(1)',
    timeWorst: 'O(log n)',
    space: 'O(1)',
    tags: ['搜索', '有序', '二分', '范围扩展'],
    summary: '先指数扩展范围，再在小区间内二分，适合未知上界的有序数组。',
    description: `指数搜索用于有序数组，先快速定位“目标可能所在区间”，再使用二分搜索精确定位。

**两阶段流程**
1. **指数扩展**：检查索引 1,2,4,8...，直到越界或值不小于 target
2. **区间二分**：在 [bound/2, min(bound,n-1)] 区间做普通二分

**适用场景**
- 数据有序
- 不知道数组有效长度上界（如流式块读取）
- 目标更可能出现在靠前区域

**复杂度**
指数扩展 O(log p)，区间二分 O(log p)，总计 O(log n)。`,
    steps: [
      '先判断 arr[0] 是否等于目标值',
      '从 bound=1 开始，每次翻倍（bound*=2）扩大搜索上界',
      '当 arr[bound] >= target 或越界时停止扩展',
      '确定二分区间 left=bound/2, right=min(bound,n-1)',
      '在该区间执行标准二分搜索',
      '找到返回索引，否则返回 -1',
    ],
    code: {
      javascript: `function exponentialSearch(arr, target) {
  const n = arr.length;
  if (n === 0) return -1;
  if (arr[0] === target) return 0;

  // 指数扩展范围
  let bound = 1;
  while (bound < n && arr[bound] < target) {
    bound *= 2;
  }

  // 在确定区间内二分
  let left = Math.floor(bound / 2);
  let right = Math.min(bound, n - 1);
  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`,
      python: `def exponential_search(arr, target):
    n = len(arr)
    if n == 0:
        return -1
    if arr[0] == target:
        return 0

    # 指数扩展范围
    bound = 1
    while bound < n and arr[bound] < target:
        bound *= 2

    # 在确定区间内二分
    left = bound // 2
    right = min(bound, n - 1)
    while left <= right:
        mid = left + (right - left) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`,
    },
    visualizerType: 'search',
  },
  {
    id: 'ternary-search',
    category: 'searching',
    name: '三分搜索',
    nameEn: 'Ternary Search',
    difficulty: 'medium',
    timeAvg: 'O(log n)',
    timeBest: 'O(1)',
    timeWorst: 'O(log n)',
    space: 'O(1)',
    tags: ['搜索', '有序', '分治', '三分'],
    summary: '每轮把区间分成三段，通过两个中点缩小搜索范围。',
    description: `三分搜索与二分搜索类似，但每次用两个中点把区间切成三段。

**核心思路**
- 计算 mid1 和 mid2
- 先检查 arr[mid1]、arr[mid2] 是否命中
- 根据 target 与两个中点值的大小关系，保留左段、中段或右段

**何时使用**
- 在离散有序数组中可替代二分搜索
- 在竞赛中更常用于“单峰函数最值”问题（连续域/整数域）

**复杂度**
每轮将区间缩小到约 2/3，时间复杂度仍为 O(log n)。`,
    steps: [
      '初始化 left=0, right=n-1',
      '计算 mid1=left+(right-left)/3 与 mid2=right-(right-left)/3',
      '若 arr[mid1] 或 arr[mid2] 命中目标，直接返回',
      '若 target < arr[mid1]，收缩到左段',
      '若 target > arr[mid2]，收缩到右段',
      '否则收缩到中段，直到区间为空返回 -1',
    ],
    code: {
      javascript: `function ternarySearch(arr, target) {
  let left = 0, right = arr.length - 1;

  while (left <= right) {
    const third = Math.floor((right - left) / 3);
    const mid1 = left + third;
    const mid2 = right - third;

    if (arr[mid1] === target) return mid1;
    if (arr[mid2] === target) return mid2;

    if (target < arr[mid1]) right = mid1 - 1;
    else if (target > arr[mid2]) left = mid2 + 1;
    else {
      left = mid1 + 1;
      right = mid2 - 1;
    }
  }
  return -1;
}`,
      python: `def ternary_search(arr, target):
    left, right = 0, len(arr) - 1

    while left <= right:
        third = (right - left) // 3
        mid1 = left + third
        mid2 = right - third

        if arr[mid1] == target:
            return mid1
        if arr[mid2] == target:
            return mid2

        if target < arr[mid1]:
            right = mid1 - 1
        elif target > arr[mid2]:
            left = mid2 + 1
        else:
            left = mid1 + 1
            right = mid2 - 1
    return -1`,
    },
    visualizerType: 'search',
  },

  // ─── Additional Graph ─────────────────────────────────────
  {
    id: 'bellman-ford',
    category: 'graph',
    name: 'Bellman-Ford 最短路径',
    nameEn: 'Bellman-Ford',
    difficulty: 'hard',
    timeAvg: 'O(VE)',
    timeBest: 'O(E)',
    timeWorst: 'O(VE)',
    space: 'O(V)',
    tags: ['图', '最短路径', '负权边', '松弛'],
    summary: '可处理负权边的单源最短路算法，并能检测负权环。',
    description: `Bellman-Ford 是 Dijkstra 的重要补充，核心优势是支持负权边并可检测负权环。

**核心思想：反复松弛**
- 最短路径最多包含 V-1 条边
- 因此对所有边执行 V-1 轮松弛即可收敛
- 第 V 轮若还能松弛，说明存在负权环

**与 Dijkstra 的区别**
- Dijkstra：快，但不能处理负权边
- Bellman-Ford：更通用，但复杂度更高

**应用**
- 汇率套利检测（负环）
- 含负收益/负成本边的路径规划
- 作为 Johnson 全源最短路的子步骤`,
    steps: [
      '初始化 dist[source]=0，其余顶点为 ∞',
      '循环 V-1 轮，每轮遍历所有边 (u,v,w)',
      '若 dist[u] + w < dist[v]，则更新 dist[v]',
      '若某一轮没有任何更新，可提前停止',
      '再遍历一轮所有边，检测是否还能松弛',
      '若还能松弛则存在负权环，否则 dist 即最短路',
    ],
    code: {
      javascript: `function bellmanFord(vertices, edges, source) {
  const dist = new Array(vertices).fill(Infinity);
  dist[source] = 0;

  // V-1 轮松弛
  for (let i = 0; i < vertices - 1; i++) {
    let relaxed = false;
    for (const [u, v, w] of edges) {
      if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        relaxed = true;
      }
    }
    if (!relaxed) break; // 提前收敛
  }

  // 第 V 轮检测负权环
  for (const [u, v, w] of edges) {
    if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
      return { hasNegativeCycle: true, distances: dist };
    }
  }
  return { hasNegativeCycle: false, distances: dist };
}`,
      python: `def bellman_ford(vertices, edges, source):
    dist = [float('inf')] * vertices
    dist[source] = 0

    # V-1 轮松弛
    for _ in range(vertices - 1):
        relaxed = False
        for u, v, w in edges:
            if dist[u] != float('inf') and dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                relaxed = True
        if not relaxed:
            break  # 提前收敛

    # 第 V 轮检测负权环
    for u, v, w in edges:
        if dist[u] != float('inf') and dist[u] + w < dist[v]:
            return True, dist  # 存在负权环
    return False, dist`,
    },
    visualizerType: 'graph',
  },
  {
    id: 'kruskal',
    category: 'graph',
    name: 'Kruskal 最小生成树',
    nameEn: "Kruskal's MST",
    difficulty: 'hard',
    timeAvg: 'O(E log E)',
    timeBest: 'O(E log E)',
    timeWorst: 'O(E log E)',
    space: 'O(V)',
    tags: ['图', '最小生成树', '贪心', '并查集'],
    summary: '按边权从小到大选边，借助并查集避免成环，构造最小生成树。',
    description: `Kruskal 算法用于求无向连通图的最小生成树（MST），是“排序 + 并查集”的经典组合。

**贪心策略**
- 总是优先选当前最小权重的边
- 只要这条边不会形成环，就加入生成树

**如何判环？**
使用并查集（Union-Find）判断边两端是否已连通：
- 不连通：可安全加入，并执行 union
- 已连通：会成环，跳过

**终止条件**
当已选边数达到 V-1 时，MST 构建完成。`,
    steps: [
      '将所有边按权重从小到大排序',
      '初始化并查集，每个顶点单独成组',
      '从最小边开始依次尝试加入',
      '若边两端不在同一集合，加入 MST 并合并集合',
      '若在同一集合则跳过（会形成环）',
      '当选边数达到 V-1 时停止，得到最小生成树',
    ],
    code: {
      javascript: `function kruskal(n, edges) {
  // edges: [u, v, w]
  edges.sort((a, b) => a[2] - b[2]);

  const parent = Array.from({ length: n }, (_, i) => i);
  const rank = new Array(n).fill(0);

  function find(x) {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  }

  function union(x, y) {
    let rx = find(x), ry = find(y);
    if (rx === ry) return false;
    if (rank[rx] < rank[ry]) parent[rx] = ry;
    else if (rank[rx] > rank[ry]) parent[ry] = rx;
    else {
      parent[ry] = rx;
      rank[rx]++;
    }
    return true;
  }

  let totalWeight = 0;
  const mstEdges = [];

  for (const [u, v, w] of edges) {
    if (union(u, v)) {
      mstEdges.push([u, v, w]);
      totalWeight += w;
      if (mstEdges.length === n - 1) break;
    }
  }

  return {
    weight: totalWeight,
    edges: mstEdges,
    isConnected: mstEdges.length === n - 1,
  };
}`,
      python: `def kruskal(n, edges):
    # edges: (u, v, w)
    edges.sort(key=lambda x: x[2])
    parent = list(range(n))
    rank = [0] * n

    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]

    def union(x, y):
        rx, ry = find(x), find(y)
        if rx == ry:
            return False
        if rank[rx] < rank[ry]:
            parent[rx] = ry
        elif rank[rx] > rank[ry]:
            parent[ry] = rx
        else:
            parent[ry] = rx
            rank[rx] += 1
        return True

    total_weight = 0
    mst_edges = []
    for u, v, w in edges:
        if union(u, v):
            mst_edges.append((u, v, w))
            total_weight += w
            if len(mst_edges) == n - 1:
                break

    return {
        'weight': total_weight,
        'edges': mst_edges,
        'is_connected': len(mst_edges) == n - 1
    }`,
    },
    visualizerType: 'graph',
  },

  // ─── Additional Dynamic Programming ───────────────────────
  {
    id: 'longest-palindromic-subsequence',
    category: 'dp',
    name: '最长回文子序列',
    nameEn: 'Longest Palindromic Subsequence',
    difficulty: 'medium',
    timeAvg: 'O(n²)',
    timeBest: 'O(n²)',
    timeWorst: 'O(n²)',
    space: 'O(n²)',
    tags: ['动态规划', '字符串', '区间DP', '子序列'],
    summary: '在字符串中找最长“正读反读相同”的子序列（不要求连续）。',
    description: `最长回文子序列（LPS）是典型的区间 DP 问题，常与最长回文子串做区分。

**子序列 vs 子串**
- 子序列：不要求连续，只需顺序不变
- 子串：必须连续

**状态定义**
dp[i][j] = 子串 s[i..j] 内的最长回文子序列长度

**状态转移**
- 若 s[i] == s[j]：dp[i][j] = dp[i+1][j-1] + 2
- 否则：dp[i][j] = max(dp[i+1][j], dp[i][j-1])

**填表顺序**
由于依赖 i+1，需让 i 从大到小遍历，j 从小到大遍历。`,
    steps: [
      '定义 n×n 的二维数组 dp，初始为 0',
      '设置所有 dp[i][i]=1（单字符回文长度为 1）',
      '按 i 从 n-1 到 0，j 从 i+1 到 n-1 遍历区间',
      '若 s[i]==s[j]，使用 dp[i+1][j-1]+2 转移',
      '否则取 dp[i+1][j] 与 dp[i][j-1] 的较大值',
      '最终 dp[0][n-1] 即全串答案',
    ],
    code: {
      javascript: `function longestPalindromicSubsequence(s) {
  const n = s.length;
  if (n === 0) return 0;

  const dp = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    dp[i][i] = 1;
    for (let j = i + 1; j < n; j++) {
      if (s[i] === s[j]) {
        dp[i][j] = dp[i + 1][j - 1] + 2;
      } else {
        dp[i][j] = Math.max(dp[i + 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp[0][n - 1];
}`,
      python: `def longest_palindromic_subsequence(s):
    n = len(s)
    if n == 0:
        return 0

    dp = [[0] * n for _ in range(n)]
    for i in range(n - 1, -1, -1):
        dp[i][i] = 1
        for j in range(i + 1, n):
            if s[i] == s[j]:
                dp[i][j] = dp[i + 1][j - 1] + 2
            else:
                dp[i][j] = max(dp[i + 1][j], dp[i][j - 1])
    return dp[0][n - 1]`,
    },
    visualizerType: 'dp',
  },
  {
    id: 'partition-equal-subset-sum',
    category: 'dp',
    name: '分割等和子集',
    nameEn: 'Partition Equal Subset Sum',
    difficulty: 'medium',
    timeAvg: 'O(n·W)',
    timeBest: 'O(n·W)',
    timeWorst: 'O(n·W)',
    space: 'O(W)',
    tags: ['动态规划', '0/1背包', '子集和', '布尔DP'],
    summary: '判断数组能否拆成两个和相等的子集，本质是 0/1 背包可达性问题。',
    description: `分割等和子集是背包思想的经典应用。

**等价转化**
设数组总和为 sum：
- 若 sum 为奇数，必定无法平分
- 否则问题等价为：是否存在子集和为 target=sum/2

**DP 定义**
dp[j] 表示“是否能用前若干个数凑出和 j”

**转移**
对每个 num，倒序更新：
dp[j] = dp[j] || dp[j-num]

倒序是关键，避免一个数字被重复使用（0/1 背包约束）。`,
    steps: [
      '计算数组总和 sum，若 sum 为奇数直接返回 false',
      '令 target = sum / 2，创建布尔数组 dp[0..target]',
      '初始化 dp[0]=true，表示和为 0 一定可达',
      '遍历每个数字 num，对 j 从 target 到 num 倒序遍历',
      '更新 dp[j] = dp[j] || dp[j-num]',
      '遍历结束后返回 dp[target]',
    ],
    code: {
      javascript: `function canPartition(nums) {
  const sum = nums.reduce((acc, x) => acc + x, 0);
  if (sum % 2 !== 0) return false;

  const target = sum / 2;
  const dp = new Array(target + 1).fill(false);
  dp[0] = true;

  for (const num of nums) {
    for (let j = target; j >= num; j--) {
      dp[j] = dp[j] || dp[j - num];
    }
  }
  return dp[target];
}`,
      python: `def can_partition(nums):
    total = sum(nums)
    if total % 2 != 0:
        return False

    target = total // 2
    dp = [False] * (target + 1)
    dp[0] = True

    for num in nums:
        for j in range(target, num - 1, -1):
            dp[j] = dp[j] or dp[j - num]
    return dp[target]`,
    },
    visualizerType: 'dp',
  },

  // ─── Additional Data Structures ───────────────────────────
  {
    id: 'binary-search-tree',
    category: 'structures',
    name: '二叉搜索树',
    nameEn: 'Binary Search Tree',
    difficulty: 'medium',
    timeAvg: 'O(log n)',
    timeBest: 'O(1)',
    timeWorst: 'O(n)',
    space: 'O(n)',
    tags: ['数据结构', '树', '有序', '查找'],
    summary: '满足左小右大的有序二叉树，支持高效查找、插入与删除。',
    description: `二叉搜索树（BST）通过“左子树都更小、右子树都更大”的性质，实现动态有序集合。

**BST 性质**
- 对任意节点 node：
  - 左子树所有值 < node.val
  - 右子树所有值 > node.val

**复杂度特点**
- 平衡时高度约 log n，查找/插入/删除均为 O(log n)
- 退化为链表时最坏 O(n)

**常见操作**
- 插入：沿比较路径走到空位挂上新节点
- 查找：按大小关系向左/右递归或迭代
- 中序遍历：输出升序序列`,
    steps: [
      '从根节点开始比较目标值与当前节点值',
      '若更小则进入左子树，若更大则进入右子树',
      '查找时遇到相等返回命中，遇到空节点返回未找到',
      '插入时在空节点位置创建新节点',
      '中序遍历按“左-根-右”访问可得到有序结果',
      '删除操作通常拆分为叶子、单子节点、双子节点三种情况',
    ],
    code: {
      javascript: `class BSTNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

class BinarySearchTree {
  constructor() {
    this.root = null;
  }

  insert(val) {
    const node = new BSTNode(val);
    if (!this.root) {
      this.root = node;
      return this;
    }
    let cur = this.root;
    while (true) {
      if (val < cur.val) {
        if (!cur.left) {
          cur.left = node;
          return this;
        }
        cur = cur.left;
      } else if (val > cur.val) {
        if (!cur.right) {
          cur.right = node;
          return this;
        }
        cur = cur.right;
      } else {
        return this; // 忽略重复值
      }
    }
  }

  search(val) {
    let cur = this.root;
    while (cur) {
      if (val === cur.val) return true;
      cur = val < cur.val ? cur.left : cur.right;
    }
    return false;
  }

  inorder(node = this.root, result = []) {
    if (!node) return result;
    this.inorder(node.left, result);
    result.push(node.val);
    this.inorder(node.right, result);
    return result;
  }
}`,
      python: `class BSTNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

class BinarySearchTree:
    def __init__(self):
        self.root = None

    def insert(self, val):
        node = BSTNode(val)
        if self.root is None:
            self.root = node
            return self

        cur = self.root
        while True:
            if val < cur.val:
                if cur.left is None:
                    cur.left = node
                    return self
                cur = cur.left
            elif val > cur.val:
                if cur.right is None:
                    cur.right = node
                    return self
                cur = cur.right
            else:
                return self  # 忽略重复值

    def search(self, val):
        cur = self.root
        while cur:
            if val == cur.val:
                return True
            cur = cur.left if val < cur.val else cur.right
        return False

    def inorder(self, node=None, result=None):
        if result is None:
            result = []
        if node is None:
            node = self.root
        if node is None:
            return result
        if node.left:
            self.inorder(node.left, result)
        result.append(node.val)
        if node.right:
            self.inorder(node.right, result)
        return result`,
    },
    visualizerType: 'tree',
  },
  {
    id: 'segment-tree',
    category: 'structures',
    name: '线段树',
    nameEn: 'Segment Tree',
    difficulty: 'hard',
    timeAvg: 'O(log n)',
    timeBest: 'O(1)',
    timeWorst: 'O(log n)',
    space: 'O(n)',
    tags: ['数据结构', '区间查询', '树', '更新'],
    summary: '支持区间查询与单点更新的高效树结构，常用于频繁查询场景。',
    description: `线段树适合“数组可修改 + 高频区间查询”的问题，比如区间和、区间最值、区间计数。

**核心能力**
- 建树：O(n)
- 单点更新：O(log n)
- 区间查询：O(log n)

**结构直观**
- 每个节点表示一个区间 [l, r]
- 叶子节点对应单个元素
- 父节点存左右子区间的聚合值（如和、最小值、最大值）

**常见扩展**
- 懒标记（Lazy Propagation）用于高效区间更新
- 可扩展到区间最值、区间 gcd、区间计数等`,
    steps: [
      '用递归将数组区间不断二分，建立线段树',
      '每个节点保存一个区间聚合值（如区间和）',
      '查询时根据目标区间与当前节点区间的关系递归下探',
      '完全覆盖直接返回，完全不相交返回单位元（如 0）',
      '单点更新时定位到叶子节点修改，再回溯更新祖先节点',
      '每次查询/更新最多经过树高层数，因此是 O(log n)',
    ],
    code: {
      javascript: `class SegmentTree {
  constructor(nums) {
    this.n = nums.length;
    this.tree = new Array(this.n * 4).fill(0);
    if (this.n > 0) this._build(nums, 1, 0, this.n - 1);
  }

  _build(nums, idx, left, right) {
    if (left === right) {
      this.tree[idx] = nums[left];
      return;
    }
    const mid = left + Math.floor((right - left) / 2);
    this._build(nums, idx * 2, left, mid);
    this._build(nums, idx * 2 + 1, mid + 1, right);
    this.tree[idx] = this.tree[idx * 2] + this.tree[idx * 2 + 1];
  }

  update(pos, val) {
    if (this.n === 0) return;
    this._update(1, 0, this.n - 1, pos, val);
  }

  _update(idx, left, right, pos, val) {
    if (left === right) {
      this.tree[idx] = val;
      return;
    }
    const mid = left + Math.floor((right - left) / 2);
    if (pos <= mid) this._update(idx * 2, left, mid, pos, val);
    else this._update(idx * 2 + 1, mid + 1, right, pos, val);
    this.tree[idx] = this.tree[idx * 2] + this.tree[idx * 2 + 1];
  }

  query(queryLeft, queryRight) {
    if (this.n === 0) return 0;
    return this._query(1, 0, this.n - 1, queryLeft, queryRight);
  }

  _query(idx, left, right, queryLeft, queryRight) {
    if (queryRight < left || right < queryLeft) return 0;
    if (queryLeft <= left && right <= queryRight) return this.tree[idx];
    const mid = left + Math.floor((right - left) / 2);
    return this._query(idx * 2, left, mid, queryLeft, queryRight)
      + this._query(idx * 2 + 1, mid + 1, right, queryLeft, queryRight);
  }
}`,
      python: `class SegmentTree:
    def __init__(self, nums):
        self.n = len(nums)
        self.tree = [0] * (self.n * 4)
        if self.n > 0:
            self._build(nums, 1, 0, self.n - 1)

    def _build(self, nums, idx, left, right):
        if left == right:
            self.tree[idx] = nums[left]
            return
        mid = left + (right - left) // 2
        self._build(nums, idx * 2, left, mid)
        self._build(nums, idx * 2 + 1, mid + 1, right)
        self.tree[idx] = self.tree[idx * 2] + self.tree[idx * 2 + 1]

    def update(self, pos, val):
        if self.n == 0:
            return
        self._update(1, 0, self.n - 1, pos, val)

    def _update(self, idx, left, right, pos, val):
        if left == right:
            self.tree[idx] = val
            return
        mid = left + (right - left) // 2
        if pos <= mid:
            self._update(idx * 2, left, mid, pos, val)
        else:
            self._update(idx * 2 + 1, mid + 1, right, pos, val)
        self.tree[idx] = self.tree[idx * 2] + self.tree[idx * 2 + 1]

    def query(self, ql, qr):
        if self.n == 0:
            return 0
        return self._query(1, 0, self.n - 1, ql, qr)

    def _query(self, idx, left, right, ql, qr):
        if qr < left or right < ql:
            return 0
        if ql <= left and right <= qr:
            return self.tree[idx]
        mid = left + (right - left) // 2
        return self._query(idx * 2, left, mid, ql, qr) + \\
               self._query(idx * 2 + 1, mid + 1, right, ql, qr)`,
    },
    visualizerType: 'tree',
  },

  // ─── Interview Hot: Searching ─────────────────────────────
  {
    id: 'kmp',
    category: 'searching',
    name: 'KMP 字符串匹配',
    nameEn: 'Knuth-Morris-Pratt (KMP)',
    difficulty: 'medium',
    timeAvg: 'O(n+m)',
    timeBest: 'O(m)',
    timeWorst: 'O(n+m)',
    space: 'O(m)',
    tags: ['搜索', '字符串', '模式匹配', '前缀函数'],
    summary: '通过前缀函数避免主串回退，实现线性时间模式匹配。',
    description: `KMP 是面试中高频的字符串匹配算法，核心价值在于“失配后不回退主串指针”。

**为什么朴素匹配慢？**
朴素算法在失配时会让主串指针回退，最坏可达 O(nm)。

**KMP 的关键优化**
- 预处理模式串，构建 lps（最长相等前后缀）数组
- 失配时根据 lps 调整模式串位置，而主串指针继续前进

**复杂度**
- 构建 lps：O(m)
- 扫描主串：O(n)
- 总复杂度：O(n+m)`,
    steps: [
      '预处理模式串，构建 lps 数组',
      '用 i 指向主串，j 指向模式串',
      '若 text[i] == pattern[j]，则 i++、j++',
      '若 j 到达模式串末尾，记录一次匹配并按 lps 回退 j',
      '若失配且 j>0，令 j=lps[j-1]；若 j==0，i++',
      '主串扫描结束后返回所有匹配起点',
    ],
    code: {
      javascript: `function buildLps(pattern) {
  const lps = new Array(pattern.length).fill(0);
  let len = 0;
  for (let i = 1; i < pattern.length; ) {
    if (pattern[i] === pattern[len]) {
      lps[i++] = ++len;
    } else if (len > 0) {
      len = lps[len - 1];
    } else {
      lps[i++] = 0;
    }
  }
  return lps;
}

function kmpSearch(text, pattern) {
  if (!pattern.length) return [];
  const lps = buildLps(pattern);
  const result = [];
  let i = 0, j = 0;

  while (i < text.length) {
    if (text[i] === pattern[j]) {
      i++;
      j++;
      if (j === pattern.length) {
        result.push(i - j);
        j = lps[j - 1];
      }
    } else if (j > 0) {
      j = lps[j - 1];
    } else {
      i++;
    }
  }
  return result;
}`,
      python: `def build_lps(pattern):
    lps = [0] * len(pattern)
    length = 0
    i = 1
    while i < len(pattern):
        if pattern[i] == pattern[length]:
            length += 1
            lps[i] = length
            i += 1
        elif length > 0:
            length = lps[length - 1]
        else:
            lps[i] = 0
            i += 1
    return lps

def kmp_search(text, pattern):
    if not pattern:
        return []
    lps = build_lps(pattern)
    result = []
    i = j = 0

    while i < len(text):
        if text[i] == pattern[j]:
            i += 1
            j += 1
            if j == len(pattern):
                result.append(i - j)
                j = lps[j - 1]
        elif j > 0:
            j = lps[j - 1]
        else:
            i += 1
    return result`,
    },
    visualizerType: 'search',
  },
  {
    id: 'sliding-window',
    category: 'searching',
    name: '滑动窗口',
    nameEn: 'Sliding Window',
    difficulty: 'medium',
    timeAvg: 'O(n)',
    timeBest: 'O(1)',
    timeWorst: 'O(n)',
    space: 'O(k)',
    tags: ['搜索', '双指针', '窗口', '哈希'],
    summary: '维护可移动窗口，在一次遍历中完成区间约束问题。',
    description: `滑动窗口是面试中最常考的技巧之一，适合“子数组/子串”问题。

**典型问题**
- 最长无重复子串
- 最小覆盖子串
- 长度固定窗口最大值
- 满足约束的最长/最短区间

**核心模板**
- 右指针扩张窗口，加入新元素
- 若违反约束，左指针收缩窗口直到恢复合法
- 在每次合法状态更新答案

该技巧通常把双层循环优化成线性复杂度 O(n)。`,
    steps: [
      '初始化左右指针 left=0, right=0 与辅助结构（计数表/集合）',
      '移动 right 扩张窗口，把新元素加入统计',
      '若窗口违反条件，循环移动 left 收缩窗口',
      '每次窗口合法时更新最优答案',
      '重复直到 right 到达末尾',
      '返回最优结果',
    ],
    code: {
      javascript: `// 例题：最长无重复子串
function lengthOfLongestSubstring(s) {
  let left = 0;
  let best = 0;
  const seen = new Map(); // 字符 -> 最近出现位置

  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    if (seen.has(ch) && seen.get(ch) >= left) {
      left = seen.get(ch) + 1; // 收缩窗口
    }
    seen.set(ch, right);
    best = Math.max(best, right - left + 1);
  }
  return best;
}`,
      python: `# 例题：最长无重复子串
def length_of_longest_substring(s):
    left = 0
    best = 0
    seen = {}  # 字符 -> 最近出现位置

    for right, ch in enumerate(s):
        if ch in seen and seen[ch] >= left:
            left = seen[ch] + 1  # 收缩窗口
        seen[ch] = right
        best = max(best, right - left + 1)
    return best`,
    },
    visualizerType: 'search',
  },

  // ─── Interview Hot: Graph ─────────────────────────────────
  {
    id: 'a-star',
    category: 'graph',
    name: 'A* 路径搜索',
    nameEn: 'A* Search',
    difficulty: 'hard',
    timeAvg: 'O((V+E) log V)',
    timeBest: 'O(E)',
    timeWorst: 'O((V+E) log V)',
    space: 'O(V)',
    tags: ['图', '最短路径', '启发式', '优先队列'],
    summary: '在 Dijkstra 基础上加入启发函数，更快逼近目标节点。',
    description: `A* 是工程里最常见的路径搜索算法之一，常用于地图导航、游戏寻路、机器人规划。

**估价函数**
f(n) = g(n) + h(n)
- g(n)：起点到当前点的真实代价
- h(n)：当前点到终点的启发式估计（如曼哈顿距离）

**与 Dijkstra 关系**
- 当 h(n)=0 时，A* 退化为 Dijkstra
- 合理启发函数能显著减少搜索节点数

**关键条件**
若 h(n) 不高估真实代价（可采纳），A* 可保证最优路径。`,
    steps: [
      '初始化 open 集合（优先队列）并放入起点',
      '维护 gScore 与 fScore，起点 g=0，f=h(start)',
      '每次取出 f 最小的节点 current',
      '若 current 是终点，按 parent 回溯得到路径',
      '遍历邻居，尝试用 current 更新其更小的 gScore',
      '更新后将邻居加入 open 集合，重复直到找到终点或集合为空',
    ],
    code: {
      javascript: `function aStar(graph, start, goal, heuristic) {
  // graph: { node: [[neighbor, weight], ...] }
  const g = {};
  const f = {};
  const parent = {};
  const open = [[heuristic(start, goal), start]];
  const closed = new Set();

  for (const node in graph) {
    g[node] = Infinity;
    f[node] = Infinity;
  }
  g[start] = 0;
  f[start] = heuristic(start, goal);

  while (open.length) {
    open.sort((a, b) => a[0] - b[0]);
    const [, cur] = open.shift();
    if (cur === goal) {
      const path = [];
      let p = goal;
      while (p !== undefined) {
        path.push(p);
        p = parent[p];
      }
      return { distance: g[goal], path: path.reverse() };
    }
    if (closed.has(cur)) continue;
    closed.add(cur);

    for (const [nb, w] of graph[cur] || []) {
      const tentative = g[cur] + w;
      if (tentative < g[nb]) {
        parent[nb] = cur;
        g[nb] = tentative;
        f[nb] = tentative + heuristic(nb, goal);
        open.push([f[nb], nb]);
      }
    }
  }
  return { distance: Infinity, path: [] };
}`,
      python: `import heapq

def a_star(graph, start, goal, heuristic):
    # graph: { node: [(neighbor, weight), ...] }
    g = {node: float('inf') for node in graph}
    f = {node: float('inf') for node in graph}
    parent = {}
    g[start] = 0
    f[start] = heuristic(start, goal)

    pq = [(f[start], start)]
    closed = set()

    while pq:
        _, cur = heapq.heappop(pq)
        if cur == goal:
            path = []
            p = goal
            while p in parent or p == start:
                path.append(p)
                if p == start:
                    break
                p = parent[p]
            return g[goal], list(reversed(path))

        if cur in closed:
            continue
        closed.add(cur)

        for nb, w in graph.get(cur, []):
            tentative = g[cur] + w
            if tentative < g[nb]:
                parent[nb] = cur
                g[nb] = tentative
                f[nb] = tentative + heuristic(nb, goal)
                heapq.heappush(pq, (f[nb], nb))

    return float('inf'), []`,
    },
    visualizerType: 'graph',
  },
  {
    id: 'floyd-warshall',
    category: 'graph',
    name: 'Floyd-Warshall 全源最短路',
    nameEn: 'Floyd-Warshall',
    difficulty: 'hard',
    timeAvg: 'O(V³)',
    timeBest: 'O(V³)',
    timeWorst: 'O(V³)',
    space: 'O(V²)',
    tags: ['图', '最短路径', '动态规划', '全源'],
    summary: '一次性求出任意两点最短路径，适合顶点数较小的稠密图。',
    description: `Floyd-Warshall 用三重循环求全源最短路，是图论里的经典动态规划算法。

**状态定义**
dist[i][j] 表示 i 到 j 的当前最短距离。

**转移思想**
依次尝试把每个顶点 k 作为中间点：
dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])

**适用场景**
- 需要频繁回答任意两点最短路查询
- 顶点规模不大（如 V <= 500）
- 稠密图或教学场景`,
    steps: [
      '初始化 dist 矩阵：有边则填权重，无边为 ∞，对角线为 0',
      '枚举中间点 k（0..V-1）',
      '对每组 (i,j) 尝试通过 k 中转',
      '若 dist[i][k] + dist[k][j] 更小，则更新 dist[i][j]',
      '循环结束后 dist 即任意两点最短距离',
      '若某点 dist[i][i] < 0，可判定存在负权环',
    ],
    code: {
      javascript: `function floydWarshall(matrix) {
  const n = matrix.length;
  const dist = matrix.map(row => [...row]);

  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (dist[i][k] !== Infinity && dist[k][j] !== Infinity) {
          dist[i][j] = Math.min(dist[i][j], dist[i][k] + dist[k][j]);
        }
      }
    }
  }
  return dist;
}`,
      python: `def floyd_warshall(matrix):
    n = len(matrix)
    dist = [row[:] for row in matrix]

    for k in range(n):
        for i in range(n):
            for j in range(n):
                if dist[i][k] != float('inf') and dist[k][j] != float('inf'):
                    dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])
    return dist`,
    },
    visualizerType: 'graph',
  },

  // ─── Interview Hot: Data Structures ───────────────────────
  {
    id: 'monotonic-stack',
    category: 'structures',
    name: '单调栈',
    nameEn: 'Monotonic Stack',
    difficulty: 'medium',
    timeAvg: 'O(n)',
    timeBest: 'O(n)',
    timeWorst: 'O(n)',
    space: 'O(n)',
    tags: ['数据结构', '栈', '单调', 'Next Greater'],
    summary: '维护单调性的栈结构，一次遍历解决“下一个更大/更小元素”问题。',
    description: `单调栈是刷题高频技巧，常用于“下一个更大元素”“每日温度”“柱状图最大矩形”等问题。

**核心原则**
- 维护一个单调递减或递增栈
- 遇到新元素时，持续弹出不满足单调性的栈顶
- 被弹出元素通常在此刻找到答案

**为何是 O(n)**
每个元素最多入栈一次、出栈一次，总操作次数线性。`,
    steps: [
      '初始化空栈，通常存索引而非值',
      '从左到右遍历数组元素',
      '当当前值打破栈的单调性时，循环弹栈并结算答案',
      '将当前索引压栈，等待未来元素结算',
      '遍历结束后，栈中剩余元素按题意填默认值',
      '输出每个位置对应的结果',
    ],
    code: {
      javascript: `// 例题：下一个更大元素（不存在则 -1）
function nextGreater(nums) {
  const n = nums.length;
  const ans = new Array(n).fill(-1);
  const stack = []; // 单调递减栈，存索引

  for (let i = 0; i < n; i++) {
    while (stack.length && nums[i] > nums[stack[stack.length - 1]]) {
      const idx = stack.pop();
      ans[idx] = nums[i];
    }
    stack.push(i);
  }
  return ans;
}`,
      python: `# 例题：下一个更大元素（不存在则 -1）
def next_greater(nums):
    n = len(nums)
    ans = [-1] * n
    stack = []  # 单调递减栈，存索引

    for i, val in enumerate(nums):
        while stack and val > nums[stack[-1]]:
            idx = stack.pop()
            ans[idx] = val
        stack.append(i)
    return ans`,
    },
    visualizerType: 'stack',
  },
  {
    id: 'lru-cache',
    category: 'structures',
    name: 'LRU 缓存',
    nameEn: 'LRU Cache',
    difficulty: 'hard',
    timeAvg: 'O(1)',
    timeBest: 'O(1)',
    timeWorst: 'O(1)',
    space: 'O(n)',
    tags: ['数据结构', '哈希', '双向链表', '缓存'],
    summary: '用哈希表 + 双向链表实现 O(1) 的 get/put，并淘汰最久未使用项。',
    description: `LRU（Least Recently Used）是系统设计与算法面试中的经典题型。

**目标**
在固定容量下支持：
- get(key)：读取并刷新为最近使用
- put(key,val)：写入，满容量时淘汰最久未使用项

**标准解法**
- 哈希表：key -> 链表节点，实现 O(1) 定位
- 双向链表：维护使用顺序，头部最新，尾部最旧

该组合保证 get/put 都为 O(1)。`,
    steps: [
      '初始化容量、哈希表和双向链表（含伪头尾节点）',
      'get：若 key 不存在返回 -1；存在则把节点移到头部后返回值',
      'put：若 key 已存在，更新值并移到头部',
      'put：若 key 不存在，创建节点插入头部并写入哈希表',
      '若超容量，删除尾部前节点（最久未使用）并从哈希表移除',
      '重复操作，始终保持链表顺序为“新 -> 旧”',
    ],
    code: {
      javascript: `class Node {
  constructor(key, val) {
    this.key = key;
    this.val = val;
    this.prev = null;
    this.next = null;
  }
}

class LRUCache {
  constructor(capacity) {
    this.cap = capacity;
    this.map = new Map();
    this.head = new Node(0, 0); // 伪头：最新
    this.tail = new Node(0, 0); // 伪尾：最旧
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  _remove(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  _addFront(node) {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next.prev = node;
    this.head.next = node;
  }

  get(key) {
    if (!this.map.has(key)) return -1;
    const node = this.map.get(key);
    this._remove(node);
    this._addFront(node);
    return node.val;
  }

  put(key, value) {
    if (this.map.has(key)) {
      const node = this.map.get(key);
      node.val = value;
      this._remove(node);
      this._addFront(node);
      return;
    }
    const node = new Node(key, value);
    this.map.set(key, node);
    this._addFront(node);

    if (this.map.size > this.cap) {
      const lru = this.tail.prev;
      this._remove(lru);
      this.map.delete(lru.key);
    }
  }
}`,
      python: `from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity):
        self.cap = capacity
        self.od = OrderedDict()

    def get(self, key):
        if key not in self.od:
            return -1
        self.od.move_to_end(key)  # 变为最近使用
        return self.od[key]

    def put(self, key, value):
        if key in self.od:
            self.od.move_to_end(key)
        self.od[key] = value
        if len(self.od) > self.cap:
            self.od.popitem(last=False)  # 淘汰最久未使用`,
    },
    visualizerType: 'hash',
  },
  {
    id: 'fenwick-tree',
    category: 'structures',
    name: '树状数组',
    nameEn: 'Fenwick Tree (BIT)',
    difficulty: 'hard',
    timeAvg: 'O(log n)',
    timeBest: 'O(1)',
    timeWorst: 'O(log n)',
    space: 'O(n)',
    tags: ['数据结构', '树状数组', '前缀和', '区间查询'],
    summary: '用低位 bit 技巧维护动态前缀和，支持 O(log n) 更新与查询。',
    description: `树状数组（Binary Indexed Tree, BIT）是线段树的轻量替代，特别适合前缀和场景。

**核心能力**
- 单点加法更新：O(log n)
- 前缀和查询：O(log n)
- 区间和查询：prefix(r) - prefix(l-1)

**lowbit 技巧**
lowbit(x) = x & -x，表示二进制最低位的 1 对应的值。  
它决定了每个节点负责的区间长度。`,
    steps: [
      '使用 1-indexed 数组 bit 存储结构信息',
      'update(i,delta)：循环 i += lowbit(i)，向上更新受影响节点',
      'query(i)：循环 i -= lowbit(i)，累加覆盖到的前缀块',
      'rangeSum(l,r) = query(r) - query(l-1)',
      '初始化时可逐个调用 update 构建',
      '所有操作仅沿二进制跳跃路径，复杂度 O(log n)',
    ],
    code: {
      javascript: `class FenwickTree {
  constructor(n) {
    this.n = n;
    this.bit = new Array(n + 1).fill(0);
  }

  _lowbit(x) {
    return x & -x;
  }

  update(index, delta) {
    for (let i = index; i <= this.n; i += this._lowbit(i)) {
      this.bit[i] += delta;
    }
  }

  query(index) {
    let sum = 0;
    for (let i = index; i > 0; i -= this._lowbit(i)) {
      sum += this.bit[i];
    }
    return sum;
  }

  rangeSum(left, right) {
    return this.query(right) - this.query(left - 1);
  }
}`,
      python: `class FenwickTree:
    def __init__(self, n):
        self.n = n
        self.bit = [0] * (n + 1)

    def _lowbit(self, x):
        return x & -x

    def update(self, index, delta):
        i = index
        while i <= self.n:
            self.bit[i] += delta
            i += self._lowbit(i)

    def query(self, index):
        s = 0
        i = index
        while i > 0:
            s += self.bit[i]
            i -= self._lowbit(i)
        return s

    def range_sum(self, left, right):
        return self.query(right) - self.query(left - 1)`,
    },
    visualizerType: 'tree',
  },
]

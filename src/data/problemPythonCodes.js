const PROBLEM_PYTHON_CODES = {
    '1': `class Solution:
    def twoSum(self, nums, target):
        seen = {}
        for i, x in enumerate(nums):
            y = target - x
            if y in seen:
                return [seen[y], i]
            seen[x] = i`,

    '49': `from collections import defaultdict

class Solution:
    def groupAnagrams(self, strs):
        groups = defaultdict(list)
        for s in strs:
            key = ''.join(sorted(s))
            groups[key].append(s)
        return list(groups.values())`,

    '128': `class Solution:
    def longestConsecutive(self, nums):
        s = set(nums)
        best = 0

        for x in s:
            if x - 1 in s:
                continue
            y = x
            while y in s:
                y += 1
            best = max(best, y - x)

        return best`,

    '238': `class Solution:
    def productExceptSelf(self, nums):
        n = len(nums)
        ans = [1] * n

        prefix = 1
        for i in range(n):
            ans[i] = prefix
            prefix *= nums[i]

        suffix = 1
        for i in range(n - 1, -1, -1):
            ans[i] *= suffix
            suffix *= nums[i]

        return ans`,

    '3': `class Solution:
    def lengthOfLongestSubstring(self, s):
        last_pos = {}
        left = 0
        best = 0

        for right, ch in enumerate(s):
            if ch in last_pos and last_pos[ch] >= left:
                left = last_pos[ch] + 1
            last_pos[ch] = right
            best = max(best, right - left + 1)

        return best`,

    '76': `from collections import Counter

class Solution:
    def minWindow(self, s, t):
        if not s or not t:
            return ''

        need = Counter(t)
        missing = len(t)
        left = 0
        best_len = float('inf')
        best_l = 0

        for right, ch in enumerate(s, 1):
            if need[ch] > 0:
                missing -= 1
            need[ch] -= 1

            while missing == 0:
                if right - left < best_len:
                    best_len = right - left
                    best_l = left

                left_ch = s[left]
                need[left_ch] += 1
                if need[left_ch] > 0:
                    missing += 1
                left += 1

        if best_len == float('inf'):
            return ''
        return s[best_l:best_l + best_len]`,

    '209': `class Solution:
    def minSubArrayLen(self, target, nums):
        left = 0
        total = 0
        ans = float('inf')

        for right, x in enumerate(nums):
            total += x
            while total >= target:
                ans = min(ans, right - left + 1)
                total -= nums[left]
                left += 1

        return 0 if ans == float('inf') else ans`,

    '42': `class Solution:
    def trap(self, height):
        left, right = 0, len(height) - 1
        left_max = 0
        right_max = 0
        water = 0

        while left < right:
            if height[left] < height[right]:
                left_max = max(left_max, height[left])
                water += left_max - height[left]
                left += 1
            else:
                right_max = max(right_max, height[right])
                water += right_max - height[right]
                right -= 1

        return water`,

    '704': `class Solution:
    def search(self, nums, target):
        left, right = 0, len(nums) - 1

        while left <= right:
            mid = left + (right - left) // 2
            if nums[mid] == target:
                return mid
            if nums[mid] < target:
                left = mid + 1
            else:
                right = mid - 1

        return -1`,

    '33': `class Solution:
    def search(self, nums, target):
        left, right = 0, len(nums) - 1

        while left <= right:
            mid = left + (right - left) // 2
            if nums[mid] == target:
                return mid

            if nums[left] <= nums[mid]:
                if nums[left] <= target < nums[mid]:
                    right = mid - 1
                else:
                    left = mid + 1
            else:
                if nums[mid] < target <= nums[right]:
                    left = mid + 1
                else:
                    right = mid - 1

        return -1`,

    '153': `class Solution:
    def findMin(self, nums):
        left, right = 0, len(nums) - 1

        while left < right:
            mid = left + (right - left) // 2
            if nums[mid] > nums[right]:
                left = mid + 1
            else:
                right = mid

        return nums[left]`,

    '875': `class Solution:
    def minEatingSpeed(self, piles, h):
        def can_finish(speed):
            total_hours = 0
            for p in piles:
                total_hours += (p + speed - 1) // speed
            return total_hours <= h

        left, right = 1, max(piles)
        while left < right:
            mid = left + (right - left) // 2
            if can_finish(mid):
                right = mid
            else:
                left = mid + 1

        return left`,

    '20': `class Solution:
    def isValid(self, s):
        pairs = {')': '(', ']': '[', '}': '{'}
        stack = []

        for ch in s:
            if ch in pairs.values():
                stack.append(ch)
            else:
                if not stack or stack[-1] != pairs[ch]:
                    return False
                stack.pop()

        return len(stack) == 0`,

    '155': `class MinStack:
    def __init__(self):
        self.stack = []
        self.min_stack = []

    def push(self, val):
        self.stack.append(val)
        if not self.min_stack:
            self.min_stack.append(val)
        else:
            self.min_stack.append(min(val, self.min_stack[-1]))

    def pop(self):
        self.stack.pop()
        self.min_stack.pop()

    def top(self):
        return self.stack[-1]

    def getMin(self):
        return self.min_stack[-1]`,

    '739': `class Solution:
    def dailyTemperatures(self, temperatures):
        n = len(temperatures)
        ans = [0] * n
        stack = []

        for i, t in enumerate(temperatures):
            while stack and temperatures[stack[-1]] < t:
                j = stack.pop()
                ans[j] = i - j
            stack.append(i)

        return ans`,

    '84': `class Solution:
    def largestRectangleArea(self, heights):
        arr = heights + [0]
        stack = []
        best = 0

        for i, h in enumerate(arr):
            while stack and arr[stack[-1]] > h:
                height = arr[stack.pop()]
                left = stack[-1] if stack else -1
                width = i - left - 1
                best = max(best, height * width)
            stack.append(i)

        return best`,

    '206': `class Solution:
    def reverseList(self, head):
        prev = None
        cur = head

        while cur:
            nxt = cur.next
            cur.next = prev
            prev = cur
            cur = nxt

        return prev`,

    '21': `class Solution:
    def mergeTwoLists(self, list1, list2):
        dummy = ListNode(0)
        tail = dummy

        while list1 and list2:
            if list1.val <= list2.val:
                tail.next = list1
                list1 = list1.next
            else:
                tail.next = list2
                list2 = list2.next
            tail = tail.next

        tail.next = list1 if list1 else list2
        return dummy.next`,

    '141': `class Solution:
    def hasCycle(self, head):
        slow = fast = head

        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
            if slow == fast:
                return True

        return False`,

    '142': `class Solution:
    def detectCycle(self, head):
        slow = fast = head

        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
            if slow == fast:
                p1, p2 = head, slow
                while p1 != p2:
                    p1 = p1.next
                    p2 = p2.next
                return p1

        return None`,

    '19': `class Solution:
    def removeNthFromEnd(self, head, n):
        dummy = ListNode(0, head)
        fast = slow = dummy

        for _ in range(n):
            fast = fast.next

        while fast.next:
            fast = fast.next
            slow = slow.next

        slow.next = slow.next.next
        return dummy.next`,

    '104': `class Solution:
    def maxDepth(self, root):
        if not root:
            return 0
        return 1 + max(self.maxDepth(root.left), self.maxDepth(root.right))`,

    '226': `class Solution:
    def invertTree(self, root):
        if not root:
            return None
        root.left, root.right = root.right, root.left
        self.invertTree(root.left)
        self.invertTree(root.right)
        return root`,

    '102': `from collections import deque

class Solution:
    def levelOrder(self, root):
        if not root:
            return []

        ans = []
        q = deque([root])

        while q:
            size = len(q)
            level = []
            for _ in range(size):
                node = q.popleft()
                level.append(node.val)
                if node.left:
                    q.append(node.left)
                if node.right:
                    q.append(node.right)
            ans.append(level)

        return ans`,

    '543': `class Solution:
    def diameterOfBinaryTree(self, root):
        best = 0

        def dfs(node):
            nonlocal best
            if not node:
                return 0
            left = dfs(node.left)
            right = dfs(node.right)
            best = max(best, left + right)
            return 1 + max(left, right)

        dfs(root)
        return best`,

    '94': `class Solution:
    def inorderTraversal(self, root):
        ans = []
        stack = []
        cur = root

        while stack or cur:
            while cur:
                stack.append(cur)
                cur = cur.left
            cur = stack.pop()
            ans.append(cur.val)
            cur = cur.right

        return ans`,

    '98': `class Solution:
    def isValidBST(self, root):
        def dfs(node, low, high):
            if not node:
                return True
            if not (low < node.val < high):
                return False
            return dfs(node.left, low, node.val) and dfs(node.right, node.val, high)

        return dfs(root, float('-inf'), float('inf'))`,

    '230': `class Solution:
    def kthSmallest(self, root, k):
        stack = []
        cur = root

        while stack or cur:
            while cur:
                stack.append(cur)
                cur = cur.left
            cur = stack.pop()
            k -= 1
            if k == 0:
                return cur.val
            cur = cur.right`,

    '236': `class Solution:
    def lowestCommonAncestor(self, root, p, q):
        if not root or root == p or root == q:
            return root

        left = self.lowestCommonAncestor(root.left, p, q)
        right = self.lowestCommonAncestor(root.right, p, q)

        if left and right:
            return root
        return left or right`,

    '105': `class Solution:
    def buildTree(self, preorder, inorder):
        index = {v: i for i, v in enumerate(inorder)}
        pre_idx = 0

        def helper(left, right):
            nonlocal pre_idx
            if left > right:
                return None

            root_val = preorder[pre_idx]
            pre_idx += 1
            root = TreeNode(root_val)

            mid = index[root_val]
            root.left = helper(left, mid - 1)
            root.right = helper(mid + 1, right)
            return root

        return helper(0, len(inorder) - 1)`,

    '200': `class Solution:
    def numIslands(self, grid):
        if not grid:
            return 0

        rows, cols = len(grid), len(grid[0])

        def dfs(r, c):
            if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != '1':
                return
            grid[r][c] = '0'
            dfs(r + 1, c)
            dfs(r - 1, c)
            dfs(r, c + 1)
            dfs(r, c - 1)

        count = 0
        for r in range(rows):
            for c in range(cols):
                if grid[r][c] == '1':
                    count += 1
                    dfs(r, c)

        return count`,

    '133': `from collections import deque

class Solution:
    def cloneGraph(self, node):
        if not node:
            return None

        clones = {node: Node(node.val)}
        q = deque([node])

        while q:
            cur = q.popleft()
            for nei in cur.neighbors:
                if nei not in clones:
                    clones[nei] = Node(nei.val)
                    q.append(nei)
                clones[cur].neighbors.append(clones[nei])

        return clones[node]`,

    '207': `from collections import deque

class Solution:
    def canFinish(self, numCourses, prerequisites):
        graph = [[] for _ in range(numCourses)]
        indeg = [0] * numCourses

        for course, pre in prerequisites:
            graph[pre].append(course)
            indeg[course] += 1

        q = deque(i for i in range(numCourses) if indeg[i] == 0)
        taken = 0

        while q:
            u = q.popleft()
            taken += 1
            for v in graph[u]:
                indeg[v] -= 1
                if indeg[v] == 0:
                    q.append(v)

        return taken == numCourses`,

    '210': `from collections import deque

class Solution:
    def findOrder(self, numCourses, prerequisites):
        graph = [[] for _ in range(numCourses)]
        indeg = [0] * numCourses

        for course, pre in prerequisites:
            graph[pre].append(course)
            indeg[course] += 1

        q = deque(i for i in range(numCourses) if indeg[i] == 0)
        order = []

        while q:
            u = q.popleft()
            order.append(u)
            for v in graph[u]:
                indeg[v] -= 1
                if indeg[v] == 0:
                    q.append(v)

        return order if len(order) == numCourses else []`,

    '994': `from collections import deque

class Solution:
    def orangesRotting(self, grid):
        rows, cols = len(grid), len(grid[0])
        q = deque()
        fresh = 0

        for r in range(rows):
            for c in range(cols):
                if grid[r][c] == 2:
                    q.append((r, c))
                elif grid[r][c] == 1:
                    fresh += 1

        if fresh == 0:
            return 0

        minutes = 0
        dirs = ((1, 0), (-1, 0), (0, 1), (0, -1))

        while q and fresh > 0:
            for _ in range(len(q)):
                r, c = q.popleft()
                for dr, dc in dirs:
                    nr, nc = r + dr, c + dc
                    if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:
                        grid[nr][nc] = 2
                        fresh -= 1
                        q.append((nr, nc))
            minutes += 1

        return minutes if fresh == 0 else -1`,

    '743': `import heapq
from collections import defaultdict

class Solution:
    def networkDelayTime(self, times, n, k):
        graph = defaultdict(list)
        for u, v, w in times:
            graph[u].append((v, w))

        dist = [float('inf')] * (n + 1)
        dist[k] = 0
        pq = [(0, k)]

        while pq:
            d, u = heapq.heappop(pq)
            if d > dist[u]:
                continue
            for v, w in graph[u]:
                nd = d + w
                if nd < dist[v]:
                    dist[v] = nd
                    heapq.heappush(pq, (nd, v))

        ans = max(dist[1:])
        return -1 if ans == float('inf') else ans`,

    '684': `class DSU:
    def __init__(self, n):
        self.parent = list(range(n + 1))
        self.rank = [0] * (n + 1)

    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra == rb:
            return False
        if self.rank[ra] < self.rank[rb]:
            ra, rb = rb, ra
        self.parent[rb] = ra
        if self.rank[ra] == self.rank[rb]:
            self.rank[ra] += 1
        return True

class Solution:
    def findRedundantConnection(self, edges):
        dsu = DSU(len(edges))
        for u, v in edges:
            if not dsu.union(u, v):
                return [u, v]`,

    '1584': `class Solution:
    def minCostConnectPoints(self, points):
        n = len(points)
        in_mst = [False] * n
        min_dist = [float('inf')] * n
        min_dist[0] = 0
        ans = 0

        for _ in range(n):
            u = -1
            for i in range(n):
                if not in_mst[i] and (u == -1 or min_dist[i] < min_dist[u]):
                    u = i

            in_mst[u] = True
            ans += min_dist[u]
            x1, y1 = points[u]

            for v in range(n):
                if not in_mst[v]:
                    x2, y2 = points[v]
                    d = abs(x1 - x2) + abs(y1 - y2)
                    if d < min_dist[v]:
                        min_dist[v] = d

        return ans`,

    '1631': `import heapq

class Solution:
    def minimumEffortPath(self, heights):
        rows, cols = len(heights), len(heights[0])
        dist = [[float('inf')] * cols for _ in range(rows)]
        dist[0][0] = 0

        pq = [(0, 0, 0)]
        dirs = ((1, 0), (-1, 0), (0, 1), (0, -1))

        while pq:
            effort, r, c = heapq.heappop(pq)
            if (r, c) == (rows - 1, cols - 1):
                return effort
            if effort > dist[r][c]:
                continue

            for dr, dc in dirs:
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols:
                    nxt = max(effort, abs(heights[nr][nc] - heights[r][c]))
                    if nxt < dist[nr][nc]:
                        dist[nr][nc] = nxt
                        heapq.heappush(pq, (nxt, nr, nc))

        return 0`,

    '70': `class Solution:
    def climbStairs(self, n):
        if n <= 2:
            return n
        a, b = 1, 2
        for _ in range(3, n + 1):
            a, b = b, a + b
        return b`,

    '198': `class Solution:
    def rob(self, nums):
        prev2 = 0
        prev1 = 0

        for x in nums:
            prev2, prev1 = prev1, max(prev1, prev2 + x)

        return prev1`,

    '213': `class Solution:
    def rob(self, nums):
        if len(nums) == 1:
            return nums[0]

        def rob_linear(arr):
            prev2 = 0
            prev1 = 0
            for x in arr:
                prev2, prev1 = prev1, max(prev1, prev2 + x)
            return prev1

        return max(rob_linear(nums[:-1]), rob_linear(nums[1:]))`,

    '322': `class Solution:
    def coinChange(self, coins, amount):
        dp = [float('inf')] * (amount + 1)
        dp[0] = 0

        for x in range(1, amount + 1):
            for c in coins:
                if x >= c:
                    dp[x] = min(dp[x], dp[x - c] + 1)

        return -1 if dp[amount] == float('inf') else dp[amount]`,

    '139': `class Solution:
    def wordBreak(self, s, wordDict):
        words = set(wordDict)
        n = len(s)
        dp = [False] * (n + 1)
        dp[0] = True

        for i in range(1, n + 1):
            for j in range(i):
                if dp[j] and s[j:i] in words:
                    dp[i] = True
                    break

        return dp[n]`,

    '300': `from bisect import bisect_left

class Solution:
    def lengthOfLIS(self, nums):
        tails = []

        for x in nums:
            i = bisect_left(tails, x)
            if i == len(tails):
                tails.append(x)
            else:
                tails[i] = x

        return len(tails)`,

    '1143': `class Solution:
    def longestCommonSubsequence(self, text1, text2):
        m, n = len(text1), len(text2)
        dp = [[0] * (n + 1) for _ in range(m + 1)]

        for i in range(1, m + 1):
            for j in range(1, n + 1):
                if text1[i - 1] == text2[j - 1]:
                    dp[i][j] = dp[i - 1][j - 1] + 1
                else:
                    dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])

        return dp[m][n]`,

    '72': `class Solution:
    def minDistance(self, word1, word2):
        m, n = len(word1), len(word2)
        dp = [[0] * (n + 1) for _ in range(m + 1)]

        for i in range(m + 1):
            dp[i][0] = i
        for j in range(n + 1):
            dp[0][j] = j

        for i in range(1, m + 1):
            for j in range(1, n + 1):
                if word1[i - 1] == word2[j - 1]:
                    dp[i][j] = dp[i - 1][j - 1]
                else:
                    dp[i][j] = 1 + min(
                        dp[i - 1][j],
                        dp[i][j - 1],
                        dp[i - 1][j - 1],
                    )

        return dp[m][n]`,

    '516': `class Solution:
    def longestPalindromeSubseq(self, s):
        n = len(s)
        dp = [[0] * n for _ in range(n)]

        for i in range(n - 1, -1, -1):
            dp[i][i] = 1
            for j in range(i + 1, n):
                if s[i] == s[j]:
                    dp[i][j] = dp[i + 1][j - 1] + 2
                else:
                    dp[i][j] = max(dp[i + 1][j], dp[i][j - 1])

        return dp[0][n - 1]`,

    '46': `class Solution:
    def permute(self, nums):
        ans = []
        used = [False] * len(nums)
        path = []

        def backtrack():
            if len(path) == len(nums):
                ans.append(path[:])
                return

            for i, x in enumerate(nums):
                if used[i]:
                    continue
                used[i] = True
                path.append(x)
                backtrack()
                path.pop()
                used[i] = False

        backtrack()
        return ans`,

    '78': `class Solution:
    def subsets(self, nums):
        ans = []
        path = []

        def backtrack(start):
            ans.append(path[:])
            for i in range(start, len(nums)):
                path.append(nums[i])
                backtrack(i + 1)
                path.pop()

        backtrack(0)
        return ans`,

    '39': `class Solution:
    def combinationSum(self, candidates, target):
        candidates.sort()
        ans = []
        path = []

        def backtrack(start, remain):
            if remain == 0:
                ans.append(path[:])
                return

            for i in range(start, len(candidates)):
                x = candidates[i]
                if x > remain:
                    break
                path.append(x)
                backtrack(i, remain - x)
                path.pop()

        backtrack(0, target)
        return ans`,

    '22': `class Solution:
    def generateParenthesis(self, n):
        ans = []
        path = []

        def backtrack(left_used, right_used):
            if len(path) == 2 * n:
                ans.append(''.join(path))
                return

            if left_used < n:
                path.append('(')
                backtrack(left_used + 1, right_used)
                path.pop()

            if right_used < left_used:
                path.append(')')
                backtrack(left_used, right_used + 1)
                path.pop()

        backtrack(0, 0)
        return ans`,

    '79': `class Solution:
    def exist(self, board, word):
        rows, cols = len(board), len(board[0])

        def dfs(r, c, k):
            if k == len(word):
                return True
            if r < 0 or r >= rows or c < 0 or c >= cols:
                return False
            if board[r][c] != word[k]:
                return False

            tmp = board[r][c]
            board[r][c] = '#'
            found = (
                dfs(r + 1, c, k + 1) or
                dfs(r - 1, c, k + 1) or
                dfs(r, c + 1, k + 1) or
                dfs(r, c - 1, k + 1)
            )
            board[r][c] = tmp
            return found

        for r in range(rows):
            for c in range(cols):
                if dfs(r, c, 0):
                    return True

        return False`,

    '215': `import heapq

class Solution:
    def findKthLargest(self, nums, k):
        heap = []
        for x in nums:
            heapq.heappush(heap, x)
            if len(heap) > k:
                heapq.heappop(heap)
        return heap[0]`,

    '347': `from collections import Counter
import heapq

class Solution:
    def topKFrequent(self, nums, k):
        freq = Counter(nums)
        return [x for x, _ in heapq.nlargest(k, freq.items(), key=lambda p: p[1])]`,

    '295': `import heapq

class MedianFinder:
    def __init__(self):
        self.small = []  # max-heap via negative values
        self.large = []  # min-heap

    def addNum(self, num):
        heapq.heappush(self.small, -num)
        heapq.heappush(self.large, -heapq.heappop(self.small))

        if len(self.large) > len(self.small):
            heapq.heappush(self.small, -heapq.heappop(self.large))

    def findMedian(self):
        if len(self.small) > len(self.large):
            return float(-self.small[0])
        return (-self.small[0] + self.large[0]) / 2.0`,

    '146': `from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity):
        self.capacity = capacity
        self.cache = OrderedDict()

    def get(self, key):
        if key not in self.cache:
            return -1
        self.cache.move_to_end(key)
        return self.cache[key]

    def put(self, key, value):
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.capacity:
            self.cache.popitem(last=False)`,

    '11': `class Solution:
    def maxArea(self, height):
        left, right = 0, len(height) - 1
        best = 0

        while left < right:
            width = right - left
            h = min(height[left], height[right])
            best = max(best, width * h)

            if height[left] < height[right]:
                left += 1
            else:
                right -= 1

        return best`,

    '15': `class Solution:
    def threeSum(self, nums):
        nums.sort()
        n = len(nums)
        ans = []

        for i in range(n):
            if i > 0 and nums[i] == nums[i - 1]:
                continue

            left, right = i + 1, n - 1
            while left < right:
                s = nums[i] + nums[left] + nums[right]
                if s == 0:
                    ans.append([nums[i], nums[left], nums[right]])
                    left += 1
                    right -= 1
                    while left < right and nums[left] == nums[left - 1]:
                        left += 1
                    while left < right and nums[right] == nums[right + 1]:
                        right -= 1
                elif s < 0:
                    left += 1
                else:
                    right -= 1

        return ans`,

    '121': `class Solution:
    def maxProfit(self, prices):
        min_price = float('inf')
        best = 0

        for p in prices:
            min_price = min(min_price, p)
            best = max(best, p - min_price)

        return best`,

    '56': `class Solution:
    def merge(self, intervals):
        intervals.sort(key=lambda x: x[0])
        merged = []

        for start, end in intervals:
            if not merged or start > merged[-1][1]:
                merged.append([start, end])
            else:
                merged[-1][1] = max(merged[-1][1], end)

        return merged`,
}

function toSnakeCase(title = '') {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '') || 'solve'
}

function getGenericPythonCode(task) {
    const fnName = toSnakeCase(task?.title || 'solve')
    return `def ${fnName}(data):\n    # TODO: 实现该题 Python 解法\n    return data`
}

export function getProblemPythonCode(task) {
    if (!task || !task.id) return getGenericPythonCode(task)
    return PROBLEM_PYTHON_CODES[task.id] || getGenericPythonCode(task)
}

export { PROBLEM_PYTHON_CODES }

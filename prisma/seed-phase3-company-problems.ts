/**
 * prisma/seed-phase3-company-problems.ts
 *
 * 15 new Phase 3 problems specifically chosen based on real 2024-25
 * Indian company interview data (Amazon, Google, Flipkart, Microsoft)
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface ProblemSeed {
  slug: string;
  title: string;
  description: string;
  difficulty: string;
  pattern: string;
  category: string;
  phase: number;
  weekNumber: number;
  timeComplexity: string;
  spaceComplexity: string;
  correctPattern: string;
  correctTimeComplexity: string;
  correctSpaceComplexity: string;
  companies: string;
  companyTags: string;
  starterCode: string;
  solutionCode: string;
  testCases: string;
  hiddenTestCases: string;
  hints: string;
}

const problems: ProblemSeed[] = [
  // ── 1. Maximum Level Sum of Binary Tree (Amazon favourite) ─────────────────
  {
    slug: "maximum-level-sum-binary-tree",
    title: "Maximum Level Sum of Binary Tree",
    description: `Given the root of a binary tree, return the smallest level x such that the sum of all the values of nodes at level x is maximum.

The root is at level 1. The level of a node is 1 + the level of its parent.`,
    difficulty: "Medium",
    pattern: "trees",
    category: "trees",
    phase: 3,
    weekNumber: 1,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    correctPattern: "BFS",
    correctTimeComplexity: "O(n)",
    correctSpaceComplexity: "O(n)",
    companies: JSON.stringify(["Amazon", "Google", "Microsoft"]),
    companyTags: "Amazon,Google,Microsoft",
    starterCode: `from collections import deque

def max_level_sum(root):
    """
    Return the smallest level with maximum sum.
    Level 1 = root.
    
    Example:
        Tree: [1, 7, 0, 7, -8, null, null]
        Returns: 2  (level 2 sum = 7+0 = 7, level 1 = 1, level 3 = 7-8 = -1)
    """
    pass

import json, sys

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def build_tree(vals):
    if not vals: return None
    root = TreeNode(vals[0])
    q = deque([root])
    i = 1
    while q and i < len(vals):
        node = q.popleft()
        if i < len(vals) and vals[i] is not None:
            node.left = TreeNode(vals[i])
            q.append(node.left)
        i += 1
        if i < len(vals) and vals[i] is not None:
            node.right = TreeNode(vals[i])
            q.append(node.right)
        i += 1
    return root

data = json.loads(input())
root = build_tree(data["root"])
print(json.dumps(max_level_sum(root)))`,
    solutionCode: `from collections import deque

def max_level_sum(root):
    if not root: return 1
    q = deque([root])
    level = 0
    best_level = 1
    best_sum = float('-inf')
    while q:
        level += 1
        level_sum = 0
        for _ in range(len(q)):
            node = q.popleft()
            level_sum += node.val
            if node.left: q.append(node.left)
            if node.right: q.append(node.right)
        if level_sum > best_sum:
            best_sum = level_sum
            best_level = level
    return best_level`,
    testCases: JSON.stringify([
      { input: '{"root": [1, 7, 0, 7, -8, null, null]}', expected: "2" },
      { input: '{"root": [989, null, 10250, 98693, -89388, null, null, null, -32127]}', expected: "2" },
      { input: '{"root": [1]}', expected: "1" },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: '{"root": [1, 2, 3, 4, 5, 6, 7]}', expected: "3" },
      { input: '{"root": [-1, -2, -3]}', expected: "1" },
    ]),
    hints: JSON.stringify([
      "Use BFS to traverse level by level.",
      "Track the sum of each level's node values.",
      "Return the smallest level index that has the maximum sum.",
    ]),
  },

  // ── 2. Find All Anagrams in a String (Amazon OA classic) ──────────────────
  {
    slug: "find-all-anagrams-in-string",
    title: "Find All Anagrams in a String",
    description: `Given two strings s and p, return an array of all the start indices of p's anagrams in s.

An anagram is a rearrangement of all characters of a word using each character exactly once.`,
    difficulty: "Medium",
    pattern: "sliding-window",
    category: "strings",
    phase: 3,
    weekNumber: 1,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    correctPattern: "SlidingWindow",
    correctTimeComplexity: "O(n)",
    correctSpaceComplexity: "O(1)",
    companies: JSON.stringify(["Amazon", "Google", "Microsoft", "Flipkart"]),
    companyTags: "Amazon,Google,Microsoft,Flipkart",
    starterCode: `def find_anagrams(s: str, p: str) -> list:
    """
    Find all start indices of p's anagrams in s.
    
    Example:
        find_anagrams("cbaebabacd", "abc") -> [0, 6]
        find_anagrams("abab", "ab") -> [0, 1, 2]
    """
    pass

import json
data = json.loads(input())
print(json.dumps(find_anagrams(data["s"], data["p"])))`,
    solutionCode: `from collections import Counter

def find_anagrams(s: str, p: str) -> list:
    if len(p) > len(s): return []
    p_count = Counter(p)
    window = Counter(s[:len(p)])
    result = []
    if window == p_count: result.append(0)
    for i in range(len(p), len(s)):
        window[s[i]] += 1
        left = s[i - len(p)]
        window[left] -= 1
        if window[left] == 0: del window[left]
        if window == p_count: result.append(i - len(p) + 1)
    return result`,
    testCases: JSON.stringify([
      { input: '{"s": "cbaebabacd", "p": "abc"}', expected: "[0, 6]" },
      { input: '{"s": "abab", "p": "ab"}', expected: "[0, 1, 2]" },
      { input: '{"s": "aa", "p": "bb"}', expected: "[]" },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: '{"s": "baa", "p": "aa"}', expected: "[1]" },
      { input: '{"s": "aaaaaaaaaa", "p": "aaaaaaaaaa"}', expected: "[0]" },
    ]),
    hints: JSON.stringify([
      "Use a fixed-size sliding window equal to len(p).",
      "Track character frequencies using a Counter.",
      "Slide the window and update counts in O(1) per step.",
    ]),
  },

  // ── 3. Minimum Height Trees (Amazon Medium) ────────────────────────────────
  {
    slug: "minimum-height-trees",
    title: "Minimum Height Trees",
    description: `A tree is an undirected graph with n nodes labeled from 0 to n-1 and exactly n-1 edges.

Given n and a list of edges, return a list of all nodes that can be the root of a minimum height tree.

The height of a rooted tree is the number of edges on the longest downward path from the root to a leaf.`,
    difficulty: "Medium",
    pattern: "graphs",
    category: "graphs",
    phase: 3,
    weekNumber: 1,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    correctPattern: "TopologicalSort",
    correctTimeComplexity: "O(n)",
    correctSpaceComplexity: "O(n)",
    companies: JSON.stringify(["Amazon", "Google"]),
    companyTags: "Amazon,Google",
    starterCode: `from collections import deque

def find_min_height_trees(n: int, edges: list) -> list:
    """
    Return roots of all minimum-height trees.
    
    Example:
        find_min_height_trees(4, [[1,0],[1,2],[1,3]]) -> [1]
        find_min_height_trees(6, [[3,0],[3,1],[3,2],[3,4],[5,4]]) -> [3, 4]
    """
    pass

import json
data = json.loads(input())
print(json.dumps(find_min_height_trees(data["n"], data["edges"])))`,
    solutionCode: `from collections import deque, defaultdict

def find_min_height_trees(n: int, edges: list) -> list:
    if n == 1: return [0]
    adj = defaultdict(set)
    for u, v in edges:
        adj[u].add(v)
        adj[v].add(u)
    leaves = deque(node for node in range(n) if len(adj[node]) == 1)
    remaining = n
    while remaining > 2:
        remaining -= len(leaves)
        new_leaves = deque()
        while leaves:
            leaf = leaves.popleft()
            neighbor = adj[leaf].pop()
            adj[neighbor].discard(leaf)
            if len(adj[neighbor]) == 1:
                new_leaves.append(neighbor)
        leaves = new_leaves
    return list(leaves)`,
    testCases: JSON.stringify([
      { input: '{"n": 4, "edges": [[1,0],[1,2],[1,3]]}', expected: "[1]" },
      { input: '{"n": 6, "edges": [[3,0],[3,1],[3,2],[3,4],[5,4]]}', expected: "[3, 4]" },
      { input: '{"n": 1, "edges": []}', expected: "[0]" },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: '{"n": 2, "edges": [[0,1]]}', expected: "[0, 1]" },
    ]),
    hints: JSON.stringify([
      "The center node(s) of the tree are always the answer.",
      "Trim leaves iteratively — like topological sort but from the outside in.",
      "Stop when 1 or 2 nodes remain.",
    ]),
  },

  // ── 4. Cheapest Flights Within K Stops (Amazon + Flipkart) ────────────────
  {
    slug: "cheapest-flights-within-k-stops",
    title: "Cheapest Flights Within K Stops",
    description: `There are n cities connected by some flights. You are given an array flights where flights[i] = [fromi, toi, pricei].

Given n, flights, src, dst, and k, return the cheapest price from src to dst with at most k stops. If there is no such route, return -1.`,
    difficulty: "Medium",
    pattern: "graphs",
    category: "graphs",
    phase: 3,
    weekNumber: 1,
    timeComplexity: "O(k * E)",
    spaceComplexity: "O(n)",
    correctPattern: "Bellman-Ford",
    correctTimeComplexity: "O(k*E)",
    correctSpaceComplexity: "O(n)",
    companies: JSON.stringify(["Amazon", "Flipkart", "Google"]),
    companyTags: "Amazon,Flipkart,Google",
    starterCode: `def find_cheapest_price(n: int, flights: list, src: int, dst: int, k: int) -> int:
    """
    Find cheapest price from src to dst with at most k stops.
    
    Example:
        n=4, flights=[[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]]
        src=0, dst=3, k=1 -> 700
    """
    pass

import json
data = json.loads(input())
print(json.dumps(find_cheapest_price(data["n"], data["flights"], data["src"], data["dst"], data["k"])))`,
    solutionCode: `def find_cheapest_price(n: int, flights: list, src: int, dst: int, k: int) -> int:
    # Bellman-Ford: k+1 relaxations
    prices = [float('inf')] * n
    prices[src] = 0
    for _ in range(k + 1):
        temp = prices[:]
        for u, v, price in flights:
            if prices[u] != float('inf') and prices[u] + price < temp[v]:
                temp[v] = prices[u] + price
        prices = temp
    return prices[dst] if prices[dst] != float('inf') else -1`,
    testCases: JSON.stringify([
      { input: '{"n": 4, "flights": [[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]], "src": 0, "dst": 3, "k": 1}', expected: "700" },
      { input: '{"n": 3, "flights": [[0,1,100],[1,2,100],[0,2,500]], "src": 0, "dst": 2, "k": 1}', expected: "200" },
      { input: '{"n": 3, "flights": [[0,1,100],[1,2,100],[0,2,500]], "src": 0, "dst": 2, "k": 0}', expected: "500" },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: '{"n": 5, "flights": [[0,1,5],[1,2,5],[0,3,2],[3,1,2],[1,4,1],[4,2,1]], "src": 0, "dst": 2, "k": 2}', expected: "7" },
    ]),
    hints: JSON.stringify([
      "Use Bellman-Ford with exactly k+1 relaxation rounds.",
      "Copy the prices array before each relaxation to avoid using updated values in the same round.",
      "Each round represents one additional stop.",
    ]),
  },

  // ── 5. Car Fleet (Amazon Monotonic Stack) ─────────────────────────────────
  {
    slug: "car-fleet",
    title: "Car Fleet",
    description: `There are n cars going to the same destination at a single-lane road. You are given two integer arrays position and speed, both of length n, where position[i] is the starting position and speed[i] is the speed of the ith car.

A car can never pass another car ahead of it, but they can catch up and drive bumper to bumper as one fleet.

Return the number of car fleets that will arrive at the destination.`,
    difficulty: "Medium",
    pattern: "stack",
    category: "stack",
    phase: 3,
    weekNumber: 1,
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    correctPattern: "MonotonicStack",
    correctTimeComplexity: "O(n log n)",
    correctSpaceComplexity: "O(n)",
    companies: JSON.stringify(["Amazon", "Google"]),
    companyTags: "Amazon,Google",
    starterCode: `def car_fleet(target: int, position: list, speed: list) -> int:
    """
    Return the number of car fleets that arrive at the destination.
    
    Example:
        car_fleet(12, [10, 8, 0, 5, 3], [2, 4, 1, 1, 3]) -> 3
    """
    pass

import json
data = json.loads(input())
print(json.dumps(car_fleet(data["target"], data["position"], data["speed"])))`,
    solutionCode: `def car_fleet(target: int, position: list, speed: list) -> int:
    pairs = sorted(zip(position, speed), reverse=True)
    stack = []
    for pos, spd in pairs:
        time = (target - pos) / spd
        stack.append(time)
        if len(stack) >= 2 and stack[-1] <= stack[-2]:
            stack.pop()
    return len(stack)`,
    testCases: JSON.stringify([
      { input: '{"target": 12, "position": [10, 8, 0, 5, 3], "speed": [2, 4, 1, 1, 3]}', expected: "3" },
      { input: '{"target": 10, "position": [3], "speed": [3]}', expected: "1" },
      { input: '{"target": 100, "position": [0, 2, 4], "speed": [4, 2, 1]}', expected: "1" },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: '{"target": 10, "position": [6, 8], "speed": [3, 2]}', expected: "2" },
    ]),
    hints: JSON.stringify([
      "Sort cars by position in descending order (closest to target first).",
      "Calculate time for each car to reach target.",
      "If a car behind reaches target faster than the car in front, they form a fleet.",
    ]),
  },

  // ── 6. Word Search II (Google Hard — Trie + DFS) ──────────────────────────
  {
    slug: "word-search-ii",
    title: "Word Search II",
    description: `Given an m x n board of characters and a list of words, return all words on the board.

Each word must be constructed from letters of sequentially adjacent cells. The same letter cell may not be used more than once in a word.`,
    difficulty: "Hard",
    pattern: "trie",
    category: "trie",
    phase: 3,
    weekNumber: 2,
    timeComplexity: "O(m * n * 4^L)",
    spaceComplexity: "O(W * L)",
    correctPattern: "Trie",
    correctTimeComplexity: "O(m*n*4^L)",
    correctSpaceComplexity: "O(W*L)",
    companies: JSON.stringify(["Google", "Amazon", "Microsoft"]),
    companyTags: "Google,Amazon,Microsoft",
    starterCode: `def find_words(board: list, words: list) -> list:
    """
    Find all words from the list that exist on the board.
    
    Example:
        board = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]]
        words = ["oath","pea","eat","rain"]
        Returns: ["eat", "oath"]
    """
    pass

import json
data = json.loads(input())
result = find_words(data["board"], data["words"])
print(json.dumps(sorted(result)))`,
    solutionCode: `def find_words(board: list, words: list) -> list:
    trie = {}
    for word in words:
        node = trie
        for ch in word:
            node = node.setdefault(ch, {})
        node['#'] = word
    
    rows, cols = len(board), len(board[0])
    result = set()
    
    def dfs(r, c, node):
        ch = board[r][c]
        if ch not in node: return
        next_node = node[ch]
        if '#' in next_node:
            result.add(next_node['#'])
        board[r][c] = '#'
        for dr, dc in [(0,1),(0,-1),(1,0),(-1,0)]:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and board[nr][nc] != '#':
                dfs(nr, nc, next_node)
        board[r][c] = ch
    
    for r in range(rows):
        for c in range(cols):
            dfs(r, c, trie)
    return list(result)`,
    testCases: JSON.stringify([
      { input: '{"board": [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], "words": ["oath","pea","eat","rain"]}', expected: '["eat", "oath"]' },
      { input: '{"board": [["a","b"],["c","d"]], "words": ["abcd"]}', expected: '[]' },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: '{"board": [["a"]], "words": ["a"]}', expected: '["a"]' },
    ]),
    hints: JSON.stringify([
      "Build a Trie from all the words for fast prefix matching.",
      "DFS from every cell, checking if the current path is a valid Trie prefix.",
      "Mark visited cells temporarily with '#' to avoid reuse.",
    ]),
  },

  // ── 7. Design Twitter (Amazon System Design Coding) ───────────────────────
  {
    slug: "design-twitter",
    title: "Design Twitter",
    description: `Design a simplified version of Twitter where users can post tweets, follow/unfollow another user, and see the 10 most recent tweets in the user's news feed.

Implement the Twitter class with these methods:
- postTweet(userId, tweetId): Compose a new tweet
- getNewsFeed(userId): Return the 10 most recent tweet IDs in the user's news feed (tweets from people they follow + own tweets)
- follow(followerId, followeeId): Follow another user
- unfollow(followerId, followeeId): Unfollow another user`,
    difficulty: "Medium",
    pattern: "heap",
    category: "design",
    phase: 3,
    weekNumber: 2,
    timeComplexity: "O(n log k)",
    spaceComplexity: "O(n)",
    correctPattern: "Heap",
    correctTimeComplexity: "O(n log k)",
    correctSpaceComplexity: "O(n)",
    companies: JSON.stringify(["Amazon", "Google", "Microsoft"]),
    companyTags: "Amazon,Google,Microsoft",
    starterCode: `import heapq
from collections import defaultdict

class Twitter:
    def __init__(self):
        """
        Initialize the Twitter object.
        """
        pass
    
    def post_tweet(self, user_id: int, tweet_id: int) -> None:
        """Post a tweet."""
        pass
    
    def get_news_feed(self, user_id: int) -> list:
        """Return the 10 most recent tweet IDs in news feed."""
        pass
    
    def follow(self, follower_id: int, followee_id: int) -> None:
        """Follow a user."""
        pass
    
    def unfollow(self, follower_id: int, followee_id: int) -> None:
        """Unfollow a user."""
        pass

import json
data = json.loads(input())
twitter = Twitter()
results = []
for op, args in zip(data["ops"], data["args"]):
    if op == "postTweet": twitter.post_tweet(*args); results.append(None)
    elif op == "getNewsFeed": results.append(twitter.get_news_feed(*args))
    elif op == "follow": twitter.follow(*args); results.append(None)
    elif op == "unfollow": twitter.unfollow(*args); results.append(None)
print(json.dumps(results))`,
    solutionCode: `import heapq
from collections import defaultdict

class Twitter:
    def __init__(self):
        self.timer = 0
        self.tweets = defaultdict(list)  # userId -> [(time, tweetId)]
        self.following = defaultdict(set)
    
    def post_tweet(self, user_id: int, tweet_id: int) -> None:
        self.tweets[user_id].append((self.timer, tweet_id))
        self.timer -= 1
    
    def get_news_feed(self, user_id: int) -> list:
        feed = []
        users = self.following[user_id] | {user_id}
        heap = []
        for uid in users:
            if self.tweets[uid]:
                time, tid = self.tweets[uid][-1]
                heap.append((time, tid, uid, len(self.tweets[uid]) - 1))
        heapq.heapify(heap)
        while heap and len(feed) < 10:
            time, tid, uid, idx = heapq.heappop(heap)
            feed.append(tid)
            if idx > 0:
                t2, tid2 = self.tweets[uid][idx - 1]
                heapq.heappush(heap, (t2, tid2, uid, idx - 1))
        return feed
    
    def follow(self, follower_id: int, followee_id: int) -> None:
        self.following[follower_id].add(followee_id)
    
    def unfollow(self, follower_id: int, followee_id: int) -> None:
        self.following[follower_id].discard(followee_id)`,
    testCases: JSON.stringify([
      {
        input: '{"ops": ["postTweet","getNewsFeed","follow","postTweet","getNewsFeed","unfollow","getNewsFeed"], "args": [[1,5],[1],[1,2],[2,6],[1],[1,2],[1]]}',
        expected: "[null, [5], null, null, [6, 5], null, [5]]",
      },
    ]),
    hiddenTestCases: JSON.stringify([
      {
        input: '{"ops": ["postTweet","follow","getNewsFeed"], "args": [[1,1],[2,1],[2]]}',
        expected: "[null, null, [1]]",
      },
    ]),
    hints: JSON.stringify([
      "Use a min-heap to efficiently merge tweets from multiple users.",
      "Use a decreasing timer to sort tweets by recency (most recent = smallest timer value).",
      "For getNewsFeed, only consider the user's own tweets + tweets from followed users.",
    ]),
  },

  // ── 8. Maximum Profit in Job Scheduling (Amazon Hard) ─────────────────────
  {
    slug: "maximum-profit-job-scheduling",
    title: "Maximum Profit in Job Scheduling",
    description: `We have n jobs, where every job is scheduled to be done from startTime[i] to endTime[i], obtaining a profit of profit[i].

You're given the startTime, endTime and profit arrays. Return the maximum profit you can take such that no two jobs in the subset overlap.

Two jobs overlap if one starts before the other ends.`,
    difficulty: "Hard",
    pattern: "dynamic-programming",
    category: "dp",
    phase: 3,
    weekNumber: 2,
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    correctPattern: "DP+BinarySearch",
    correctTimeComplexity: "O(n log n)",
    correctSpaceComplexity: "O(n)",
    companies: JSON.stringify(["Amazon", "Google"]),
    companyTags: "Amazon,Google",
    starterCode: `import bisect

def job_scheduling(start_time: list, end_time: list, profit: list) -> int:
    """
    Return maximum profit from non-overlapping jobs.
    
    Example:
        start=[1,2,3,3], end=[3,4,5,6], profit=[50,10,40,70] -> 120
    """
    pass

import json
data = json.loads(input())
print(json.dumps(job_scheduling(data["startTime"], data["endTime"], data["profit"])))`,
    solutionCode: `import bisect

def job_scheduling(start_time: list, end_time: list, profit: list) -> int:
    jobs = sorted(zip(start_time, end_time, profit), key=lambda x: x[1])
    dp = [(0, 0)]  # (end_time, max_profit)
    for start, end, prof in jobs:
        idx = bisect.bisect_right(dp, (start, float('inf'))) - 1
        new_profit = dp[idx][1] + prof
        if new_profit > dp[-1][1]:
            dp.append((end, new_profit))
    return dp[-1][1]`,
    testCases: JSON.stringify([
      { input: '{"startTime": [1,2,3,3], "endTime": [3,4,5,6], "profit": [50,10,40,70]}', expected: "120" },
      { input: '{"startTime": [1,2,3,4,6], "endTime": [3,5,10,6,9], "profit": [20,20,100,70,60]}', expected: "150" },
      { input: '{"startTime": [1,1,1], "endTime": [2,3,4], "profit": [5,6,4]}', expected: "6" },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: '{"startTime": [1], "endTime": [2], "profit": [50]}', expected: "50" },
    ]),
    hints: JSON.stringify([
      "Sort jobs by end time.",
      "Use DP where dp[i] = max profit considering first i jobs.",
      "Use binary search to quickly find the last non-overlapping job.",
    ]),
  },

  // ── 9. Basic Calculator II (Flipkart) ─────────────────────────────────────
  {
    slug: "basic-calculator-ii",
    title: "Basic Calculator II",
    description: `Given a string s which represents an expression, evaluate this expression and return its value.

The integer division should truncate toward zero. The expression contains non-negative integers, '+', '-', '*', '/' operators and empty spaces. You may assume the expression is always valid.`,
    difficulty: "Medium",
    pattern: "stack",
    category: "stack",
    phase: 3,
    weekNumber: 2,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    correctPattern: "Stack",
    correctTimeComplexity: "O(n)",
    correctSpaceComplexity: "O(n)",
    companies: JSON.stringify(["Flipkart", "Amazon", "Microsoft", "Google"]),
    companyTags: "Flipkart,Amazon,Microsoft,Google",
    starterCode: `def calculate(s: str) -> int:
    """
    Evaluate a mathematical expression string.
    
    Example:
        calculate("3+2*2") -> 7
        calculate(" 3/2 ") -> 1
        calculate(" 3+5 / 2 ") -> 5
    """
    pass

import json
data = json.loads(input())
print(json.dumps(calculate(data["s"])))`,
    solutionCode: `def calculate(s: str) -> int:
    stack = []
    num = 0
    op = '+'
    for i, ch in enumerate(s):
        if ch.isdigit():
            num = num * 10 + int(ch)
        if (ch in '+-*/') or i == len(s) - 1:
            if op == '+': stack.append(num)
            elif op == '-': stack.append(-num)
            elif op == '*': stack.append(stack.pop() * num)
            elif op == '/': stack.append(int(stack.pop() / num))
            op = ch
            num = 0
    return sum(stack)`,
    testCases: JSON.stringify([
      { input: '{"s": "3+2*2"}', expected: "7" },
      { input: '{"s": " 3/2 "}', expected: "1" },
      { input: '{"s": " 3+5 / 2 "}', expected: "5" },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: '{"s": "14-3/2"}', expected: "13" },
      { input: '{"s": "1*2-3/4+5*6-7*8+9/10"}', expected: "1" },
    ]),
    hints: JSON.stringify([
      "Use a stack. Process numbers and apply the previous operator when you see a new operator.",
      "Handle * and / immediately; defer + and - by pushing to stack.",
      "Sum all values in the stack at the end.",
    ]),
  },

  // ── 10. Swim in Rising Water (Google Hard) ────────────────────────────────
  {
    slug: "swim-in-rising-water",
    title: "Swim in Rising Water",
    description: `You are given an n x n integer grid where grid[i][j] represents the elevation at that cell. At time t, the water level is t.

You can swim from one square to another 4-directionally adjacent if and only if both squares have elevation at most t.

Return the least time until you can reach the bottom-right cell (n-1, n-1) from the top-left cell (0, 0).`,
    difficulty: "Hard",
    pattern: "graphs",
    category: "graphs",
    phase: 3,
    weekNumber: 2,
    timeComplexity: "O(n² log n)",
    spaceComplexity: "O(n²)",
    correctPattern: "Dijkstra",
    correctTimeComplexity: "O(n² log n)",
    correctSpaceComplexity: "O(n²)",
    companies: JSON.stringify(["Google", "Amazon"]),
    companyTags: "Google,Amazon",
    starterCode: `import heapq

def swim_in_water(grid: list) -> int:
    """
    Return minimum time to reach bottom-right cell.
    
    Example:
        swim_in_water([[0,2],[1,3]]) -> 3
    """
    pass

import json
data = json.loads(input())
print(json.dumps(swim_in_water(data["grid"])))`,
    solutionCode: `import heapq

def swim_in_water(grid: list) -> int:
    n = len(grid)
    heap = [(grid[0][0], 0, 0)]
    visited = set()
    while heap:
        t, r, c = heapq.heappop(heap)
        if (r, c) in visited: continue
        visited.add((r, c))
        if r == n - 1 and c == n - 1: return t
        for dr, dc in [(0,1),(0,-1),(1,0),(-1,0)]:
            nr, nc = r + dr, c + dc
            if 0 <= nr < n and 0 <= nc < n and (nr, nc) not in visited:
                heapq.heappush(heap, (max(t, grid[nr][nc]), nr, nc))
    return -1`,
    testCases: JSON.stringify([
      { input: '{"grid": [[0,2],[1,3]]}', expected: "3" },
      { input: '{"grid": [[0,1,2,3,4],[24,23,22,21,5],[12,13,14,15,16],[11,17,18,19,20],[10,9,8,7,6]]}', expected: "16" },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: '{"grid": [[0]]}', expected: "0" },
    ]),
    hints: JSON.stringify([
      "Use Dijkstra: the 'cost' at each cell is max(current_time, grid[r][c]).",
      "The answer is the minimum possible maximum elevation on any path from (0,0) to (n-1,n-1).",
      "Use a min-heap to always expand the cell with minimum required time first.",
    ]),
  },
];

export async function seedPhase3CompanyProblems() {
  console.log(`  Seeding ${problems.length} Phase 3 company-targeted problems...`);
  let created = 0;
  let skipped = 0;

  for (const p of problems) {
    const existing = await prisma.problem.findUnique({ where: { slug: p.slug } });
    if (existing) {
      // Update company tags on existing
      await prisma.problem.update({
        where: { slug: p.slug },
        data: { companies: p.companies, companyTags: p.companyTags },
      });
      skipped++;
      continue;
    }

    await prisma.problem.create({
      data: {
        slug: p.slug,
        title: p.title,
        description: p.description,
        difficulty: p.difficulty,
        pattern: p.pattern,
        category: p.category,
        phase: p.phase,
        weekNumber: p.weekNumber,
        timeComplexity: p.timeComplexity,
        spaceComplexity: p.spaceComplexity,
        correctPattern: p.correctPattern,
        correctTimeComplexity: p.correctTimeComplexity,
        correctSpaceComplexity: p.correctSpaceComplexity,
        companies: p.companies,
        companyTags: p.companyTags,
        starterCode: p.starterCode,
        solutionCode: p.solutionCode,
        testCases: p.testCases,
        hiddenTestCases: p.hiddenTestCases,
        hints: p.hints,
        isActive: true,
        order: 300 + problems.indexOf(p),
        topicOrder: 300 + problems.indexOf(p),
      },
    });
    created++;
  }

  console.log(`  ✅ Created: ${created}, Updated tags: ${skipped}`);
}

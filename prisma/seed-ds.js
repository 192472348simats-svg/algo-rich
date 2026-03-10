const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const dsLessons = [
  {
    title: "Arrays & Lists",
    order: 1,
    difficulty: "Beginner",
    estimatedTime: 20,
    codeExample: `# Python Lists (Dynamic Arrays)
numbers = [10, 20, 30, 40, 50]

# Accessing elements - O(1)
print(f"First: {numbers[0]}")
print(f"Last: {numbers[-1]}")

# Append - O(1) amortized
numbers.append(60)
print(f"After append: {numbers}")

# Insert at index - O(n)
numbers.insert(2, 25)
print(f"After insert at 2: {numbers}")

# Remove - O(n)
numbers.remove(25)
print(f"After remove: {numbers}")

# Slicing - O(k)
print(f"Slice [1:4]: {numbers[1:4]}")

# List comprehension
squares = [x**2 for x in range(1, 6)]
print(f"Squares: {squares}")`,
    content: `# Arrays & Lists

Arrays are the most fundamental data structure in computer science. They store elements in **contiguous memory locations**, allowing fast access by index.

## What is an Array?

An **array** is an ordered collection of elements, each identified by an **index** (starting from 0). The key property of arrays is that accessing any element by its index is an **O(1)** operation — it takes the same time regardless of the array's size.

> **Key Insight:** Arrays provide constant-time access because the memory address of any element can be calculated directly: \`address = base + index × element_size\`

## Arrays in Python: Lists

Python doesn't have traditional fixed-size arrays. Instead, it provides **lists** — dynamic arrays that can grow and shrink.

\`\`\`python
# Creating a list
fruits = ["apple", "banana", "cherry"]
numbers = [1, 2, 3, 4, 5]
mixed = [42, "hello", True, 3.14]  # Can hold mixed types
\`\`\`

### Accessing Elements

\`\`\`python
fruits = ["apple", "banana", "cherry", "date"]

# Index access - O(1)
print(fruits[0])    # "apple"
print(fruits[-1])   # "date" (negative indexing)

# Slicing - O(k) where k is slice size
print(fruits[1:3])  # ["banana", "cherry"]
print(fruits[:2])   # ["apple", "banana"]
print(fruits[2:])   # ["cherry", "date"]
\`\`\`

## Common Operations & Time Complexity

| Operation | Method | Time Complexity |
|-----------|--------|----------------|
| Access by index | \`arr[i]\` | O(1) |
| Search (unsorted) | \`x in arr\` | O(n) |
| Append | \`arr.append(x)\` | O(1) amortized |
| Insert at index | \`arr.insert(i, x)\` | O(n) |
| Delete by index | \`arr.pop(i)\` | O(n) |
| Delete last | \`arr.pop()\` | O(1) |
| Length | \`len(arr)\` | O(1) |

### Insertion & Deletion

\`\`\`python
numbers = [10, 20, 30, 40, 50]

# Append to end - O(1) amortized
numbers.append(60)
# [10, 20, 30, 40, 50, 60]

# Insert at position - O(n) (shifts elements right)
numbers.insert(2, 25)
# [10, 20, 25, 30, 40, 50, 60]

# Remove by value - O(n) (finds + shifts)
numbers.remove(25)
# [10, 20, 30, 40, 50, 60]

# Pop (remove last) - O(1)
last = numbers.pop()
# last = 60, numbers = [10, 20, 30, 40, 50]

# Pop at index - O(n)
second = numbers.pop(1)
# second = 20, numbers = [10, 30, 40, 50]
\`\`\`

## Dynamic Array Resizing

Python lists are **dynamic arrays**. When you append and the internal array is full, Python:

1. Allocates a new, larger array (typically 1.5x-2x the size)
2. Copies all elements to the new array
3. Frees the old array

This is why \`append()\` is **O(1) amortized** — most appends are O(1), but occasionally one triggers an O(n) resize. Averaged out, it's still O(1).

## Two-Pointer Technique

A powerful pattern for array problems is the **two-pointer technique**:

\`\`\`python
def two_sum_sorted(arr, target):
    """Find two numbers in a sorted array that sum to target."""
    left, right = 0, len(arr) - 1
    
    while left < right:
        current_sum = arr[left] + arr[right]
        if current_sum == target:
            return [left, right]
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    
    return [-1, -1]

# Example
sorted_nums = [1, 3, 5, 7, 9, 11]
result = two_sum_sorted(sorted_nums, 12)
print(f"Indices: {result}")  # [1, 4] → 3 + 9 = 12
\`\`\`

## Sliding Window Pattern

Another essential pattern for contiguous subarray problems:

\`\`\`python
def max_subarray_sum(arr, k):
    """Find maximum sum of any subarray of size k."""
    if len(arr) < k:
        return None
    
    # Calculate sum of first window
    window_sum = sum(arr[:k])
    max_sum = window_sum
    
    # Slide the window
    for i in range(k, len(arr)):
        window_sum += arr[i] - arr[i - k]
        max_sum = max(max_sum, window_sum)
    
    return max_sum

nums = [2, 1, 5, 1, 3, 2]
print(f"Max sum (k=3): {max_subarray_sum(nums, 3)}")  # 9
\`\`\`

## When to Use Arrays

**Use arrays when you need:**
- Fast access by index (O(1))
- Sequential iteration
- Storing ordered collections

**Consider alternatives when you need:**
- Frequent insertions/deletions in the middle → Linked List
- Fast lookups by value → Hash Map / Set
- LIFO/FIFO behavior → Stack / Queue

## Summary

- Arrays store elements in contiguous memory with O(1) index access
- Python lists are dynamic arrays that resize automatically
- Append is O(1) amortized; insert/delete at arbitrary positions is O(n)
- Master the **two-pointer** and **sliding window** patterns for array problems
- Always consider time complexity when choosing between data structures
`,
  },
  {
    title: "Linked Lists",
    order: 2,
    difficulty: "Intermediate",
    estimatedTime: 25,
    codeExample: `# Linked List Implementation
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None
    
    def append(self, data):
        new_node = Node(data)
        if not self.head:
            self.head = new_node
            return
        current = self.head
        while current.next:
            current = current.next
        current.next = new_node
    
    def display(self):
        elements = []
        current = self.head
        while current:
            elements.append(str(current.data))
            current = current.next
        print(" -> ".join(elements) + " -> None")
    
    def length(self):
        count = 0
        current = self.head
        while current:
            count += 1
            current = current.next
        return count

# Create and use linked list
ll = LinkedList()
for val in [10, 20, 30, 40]:
    ll.append(val)

ll.display()
print(f"Length: {ll.length()}")`,
    content: `# Linked Lists

A **linked list** is a linear data structure where elements are stored in **nodes**, and each node contains a **pointer** (reference) to the next node. Unlike arrays, linked list elements are not stored in contiguous memory.

## Why Linked Lists?

Arrays have a limitation: inserting or deleting elements in the middle requires shifting all subsequent elements — an **O(n)** operation. Linked lists solve this by allowing **O(1)** insertion and deletion (once you have a reference to the position).

> **Key Insight:** Linked lists trade random access speed (O(n) vs array's O(1)) for efficient insertion/deletion at known positions.

## Node Structure

Each node in a singly linked list contains:
1. **Data** — the value stored
2. **Next** — a reference to the next node (or \`None\`)

\`\`\`python
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None
\`\`\`

## Singly Linked List Implementation

\`\`\`python
class LinkedList:
    def __init__(self):
        self.head = None
    
    def is_empty(self):
        return self.head is None
    
    def prepend(self, data):
        """Insert at the beginning - O(1)"""
        new_node = Node(data)
        new_node.next = self.head
        self.head = new_node
    
    def append(self, data):
        """Insert at the end - O(n)"""
        new_node = Node(data)
        if not self.head:
            self.head = new_node
            return
        current = self.head
        while current.next:
            current = current.next
        current.next = new_node
    
    def delete(self, data):
        """Delete first occurrence of data - O(n)"""
        if not self.head:
            return
        if self.head.data == data:
            self.head = self.head.next
            return
        current = self.head
        while current.next:
            if current.next.data == data:
                current.next = current.next.next
                return
            current = current.next
    
    def search(self, data):
        """Search for a value - O(n)"""
        current = self.head
        while current:
            if current.data == data:
                return True
            current = current.next
        return False
    
    def display(self):
        elements = []
        current = self.head
        while current:
            elements.append(str(current.data))
            current = current.next
        return " -> ".join(elements) + " -> None"
\`\`\`

## Time Complexity Comparison

| Operation | Array | Linked List |
|-----------|-------|-------------|
| Access by index | O(1) | O(n) |
| Search | O(n) | O(n) |
| Insert at beginning | O(n) | **O(1)** |
| Insert at end | O(1)* | O(n)** |
| Delete at beginning | O(n) | **O(1)** |
| Delete at end | O(1) | O(n) |

*Amortized for dynamic arrays  
**O(1) if you maintain a tail pointer

## Traversal Patterns

### Iterative Traversal

\`\`\`python
def print_list(head):
    current = head
    while current:
        print(current.data, end=" -> ")
        current = current.next
    print("None")
\`\`\`

### Recursive Traversal

\`\`\`python
def print_recursive(node):
    if not node:
        print("None")
        return
    print(node.data, end=" -> ")
    print_recursive(node.next)
\`\`\`

## Common Interview Patterns

### Reverse a Linked List

\`\`\`python
def reverse(head):
    """Reverse a linked list in-place - O(n) time, O(1) space"""
    prev = None
    current = head
    while current:
        next_node = current.next  # Save next
        current.next = prev       # Reverse pointer
        prev = current             # Move prev forward
        current = next_node        # Move current forward
    return prev  # New head
\`\`\`

### Detect a Cycle (Floyd's Algorithm)

\`\`\`python
def has_cycle(head):
    """Detect if linked list has a cycle - O(n) time, O(1) space"""
    slow = fast = head
    while fast and fast.next:
        slow = slow.next          # Move 1 step
        fast = fast.next.next     # Move 2 steps
        if slow == fast:
            return True
    return False
\`\`\`

### Find Middle Node

\`\`\`python
def find_middle(head):
    """Find the middle node using slow/fast pointers"""
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    return slow
\`\`\`

## Doubly Linked Lists

A **doubly linked list** adds a \`prev\` pointer to each node, allowing traversal in both directions:

\`\`\`python
class DNode:
    def __init__(self, data):
        self.data = data
        self.prev = None
        self.next = None
\`\`\`

**Advantages:** O(1) deletion when you have a reference to the node, backward traversal  
**Disadvantages:** Extra memory for \`prev\` pointer, more complex code

## When to Use Linked Lists

**Use when:**
- Frequent insertions/deletions at the beginning
- You don't need random access
- Building stacks or queues

**Avoid when:**
- You need fast random access by index
- Memory efficiency is critical (pointers add overhead)
- You need cache-friendly traversal

## Summary

- Linked lists store elements in nodes connected by pointers
- O(1) insertion/deletion at the head; O(n) access by index
- Master the **runner (fast/slow)** technique for interview problems
- Reversing a linked list is a classic problem — practice until it's second nature
- Consider doubly linked lists when you need backward traversal or O(1) deletion
`,
  },
  {
    title: "Stacks & Queues",
    order: 3,
    difficulty: "Beginner",
    estimatedTime: 20,
    codeExample: `# Stack using Python list
stack = []

# Push - O(1)
stack.append("A")
stack.append("B")
stack.append("C")
print(f"Stack: {stack}")

# Pop - O(1)
top = stack.pop()
print(f"Popped: {top}")
print(f"Stack: {stack}")

# Peek
print(f"Top: {stack[-1]}")

# Queue using collections.deque
from collections import deque

queue = deque()

# Enqueue - O(1)
queue.append("X")
queue.append("Y")
queue.append("Z")
print(f"\\nQueue: {list(queue)}")

# Dequeue - O(1)
front = queue.popleft()
print(f"Dequeued: {front}")
print(f"Queue: {list(queue)}")`,
    content: `# Stacks & Queues

Stacks and queues are two of the most commonly used **abstract data types** in programming. They restrict how elements are added and removed, which makes them perfect for specific patterns.

## Stacks: Last In, First Out (LIFO)

A **stack** is like a stack of plates — you can only add or remove from the **top**. The last element added is the first one removed.

### Core Operations

| Operation | Description | Time |
|-----------|-------------|------|
| \`push(x)\` | Add element to top | O(1) |
| \`pop()\` | Remove & return top element | O(1) |
| \`peek()\` / \`top()\` | View top element without removing | O(1) |
| \`is_empty()\` | Check if stack is empty | O(1) |

### Stack Implementation

\`\`\`python
class Stack:
    def __init__(self):
        self._items = []
    
    def push(self, item):
        self._items.append(item)
    
    def pop(self):
        if self.is_empty():
            raise IndexError("Stack is empty")
        return self._items.pop()
    
    def peek(self):
        if self.is_empty():
            raise IndexError("Stack is empty")
        return self._items[-1]
    
    def is_empty(self):
        return len(self._items) == 0
    
    def size(self):
        return len(self._items)
\`\`\`

In practice, Python's built-in \`list\` works perfectly as a stack:

\`\`\`python
stack = []
stack.append("a")   # push
stack.append("b")
stack.pop()          # returns "b"
stack[-1]            # peek → "a"
\`\`\`

### Classic Stack Problems

#### Balanced Parentheses

\`\`\`python
def is_balanced(s):
    """Check if parentheses/brackets are balanced."""
    stack = []
    pairs = {')': '(', ']': '[', '}': '{'}
    
    for char in s:
        if char in '([{':
            stack.append(char)
        elif char in ')]}':
            if not stack or stack[-1] != pairs[char]:
                return False
            stack.pop()
    
    return len(stack) == 0

print(is_balanced("({[]})"))   # True
print(is_balanced("([)]"))     # False
print(is_balanced("{[}"))      # False
\`\`\`

#### Reverse a String

\`\`\`python
def reverse_string(s):
    stack = list(s)
    result = ""
    while stack:
        result += stack.pop()
    return result

print(reverse_string("hello"))  # "olleh"
\`\`\`

## Queues: First In, First Out (FIFO)

A **queue** is like a line at a store — the first person in line is the first one served. Elements are added at the **rear** and removed from the **front**.

### Core Operations

| Operation | Description | Time |
|-----------|-------------|------|
| \`enqueue(x)\` | Add element to rear | O(1) |
| \`dequeue()\` | Remove & return front element | O(1)* |
| \`peek()\` / \`front()\` | View front element | O(1) |
| \`is_empty()\` | Check if queue is empty | O(1) |

*O(1) with \`deque\`, O(n) with plain list

### Queue Implementation

> **Warning:** Never use a plain Python \`list\` as a queue! \`list.pop(0)\` is O(n). Use \`collections.deque\` instead.

\`\`\`python
from collections import deque

class Queue:
    def __init__(self):
        self._items = deque()
    
    def enqueue(self, item):
        self._items.append(item)
    
    def dequeue(self):
        if self.is_empty():
            raise IndexError("Queue is empty")
        return self._items.popleft()
    
    def peek(self):
        if self.is_empty():
            raise IndexError("Queue is empty")
        return self._items[0]
    
    def is_empty(self):
        return len(self._items) == 0
    
    def size(self):
        return len(self._items)
\`\`\`

### BFS with a Queue

Queues are essential for **Breadth-First Search**:

\`\`\`python
from collections import deque

def bfs(graph, start):
    """Breadth-first traversal of a graph."""
    visited = set()
    queue = deque([start])
    visited.add(start)
    order = []
    
    while queue:
        node = queue.popleft()
        order.append(node)
        
        for neighbor in graph.get(node, []):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    
    return order

graph = {
    'A': ['B', 'C'],
    'B': ['D', 'E'],
    'C': ['F'],
    'D': [], 'E': [], 'F': []
}
print(bfs(graph, 'A'))  # ['A', 'B', 'C', 'D', 'E', 'F']
\`\`\`

## Stack vs Queue Summary

| Feature | Stack (LIFO) | Queue (FIFO) |
|---------|-------------|-------------|
| Add | Push to top | Enqueue at rear |
| Remove | Pop from top | Dequeue from front |
| Real-world analogy | Stack of plates | Line at a store |
| Python implementation | \`list\` | \`collections.deque\` |
| Common uses | Undo, DFS, parsing | BFS, scheduling, buffers |

## When to Use What

**Use a Stack when:**
- Processing things in reverse order
- Matching pairs (parentheses, HTML tags)
- Implementing undo/redo
- DFS traversal
- Evaluating expressions

**Use a Queue when:**
- Processing things in order of arrival
- BFS traversal
- Task scheduling
- Buffering data (print queues, message queues)

## Summary

- Stacks are LIFO — use Python \`list\` with \`append()\` / \`pop()\`
- Queues are FIFO — use \`collections.deque\` with \`append()\` / \`popleft()\`
- Both provide O(1) for their core operations
- Stacks are essential for DFS, expression evaluation, and undo operations
- Queues are essential for BFS, scheduling, and ordered processing
`,
  },
  {
    title: "Hash Maps & Sets",
    order: 4,
    difficulty: "Intermediate",
    estimatedTime: 25,
    codeExample: `# Python Dictionary (Hash Map)
student = {
    "name": "Alice",
    "age": 22,
    "grade": "A"
}

# Access - O(1) average
print(f"Name: {student['name']}")

# Insert/Update - O(1) average
student["gpa"] = 3.9
student["age"] = 23
print(f"Updated: {student}")

# Check existence - O(1) average
print(f"Has 'name': {'name' in student}")

# Frequency counter pattern
text = "hello world"
freq = {}
for char in text:
    freq[char] = freq.get(char, 0) + 1
print(f"\\nFrequency: {freq}")

# Python Set
numbers = {1, 2, 3, 4, 5}
numbers.add(6)
print(f"\\nSet: {numbers}")
print(f"3 in set: {3 in numbers}")   # O(1)
print(f"10 in set: {10 in numbers}") # O(1)`,
    content: `# Hash Maps & Sets

Hash maps (dictionaries in Python) are arguably the **most important data structure** for coding interviews. They provide average **O(1)** time for lookups, insertions, and deletions.

## How Hash Maps Work

A hash map stores **key-value pairs** using a technique called **hashing**:

1. A **hash function** converts the key into an integer (hash code)
2. The hash code is mapped to an **index** in an internal array
3. The value is stored at that index

\`\`\`
key → hash function → index → store value at index
"alice" → hash("alice") → 42 → array[42] = value
\`\`\`

> **Key Insight:** Hash maps achieve O(1) average time by trading space for speed. They use extra memory to avoid searching through all elements.

## Python Dictionaries

Python's \`dict\` is a hash map implementation:

\`\`\`python
# Creating dictionaries
empty = {}
person = {"name": "Alice", "age": 25, "city": "NYC"}
from_pairs = dict([("a", 1), ("b", 2)])

# Access - O(1) average
name = person["name"]           # Raises KeyError if missing
age = person.get("age", 0)      # Returns default if missing

# Insert / Update - O(1) average
person["email"] = "alice@example.com"
person["age"] = 26

# Delete - O(1) average
del person["city"]
removed = person.pop("email")

# Check existence - O(1) average
if "name" in person:
    print(f"Name: {person['name']}")
\`\`\`

## Time Complexity

| Operation | Average | Worst Case |
|-----------|---------|------------|
| Access by key | O(1) | O(n) |
| Insert | O(1) | O(n) |
| Delete | O(1) | O(n) |
| Search by value | O(n) | O(n) |
| \`in\` operator | O(1) | O(n) |

Worst case O(n) happens with hash collisions — extremely rare with good hash functions.

## Collision Handling

When two keys hash to the same index, we have a **collision**. Two common strategies:

1. **Chaining** — Store a linked list at each index (Python uses this variant)
2. **Open Addressing** — Find the next empty slot in the array

Python's implementation uses open addressing with a probing technique for performance.

## Essential Hash Map Patterns

### 1. Frequency Counter

\`\`\`python
def char_frequency(s):
    """Count character occurrences - O(n)"""
    freq = {}
    for char in s:
        freq[char] = freq.get(char, 0) + 1
    return freq

# Using Counter (built-in)
from collections import Counter
freq = Counter("programming")
print(freq)  # Counter({'r': 2, 'g': 2, 'm': 2, ...})
print(freq.most_common(3))  # Top 3 most common
\`\`\`

### 2. Two Sum (Classic Interview Problem)

\`\`\`python
def two_sum(nums, target):
    """Find indices of two numbers that sum to target - O(n)"""
    seen = {}  # value -> index
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

print(two_sum([2, 7, 11, 15], 9))  # [0, 1]
\`\`\`

### 3. Group Anagrams

\`\`\`python
from collections import defaultdict

def group_anagrams(words):
    """Group words that are anagrams of each other - O(n*k log k)"""
    groups = defaultdict(list)
    for word in words:
        key = "".join(sorted(word))
        groups[key].append(word)
    return list(groups.values())

words = ["eat", "tea", "tan", "ate", "nat", "bat"]
print(group_anagrams(words))
# [["eat", "tea", "ate"], ["tan", "nat"], ["bat"]]
\`\`\`

## Python Sets

A **set** is a hash map with only keys (no values). It stores **unique elements** with O(1) lookup.

\`\`\`python
# Creating sets
numbers = {1, 2, 3, 4, 5}
from_list = set([1, 2, 2, 3, 3, 3])  # {1, 2, 3}

# Operations - all O(1) average
numbers.add(6)          # Add element
numbers.remove(1)       # Remove (raises KeyError if missing)
numbers.discard(99)     # Remove (no error if missing)
print(3 in numbers)     # Membership test - O(1)
\`\`\`

### Set Operations

\`\`\`python
a = {1, 2, 3, 4}
b = {3, 4, 5, 6}

print(a | b)   # Union:        {1, 2, 3, 4, 5, 6}
print(a & b)   # Intersection: {3, 4}
print(a - b)   # Difference:   {1, 2}
print(a ^ b)   # Symmetric diff: {1, 2, 5, 6}
\`\`\`

### Using Sets to Remove Duplicates

\`\`\`python
def has_duplicates(arr):
    """Check for duplicates in O(n) time"""
    return len(arr) != len(set(arr))

def unique_elements(arr):
    """Remove duplicates while preserving order"""
    seen = set()
    result = []
    for item in arr:
        if item not in seen:
            seen.add(item)
            result.append(item)
    return result
\`\`\`

## defaultdict and Counter

Python provides specialized hash map variants:

\`\`\`python
from collections import defaultdict, Counter

# defaultdict - no KeyError, auto-initializes
graph = defaultdict(list)
graph["A"].append("B")
graph["A"].append("C")

word_count = defaultdict(int)
for word in "the cat sat on the mat".split():
    word_count[word] += 1

# Counter - frequency counting made easy
text = "abracadabra"
c = Counter(text)
print(c.most_common(3))  # [('a', 5), ('b', 2), ('r', 2)]
\`\`\`

## When to Use Hash Maps vs Other Structures

| Need | Use |
|------|-----|
| Key-value lookup | \`dict\` |
| Check membership / unique items | \`set\` |
| Count occurrences | \`Counter\` |
| Group items by property | \`defaultdict(list)\` |
| Ordered key-value pairs | \`OrderedDict\` (or \`dict\` in Python 3.7+) |

## Summary

- Hash maps provide O(1) average-case operations via hashing
- Python \`dict\` is the primary hash map; \`set\` is a hash set
- The **frequency counter** and **complement lookup** patterns solve many interview problems
- Use \`defaultdict\` and \`Counter\` from \`collections\` for cleaner code
- Sets are perfect for uniqueness checks and membership tests
- Hash maps are your go-to for optimizing brute force O(n²) solutions to O(n)
`,
  },
  {
    title: "Trees & Binary Search Trees",
    order: 5,
    difficulty: "Intermediate",
    estimatedTime: 30,
    codeExample: `# Binary Search Tree Implementation
class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

class BST:
    def __init__(self):
        self.root = None
    
    def insert(self, val):
        self.root = self._insert(self.root, val)
    
    def _insert(self, node, val):
        if not node:
            return TreeNode(val)
        if val < node.val:
            node.left = self._insert(node.left, val)
        elif val > node.val:
            node.right = self._insert(node.right, val)
        return node
    
    def inorder(self):
        result = []
        self._inorder(self.root, result)
        return result
    
    def _inorder(self, node, result):
        if node:
            self._inorder(node.left, result)
            result.append(node.val)
            self._inorder(node.right, result)

# Build and traverse a BST
bst = BST()
for val in [50, 30, 70, 20, 40, 60, 80]:
    bst.insert(val)

print(f"In-order: {bst.inorder()}")
# [20, 30, 40, 50, 60, 70, 80] - sorted!`,
    content: `# Trees & Binary Search Trees

Trees are **hierarchical data structures** that model relationships where each element (node) can have multiple children. They're fundamental to computer science and appear everywhere — file systems, databases, compilers, and more.

## Tree Terminology

- **Node** — An element in the tree containing data
- **Root** — The topmost node (no parent)
- **Parent** — A node that has children
- **Child** — A node connected below another node
- **Leaf** — A node with no children
- **Edge** — Connection between a parent and child
- **Height** — Length of the longest path from a node to a leaf
- **Depth** — Length of the path from the root to a node

## Binary Trees

A **binary tree** is a tree where each node has **at most two children**: left and right.

\`\`\`python
class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
\`\`\`

### Tree Traversals

There are four standard ways to visit all nodes:

#### 1. In-Order (Left → Root → Right)

\`\`\`python
def inorder(node):
    """For BSTs, this gives sorted order"""
    if not node:
        return []
    return inorder(node.left) + [node.val] + inorder(node.right)
\`\`\`

#### 2. Pre-Order (Root → Left → Right)

\`\`\`python
def preorder(node):
    """Useful for creating a copy of the tree"""
    if not node:
        return []
    return [node.val] + preorder(node.left) + preorder(node.right)
\`\`\`

#### 3. Post-Order (Left → Right → Root)

\`\`\`python
def postorder(node):
    """Useful for deleting the tree"""
    if not node:
        return []
    return postorder(node.left) + postorder(node.right) + [node.val]
\`\`\`

#### 4. Level-Order (BFS)

\`\`\`python
from collections import deque

def level_order(root):
    """Visit nodes level by level"""
    if not root:
        return []
    result = []
    queue = deque([root])
    while queue:
        level = []
        for _ in range(len(queue)):
            node = queue.popleft()
            level.append(node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        result.append(level)
    return result
\`\`\`

## Binary Search Trees (BST)

A BST is a binary tree with an **ordering property**:
- All values in the **left subtree** are **less than** the node's value
- All values in the **right subtree** are **greater than** the node's value

This property enables O(log n) search, insertion, and deletion (when balanced).

### BST Operations

\`\`\`python
class BST:
    def __init__(self):
        self.root = None
    
    def insert(self, val):
        """Insert a value - O(log n) average, O(n) worst"""
        if not self.root:
            self.root = TreeNode(val)
            return
        current = self.root
        while True:
            if val < current.val:
                if current.left is None:
                    current.left = TreeNode(val)
                    return
                current = current.left
            elif val > current.val:
                if current.right is None:
                    current.right = TreeNode(val)
                    return
                current = current.right
            else:
                return  # Duplicate, don't insert
    
    def search(self, val):
        """Search for a value - O(log n) average"""
        current = self.root
        while current:
            if val == current.val:
                return True
            elif val < current.val:
                current = current.left
            else:
                current = current.right
        return False
    
    def find_min(self):
        """Find minimum value - O(log n) average"""
        current = self.root
        while current and current.left:
            current = current.left
        return current.val if current else None
    
    def find_max(self):
        """Find maximum value - O(log n) average"""
        current = self.root
        while current and current.right:
            current = current.right
        return current.val if current else None
\`\`\`

### BST Time Complexity

| Operation | Average | Worst (unbalanced) |
|-----------|---------|-------------------|
| Search | O(log n) | O(n) |
| Insert | O(log n) | O(n) |
| Delete | O(log n) | O(n) |
| Find min/max | O(log n) | O(n) |

> **Key Insight:** A BST degrades to O(n) when elements are inserted in sorted order (becomes a linked list). Self-balancing trees (AVL, Red-Black) prevent this.

## Common Tree Problems

### Height of a Tree

\`\`\`python
def height(node):
    """Calculate height - O(n)"""
    if not node:
        return -1
    return 1 + max(height(node.left), height(node.right))
\`\`\`

### Check if Tree is Balanced

\`\`\`python
def is_balanced(node):
    """A tree is balanced if height difference of subtrees <= 1"""
    def check(node):
        if not node:
            return 0
        left = check(node.left)
        right = check(node.right)
        if left == -1 or right == -1 or abs(left - right) > 1:
            return -1
        return 1 + max(left, right)
    
    return check(node) != -1
\`\`\`

### Validate BST

\`\`\`python
def is_valid_bst(node, min_val=float('-inf'), max_val=float('inf')):
    """Check if tree satisfies BST property"""
    if not node:
        return True
    if node.val <= min_val or node.val >= max_val:
        return False
    return (is_valid_bst(node.left, min_val, node.val) and
            is_valid_bst(node.right, node.val, max_val))
\`\`\`

### Lowest Common Ancestor (BST)

\`\`\`python
def lca(root, p, q):
    """Find LCA of two nodes in a BST - O(log n)"""
    while root:
        if p < root.val and q < root.val:
            root = root.left
        elif p > root.val and q > root.val:
            root = root.right
        else:
            return root.val
    return None
\`\`\`

## Tree Patterns for Interviews

1. **Recursive DFS** — Most tree problems use recursion. Think "what does the root need from its children?"
2. **Level-order BFS** — Use a queue for level-by-level processing
3. **Path problems** — Track values from root to leaf
4. **BST property** — In-order traversal gives sorted elements

## When to Use Trees

**Use when:**
- Data has hierarchical relationships
- You need O(log n) search, insert, and delete (BST)
- Implementing priority queues (heaps)
- Autocompletion (tries)

**Consider alternatives when:**
- Data is flat and unordered → Hash Map
- You need guaranteed O(log n) → Use built-in sorted structures
- Simple sequential access → Array/List

## Summary

- Trees model hierarchical relationships with nodes and edges
- Binary trees have at most 2 children per node
- BSTs maintain sorted order: left < root < right
- Four traversals: in-order, pre-order, post-order, level-order
- BSTs give O(log n) operations when balanced, O(n) when degenerate
- Most tree problems are solved with recursion or BFS
- In-order traversal of a BST produces elements in sorted order
`,
  },
];

async function seedDS() {
  console.log("🌱 Seeding Data Structures course...\n");

  // Check if DS course already exists
  const existing = await prisma.course.findFirst({
    where: { category: "data-structures" },
  });

  if (existing) {
    // Delete old lessons for this course
    await prisma.progress.deleteMany({
      where: { lesson: { courseId: existing.id } },
    });
    await prisma.lesson.deleteMany({ where: { courseId: existing.id } });
    await prisma.course.delete({ where: { id: existing.id } });
    console.log("🗑️  Removed existing DS course");
  }

  const course = await prisma.course.create({
    data: {
      title: "Data Structures",
      description:
        "Learn the essential data structures used in programming and technical interviews. From arrays and linked lists to trees and hash maps, build the foundation for algorithmic thinking.",
      category: "data-structures",
      order: 2,
    },
  });

  console.log(`📚 Created course: ${course.title}`);

  for (const lessonData of dsLessons) {
    const lesson = await prisma.lesson.create({
      data: {
        courseId: course.id,
        title: lessonData.title,
        content: lessonData.content,
        codeExample: lessonData.codeExample,
        order: lessonData.order,
        difficulty: lessonData.difficulty,
        estimatedTime: lessonData.estimatedTime,
      },
    });
    console.log(`  📝 Lesson ${lesson.order}: ${lesson.title}`);
  }

  console.log("\n✅ Data Structures course seeded!");
}

seedDS()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

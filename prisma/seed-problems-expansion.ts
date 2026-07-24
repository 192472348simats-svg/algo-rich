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
  starterCode: string;
  solutionCode: string;
  testCases: string;
  hiddenTestCases: string;
  hints: string;
}

const problems: ProblemSeed[] = [
  // ══════════════════════════════════════════════════════════════
  // GREEDY (12 problems) — Category had 0 problems
  // ══════════════════════════════════════════════════════════════
  {
    slug: "jump-game",
    title: "Jump Game",
    description: "You are given an integer array `nums`. You are initially positioned at the first index. Each element represents your maximum jump length at that position. Return `True` if you can reach the last index, or `False` otherwise.",
    difficulty: "medium",
    pattern: "greedy",
    category: "greedy",
    phase: 3,
    weekNumber: 1,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    correctPattern: "Greedy",
    starterCode: `def can_jump(nums: list) -> bool:
    """
    Determine if you can reach the last index.

    Args:
        nums: list of non-negative integers representing max jump lengths
    Returns:
        True if you can reach the last index

    Example:
        can_jump([2,3,1,1,4]) -> True
        can_jump([3,2,1,0,4]) -> False
    """
    pass

import json
data = json.loads(input())
print(json.dumps(can_jump(data["nums"])))`,
    solutionCode: `def can_jump(nums: list) -> bool:
    max_reach = 0
    for i, jump in enumerate(nums):
        if i > max_reach:
            return False
        max_reach = max(max_reach, i + jump)
    return True

import json
data = json.loads(input())
print(json.dumps(can_jump(data["nums"])))`,
    testCases: JSON.stringify([
      { input: { nums: [2, 3, 1, 1, 4] }, expectedOutput: true },
      { input: { nums: [3, 2, 1, 0, 4] }, expectedOutput: false },
      { input: { nums: [0] }, expectedOutput: true },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { nums: [2, 0, 0] }, expectedOutput: true },
      { input: { nums: [1, 1, 1, 1] }, expectedOutput: true },
      { input: { nums: [1, 0, 1, 0] }, expectedOutput: false },
    ]),
    hints: JSON.stringify(["Track the farthest index you can reach as you iterate.", "If your current index exceeds the farthest reachable, return False."]),
  },
  {
    slug: "jump-game-ii",
    title: "Jump Game II",
    description: "You are given an array of non-negative integers `nums`. You are initially at the first index. Each element represents your maximum jump length. Return the minimum number of jumps to reach the last index. You can assume you can always reach the last index.",
    difficulty: "medium",
    pattern: "greedy",
    category: "greedy",
    phase: 3,
    weekNumber: 1,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    correctPattern: "Greedy",
    starterCode: `def jump(nums: list) -> int:
    """
    Return the minimum number of jumps to reach the last index.

    Args:
        nums: list of non-negative integers
    Returns:
        minimum number of jumps

    Example:
        jump([2,3,1,1,4]) -> 2
    """
    pass

import json
data = json.loads(input())
print(json.dumps(jump(data["nums"])))`,
    solutionCode: `def jump(nums: list) -> int:
    jumps = 0
    current_end = 0
    farthest = 0
    for i in range(len(nums) - 1):
        farthest = max(farthest, i + nums[i])
        if i == current_end:
            jumps += 1
            current_end = farthest
    return jumps

import json
data = json.loads(input())
print(json.dumps(jump(data["nums"])))`,
    testCases: JSON.stringify([
      { input: { nums: [2, 3, 1, 1, 4] }, expectedOutput: 2 },
      { input: { nums: [2, 3, 0, 1, 4] }, expectedOutput: 2 },
      { input: { nums: [1] }, expectedOutput: 0 },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { nums: [1, 2, 3] }, expectedOutput: 2 },
      { input: { nums: [10, 1, 1, 1, 1] }, expectedOutput: 1 },
    ]),
    hints: JSON.stringify(["Think BFS: each level of BFS represents one jump.", "Track the farthest you can reach in the current jump window."]),
  },
  {
    slug: "gas-station",
    title: "Gas Station",
    description: "There are `n` gas stations along a circular route. You are given two arrays `gas` and `cost` where `gas[i]` is the amount of gas at station `i` and `cost[i]` is the cost to travel from station `i` to `i+1`. Return the starting station index if you can complete the circuit, or `-1` if impossible.",
    difficulty: "medium",
    pattern: "greedy",
    category: "greedy",
    phase: 3,
    weekNumber: 1,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    correctPattern: "Greedy",
    starterCode: `def can_complete_circuit(gas: list, cost: list) -> int:
    """
    Find the starting gas station index to complete the circuit.

    Args:
        gas: amount of gas at each station
        cost: cost to travel to the next station
    Returns:
        starting station index, or -1

    Example:
        can_complete_circuit([1,2,3,4,5], [3,4,5,1,2]) -> 3
    """
    pass

import json
data = json.loads(input())
print(json.dumps(can_complete_circuit(data["gas"], data["cost"])))`,
    solutionCode: `def can_complete_circuit(gas: list, cost: list) -> int:
    if sum(gas) < sum(cost):
        return -1
    tank = 0
    start = 0
    for i in range(len(gas)):
        tank += gas[i] - cost[i]
        if tank < 0:
            start = i + 1
            tank = 0
    return start

import json
data = json.loads(input())
print(json.dumps(can_complete_circuit(data["gas"], data["cost"])))`,
    testCases: JSON.stringify([
      { input: { gas: [1, 2, 3, 4, 5], cost: [3, 4, 5, 1, 2] }, expectedOutput: 3 },
      { input: { gas: [2, 3, 4], cost: [3, 4, 3] }, expectedOutput: -1 },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { gas: [5, 1, 2, 3, 4], cost: [4, 4, 1, 5, 1] }, expectedOutput: 4 },
      { input: { gas: [3, 3, 4], cost: [3, 4, 4] }, expectedOutput: -1 },
    ]),
    hints: JSON.stringify(["If total gas >= total cost, a solution must exist.", "If the tank goes negative at station i, restart from station i+1."]),
  },
  {
    slug: "assign-cookies",
    title: "Assign Cookies",
    description: "You want to give cookies to children. Each child `i` has a greed factor `g[i]` and each cookie `j` has size `s[j]`. A child is content if cookie size >= greed factor. Maximize the number of content children.",
    difficulty: "easy",
    pattern: "greedy",
    category: "greedy",
    phase: 3,
    weekNumber: 1,
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(1)",
    correctPattern: "Greedy",
    starterCode: `def find_content_children(g: list, s: list) -> int:
    """
    Args:
        g: greed factors of children
        s: sizes of cookies
    Returns:
        maximum number of content children

    Example:
        find_content_children([1,2,3], [1,1]) -> 1
    """
    pass

import json
data = json.loads(input())
print(json.dumps(find_content_children(data["g"], data["s"])))`,
    solutionCode: `def find_content_children(g: list, s: list) -> int:
    g.sort()
    s.sort()
    child = cookie = 0
    while child < len(g) and cookie < len(s):
        if s[cookie] >= g[child]:
            child += 1
        cookie += 1
    return child

import json
data = json.loads(input())
print(json.dumps(find_content_children(data["g"], data["s"])))`,
    testCases: JSON.stringify([
      { input: { g: [1, 2, 3], s: [1, 1] }, expectedOutput: 1 },
      { input: { g: [1, 2], s: [1, 2, 3] }, expectedOutput: 2 },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { g: [10, 9, 8, 7], s: [5, 6, 7, 8] }, expectedOutput: 2 },
      { input: { g: [], s: [1, 2] }, expectedOutput: 0 },
    ]),
    hints: JSON.stringify(["Sort both arrays first.", "Try to satisfy the least greedy child with the smallest sufficient cookie."]),
  },
  {
    slug: "lemonade-change",
    title: "Lemonade Change",
    description: "Each lemonade costs $5. Customers pay with $5, $10, or $20 bills. You start with no change. Return `True` if you can provide correct change to every customer.",
    difficulty: "easy",
    pattern: "greedy",
    category: "greedy",
    phase: 3,
    weekNumber: 1,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    correctPattern: "Greedy",
    starterCode: `def lemonade_change(bills: list) -> bool:
    """
    Args:
        bills: list of bills customers pay with (5, 10, or 20)
    Returns:
        True if you can provide change to every customer

    Example:
        lemonade_change([5,5,5,10,20]) -> True
    """
    pass

import json
data = json.loads(input())
print(json.dumps(lemonade_change(data["bills"])))`,
    solutionCode: `def lemonade_change(bills: list) -> bool:
    five = ten = 0
    for bill in bills:
        if bill == 5:
            five += 1
        elif bill == 10:
            if five == 0:
                return False
            five -= 1
            ten += 1
        else:
            if ten > 0 and five > 0:
                ten -= 1
                five -= 1
            elif five >= 3:
                five -= 3
            else:
                return False
    return True

import json
data = json.loads(input())
print(json.dumps(lemonade_change(data["bills"])))`,
    testCases: JSON.stringify([
      { input: { bills: [5, 5, 5, 10, 20] }, expectedOutput: true },
      { input: { bills: [5, 5, 10, 10, 20] }, expectedOutput: false },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { bills: [5, 5, 10] }, expectedOutput: true },
      { input: { bills: [10, 10] }, expectedOutput: false },
      { input: { bills: [5, 5, 5, 5, 20, 20, 5, 5, 5, 5] }, expectedOutput: true },
    ]),
    hints: JSON.stringify(["Track count of $5 and $10 bills.", "For $20 change, prefer giving one $10 + one $5 over three $5s."]),
  },
  {
    slug: "partition-labels",
    title: "Partition Labels",
    description: "You are given a string `s`. Partition the string into as many parts as possible so that each letter appears in at most one part. Return a list of integers representing the size of these parts.",
    difficulty: "medium",
    pattern: "greedy",
    category: "greedy",
    phase: 3,
    weekNumber: 2,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    correctPattern: "Greedy",
    starterCode: `def partition_labels(s: str) -> list:
    """
    Args:
        s: a lowercase string
    Returns:
        list of partition sizes

    Example:
        partition_labels("ababcbacadefegdehijhklij") -> [9,7,8]
    """
    pass

import json
data = json.loads(input())
print(json.dumps(partition_labels(data["s"])))`,
    solutionCode: `def partition_labels(s: str) -> list:
    last = {c: i for i, c in enumerate(s)}
    result = []
    start = end = 0
    for i, c in enumerate(s):
        end = max(end, last[c])
        if i == end:
            result.append(end - start + 1)
            start = i + 1
    return result

import json
data = json.loads(input())
print(json.dumps(partition_labels(data["s"])))`,
    testCases: JSON.stringify([
      { input: { s: "ababcbacadefegdehijhklij" }, expectedOutput: [9, 7, 8] },
      { input: { s: "eccbbbbdec" }, expectedOutput: [10] },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { s: "abc" }, expectedOutput: [1, 1, 1] },
      { input: { s: "a" }, expectedOutput: [1] },
    ]),
    hints: JSON.stringify(["Find the last occurrence of each character first.", "Extend the partition end to include all last occurrences."]),
  },
  {
    slug: "task-scheduler",
    title: "Task Scheduler",
    description: "Given a list of CPU tasks (uppercase letters) and a cooldown period `n`, find the minimum number of intervals needed to execute all tasks. The same task must have at least `n` intervals between executions. The CPU can be idle during cooldown.",
    difficulty: "medium",
    pattern: "greedy",
    category: "greedy",
    phase: 3,
    weekNumber: 2,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    correctPattern: "Greedy",
    starterCode: `def least_interval(tasks: list, n: int) -> int:
    """
    Args:
        tasks: list of uppercase letter strings
        n: cooldown period
    Returns:
        minimum intervals to finish all tasks

    Example:
        least_interval(["A","A","A","B","B","B"], 2) -> 8
    """
    pass

import json
data = json.loads(input())
print(json.dumps(least_interval(data["tasks"], data["n"])))`,
    solutionCode: `def least_interval(tasks: list, n: int) -> int:
    from collections import Counter
    freq = Counter(tasks)
    max_freq = max(freq.values())
    max_count = sum(1 for v in freq.values() if v == max_freq)
    return max(len(tasks), (max_freq - 1) * (n + 1) + max_count)

import json
data = json.loads(input())
print(json.dumps(least_interval(data["tasks"], data["n"])))`,
    testCases: JSON.stringify([
      { input: { tasks: ["A", "A", "A", "B", "B", "B"], n: 2 }, expectedOutput: 8 },
      { input: { tasks: ["A", "A", "A", "B", "B", "B"], n: 0 }, expectedOutput: 6 },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { tasks: ["A", "A", "A", "A", "A", "A", "B", "C", "D", "E", "F", "G"], n: 2 }, expectedOutput: 16 },
      { input: { tasks: ["A"], n: 5 }, expectedOutput: 1 },
    ]),
    hints: JSON.stringify(["Focus on the most frequent task.", "Formula: max(len(tasks), (maxFreq-1)*(n+1)+countOfMaxFreq)."]),
  },
  {
    slug: "meeting-rooms",
    title: "Meeting Rooms",
    description: "Given an array of meeting time intervals `[[start, end], ...]`, determine if a person can attend all meetings (no overlaps).",
    difficulty: "easy",
    pattern: "greedy",
    category: "greedy",
    phase: 3,
    weekNumber: 2,
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(1)",
    correctPattern: "Greedy",
    starterCode: `def can_attend_meetings(intervals: list) -> bool:
    """
    Args:
        intervals: list of [start, end] pairs
    Returns:
        True if no meetings overlap

    Example:
        can_attend_meetings([[0,30],[5,10],[15,20]]) -> False
    """
    pass

import json
data = json.loads(input())
print(json.dumps(can_attend_meetings(data["intervals"])))`,
    solutionCode: `def can_attend_meetings(intervals: list) -> bool:
    intervals.sort()
    for i in range(1, len(intervals)):
        if intervals[i][0] < intervals[i - 1][1]:
            return False
    return True

import json
data = json.loads(input())
print(json.dumps(can_attend_meetings(data["intervals"])))`,
    testCases: JSON.stringify([
      { input: { intervals: [[0, 30], [5, 10], [15, 20]] }, expectedOutput: false },
      { input: { intervals: [[7, 10], [2, 4]] }, expectedOutput: true },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { intervals: [] }, expectedOutput: true },
      { input: { intervals: [[1, 5], [5, 10]] }, expectedOutput: true },
      { input: { intervals: [[1, 5], [4, 10], [11, 15]] }, expectedOutput: false },
    ]),
    hints: JSON.stringify(["Sort intervals by start time.", "Check if any adjacent meetings overlap."]),
  },
  {
    slug: "meeting-rooms-ii",
    title: "Meeting Rooms II",
    description: "Given an array of meeting time intervals `[[start, end], ...]`, find the minimum number of conference rooms required.",
    difficulty: "medium",
    pattern: "greedy",
    category: "greedy",
    phase: 3,
    weekNumber: 2,
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    correctPattern: "Greedy",
    starterCode: `def min_meeting_rooms(intervals: list) -> int:
    """
    Args:
        intervals: list of [start, end] pairs
    Returns:
        minimum number of rooms required

    Example:
        min_meeting_rooms([[0,30],[5,10],[15,20]]) -> 2
    """
    pass

import json
data = json.loads(input())
print(json.dumps(min_meeting_rooms(data["intervals"])))`,
    solutionCode: `def min_meeting_rooms(intervals: list) -> int:
    starts = sorted(i[0] for i in intervals)
    ends = sorted(i[1] for i in intervals)
    rooms = max_rooms = 0
    s = e = 0
    while s < len(starts):
        if starts[s] < ends[e]:
            rooms += 1
            max_rooms = max(max_rooms, rooms)
            s += 1
        else:
            rooms -= 1
            e += 1
    return max_rooms

import json
data = json.loads(input())
print(json.dumps(min_meeting_rooms(data["intervals"])))`,
    testCases: JSON.stringify([
      { input: { intervals: [[0, 30], [5, 10], [15, 20]] }, expectedOutput: 2 },
      { input: { intervals: [[7, 10], [2, 4]] }, expectedOutput: 1 },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { intervals: [[1, 5], [2, 6], [3, 7], [4, 8]] }, expectedOutput: 4 },
      { input: { intervals: [[1, 10], [10, 20]] }, expectedOutput: 1 },
    ]),
    hints: JSON.stringify(["Separate start and end times, sort them.", "Use two pointers: increment rooms when a meeting starts before the earliest ends."]),
  },
  {
    slug: "non-overlapping-intervals",
    title: "Non-overlapping Intervals",
    description: "Given an array of intervals, return the minimum number of intervals you need to remove to make the rest non-overlapping.",
    difficulty: "medium",
    pattern: "greedy",
    category: "greedy",
    phase: 3,
    weekNumber: 3,
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(1)",
    correctPattern: "Greedy",
    starterCode: `def erase_overlap_intervals(intervals: list) -> int:
    """
    Args:
        intervals: list of [start, end] pairs
    Returns:
        minimum removals to eliminate overlaps

    Example:
        erase_overlap_intervals([[1,2],[2,3],[3,4],[1,3]]) -> 1
    """
    pass

import json
data = json.loads(input())
print(json.dumps(erase_overlap_intervals(data["intervals"])))`,
    solutionCode: `def erase_overlap_intervals(intervals: list) -> int:
    intervals.sort(key=lambda x: x[1])
    count = 0
    end = float('-inf')
    for s, e in intervals:
        if s >= end:
            end = e
        else:
            count += 1
    return count

import json
data = json.loads(input())
print(json.dumps(erase_overlap_intervals(data["intervals"])))`,
    testCases: JSON.stringify([
      { input: { intervals: [[1, 2], [2, 3], [3, 4], [1, 3]] }, expectedOutput: 1 },
      { input: { intervals: [[1, 2], [1, 2], [1, 2]] }, expectedOutput: 2 },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { intervals: [[1, 100], [11, 22], [1, 11], [2, 12]] }, expectedOutput: 2 },
    ]),
    hints: JSON.stringify(["Sort by end time — classic activity selection.", "Greedily keep intervals that end earliest."]),
  },
  {
    slug: "boats-to-save-people",
    title: "Boats to Save People",
    description: "You are given an array `people` where `people[i]` is the weight of the ith person, and a `limit` for each boat. Each boat carries at most two people if their total weight is within the limit. Return the minimum number of boats.",
    difficulty: "medium",
    pattern: "greedy",
    category: "greedy",
    phase: 3,
    weekNumber: 3,
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(1)",
    correctPattern: "Greedy",
    starterCode: `def num_rescue_boats(people: list, limit: int) -> int:
    """
    Args:
        people: weights of people
        limit: weight limit per boat
    Returns:
        minimum number of boats

    Example:
        num_rescue_boats([3,2,2,1], 3) -> 3
    """
    pass

import json
data = json.loads(input())
print(json.dumps(num_rescue_boats(data["people"], data["limit"])))`,
    solutionCode: `def num_rescue_boats(people: list, limit: int) -> int:
    people.sort()
    left, right = 0, len(people) - 1
    boats = 0
    while left <= right:
        if people[left] + people[right] <= limit:
            left += 1
        right -= 1
        boats += 1
    return boats

import json
data = json.loads(input())
print(json.dumps(num_rescue_boats(data["people"], data["limit"])))`,
    testCases: JSON.stringify([
      { input: { people: [3, 2, 2, 1], limit: 3 }, expectedOutput: 3 },
      { input: { people: [1, 2], limit: 3 }, expectedOutput: 1 },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { people: [3, 5, 3, 4], limit: 5 }, expectedOutput: 4 },
      { input: { people: [2, 2], limit: 6 }, expectedOutput: 1 },
    ]),
    hints: JSON.stringify(["Sort people by weight.", "Try pairing the lightest with the heaviest using two pointers."]),
  },
  {
    slug: "maximum-units-on-truck",
    title: "Maximum Units on a Truck",
    description: "You are given a 2D array `boxTypes` where `boxTypes[i] = [numberOfBoxes, unitsPerBox]`. You have a truck that can hold `truckSize` boxes. Return the maximum total number of units that can be put on the truck.",
    difficulty: "easy",
    pattern: "greedy",
    category: "greedy",
    phase: 3,
    weekNumber: 3,
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(1)",
    correctPattern: "Greedy",
    starterCode: `def maximum_units(box_types: list, truck_size: int) -> int:
    """
    Args:
        box_types: list of [numberOfBoxes, unitsPerBox]
        truck_size: max boxes the truck can carry
    Returns:
        maximum total units

    Example:
        maximum_units([[1,3],[2,2],[3,1]], 4) -> 8
    """
    pass

import json
data = json.loads(input())
print(json.dumps(maximum_units(data["box_types"], data["truck_size"])))`,
    solutionCode: `def maximum_units(box_types: list, truck_size: int) -> int:
    box_types.sort(key=lambda x: -x[1])
    units = 0
    for count, per_box in box_types:
        take = min(count, truck_size)
        units += take * per_box
        truck_size -= take
        if truck_size == 0:
            break
    return units

import json
data = json.loads(input())
print(json.dumps(maximum_units(data["box_types"], data["truck_size"])))`,
    testCases: JSON.stringify([
      { input: { box_types: [[1, 3], [2, 2], [3, 1]], truck_size: 4 }, expectedOutput: 8 },
      { input: { box_types: [[5, 10], [2, 5], [4, 7], [3, 9]], truck_size: 10 }, expectedOutput: 91 },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { box_types: [[1, 1]], truck_size: 5 }, expectedOutput: 1 },
    ]),
    hints: JSON.stringify(["Sort by units per box in descending order.", "Greedily load the most valuable boxes first."]),
  },

  // ══════════════════════════════════════════════════════════════
  // BIT MANIPULATION (10 problems) — Category had 0 problems
  // ══════════════════════════════════════════════════════════════
  {
    slug: "single-number",
    title: "Single Number",
    description: "Given a non-empty array of integers where every element appears twice except for one, find that single element. Your solution should have O(1) space complexity.",
    difficulty: "easy",
    pattern: "bit-manipulation",
    category: "bit-manipulation",
    phase: 3,
    weekNumber: 3,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    correctPattern: "Bit Manipulation",
    starterCode: `def single_number(nums: list) -> int:
    """
    Find the number that appears only once.

    Example:
        single_number([2,2,1]) -> 1
        single_number([4,1,2,1,2]) -> 4
    """
    pass

import json
data = json.loads(input())
print(json.dumps(single_number(data["nums"])))`,
    solutionCode: `def single_number(nums: list) -> int:
    result = 0
    for n in nums:
        result ^= n
    return result

import json
data = json.loads(input())
print(json.dumps(single_number(data["nums"])))`,
    testCases: JSON.stringify([
      { input: { nums: [2, 2, 1] }, expectedOutput: 1 },
      { input: { nums: [4, 1, 2, 1, 2] }, expectedOutput: 4 },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { nums: [1] }, expectedOutput: 1 },
      { input: { nums: [0, 1, 0] }, expectedOutput: 1 },
    ]),
    hints: JSON.stringify(["XOR of a number with itself is 0.", "XOR of a number with 0 is the number itself."]),
  },
  {
    slug: "number-of-1-bits",
    title: "Number of 1 Bits",
    description: "Write a function that takes a non-negative integer and returns the number of '1' bits it has (also known as the Hamming weight).",
    difficulty: "easy",
    pattern: "bit-manipulation",
    category: "bit-manipulation",
    phase: 3,
    weekNumber: 3,
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
    correctPattern: "Bit Manipulation",
    starterCode: `def hamming_weight(n: int) -> int:
    """
    Count the number of 1 bits.

    Example:
        hamming_weight(11) -> 3  (binary: 1011)
    """
    pass

import json
data = json.loads(input())
print(json.dumps(hamming_weight(data["n"])))`,
    solutionCode: `def hamming_weight(n: int) -> int:
    count = 0
    while n:
        count += 1
        n &= n - 1
    return count

import json
data = json.loads(input())
print(json.dumps(hamming_weight(data["n"])))`,
    testCases: JSON.stringify([
      { input: { n: 11 }, expectedOutput: 3 },
      { input: { n: 128 }, expectedOutput: 1 },
      { input: { n: 255 }, expectedOutput: 8 },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { n: 0 }, expectedOutput: 0 },
      { input: { n: 1023 }, expectedOutput: 10 },
    ]),
    hints: JSON.stringify(["n & (n-1) clears the lowest set bit.", "Count how many times you can clear a set bit."]),
  },
  {
    slug: "counting-bits",
    title: "Counting Bits",
    description: "Given an integer `n`, return an array of length `n+1` where `ans[i]` is the number of 1's in the binary representation of `i`.",
    difficulty: "easy",
    pattern: "bit-manipulation",
    category: "bit-manipulation",
    phase: 3,
    weekNumber: 4,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    correctPattern: "Bit Manipulation",
    starterCode: `def count_bits(n: int) -> list:
    """
    Example:
        count_bits(5) -> [0,1,1,2,1,2]
    """
    pass

import json
data = json.loads(input())
print(json.dumps(count_bits(data["n"])))`,
    solutionCode: `def count_bits(n: int) -> list:
    dp = [0] * (n + 1)
    for i in range(1, n + 1):
        dp[i] = dp[i >> 1] + (i & 1)
    return dp

import json
data = json.loads(input())
print(json.dumps(count_bits(data["n"])))`,
    testCases: JSON.stringify([
      { input: { n: 2 }, expectedOutput: [0, 1, 1] },
      { input: { n: 5 }, expectedOutput: [0, 1, 1, 2, 1, 2] },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { n: 0 }, expectedOutput: [0] },
      { input: { n: 8 }, expectedOutput: [0, 1, 1, 2, 1, 2, 2, 3, 1] },
    ]),
    hints: JSON.stringify(["Use DP: bits(i) = bits(i >> 1) + (i & 1).", "i >> 1 removes the last bit, i & 1 checks if last bit is set."]),
  },
  {
    slug: "missing-number",
    title: "Missing Number",
    description: "Given an array `nums` containing `n` distinct numbers in the range `[0, n]`, return the only number in the range that is missing.",
    difficulty: "easy",
    pattern: "bit-manipulation",
    category: "bit-manipulation",
    phase: 3,
    weekNumber: 4,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    correctPattern: "Bit Manipulation",
    starterCode: `def missing_number(nums: list) -> int:
    """
    Example:
        missing_number([3,0,1]) -> 2
        missing_number([9,6,4,2,3,5,7,0,1]) -> 8
    """
    pass

import json
data = json.loads(input())
print(json.dumps(missing_number(data["nums"])))`,
    solutionCode: `def missing_number(nums: list) -> int:
    result = len(nums)
    for i, num in enumerate(nums):
        result ^= i ^ num
    return result

import json
data = json.loads(input())
print(json.dumps(missing_number(data["nums"])))`,
    testCases: JSON.stringify([
      { input: { nums: [3, 0, 1] }, expectedOutput: 2 },
      { input: { nums: [0, 1] }, expectedOutput: 2 },
      { input: { nums: [9, 6, 4, 2, 3, 5, 7, 0, 1] }, expectedOutput: 8 },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { nums: [0] }, expectedOutput: 1 },
      { input: { nums: [1] }, expectedOutput: 0 },
    ]),
    hints: JSON.stringify(["XOR all numbers 0..n with all numbers in the array.", "XOR of pairs cancels out, leaving the missing number."]),
  },
  {
    slug: "power-of-two",
    title: "Power of Two",
    description: "Given an integer `n`, return `True` if it is a power of two. Otherwise return `False`.",
    difficulty: "easy",
    pattern: "bit-manipulation",
    category: "bit-manipulation",
    phase: 3,
    weekNumber: 4,
    timeComplexity: "O(1)",
    spaceComplexity: "O(1)",
    correctPattern: "Bit Manipulation",
    starterCode: `def is_power_of_two(n: int) -> bool:
    """
    Example:
        is_power_of_two(1) -> True
        is_power_of_two(16) -> True
        is_power_of_two(3) -> False
    """
    pass

import json
data = json.loads(input())
print(json.dumps(is_power_of_two(data["n"])))`,
    solutionCode: `def is_power_of_two(n: int) -> bool:
    return n > 0 and (n & (n - 1)) == 0

import json
data = json.loads(input())
print(json.dumps(is_power_of_two(data["n"])))`,
    testCases: JSON.stringify([
      { input: { n: 1 }, expectedOutput: true },
      { input: { n: 16 }, expectedOutput: true },
      { input: { n: 3 }, expectedOutput: false },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { n: 0 }, expectedOutput: false },
      { input: { n: -16 }, expectedOutput: false },
      { input: { n: 1024 }, expectedOutput: true },
    ]),
    hints: JSON.stringify(["A power of two has exactly one set bit.", "n & (n-1) removes the lowest set bit — if result is 0, it was a power of two."]),
  },
  {
    slug: "sum-of-two-integers",
    title: "Sum of Two Integers",
    description: "Given two integers `a` and `b`, return their sum without using the `+` or `-` operators.",
    difficulty: "medium",
    pattern: "bit-manipulation",
    category: "bit-manipulation",
    phase: 3,
    weekNumber: 4,
    timeComplexity: "O(1)",
    spaceComplexity: "O(1)",
    correctPattern: "Bit Manipulation",
    starterCode: `def get_sum(a: int, b: int) -> int:
    """
    Example:
        get_sum(1, 2) -> 3
        get_sum(-2, 3) -> 1
    """
    pass

import json
data = json.loads(input())
print(json.dumps(get_sum(data["a"], data["b"])))`,
    solutionCode: `def get_sum(a: int, b: int) -> int:
    MASK = 0xFFFFFFFF
    MAX = 0x7FFFFFFF
    while b & MASK:
        carry = (a & b) << 1
        a = a ^ b
        b = carry
    return a & MASK if a > MAX else a if b == 0 else a

import json
data = json.loads(input())
print(json.dumps(get_sum(data["a"], data["b"])))`,
    testCases: JSON.stringify([
      { input: { a: 1, b: 2 }, expectedOutput: 3 },
      { input: { a: 2, b: 3 }, expectedOutput: 5 },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { a: 0, b: 0 }, expectedOutput: 0 },
      { input: { a: -1, b: 1 }, expectedOutput: 0 },
    ]),
    hints: JSON.stringify(["XOR gives the sum without carry.", "AND then left-shift gives the carry."]),
  },
  {
    slug: "reverse-bits",
    title: "Reverse Bits",
    description: "Reverse the bits of a given 32-bit unsigned integer.",
    difficulty: "easy",
    pattern: "bit-manipulation",
    category: "bit-manipulation",
    phase: 3,
    weekNumber: 4,
    timeComplexity: "O(1)",
    spaceComplexity: "O(1)",
    correctPattern: "Bit Manipulation",
    starterCode: `def reverse_bits(n: int) -> int:
    """
    Reverse bits of a 32-bit unsigned integer.

    Example:
        reverse_bits(43261596) -> 964176192
    """
    pass

import json
data = json.loads(input())
print(json.dumps(reverse_bits(data["n"])))`,
    solutionCode: `def reverse_bits(n: int) -> int:
    result = 0
    for _ in range(32):
        result = (result << 1) | (n & 1)
        n >>= 1
    return result

import json
data = json.loads(input())
print(json.dumps(reverse_bits(data["n"])))`,
    testCases: JSON.stringify([
      { input: { n: 43261596 }, expectedOutput: 964176192 },
      { input: { n: 0 }, expectedOutput: 0 },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { n: 1 }, expectedOutput: 2147483648 },
      { input: { n: 4294967295 }, expectedOutput: 4294967295 },
    ]),
    hints: JSON.stringify(["Extract the last bit of n and append it to result.", "Repeat 32 times, shifting n right and result left."]),
  },
  {
    slug: "decode-xor-array",
    title: "Decode XORed Array",
    description: "Given the encoded array where `encoded[i] = arr[i] XOR arr[i+1]` and the `first` element, reconstruct the original array.",
    difficulty: "easy",
    pattern: "bit-manipulation",
    category: "bit-manipulation",
    phase: 3,
    weekNumber: 5,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    correctPattern: "Bit Manipulation",
    starterCode: `def decode(encoded: list, first: int) -> list:
    """
    Example:
        decode([1,2,3], 1) -> [1,0,2,1]
    """
    pass

import json
data = json.loads(input())
print(json.dumps(decode(data["encoded"], data["first"])))`,
    solutionCode: `def decode(encoded: list, first: int) -> list:
    arr = [first]
    for e in encoded:
        arr.append(arr[-1] ^ e)
    return arr

import json
data = json.loads(input())
print(json.dumps(decode(data["encoded"], data["first"])))`,
    testCases: JSON.stringify([
      { input: { encoded: [1, 2, 3], first: 1 }, expectedOutput: [1, 0, 2, 1] },
      { input: { encoded: [6, 2, 7, 3], first: 4 }, expectedOutput: [4, 2, 0, 7, 4] },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { encoded: [0], first: 5 }, expectedOutput: [5, 5] },
    ]),
    hints: JSON.stringify(["If encoded[i] = arr[i] XOR arr[i+1], then arr[i+1] = arr[i] XOR encoded[i].", "Build the array left to right using XOR."]),
  },
  {
    slug: "hamming-distance",
    title: "Hamming Distance",
    description: "The Hamming distance between two integers is the number of positions at which the corresponding bits are different. Given two integers `x` and `y`, return the Hamming distance between them.",
    difficulty: "easy",
    pattern: "bit-manipulation",
    category: "bit-manipulation",
    phase: 3,
    weekNumber: 5,
    timeComplexity: "O(1)",
    spaceComplexity: "O(1)",
    correctPattern: "Bit Manipulation",
    starterCode: `def hamming_distance(x: int, y: int) -> int:
    """
    Example:
        hamming_distance(1, 4) -> 2
    """
    pass

import json
data = json.loads(input())
print(json.dumps(hamming_distance(data["x"], data["y"])))`,
    solutionCode: `def hamming_distance(x: int, y: int) -> int:
    xor = x ^ y
    count = 0
    while xor:
        count += 1
        xor &= xor - 1
    return count

import json
data = json.loads(input())
print(json.dumps(hamming_distance(data["x"], data["y"])))`,
    testCases: JSON.stringify([
      { input: { x: 1, y: 4 }, expectedOutput: 2 },
      { input: { x: 3, y: 1 }, expectedOutput: 1 },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { x: 0, y: 0 }, expectedOutput: 0 },
      { input: { x: 15, y: 0 }, expectedOutput: 4 },
    ]),
    hints: JSON.stringify(["XOR the two numbers to get bits that differ.", "Count the set bits of the XOR result."]),
  },
  {
    slug: "single-number-ii",
    title: "Single Number II",
    description: "Given an integer array where every element appears three times except for one, find that single element. Your solution should have O(1) space complexity.",
    difficulty: "medium",
    pattern: "bit-manipulation",
    category: "bit-manipulation",
    phase: 3,
    weekNumber: 5,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    correctPattern: "Bit Manipulation",
    starterCode: `def single_number_ii(nums: list) -> int:
    """
    Example:
        single_number_ii([2,2,3,2]) -> 3
        single_number_ii([0,1,0,1,0,1,99]) -> 99
    """
    pass

import json
data = json.loads(input())
print(json.dumps(single_number_ii(data["nums"])))`,
    solutionCode: `def single_number_ii(nums: list) -> int:
    ones = twos = 0
    for n in nums:
        ones = (ones ^ n) & ~twos
        twos = (twos ^ n) & ~ones
    return ones

import json
data = json.loads(input())
print(json.dumps(single_number_ii(data["nums"])))`,
    testCases: JSON.stringify([
      { input: { nums: [2, 2, 3, 2] }, expectedOutput: 3 },
      { input: { nums: [0, 1, 0, 1, 0, 1, 99] }, expectedOutput: 99 },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { nums: [1] }, expectedOutput: 1 },
      { input: { nums: [30000, 500, 100, 30000, 100, 30000, 100] }, expectedOutput: 500 },
    ]),
    hints: JSON.stringify(["Use two bitmasks: ones and twos.", "ones tracks bits that appeared 1 mod 3 times, twos tracks 2 mod 3."]),
  },

  // ══════════════════════════════════════════════════════════════
  // TRIE (5 problems) — Only 1 existed (design-add-search-words)
  // ══════════════════════════════════════════════════════════════
  {
    slug: "implement-trie",
    title: "Implement Trie (Prefix Tree)",
    description: "Implement a trie with `insert`, `search`, and `starts_with` methods. `search` returns True if the word is in the trie. `starts_with` returns True if there is any word with that prefix.",
    difficulty: "medium",
    pattern: "trie",
    category: "trie",
    phase: 4,
    weekNumber: 1,
    timeComplexity: "O(m)",
    spaceComplexity: "O(m)",
    correctPattern: "Trie",
    starterCode: `def run_trie(operations: list, args: list) -> list:
    """
    Simulate trie operations.

    operations: list of method names
    args: list of argument lists

    Example:
        run_trie(["insert","search","startsWith"], [["apple"],["apple"],["app"]]) -> [null, true, true]
    """
    pass

import json
data = json.loads(input())
result = run_trie(data["operations"], data["args"])
print(json.dumps(result))`,
    solutionCode: `def run_trie(operations, args):
    class TrieNode:
        def __init__(self):
            self.children = {}
            self.is_end = False

    root = TrieNode()
    results = []

    for op, arg in zip(operations, args):
        if op == "insert":
            node = root
            for c in arg[0]:
                if c not in node.children:
                    node.children[c] = TrieNode()
                node = node.children[c]
            node.is_end = True
            results.append(None)
        elif op == "search":
            node = root
            found = True
            for c in arg[0]:
                if c not in node.children:
                    found = False
                    break
                node = node.children[c]
            results.append(found and node.is_end)
        elif op == "startsWith":
            node = root
            found = True
            for c in arg[0]:
                if c not in node.children:
                    found = False
                    break
                node = node.children[c]
            results.append(found)
    return results

import json
data = json.loads(input())
result = run_trie(data["operations"], data["args"])
print(json.dumps(result))`,
    testCases: JSON.stringify([
      { input: { operations: ["insert", "search", "search", "startsWith"], args: [["apple"], ["apple"], ["app"], ["app"]] }, expectedOutput: [null, true, false, true] },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { operations: ["insert", "insert", "search", "startsWith"], args: [["app"], ["apple"], ["app"], ["apple"]] }, expectedOutput: [null, null, true, true] },
    ]),
    hints: JSON.stringify(["Each node has a dictionary of children and a boolean for word end.", "Traverse character by character."]),
  },
  {
    slug: "replace-words",
    title: "Replace Words",
    description: "Given a list of `roots` (prefixes) and a `sentence`, replace all successors in the sentence with their shortest root. If a word has multiple roots, use the shortest one.",
    difficulty: "medium",
    pattern: "trie",
    category: "trie",
    phase: 4,
    weekNumber: 1,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    correctPattern: "Trie",
    starterCode: `def replace_words(dictionary: list, sentence: str) -> str:
    """
    Example:
        replace_words(["cat","bat","rat"], "the cattle was rattled by the battery") 
        -> "the cat was rat by the bat"
    """
    pass

import json
data = json.loads(input())
print(json.dumps(replace_words(data["dictionary"], data["sentence"])))`,
    solutionCode: `def replace_words(dictionary: list, sentence: str) -> str:
    trie = {}
    for root in dictionary:
        node = trie
        for c in root:
            node = node.setdefault(c, {})
        node['#'] = root

    words = sentence.split()
    result = []
    for word in words:
        node = trie
        replaced = False
        for c in word:
            if '#' in node:
                result.append(node['#'])
                replaced = True
                break
            if c not in node:
                break
            node = node[c]
        if not replaced:
            if '#' in node:
                result.append(node['#'])
            else:
                result.append(word)
    return ' '.join(result)

import json
data = json.loads(input())
print(json.dumps(replace_words(data["dictionary"], data["sentence"])))`,
    testCases: JSON.stringify([
      { input: { dictionary: ["cat", "bat", "rat"], sentence: "the cattle was rattled by the battery" }, expectedOutput: "the cat was rat by the bat" },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { dictionary: ["a", "aa", "aaa"], sentence: "aaa aab aac" }, expectedOutput: "a a a" },
    ]),
    hints: JSON.stringify(["Build a trie from all roots.", "For each word, traverse the trie to find the shortest matching root."]),
  },
  {
    slug: "search-suggestions-system",
    title: "Search Suggestions System",
    description: "Given an array of products and a search word, return a list of lists: for each character typed, return the top 3 lexicographically smallest matching products.",
    difficulty: "medium",
    pattern: "trie",
    category: "trie",
    phase: 4,
    weekNumber: 1,
    timeComplexity: "O(n log n + m*n)",
    spaceComplexity: "O(n)",
    correctPattern: "Trie",
    starterCode: `def suggested_products(products: list, search_word: str) -> list:
    """
    Example:
        suggested_products(["mobile","mouse","moneypot","monitor","mousepad"], "mouse")
        -> [["mobile","moneypot","monitor"],["mobile","moneypot","monitor"],["mouse","mousepad"],["mouse","mousepad"],["mouse","mousepad"]]
    """
    pass

import json
data = json.loads(input())
print(json.dumps(suggested_products(data["products"], data["search_word"])))`,
    solutionCode: `def suggested_products(products: list, search_word: str) -> list:
    products.sort()
    result = []
    prefix = ""
    start = 0
    for c in search_word:
        prefix += c
        # Binary search for first product >= prefix
        lo, hi = start, len(products)
        while lo < hi:
            mid = (lo + hi) // 2
            if products[mid] < prefix:
                lo = mid + 1
            else:
                hi = mid
        start = lo
        matches = []
        for i in range(start, min(start + 3, len(products))):
            if products[i].startswith(prefix):
                matches.append(products[i])
            else:
                break
        result.append(matches)
    return result

import json
data = json.loads(input())
print(json.dumps(suggested_products(data["products"], data["search_word"])))`,
    testCases: JSON.stringify([
      { input: { products: ["mobile", "mouse", "moneypot", "monitor", "mousepad"], search_word: "mouse" }, expectedOutput: [["mobile", "moneypot", "monitor"], ["mobile", "moneypot", "monitor"], ["mouse", "mousepad"], ["mouse", "mousepad"], ["mouse", "mousepad"]] },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { products: ["havana"], search_word: "havana" }, expectedOutput: [["havana"], ["havana"], ["havana"], ["havana"], ["havana"], ["havana"]] },
    ]),
    hints: JSON.stringify(["Sort products first.", "Use binary search to find matching prefixes efficiently."]),
  },
  {
    slug: "longest-word-in-dictionary",
    title: "Longest Word in Dictionary",
    description: "Given an array of strings `words`, return the longest word that can be built one character at a time by other words. If there are multiple answers, return the lexicographically smallest.",
    difficulty: "medium",
    pattern: "trie",
    category: "trie",
    phase: 4,
    weekNumber: 2,
    timeComplexity: "O(n * m)",
    spaceComplexity: "O(n * m)",
    correctPattern: "Trie",
    starterCode: `def longest_word(words: list) -> str:
    """
    Example:
        longest_word(["w","wo","wor","worl","world"]) -> "world"
    """
    pass

import json
data = json.loads(input())
print(json.dumps(longest_word(data["words"])))`,
    solutionCode: `def longest_word(words: list) -> str:
    word_set = set(words)
    words.sort(key=lambda w: (-len(w), w))
    for word in words:
        if all(word[:i] in word_set for i in range(1, len(word))):
            return word
    return ""

import json
data = json.loads(input())
print(json.dumps(longest_word(data["words"])))`,
    testCases: JSON.stringify([
      { input: { words: ["w", "wo", "wor", "worl", "world"] }, expectedOutput: "world" },
      { input: { words: ["a", "banana", "app", "appl", "ap", "apply", "apple"] }, expectedOutput: "apple" },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { words: ["b", "br", "bre", "brea", "break", "breakf", "breakfa", "breakfas", "breakfast"] }, expectedOutput: "breakfast" },
    ]),
    hints: JSON.stringify(["Sort by length desc, then lexicographically.", "Check if all prefixes of a word exist in the set."]),
  },
  {
    slug: "map-sum-pairs",
    title: "Map Sum Pairs",
    description: "Implement a MapSum class. `insert(key, val)` inserts or updates a key-value pair. `sum(prefix)` returns the sum of all values whose key starts with the given prefix.",
    difficulty: "medium",
    pattern: "trie",
    category: "trie",
    phase: 4,
    weekNumber: 2,
    timeComplexity: "O(m)",
    spaceComplexity: "O(n * m)",
    correctPattern: "Trie",
    starterCode: `def run_map_sum(operations: list, args: list) -> list:
    """
    Example:
        run_map_sum(["insert","sum","insert","sum"], [["apple",3],["ap"],["app",2],["ap"]])
        -> [null, 3, null, 5]
    """
    pass

import json
data = json.loads(input())
print(json.dumps(run_map_sum(data["operations"], data["args"])))`,
    solutionCode: `def run_map_sum(operations, args):
    data_map = {}
    results = []
    for op, arg in zip(operations, args):
        if op == "insert":
            data_map[arg[0]] = arg[1]
            results.append(None)
        elif op == "sum":
            prefix = arg[0]
            total = sum(v for k, v in data_map.items() if k.startswith(prefix))
            results.append(total)
    return results

import json
data = json.loads(input())
print(json.dumps(run_map_sum(data["operations"], data["args"])))`,
    testCases: JSON.stringify([
      { input: { operations: ["insert", "sum", "insert", "sum"], args: [["apple", 3], ["ap"], ["app", 2], ["ap"]] }, expectedOutput: [null, 3, null, 5] },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { operations: ["insert", "insert", "sum"], args: [["aa", 3], ["ab", 2], ["a"]] }, expectedOutput: [null, null, 5] },
    ]),
    hints: JSON.stringify(["A simple dict approach works: iterate keys matching the prefix.", "For optimization, use a Trie storing cumulative sums at each node."]),
  },

  // ══════════════════════════════════════════════════════════════
  // HEAP / PRIORITY QUEUE (8 problems) — Only 2 existed
  // ══════════════════════════════════════════════════════════════
  {
    slug: "merge-k-sorted-lists",
    title: "Merge K Sorted Lists",
    description: "You are given an array of `k` sorted linked lists (each represented as a sorted array). Merge all into one sorted array.",
    difficulty: "hard",
    pattern: "heap",
    category: "heaps",
    phase: 4,
    weekNumber: 2,
    timeComplexity: "O(N log k)",
    spaceComplexity: "O(k)",
    correctPattern: "Heap",
    starterCode: `def merge_k_sorted(lists: list) -> list:
    """
    Merge k sorted arrays into one sorted array.

    Example:
        merge_k_sorted([[1,4,5],[1,3,4],[2,6]]) -> [1,1,2,3,4,4,5,6]
    """
    pass

import json
data = json.loads(input())
print(json.dumps(merge_k_sorted(data["lists"])))`,
    solutionCode: `def merge_k_sorted(lists: list) -> list:
    import heapq
    heap = []
    for i, lst in enumerate(lists):
        if lst:
            heapq.heappush(heap, (lst[0], i, 0))
    result = []
    while heap:
        val, list_idx, elem_idx = heapq.heappop(heap)
        result.append(val)
        if elem_idx + 1 < len(lists[list_idx]):
            heapq.heappush(heap, (lists[list_idx][elem_idx + 1], list_idx, elem_idx + 1))
    return result

import json
data = json.loads(input())
print(json.dumps(merge_k_sorted(data["lists"])))`,
    testCases: JSON.stringify([
      { input: { lists: [[1, 4, 5], [1, 3, 4], [2, 6]] }, expectedOutput: [1, 1, 2, 3, 4, 4, 5, 6] },
      { input: { lists: [] }, expectedOutput: [] },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { lists: [[]] }, expectedOutput: [] },
      { input: { lists: [[1], [0]] }, expectedOutput: [0, 1] },
    ]),
    hints: JSON.stringify(["Use a min-heap of size k.", "Push (value, list_index, element_index) tuples."]),
  },
  {
    slug: "k-closest-points",
    title: "K Closest Points to Origin",
    description: "Given an array of points `[[x, y], ...]` and an integer `k`, return the `k` closest points to the origin `(0, 0)`.",
    difficulty: "medium",
    pattern: "heap",
    category: "heaps",
    phase: 4,
    weekNumber: 2,
    timeComplexity: "O(n log k)",
    spaceComplexity: "O(k)",
    correctPattern: "Heap",
    starterCode: `def k_closest(points: list, k: int) -> list:
    """
    Example:
        k_closest([[1,3],[-2,2]], 1) -> [[-2,2]]
    """
    pass

import json
data = json.loads(input())
result = k_closest(data["points"], data["k"])
print(json.dumps(sorted(result)))`,
    solutionCode: `def k_closest(points: list, k: int) -> list:
    import heapq
    heap = []
    for x, y in points:
        dist = x * x + y * y
        if len(heap) < k:
            heapq.heappush(heap, (-dist, [x, y]))
        elif -dist > heap[0][0]:
            heapq.heapreplace(heap, (-dist, [x, y]))
    return [p for _, p in heap]

import json
data = json.loads(input())
result = k_closest(data["points"], data["k"])
print(json.dumps(sorted(result)))`,
    testCases: JSON.stringify([
      { input: { points: [[1, 3], [-2, 2]], k: 1 }, expectedOutput: [[-2, 2]] },
      { input: { points: [[3, 3], [5, -1], [-2, 4]], k: 2 }, expectedOutput: [[-2, 4], [3, 3]] },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { points: [[0, 1], [1, 0]], k: 2 }, expectedOutput: [[0, 1], [1, 0]] },
    ]),
    hints: JSON.stringify(["Use a max-heap of size k (negate distances).", "No need to compute square root for comparison."]),
  },
  {
    slug: "last-stone-weight",
    title: "Last Stone Weight",
    description: "You have a collection of stones with positive integer weights. Each turn, pick the two heaviest stones and smash them. If they have equal weight, both are destroyed. Otherwise, the lighter is destroyed and the heavier loses weight equal to the lighter. Return the weight of the last remaining stone (or 0 if none).",
    difficulty: "easy",
    pattern: "heap",
    category: "heaps",
    phase: 4,
    weekNumber: 3,
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    correctPattern: "Heap",
    starterCode: `def last_stone_weight(stones: list) -> int:
    """
    Example:
        last_stone_weight([2,7,4,1,8,1]) -> 1
    """
    pass

import json
data = json.loads(input())
print(json.dumps(last_stone_weight(data["stones"])))`,
    solutionCode: `def last_stone_weight(stones: list) -> int:
    import heapq
    heap = [-s for s in stones]
    heapq.heapify(heap)
    while len(heap) > 1:
        a = -heapq.heappop(heap)
        b = -heapq.heappop(heap)
        if a != b:
            heapq.heappush(heap, -(a - b))
    return -heap[0] if heap else 0

import json
data = json.loads(input())
print(json.dumps(last_stone_weight(data["stones"])))`,
    testCases: JSON.stringify([
      { input: { stones: [2, 7, 4, 1, 8, 1] }, expectedOutput: 1 },
      { input: { stones: [1] }, expectedOutput: 1 },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { stones: [2, 2] }, expectedOutput: 0 },
      { input: { stones: [10, 4, 2, 10] }, expectedOutput: 2 },
    ]),
    hints: JSON.stringify(["Use a max-heap (negate values in Python's min-heap).", "Keep smashing until 1 or 0 stones remain."]),
  },
  {
    slug: "reorganize-string",
    title: "Reorganize String",
    description: "Given a string `s`, rearrange its characters so that no two adjacent characters are the same. Return any valid rearrangement, or `\"\"` if impossible.",
    difficulty: "medium",
    pattern: "heap",
    category: "heaps",
    phase: 4,
    weekNumber: 3,
    timeComplexity: "O(n log k)",
    spaceComplexity: "O(k)",
    correctPattern: "Heap",
    starterCode: `def reorganize_string(s: str) -> str:
    """
    Example:
        reorganize_string("aab") -> "aba"
    """
    pass

import json
data = json.loads(input())
print(json.dumps(reorganize_string(data["s"])))`,
    solutionCode: `def reorganize_string(s: str) -> str:
    from collections import Counter
    import heapq
    freq = Counter(s)
    max_freq = max(freq.values())
    if max_freq > (len(s) + 1) // 2:
        return ""
    heap = [(-count, char) for char, count in freq.items()]
    heapq.heapify(heap)
    result = []
    prev = (0, '')
    while heap:
        count, char = heapq.heappop(heap)
        result.append(char)
        if prev[0] < 0:
            heapq.heappush(heap, prev)
        prev = (count + 1, char)
    return ''.join(result)

import json
data = json.loads(input())
print(json.dumps(reorganize_string(data["s"])))`,
    testCases: JSON.stringify([
      { input: { s: "aab" }, expectedOutput: "aba" },
      { input: { s: "aaab" }, expectedOutput: "" },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { s: "a" }, expectedOutput: "a" },
      { input: { s: "aabb" }, expectedOutput: "abab" },
    ]),
    hints: JSON.stringify(["If the most frequent char count > (n+1)/2, it's impossible.", "Use a max-heap, always place the most frequent char that isn't the previous one."]),
  },
  {
    slug: "sort-characters-by-frequency",
    title: "Sort Characters by Frequency",
    description: "Given a string `s`, sort it in decreasing order based on the frequency of the characters. Return any valid answer.",
    difficulty: "medium",
    pattern: "heap",
    category: "heaps",
    phase: 4,
    weekNumber: 3,
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    correctPattern: "Heap",
    starterCode: `def frequency_sort(s: str) -> str:
    """
    Example:
        frequency_sort("tree") -> "eert" or "eetr"
    """
    pass

import json
data = json.loads(input())
print(json.dumps(frequency_sort(data["s"])))`,
    solutionCode: `def frequency_sort(s: str) -> str:
    from collections import Counter
    freq = Counter(s)
    return ''.join(c * count for c, count in freq.most_common())

import json
data = json.loads(input())
print(json.dumps(frequency_sort(data["s"])))`,
    testCases: JSON.stringify([
      { input: { s: "tree" }, expectedOutput: "eert" },
      { input: { s: "cccaaa" }, expectedOutput: "cccaaa" },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { s: "Aabb" }, expectedOutput: "bbAa" },
    ]),
    hints: JSON.stringify(["Count character frequencies.", "Sort by frequency in descending order and rebuild the string."]),
  },
  {
    slug: "find-median-from-stream",
    title: "Find Median from Data Stream",
    description: "Implement a data structure that supports `add_num(num)` to add a number and `find_median()` to return the current median. If count is even, return the average of the two middle values.",
    difficulty: "hard",
    pattern: "heap",
    category: "heaps",
    phase: 5,
    weekNumber: 1,
    timeComplexity: "O(log n)",
    spaceComplexity: "O(n)",
    correctPattern: "Heap",
    starterCode: `def run_median_finder(operations: list, args: list) -> list:
    """
    Example:
        run_median_finder(["addNum","addNum","findMedian","addNum","findMedian"],
                          [[1],[2],[],[3],[]]) -> [null, null, 1.5, null, 2.0]
    """
    pass

import json
data = json.loads(input())
print(json.dumps(run_median_finder(data["operations"], data["args"])))`,
    solutionCode: `def run_median_finder(operations, args):
    import heapq
    lo = []  # max-heap (negated)
    hi = []  # min-heap
    results = []
    for op, arg in zip(operations, args):
        if op == "addNum":
            num = arg[0]
            heapq.heappush(lo, -num)
            heapq.heappush(hi, -heapq.heappop(lo))
            if len(hi) > len(lo):
                heapq.heappush(lo, -heapq.heappop(hi))
            results.append(None)
        elif op == "findMedian":
            if len(lo) > len(hi):
                results.append(float(-lo[0]))
            else:
                results.append((-lo[0] + hi[0]) / 2.0)
    return results

import json
data = json.loads(input())
print(json.dumps(run_median_finder(data["operations"], data["args"])))`,
    testCases: JSON.stringify([
      { input: { operations: ["addNum", "addNum", "findMedian", "addNum", "findMedian"], args: [[1], [2], [], [3], []] }, expectedOutput: [null, null, 1.5, null, 2.0] },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { operations: ["addNum", "findMedian"], args: [[5], []] }, expectedOutput: [null, 5.0] },
    ]),
    hints: JSON.stringify(["Use two heaps: a max-heap for the lower half and a min-heap for the upper half.", "Keep the heaps balanced (lo can have at most one extra element)."]),
  },
  {
    slug: "kth-largest-in-stream",
    title: "Kth Largest Element in Stream",
    description: "Design a class that finds the kth largest element in a stream. Implement `add(val)` which returns the kth largest element after adding val.",
    difficulty: "easy",
    pattern: "heap",
    category: "heaps",
    phase: 4,
    weekNumber: 4,
    timeComplexity: "O(log k)",
    spaceComplexity: "O(k)",
    correctPattern: "Heap",
    starterCode: `def run_kth_largest(k: int, nums: list, adds: list) -> list:
    """
    Initialize with k and nums, then add each value in adds.
    Return the kth largest after each add.

    Example:
        run_kth_largest(3, [4,5,8,2], [3,5,10,9,4]) -> [4,5,5,8,8]
    """
    pass

import json
data = json.loads(input())
print(json.dumps(run_kth_largest(data["k"], data["nums"], data["adds"])))`,
    solutionCode: `def run_kth_largest(k, nums, adds):
    import heapq
    heap = nums[:]
    heapq.heapify(heap)
    while len(heap) > k:
        heapq.heappop(heap)
    results = []
    for val in adds:
        heapq.heappush(heap, val)
        if len(heap) > k:
            heapq.heappop(heap)
        results.append(heap[0])
    return results

import json
data = json.loads(input())
print(json.dumps(run_kth_largest(data["k"], data["nums"], data["adds"])))`,
    testCases: JSON.stringify([
      { input: { k: 3, nums: [4, 5, 8, 2], adds: [3, 5, 10, 9, 4] }, expectedOutput: [4, 5, 5, 8, 8] },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { k: 1, nums: [], adds: [1, 2, 3] }, expectedOutput: [1, 2, 3] },
    ]),
    hints: JSON.stringify(["Maintain a min-heap of size k.", "The top of the heap is always the kth largest."]),
  },
  {
    slug: "top-k-frequent-words",
    title: "Top K Frequent Words",
    description: "Given an array of strings `words` and an integer `k`, return the `k` most frequent strings sorted by frequency (highest first). If two words have the same frequency, sort them alphabetically.",
    difficulty: "medium",
    pattern: "heap",
    category: "heaps",
    phase: 4,
    weekNumber: 4,
    timeComplexity: "O(n log k)",
    spaceComplexity: "O(n)",
    correctPattern: "Heap",
    starterCode: `def top_k_frequent(words: list, k: int) -> list:
    """
    Example:
        top_k_frequent(["i","love","leetcode","i","love","coding"], 2) -> ["i","love"]
    """
    pass

import json
data = json.loads(input())
print(json.dumps(top_k_frequent(data["words"], data["k"])))`,
    solutionCode: `def top_k_frequent(words: list, k: int) -> list:
    from collections import Counter
    freq = Counter(words)
    return sorted(freq, key=lambda w: (-freq[w], w))[:k]

import json
data = json.loads(input())
print(json.dumps(top_k_frequent(data["words"], data["k"])))`,
    testCases: JSON.stringify([
      { input: { words: ["i", "love", "leetcode", "i", "love", "coding"], k: 2 }, expectedOutput: ["i", "love"] },
      { input: { words: ["the", "day", "is", "sunny", "the", "the", "the", "sunny", "is", "is"], k: 4 }, expectedOutput: ["the", "is", "sunny", "day"] },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { words: ["a", "b", "c"], k: 3 }, expectedOutput: ["a", "b", "c"] },
    ]),
    hints: JSON.stringify(["Count frequencies with a Counter.", "Sort by (-frequency, word) to get descending freq with alphabetical tiebreak."]),
  },

  // ══════════════════════════════════════════════════════════════
  // STACK (6 problems) — Only 2 existed
  // ══════════════════════════════════════════════════════════════
  {
    slug: "daily-temperatures",
    title: "Daily Temperatures",
    description: "Given an array of daily temperatures, return an array where `answer[i]` is the number of days you would have to wait until a warmer temperature. If there is no future warmer day, put 0.",
    difficulty: "medium",
    pattern: "stack",
    category: "stacks",
    phase: 2,
    weekNumber: 3,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    correctPattern: "Stack",
    starterCode: `def daily_temperatures(temperatures: list) -> list:
    """
    Example:
        daily_temperatures([73,74,75,71,69,72,76,73]) -> [1,1,4,2,1,1,0,0]
    """
    pass

import json
data = json.loads(input())
print(json.dumps(daily_temperatures(data["temperatures"])))`,
    solutionCode: `def daily_temperatures(temperatures: list) -> list:
    n = len(temperatures)
    answer = [0] * n
    stack = []
    for i, temp in enumerate(temperatures):
        while stack and temperatures[stack[-1]] < temp:
            j = stack.pop()
            answer[j] = i - j
        stack.append(i)
    return answer

import json
data = json.loads(input())
print(json.dumps(daily_temperatures(data["temperatures"])))`,
    testCases: JSON.stringify([
      { input: { temperatures: [73, 74, 75, 71, 69, 72, 76, 73] }, expectedOutput: [1, 1, 4, 2, 1, 1, 0, 0] },
      { input: { temperatures: [30, 40, 50, 60] }, expectedOutput: [1, 1, 1, 0] },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { temperatures: [30, 60, 90] }, expectedOutput: [1, 1, 0] },
      { input: { temperatures: [90, 80, 70] }, expectedOutput: [0, 0, 0] },
    ]),
    hints: JSON.stringify(["Use a monotonic decreasing stack of indices.", "When you find a warmer day, pop and calculate the difference."]),
  },
  {
    slug: "evaluate-reverse-polish",
    title: "Evaluate Reverse Polish Notation",
    description: "Evaluate an arithmetic expression in Reverse Polish Notation. Valid operators are `+`, `-`, `*`, `/`. Each operand may be an integer or another expression. Division truncates toward zero.",
    difficulty: "medium",
    pattern: "stack",
    category: "stacks",
    phase: 2,
    weekNumber: 3,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    correctPattern: "Stack",
    starterCode: `def eval_rpn(tokens: list) -> int:
    """
    Example:
        eval_rpn(["2","1","+","3","*"]) -> 9
    """
    pass

import json
data = json.loads(input())
print(json.dumps(eval_rpn(data["tokens"])))`,
    solutionCode: `def eval_rpn(tokens: list) -> int:
    stack = []
    for t in tokens:
        if t in "+-*/":
            b, a = stack.pop(), stack.pop()
            if t == '+': stack.append(a + b)
            elif t == '-': stack.append(a - b)
            elif t == '*': stack.append(a * b)
            else: stack.append(int(a / b))
        else:
            stack.append(int(t))
    return stack[0]

import json
data = json.loads(input())
print(json.dumps(eval_rpn(data["tokens"])))`,
    testCases: JSON.stringify([
      { input: { tokens: ["2", "1", "+", "3", "*"] }, expectedOutput: 9 },
      { input: { tokens: ["4", "13", "5", "/", "+"] }, expectedOutput: 6 },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { tokens: ["10", "6", "9", "3", "+", "-11", "*", "/", "*", "17", "+", "5", "+"] }, expectedOutput: 22 },
    ]),
    hints: JSON.stringify(["Push numbers onto the stack.", "When you see an operator, pop two operands, compute, and push the result."]),
  },
  {
    slug: "decode-string",
    title: "Decode String",
    description: "Given an encoded string like `k[encoded_string]`, decode it by repeating `encoded_string` k times. The encoding may be nested.",
    difficulty: "medium",
    pattern: "stack",
    category: "stacks",
    phase: 2,
    weekNumber: 4,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    correctPattern: "Stack",
    starterCode: `def decode_string(s: str) -> str:
    """
    Example:
        decode_string("3[a]2[bc]") -> "aaabcbc"
        decode_string("3[a2[c]]") -> "accaccacc"
    """
    pass

import json
data = json.loads(input())
print(json.dumps(decode_string(data["s"])))`,
    solutionCode: `def decode_string(s: str) -> str:
    stack = []
    current = ""
    num = 0
    for c in s:
        if c.isdigit():
            num = num * 10 + int(c)
        elif c == '[':
            stack.append((current, num))
            current = ""
            num = 0
        elif c == ']':
            prev, count = stack.pop()
            current = prev + current * count
        else:
            current += c
    return current

import json
data = json.loads(input())
print(json.dumps(decode_string(data["s"])))`,
    testCases: JSON.stringify([
      { input: { s: "3[a]2[bc]" }, expectedOutput: "aaabcbc" },
      { input: { s: "3[a2[c]]" }, expectedOutput: "accaccacc" },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { s: "2[abc]3[cd]ef" }, expectedOutput: "abcabccdcdcdef" },
      { input: { s: "abc" }, expectedOutput: "abc" },
    ]),
    hints: JSON.stringify(["Use a stack to handle nesting.", "When you see '[', push current string and number. When you see ']', pop and repeat."]),
  },
  {
    slug: "asteroid-collision",
    title: "Asteroid Collision",
    description: "Given an array of integers representing asteroids. Positive = moving right, negative = moving left. When two collide, the smaller one explodes. If equal, both explode. Return the state after all collisions.",
    difficulty: "medium",
    pattern: "stack",
    category: "stacks",
    phase: 2,
    weekNumber: 4,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    correctPattern: "Stack",
    starterCode: `def asteroid_collision(asteroids: list) -> list:
    """
    Example:
        asteroid_collision([5,10,-5]) -> [5,10]
        asteroid_collision([8,-8]) -> []
    """
    pass

import json
data = json.loads(input())
print(json.dumps(asteroid_collision(data["asteroids"])))`,
    solutionCode: `def asteroid_collision(asteroids: list) -> list:
    stack = []
    for a in asteroids:
        alive = True
        while alive and a < 0 and stack and stack[-1] > 0:
            if stack[-1] < -a:
                stack.pop()
            elif stack[-1] == -a:
                stack.pop()
                alive = False
            else:
                alive = False
        if alive:
            stack.append(a)
    return stack

import json
data = json.loads(input())
print(json.dumps(asteroid_collision(data["asteroids"])))`,
    testCases: JSON.stringify([
      { input: { asteroids: [5, 10, -5] }, expectedOutput: [5, 10] },
      { input: { asteroids: [8, -8] }, expectedOutput: [] },
      { input: { asteroids: [10, 2, -5] }, expectedOutput: [10] },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { asteroids: [-2, -1, 1, 2] }, expectedOutput: [-2, -1, 1, 2] },
    ]),
    hints: JSON.stringify(["Only right-moving (positive) and left-moving (negative) asteroids collide.", "Use a stack: incoming negative asteroid may destroy multiple positive ones."]),
  },
  {
    slug: "next-greater-element",
    title: "Next Greater Element I",
    description: "Given two arrays `nums1` (subset of `nums2`), for each element in `nums1`, find the next greater element in `nums2`. If none, return -1.",
    difficulty: "easy",
    pattern: "stack",
    category: "stacks",
    phase: 2,
    weekNumber: 4,
    timeComplexity: "O(n + m)",
    spaceComplexity: "O(n)",
    correctPattern: "Stack",
    starterCode: `def next_greater_element(nums1: list, nums2: list) -> list:
    """
    Example:
        next_greater_element([4,1,2], [1,3,4,2]) -> [-1,3,-1]
    """
    pass

import json
data = json.loads(input())
print(json.dumps(next_greater_element(data["nums1"], data["nums2"])))`,
    solutionCode: `def next_greater_element(nums1: list, nums2: list) -> list:
    nge = {}
    stack = []
    for n in nums2:
        while stack and stack[-1] < n:
            nge[stack.pop()] = n
        stack.append(n)
    return [nge.get(n, -1) for n in nums1]

import json
data = json.loads(input())
print(json.dumps(next_greater_element(data["nums1"], data["nums2"])))`,
    testCases: JSON.stringify([
      { input: { nums1: [4, 1, 2], nums2: [1, 3, 4, 2] }, expectedOutput: [-1, 3, -1] },
      { input: { nums1: [2, 4], nums2: [1, 2, 3, 4] }, expectedOutput: [3, -1] },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { nums1: [1], nums2: [1, 2] }, expectedOutput: [2] },
    ]),
    hints: JSON.stringify(["Build a next-greater-element map for nums2 using a monotonic stack.", "Then look up each element of nums1 in the map."]),
  },
  {
    slug: "largest-rectangle-histogram",
    title: "Largest Rectangle in Histogram",
    description: "Given an array of integers `heights` representing the histogram's bar height, find the area of the largest rectangle in the histogram.",
    difficulty: "hard",
    pattern: "stack",
    category: "stacks",
    phase: 5,
    weekNumber: 1,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    correctPattern: "Stack",
    starterCode: `def largest_rectangle_area(heights: list) -> int:
    """
    Example:
        largest_rectangle_area([2,1,5,6,2,3]) -> 10
    """
    pass

import json
data = json.loads(input())
print(json.dumps(largest_rectangle_area(data["heights"])))`,
    solutionCode: `def largest_rectangle_area(heights: list) -> int:
    stack = []
    max_area = 0
    heights.append(0)
    for i, h in enumerate(heights):
        while stack and heights[stack[-1]] > h:
            height = heights[stack.pop()]
            width = i if not stack else i - stack[-1] - 1
            max_area = max(max_area, height * width)
        stack.append(i)
    heights.pop()
    return max_area

import json
data = json.loads(input())
print(json.dumps(largest_rectangle_area(data["heights"])))`,
    testCases: JSON.stringify([
      { input: { heights: [2, 1, 5, 6, 2, 3] }, expectedOutput: 10 },
      { input: { heights: [2, 4] }, expectedOutput: 4 },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { heights: [1] }, expectedOutput: 1 },
      { input: { heights: [1, 1, 1, 1] }, expectedOutput: 4 },
    ]),
    hints: JSON.stringify(["Use a monotonic increasing stack of indices.", "When a shorter bar is found, calculate the area with the popped bar as height."]),
  },

  // ══════════════════════════════════════════════════════════════
  // DYNAMIC PROGRAMMING (12 problems) — More depth
  // ══════════════════════════════════════════════════════════════
  {
    slug: "house-robber",
    title: "House Robber",
    description: "You are a robber planning to rob houses along a street. Each house has a certain amount of money. Adjacent houses have security systems connected — if two adjacent houses are broken into, the police will be called. Maximize the amount you can rob.",
    difficulty: "medium",
    pattern: "dynamic-programming",
    category: "dynamic-programming",
    phase: 3,
    weekNumber: 5,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    correctPattern: "Dynamic Programming",
    starterCode: `def rob(nums: list) -> int:
    """
    Example:
        rob([1,2,3,1]) -> 4
        rob([2,7,9,3,1]) -> 12
    """
    pass

import json
data = json.loads(input())
print(json.dumps(rob(data["nums"])))`,
    solutionCode: `def rob(nums: list) -> int:
    if not nums: return 0
    prev2 = prev1 = 0
    for n in nums:
        curr = max(prev1, prev2 + n)
        prev2 = prev1
        prev1 = curr
    return prev1

import json
data = json.loads(input())
print(json.dumps(rob(data["nums"])))`,
    testCases: JSON.stringify([
      { input: { nums: [1, 2, 3, 1] }, expectedOutput: 4 },
      { input: { nums: [2, 7, 9, 3, 1] }, expectedOutput: 12 },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { nums: [0] }, expectedOutput: 0 },
      { input: { nums: [100] }, expectedOutput: 100 },
      { input: { nums: [2, 1, 1, 2] }, expectedOutput: 4 },
    ]),
    hints: JSON.stringify(["dp[i] = max(dp[i-1], dp[i-2] + nums[i]).", "You only need the last two values, so optimize to O(1) space."]),
  },
  {
    slug: "house-robber-ii",
    title: "House Robber II",
    description: "Same as House Robber, but the houses are arranged in a circle (first and last houses are adjacent). You cannot rob both the first and last house.",
    difficulty: "medium",
    pattern: "dynamic-programming",
    category: "dynamic-programming",
    phase: 3,
    weekNumber: 5,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    correctPattern: "Dynamic Programming",
    starterCode: `def rob_ii(nums: list) -> int:
    """
    Example:
        rob_ii([2,3,2]) -> 3
        rob_ii([1,2,3,1]) -> 4
    """
    pass

import json
data = json.loads(input())
print(json.dumps(rob_ii(data["nums"])))`,
    solutionCode: `def rob_ii(nums: list) -> int:
    if len(nums) == 1: return nums[0]
    def rob_linear(arr):
        prev2 = prev1 = 0
        for n in arr:
            curr = max(prev1, prev2 + n)
            prev2 = prev1
            prev1 = curr
        return prev1
    return max(rob_linear(nums[:-1]), rob_linear(nums[1:]))

import json
data = json.loads(input())
print(json.dumps(rob_ii(data["nums"])))`,
    testCases: JSON.stringify([
      { input: { nums: [2, 3, 2] }, expectedOutput: 3 },
      { input: { nums: [1, 2, 3, 1] }, expectedOutput: 4 },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { nums: [1] }, expectedOutput: 1 },
      { input: { nums: [1, 2, 3] }, expectedOutput: 3 },
    ]),
    hints: JSON.stringify(["Run House Robber twice: once excluding the last house, once excluding the first.", "Take the maximum of both runs."]),
  },
  {
    slug: "decode-ways",
    title: "Decode Ways",
    description: "A message encoded as digits can be decoded into letters (A=1, B=2, ..., Z=26). Given a string of digits, return the number of ways to decode it.",
    difficulty: "medium",
    pattern: "dynamic-programming",
    category: "dynamic-programming",
    phase: 3,
    weekNumber: 6,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    correctPattern: "Dynamic Programming",
    starterCode: `def num_decodings(s: str) -> int:
    """
    Example:
        num_decodings("12") -> 2
        num_decodings("226") -> 3
    """
    pass

import json
data = json.loads(input())
print(json.dumps(num_decodings(data["s"])))`,
    solutionCode: `def num_decodings(s: str) -> int:
    if not s or s[0] == '0': return 0
    prev2, prev1 = 1, 1
    for i in range(1, len(s)):
        curr = 0
        if s[i] != '0':
            curr += prev1
        two_digit = int(s[i-1:i+1])
        if 10 <= two_digit <= 26:
            curr += prev2
        prev2 = prev1
        prev1 = curr
    return prev1

import json
data = json.loads(input())
print(json.dumps(num_decodings(data["s"])))`,
    testCases: JSON.stringify([
      { input: { s: "12" }, expectedOutput: 2 },
      { input: { s: "226" }, expectedOutput: 3 },
      { input: { s: "06" }, expectedOutput: 0 },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { s: "10" }, expectedOutput: 1 },
      { input: { s: "2101" }, expectedOutput: 1 },
    ]),
    hints: JSON.stringify(["If current digit is non-zero, it can be decoded alone.", "If last two digits form 10-26, they can be decoded together."]),
  },
  {
    slug: "unique-paths",
    title: "Unique Paths",
    description: "A robot is at the top-left corner of an `m x n` grid. It can only move right or down. How many unique paths are there to the bottom-right corner?",
    difficulty: "medium",
    pattern: "dynamic-programming",
    category: "dynamic-programming",
    phase: 3,
    weekNumber: 6,
    timeComplexity: "O(m*n)",
    spaceComplexity: "O(n)",
    correctPattern: "Dynamic Programming",
    starterCode: `def unique_paths(m: int, n: int) -> int:
    """
    Example:
        unique_paths(3, 7) -> 28
        unique_paths(3, 2) -> 3
    """
    pass

import json
data = json.loads(input())
print(json.dumps(unique_paths(data["m"], data["n"])))`,
    solutionCode: `def unique_paths(m: int, n: int) -> int:
    row = [1] * n
    for _ in range(1, m):
        for j in range(1, n):
            row[j] += row[j - 1]
    return row[-1]

import json
data = json.loads(input())
print(json.dumps(unique_paths(data["m"], data["n"])))`,
    testCases: JSON.stringify([
      { input: { m: 3, n: 7 }, expectedOutput: 28 },
      { input: { m: 3, n: 2 }, expectedOutput: 3 },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { m: 1, n: 1 }, expectedOutput: 1 },
      { input: { m: 7, n: 3 }, expectedOutput: 28 },
    ]),
    hints: JSON.stringify(["dp[i][j] = dp[i-1][j] + dp[i][j-1].", "You can optimize space to a single row."]),
  },
  {
    slug: "word-break",
    title: "Word Break",
    description: "Given a string `s` and a list of strings `wordDict`, determine if `s` can be segmented into a space-separated sequence of one or more dictionary words.",
    difficulty: "medium",
    pattern: "dynamic-programming",
    category: "dynamic-programming",
    phase: 4,
    weekNumber: 4,
    timeComplexity: "O(n^2)",
    spaceComplexity: "O(n)",
    correctPattern: "Dynamic Programming",
    starterCode: `def word_break(s: str, word_dict: list) -> bool:
    """
    Example:
        word_break("leetcode", ["leet","code"]) -> True
        word_break("applepenapple", ["apple","pen"]) -> True
    """
    pass

import json
data = json.loads(input())
print(json.dumps(word_break(data["s"], data["word_dict"])))`,
    solutionCode: `def word_break(s: str, word_dict: list) -> bool:
    words = set(word_dict)
    n = len(s)
    dp = [False] * (n + 1)
    dp[0] = True
    for i in range(1, n + 1):
        for j in range(i):
            if dp[j] and s[j:i] in words:
                dp[i] = True
                break
    return dp[n]

import json
data = json.loads(input())
print(json.dumps(word_break(data["s"], data["word_dict"])))`,
    testCases: JSON.stringify([
      { input: { s: "leetcode", word_dict: ["leet", "code"] }, expectedOutput: true },
      { input: { s: "applepenapple", word_dict: ["apple", "pen"] }, expectedOutput: true },
      { input: { s: "catsandog", word_dict: ["cats", "dog", "sand", "and", "cat"] }, expectedOutput: false },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { s: "a", word_dict: ["a"] }, expectedOutput: true },
      { input: { s: "ab", word_dict: ["a", "b"] }, expectedOutput: true },
    ]),
    hints: JSON.stringify(["dp[i] = True if s[:i] can be segmented.", "For each position, check all possible last words."]),
  },
  {
    slug: "longest-common-subsequence",
    title: "Longest Common Subsequence",
    description: "Given two strings `text1` and `text2`, return the length of their longest common subsequence. A subsequence is a sequence derived by deleting some characters without changing the order of remaining characters.",
    difficulty: "medium",
    pattern: "dynamic-programming",
    category: "dynamic-programming",
    phase: 4,
    weekNumber: 4,
    timeComplexity: "O(m*n)",
    spaceComplexity: "O(m*n)",
    correctPattern: "Dynamic Programming",
    starterCode: `def longest_common_subsequence(text1: str, text2: str) -> int:
    """
    Example:
        longest_common_subsequence("abcde", "ace") -> 3
    """
    pass

import json
data = json.loads(input())
print(json.dumps(longest_common_subsequence(data["text1"], data["text2"])))`,
    solutionCode: `def longest_common_subsequence(text1: str, text2: str) -> int:
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i-1] == text2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    return dp[m][n]

import json
data = json.loads(input())
print(json.dumps(longest_common_subsequence(data["text1"], data["text2"])))`,
    testCases: JSON.stringify([
      { input: { text1: "abcde", text2: "ace" }, expectedOutput: 3 },
      { input: { text1: "abc", text2: "abc" }, expectedOutput: 3 },
      { input: { text1: "abc", text2: "def" }, expectedOutput: 0 },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { text1: "oxcpqrsvwf", text2: "shmtulqrypy" }, expectedOutput: 2 },
    ]),
    hints: JSON.stringify(["Classic 2D DP: compare characters from both strings.", "If chars match, dp[i][j] = dp[i-1][j-1] + 1."]),
  },
  {
    slug: "palindromic-substrings",
    title: "Palindromic Substrings",
    description: "Given a string `s`, return the number of palindromic substrings in it. A substring is palindromic if it reads the same forward and backward.",
    difficulty: "medium",
    pattern: "dynamic-programming",
    category: "dynamic-programming",
    phase: 4,
    weekNumber: 5,
    timeComplexity: "O(n^2)",
    spaceComplexity: "O(1)",
    correctPattern: "Dynamic Programming",
    starterCode: `def count_substrings(s: str) -> int:
    """
    Example:
        count_substrings("abc") -> 3
        count_substrings("aaa") -> 6
    """
    pass

import json
data = json.loads(input())
print(json.dumps(count_substrings(data["s"])))`,
    solutionCode: `def count_substrings(s: str) -> int:
    count = 0
    def expand(left, right):
        nonlocal count
        while left >= 0 and right < len(s) and s[left] == s[right]:
            count += 1
            left -= 1
            right += 1
    for i in range(len(s)):
        expand(i, i)
        expand(i, i + 1)
    return count

import json
data = json.loads(input())
print(json.dumps(count_substrings(data["s"])))`,
    testCases: JSON.stringify([
      { input: { s: "abc" }, expectedOutput: 3 },
      { input: { s: "aaa" }, expectedOutput: 6 },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { s: "a" }, expectedOutput: 1 },
      { input: { s: "abba" }, expectedOutput: 6 },
    ]),
    hints: JSON.stringify(["Expand around each center (both odd and even length).", "Each single character is a palindrome."]),
  },
  {
    slug: "longest-palindromic-substring",
    title: "Longest Palindromic Substring",
    description: "Given a string `s`, return the longest palindromic substring in `s`.",
    difficulty: "medium",
    pattern: "dynamic-programming",
    category: "dynamic-programming",
    phase: 4,
    weekNumber: 5,
    timeComplexity: "O(n^2)",
    spaceComplexity: "O(1)",
    correctPattern: "Dynamic Programming",
    starterCode: `def longest_palindrome(s: str) -> str:
    """
    Example:
        longest_palindrome("babad") -> "bab" or "aba"
        longest_palindrome("cbbd") -> "bb"
    """
    pass

import json
data = json.loads(input())
print(json.dumps(longest_palindrome(data["s"])))`,
    solutionCode: `def longest_palindrome(s: str) -> str:
    start = 0
    max_len = 1
    def expand(l, r):
        nonlocal start, max_len
        while l >= 0 and r < len(s) and s[l] == s[r]:
            if r - l + 1 > max_len:
                start = l
                max_len = r - l + 1
            l -= 1
            r += 1
    for i in range(len(s)):
        expand(i, i)
        expand(i, i + 1)
    return s[start:start + max_len]

import json
data = json.loads(input())
print(json.dumps(longest_palindrome(data["s"])))`,
    testCases: JSON.stringify([
      { input: { s: "babad" }, expectedOutput: "bab" },
      { input: { s: "cbbd" }, expectedOutput: "bb" },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { s: "a" }, expectedOutput: "a" },
      { input: { s: "ac" }, expectedOutput: "a" },
    ]),
    hints: JSON.stringify(["Expand around center for both odd and even length palindromes.", "Track the start index and length of the longest found."]),
  },
  {
    slug: "partition-equal-subset-sum",
    title: "Partition Equal Subset Sum",
    description: "Given a non-empty array of positive integers, determine if it can be partitioned into two subsets such that the sum of elements in both subsets is equal.",
    difficulty: "medium",
    pattern: "dynamic-programming",
    category: "dynamic-programming",
    phase: 4,
    weekNumber: 5,
    timeComplexity: "O(n * sum)",
    spaceComplexity: "O(sum)",
    correctPattern: "Dynamic Programming",
    starterCode: `def can_partition(nums: list) -> bool:
    """
    Example:
        can_partition([1,5,11,5]) -> True
        can_partition([1,2,3,5]) -> False
    """
    pass

import json
data = json.loads(input())
print(json.dumps(can_partition(data["nums"])))`,
    solutionCode: `def can_partition(nums: list) -> bool:
    total = sum(nums)
    if total % 2: return False
    target = total // 2
    dp = {0}
    for n in nums:
        dp = dp | {s + n for s in dp if s + n <= target}
        if target in dp:
            return True
    return target in dp

import json
data = json.loads(input())
print(json.dumps(can_partition(data["nums"])))`,
    testCases: JSON.stringify([
      { input: { nums: [1, 5, 11, 5] }, expectedOutput: true },
      { input: { nums: [1, 2, 3, 5] }, expectedOutput: false },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { nums: [1, 1] }, expectedOutput: true },
      { input: { nums: [1, 2, 5] }, expectedOutput: false },
    ]),
    hints: JSON.stringify(["If total sum is odd, return False immediately.", "This is a 0/1 knapsack problem targeting sum/2."]),
  },
  {
    slug: "target-sum",
    title: "Target Sum",
    description: "Given an array of integers `nums` and an integer `target`, assign each number a `+` or `-` sign. Return the number of different expressions that evaluate to `target`.",
    difficulty: "medium",
    pattern: "dynamic-programming",
    category: "dynamic-programming",
    phase: 4,
    weekNumber: 6,
    timeComplexity: "O(n * sum)",
    spaceComplexity: "O(sum)",
    correctPattern: "Dynamic Programming",
    starterCode: `def find_target_sum_ways(nums: list, target: int) -> int:
    """
    Example:
        find_target_sum_ways([1,1,1,1,1], 3) -> 5
    """
    pass

import json
data = json.loads(input())
print(json.dumps(find_target_sum_ways(data["nums"], data["target"])))`,
    solutionCode: `def find_target_sum_ways(nums: list, target: int) -> int:
    from collections import defaultdict
    dp = defaultdict(int)
    dp[0] = 1
    for n in nums:
        new_dp = defaultdict(int)
        for s, count in dp.items():
            new_dp[s + n] += count
            new_dp[s - n] += count
        dp = new_dp
    return dp[target]

import json
data = json.loads(input())
print(json.dumps(find_target_sum_ways(data["nums"], data["target"])))`,
    testCases: JSON.stringify([
      { input: { nums: [1, 1, 1, 1, 1], target: 3 }, expectedOutput: 5 },
      { input: { nums: [1], target: 1 }, expectedOutput: 1 },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { nums: [0, 0, 0, 0, 0, 0, 0, 0, 1], target: 1 }, expectedOutput: 256 },
    ]),
    hints: JSON.stringify(["Use a dict-based DP mapping sum -> number of ways.", "For each number, branch into + and - from every current sum."]),
  },
  {
    slug: "coin-change-ii",
    title: "Coin Change II",
    description: "Given an integer `amount` and an array of coin denominations, return the number of combinations that make up the amount. If that amount cannot be made up, return 0.",
    difficulty: "medium",
    pattern: "dynamic-programming",
    category: "dynamic-programming",
    phase: 4,
    weekNumber: 6,
    timeComplexity: "O(n * amount)",
    spaceComplexity: "O(amount)",
    correctPattern: "Dynamic Programming",
    starterCode: `def change(amount: int, coins: list) -> int:
    """
    Example:
        change(5, [1,2,5]) -> 4
    """
    pass

import json
data = json.loads(input())
print(json.dumps(change(data["amount"], data["coins"])))`,
    solutionCode: `def change(amount: int, coins: list) -> int:
    dp = [0] * (amount + 1)
    dp[0] = 1
    for coin in coins:
        for i in range(coin, amount + 1):
            dp[i] += dp[i - coin]
    return dp[amount]

import json
data = json.loads(input())
print(json.dumps(change(data["amount"], data["coins"])))`,
    testCases: JSON.stringify([
      { input: { amount: 5, coins: [1, 2, 5] }, expectedOutput: 4 },
      { input: { amount: 3, coins: [2] }, expectedOutput: 0 },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { amount: 0, coins: [1] }, expectedOutput: 1 },
      { input: { amount: 10, coins: [10] }, expectedOutput: 1 },
    ]),
    hints: JSON.stringify(["Iterate coins in the outer loop to avoid counting permutations.", "dp[i] += dp[i - coin] for each coin."]),
  },
  {
    slug: "min-cost-climbing-stairs",
    title: "Min Cost Climbing Stairs",
    description: "Given an array `cost` where `cost[i]` is the cost of the ith step, you can start from step 0 or 1. At each step you can climb 1 or 2 steps. Return the minimum cost to reach the top.",
    difficulty: "easy",
    pattern: "dynamic-programming",
    category: "dynamic-programming",
    phase: 2,
    weekNumber: 5,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    correctPattern: "Dynamic Programming",
    starterCode: `def min_cost_climbing_stairs(cost: list) -> int:
    """
    Example:
        min_cost_climbing_stairs([10,15,20]) -> 15
        min_cost_climbing_stairs([1,100,1,1,1,100,1,1,100,1]) -> 6
    """
    pass

import json
data = json.loads(input())
print(json.dumps(min_cost_climbing_stairs(data["cost"])))`,
    solutionCode: `def min_cost_climbing_stairs(cost: list) -> int:
    a = b = 0
    for c in cost:
        a, b = b, min(a, b) + c
    return min(a, b)

import json
data = json.loads(input())
print(json.dumps(min_cost_climbing_stairs(data["cost"])))`,
    testCases: JSON.stringify([
      { input: { cost: [10, 15, 20] }, expectedOutput: 15 },
      { input: { cost: [1, 100, 1, 1, 1, 100, 1, 1, 100, 1] }, expectedOutput: 6 },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { cost: [0, 0, 0, 1] }, expectedOutput: 0 },
    ]),
    hints: JSON.stringify(["dp[i] = cost[i] + min(dp[i-1], dp[i-2]).", "The answer is min(dp[-1], dp[-2])."]),
  },

  // ══════════════════════════════════════════════════════════════
  // GRAPH (10 problems) — More depth and variety
  // ══════════════════════════════════════════════════════════════
  {
    slug: "clone-graph",
    title: "Clone Graph",
    description: "Given a node in a connected undirected graph (represented as an adjacency list), return a deep copy. Input: adjacency list `adjList` where `adjList[i]` lists the neighbors of node `i+1`. Return the adjacency list of the cloned graph.",
    difficulty: "medium",
    pattern: "graph",
    category: "graphs",
    phase: 3,
    weekNumber: 7,
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V)",
    correctPattern: "Graph",
    starterCode: `def clone_graph(adj_list: list) -> list:
    """
    Given an adjacency list, return a deep copy.
    adj_list[i] = neighbors of node (i+1), 1-indexed.

    Example:
        clone_graph([[2,4],[1,3],[2,4],[1,3]]) -> [[2,4],[1,3],[2,4],[1,3]]
    """
    pass

import json
data = json.loads(input())
print(json.dumps(clone_graph(data["adj_list"])))`,
    solutionCode: `def clone_graph(adj_list: list) -> list:
    if not adj_list:
        return []
    return [list(neighbors) for neighbors in adj_list]

import json
data = json.loads(input())
print(json.dumps(clone_graph(data["adj_list"])))`,
    testCases: JSON.stringify([
      { input: { adj_list: [[2, 4], [1, 3], [2, 4], [1, 3]] }, expectedOutput: [[2, 4], [1, 3], [2, 4], [1, 3]] },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { adj_list: [[]] }, expectedOutput: [[]] },
      { input: { adj_list: [] }, expectedOutput: [] },
    ]),
    hints: JSON.stringify(["Use BFS or DFS to traverse the original graph.", "Maintain a hashmap from original node to cloned node."]),
  },
  {
    slug: "pacific-atlantic-water-flow",
    title: "Pacific Atlantic Water Flow",
    description: "Given an `m x n` matrix of heights, water can flow to adjacent cells (up/down/left/right) with equal or lower height. The Pacific ocean touches the top and left edges. The Atlantic touches the bottom and right. Return all cells from which water can flow to both oceans.",
    difficulty: "medium",
    pattern: "dfs",
    category: "graphs",
    phase: 3,
    weekNumber: 7,
    timeComplexity: "O(m*n)",
    spaceComplexity: "O(m*n)",
    correctPattern: "DFS",
    starterCode: `def pacific_atlantic(heights: list) -> list:
    """
    Example:
        pacific_atlantic([[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]])
        -> [[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]
    """
    pass

import json
data = json.loads(input())
result = pacific_atlantic(data["heights"])
print(json.dumps(sorted(result)))`,
    solutionCode: `def pacific_atlantic(heights: list) -> list:
    if not heights: return []
    m, n = len(heights), len(heights[0])
    pacific = set()
    atlantic = set()

    def dfs(r, c, visited):
        visited.add((r, c))
        for dr, dc in [(-1,0),(1,0),(0,-1),(0,1)]:
            nr, nc = r + dr, c + dc
            if 0 <= nr < m and 0 <= nc < n and (nr, nc) not in visited and heights[nr][nc] >= heights[r][c]:
                dfs(nr, nc, visited)

    for c in range(n):
        dfs(0, c, pacific)
        dfs(m-1, c, atlantic)
    for r in range(m):
        dfs(r, 0, pacific)
        dfs(r, n-1, atlantic)

    return sorted([list(cell) for cell in pacific & atlantic])

import json
data = json.loads(input())
result = pacific_atlantic(data["heights"])
print(json.dumps(sorted(result)))`,
    testCases: JSON.stringify([
      { input: { heights: [[1, 2, 2, 3, 5], [3, 2, 3, 4, 4], [2, 4, 5, 3, 1], [6, 7, 1, 4, 5], [5, 1, 1, 2, 4]] }, expectedOutput: [[0, 4], [1, 3], [1, 4], [2, 2], [3, 0], [3, 1], [4, 0]] },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { heights: [[1]] }, expectedOutput: [[0, 0]] },
    ]),
    hints: JSON.stringify(["Start DFS from ocean borders going uphill.", "A cell that can reach both oceans is in both visited sets."]),
  },
  {
    slug: "rotting-oranges",
    title: "Rotting Oranges",
    description: "In a grid, 0=empty, 1=fresh orange, 2=rotten orange. Every minute, fresh oranges adjacent (4-directional) to rotten ones become rotten. Return the minimum minutes until no fresh orange remains, or -1 if impossible.",
    difficulty: "medium",
    pattern: "bfs",
    category: "graphs",
    phase: 3,
    weekNumber: 7,
    timeComplexity: "O(m*n)",
    spaceComplexity: "O(m*n)",
    correctPattern: "BFS",
    starterCode: `def oranges_rotting(grid: list) -> int:
    """
    Example:
        oranges_rotting([[2,1,1],[1,1,0],[0,1,1]]) -> 4
    """
    pass

import json
data = json.loads(input())
print(json.dumps(oranges_rotting(data["grid"])))`,
    solutionCode: `def oranges_rotting(grid: list) -> int:
    from collections import deque
    m, n = len(grid), len(grid[0])
    queue = deque()
    fresh = 0
    for r in range(m):
        for c in range(n):
            if grid[r][c] == 2:
                queue.append((r, c))
            elif grid[r][c] == 1:
                fresh += 1
    if fresh == 0: return 0
    minutes = 0
    while queue:
        for _ in range(len(queue)):
            r, c = queue.popleft()
            for dr, dc in [(-1,0),(1,0),(0,-1),(0,1)]:
                nr, nc = r+dr, c+dc
                if 0 <= nr < m and 0 <= nc < n and grid[nr][nc] == 1:
                    grid[nr][nc] = 2
                    fresh -= 1
                    queue.append((nr, nc))
        minutes += 1
    return minutes - 1 if fresh == 0 else -1

import json
data = json.loads(input())
print(json.dumps(oranges_rotting(data["grid"])))`,
    testCases: JSON.stringify([
      { input: { grid: [[2, 1, 1], [1, 1, 0], [0, 1, 1]] }, expectedOutput: 4 },
      { input: { grid: [[2, 1, 1], [0, 1, 1], [1, 0, 1]] }, expectedOutput: -1 },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { grid: [[0, 2]] }, expectedOutput: 0 },
      { input: { grid: [[0]] }, expectedOutput: 0 },
    ]),
    hints: JSON.stringify(["Multi-source BFS from all initially rotten oranges.", "Track fresh count; return -1 if any remain after BFS."]),
  },
  {
    slug: "surrounded-regions",
    title: "Surrounded Regions",
    description: "Given an `m x n` board containing 'X' and 'O', capture all regions that are surrounded by 'X'. A region is captured by flipping all 'O's into 'X's. A region is not captured if any 'O' is on the border.",
    difficulty: "medium",
    pattern: "dfs",
    category: "graphs",
    phase: 3,
    weekNumber: 8,
    timeComplexity: "O(m*n)",
    spaceComplexity: "O(m*n)",
    correctPattern: "DFS",
    starterCode: `def solve(board: list) -> list:
    """
    Example:
        solve([["X","X","X","X"],["X","O","O","X"],["X","X","O","X"],["X","O","X","X"]])
        -> [["X","X","X","X"],["X","X","X","X"],["X","X","X","X"],["X","O","X","X"]]
    """
    pass

import json
data = json.loads(input())
print(json.dumps(solve(data["board"])))`,
    solutionCode: `def solve(board: list) -> list:
    if not board: return board
    m, n = len(board), len(board[0])
    def dfs(r, c):
        if r < 0 or r >= m or c < 0 or c >= n or board[r][c] != 'O':
            return
        board[r][c] = 'S'
        dfs(r+1, c); dfs(r-1, c); dfs(r, c+1); dfs(r, c-1)
    for r in range(m):
        dfs(r, 0); dfs(r, n-1)
    for c in range(n):
        dfs(0, c); dfs(m-1, c)
    for r in range(m):
        for c in range(n):
            if board[r][c] == 'O': board[r][c] = 'X'
            elif board[r][c] == 'S': board[r][c] = 'O'
    return board

import json
data = json.loads(input())
print(json.dumps(solve(data["board"])))`,
    testCases: JSON.stringify([
      { input: { board: [["X", "X", "X", "X"], ["X", "O", "O", "X"], ["X", "X", "O", "X"], ["X", "O", "X", "X"]] }, expectedOutput: [["X", "X", "X", "X"], ["X", "X", "X", "X"], ["X", "X", "X", "X"], ["X", "O", "X", "X"]] },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { board: [["O"]] }, expectedOutput: [["O"]] },
    ]),
    hints: JSON.stringify(["DFS from border 'O's to mark them safe.", "After marking, flip remaining 'O's to 'X' and restore safe cells."]),
  },
  {
    slug: "redundant-connection",
    title: "Redundant Connection",
    description: "Given a graph that started as a tree with one extra edge added, find the edge that can be removed to make it a tree again. If there are multiple, return the one that occurs last in the input.",
    difficulty: "medium",
    pattern: "union-find",
    category: "graphs",
    phase: 4,
    weekNumber: 6,
    timeComplexity: "O(n α(n))",
    spaceComplexity: "O(n)",
    correctPattern: "Union Find",
    starterCode: `def find_redundant_connection(edges: list) -> list:
    """
    Example:
        find_redundant_connection([[1,2],[1,3],[2,3]]) -> [2,3]
    """
    pass

import json
data = json.loads(input())
print(json.dumps(find_redundant_connection(data["edges"])))`,
    solutionCode: `def find_redundant_connection(edges: list) -> list:
    parent = list(range(len(edges) + 1))
    rank = [0] * (len(edges) + 1)
    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x
    def union(a, b):
        ra, rb = find(a), find(b)
        if ra == rb: return False
        if rank[ra] < rank[rb]: ra, rb = rb, ra
        parent[rb] = ra
        if rank[ra] == rank[rb]: rank[ra] += 1
        return True
    for u, v in edges:
        if not union(u, v):
            return [u, v]
    return []

import json
data = json.loads(input())
print(json.dumps(find_redundant_connection(data["edges"])))`,
    testCases: JSON.stringify([
      { input: { edges: [[1, 2], [1, 3], [2, 3]] }, expectedOutput: [2, 3] },
      { input: { edges: [[1, 2], [2, 3], [3, 4], [1, 4], [1, 5]] }, expectedOutput: [1, 4] },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { edges: [[1, 2], [2, 3], [1, 3]] }, expectedOutput: [1, 3] },
    ]),
    hints: JSON.stringify(["Use Union-Find (Disjoint Set Union).", "The first edge that connects two already-connected nodes is the answer."]),
  },
  {
    slug: "network-delay-time",
    title: "Network Delay Time",
    description: "Given a network of `n` nodes and directed weighted edges `times[i] = [u, v, w]`, find the time it takes for all nodes to receive a signal sent from node `k`. Return -1 if not all nodes can be reached.",
    difficulty: "medium",
    pattern: "graph",
    category: "graphs",
    phase: 4,
    weekNumber: 6,
    timeComplexity: "O(E log V)",
    spaceComplexity: "O(V + E)",
    correctPattern: "Graph",
    starterCode: `def network_delay_time(times: list, n: int, k: int) -> int:
    """
    Example:
        network_delay_time([[2,1,1],[2,3,1],[3,4,1]], 4, 2) -> 2
    """
    pass

import json
data = json.loads(input())
print(json.dumps(network_delay_time(data["times"], data["n"], data["k"])))`,
    solutionCode: `def network_delay_time(times: list, n: int, k: int) -> int:
    import heapq
    from collections import defaultdict
    graph = defaultdict(list)
    for u, v, w in times:
        graph[u].append((v, w))
    dist = {}
    heap = [(0, k)]
    while heap:
        d, node = heapq.heappop(heap)
        if node in dist: continue
        dist[node] = d
        for nei, w in graph[node]:
            if nei not in dist:
                heapq.heappush(heap, (d + w, nei))
    return max(dist.values()) if len(dist) == n else -1

import json
data = json.loads(input())
print(json.dumps(network_delay_time(data["times"], data["n"], data["k"])))`,
    testCases: JSON.stringify([
      { input: { times: [[2, 1, 1], [2, 3, 1], [3, 4, 1]], n: 4, k: 2 }, expectedOutput: 2 },
      { input: { times: [[1, 2, 1]], n: 2, k: 2 }, expectedOutput: -1 },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { times: [[1, 2, 1]], n: 2, k: 1 }, expectedOutput: 1 },
    ]),
    hints: JSON.stringify(["Use Dijkstra's algorithm from node k.", "The answer is the maximum distance to any reachable node."]),
  },
  {
    slug: "shortest-path-binary-matrix",
    title: "Shortest Path in Binary Matrix",
    description: "Given an `n x n` binary matrix, find the length of the shortest clear path from top-left to bottom-right. A clear path consists of cells with 0, connected 8-directionally. Return -1 if no path exists.",
    difficulty: "medium",
    pattern: "bfs",
    category: "graphs",
    phase: 3,
    weekNumber: 8,
    timeComplexity: "O(n^2)",
    spaceComplexity: "O(n^2)",
    correctPattern: "BFS",
    starterCode: `def shortest_path_binary_matrix(grid: list) -> int:
    """
    Example:
        shortest_path_binary_matrix([[0,1],[1,0]]) -> 2
        shortest_path_binary_matrix([[0,0,0],[1,1,0],[1,1,0]]) -> 4
    """
    pass

import json
data = json.loads(input())
print(json.dumps(shortest_path_binary_matrix(data["grid"])))`,
    solutionCode: `def shortest_path_binary_matrix(grid: list) -> int:
    from collections import deque
    n = len(grid)
    if grid[0][0] or grid[n-1][n-1]:
        return -1
    queue = deque([(0, 0, 1)])
    grid[0][0] = 1
    while queue:
        r, c, dist = queue.popleft()
        if r == n-1 and c == n-1:
            return dist
        for dr in [-1, 0, 1]:
            for dc in [-1, 0, 1]:
                nr, nc = r+dr, c+dc
                if 0 <= nr < n and 0 <= nc < n and grid[nr][nc] == 0:
                    grid[nr][nc] = 1
                    queue.append((nr, nc, dist+1))
    return -1

import json
data = json.loads(input())
print(json.dumps(shortest_path_binary_matrix(data["grid"])))`,
    testCases: JSON.stringify([
      { input: { grid: [[0, 1], [1, 0]] }, expectedOutput: 2 },
      { input: { grid: [[0, 0, 0], [1, 1, 0], [1, 1, 0]] }, expectedOutput: 4 },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { grid: [[1, 0], [0, 0]] }, expectedOutput: -1 },
      { input: { grid: [[0]] }, expectedOutput: 1 },
    ]),
    hints: JSON.stringify(["Use BFS from (0,0) — BFS guarantees shortest path in unweighted graph.", "Explore all 8 directions."]),
  },
  {
    slug: "walls-and-gates",
    title: "Walls and Gates",
    description: "Given a grid where -1 is a wall, 0 is a gate, and INF (2147483647) is an empty room, fill each room with the distance to its nearest gate. If impossible, leave as INF.",
    difficulty: "medium",
    pattern: "bfs",
    category: "graphs",
    phase: 3,
    weekNumber: 8,
    timeComplexity: "O(m*n)",
    spaceComplexity: "O(m*n)",
    correctPattern: "BFS",
    starterCode: `def walls_and_gates(rooms: list) -> list:
    """
    Example:
        walls_and_gates([[2147483647,-1,0,2147483647],[2147483647,2147483647,2147483647,-1],[2147483647,-1,2147483647,-1],[0,-1,2147483647,2147483647]])
        -> [[3,-1,0,1],[2,2,1,-1],[1,-1,2,-1],[0,-1,3,4]]
    """
    pass

import json
data = json.loads(input())
print(json.dumps(walls_and_gates(data["rooms"])))`,
    solutionCode: `def walls_and_gates(rooms: list) -> list:
    from collections import deque
    INF = 2147483647
    if not rooms: return rooms
    m, n = len(rooms), len(rooms[0])
    queue = deque()
    for r in range(m):
        for c in range(n):
            if rooms[r][c] == 0:
                queue.append((r, c))
    while queue:
        r, c = queue.popleft()
        for dr, dc in [(-1,0),(1,0),(0,-1),(0,1)]:
            nr, nc = r+dr, c+dc
            if 0 <= nr < m and 0 <= nc < n and rooms[nr][nc] == INF:
                rooms[nr][nc] = rooms[r][c] + 1
                queue.append((nr, nc))
    return rooms

import json
data = json.loads(input())
print(json.dumps(walls_and_gates(data["rooms"])))`,
    testCases: JSON.stringify([
      { input: { rooms: [[2147483647, -1, 0, 2147483647], [2147483647, 2147483647, 2147483647, -1], [2147483647, -1, 2147483647, -1], [0, -1, 2147483647, 2147483647]] }, expectedOutput: [[3, -1, 0, 1], [2, 2, 1, -1], [1, -1, 2, -1], [0, -1, 3, 4]] },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { rooms: [[0]] }, expectedOutput: [[0]] },
    ]),
    hints: JSON.stringify(["Multi-source BFS from all gates simultaneously.", "Each empty room gets the distance of the first gate that reaches it."]),
  },
  {
    slug: "graph-valid-tree",
    title: "Graph Valid Tree",
    description: "Given `n` nodes labeled 0 to n-1 and a list of undirected edges, check if these edges form a valid tree (connected, no cycles).",
    difficulty: "medium",
    pattern: "union-find",
    category: "graphs",
    phase: 4,
    weekNumber: 7,
    timeComplexity: "O(n α(n))",
    spaceComplexity: "O(n)",
    correctPattern: "Union Find",
    starterCode: `def valid_tree(n: int, edges: list) -> bool:
    """
    Example:
        valid_tree(5, [[0,1],[0,2],[0,3],[1,4]]) -> True
        valid_tree(5, [[0,1],[1,2],[2,3],[1,3],[1,4]]) -> False
    """
    pass

import json
data = json.loads(input())
print(json.dumps(valid_tree(data["n"], data["edges"])))`,
    solutionCode: `def valid_tree(n: int, edges: list) -> bool:
    if len(edges) != n - 1:
        return False
    parent = list(range(n))
    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x
    for u, v in edges:
        ru, rv = find(u), find(v)
        if ru == rv:
            return False
        parent[ru] = rv
    return True

import json
data = json.loads(input())
print(json.dumps(valid_tree(data["n"], data["edges"])))`,
    testCases: JSON.stringify([
      { input: { n: 5, edges: [[0, 1], [0, 2], [0, 3], [1, 4]] }, expectedOutput: true },
      { input: { n: 5, edges: [[0, 1], [1, 2], [2, 3], [1, 3], [1, 4]] }, expectedOutput: false },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { n: 1, edges: [] }, expectedOutput: true },
      { input: { n: 2, edges: [] }, expectedOutput: false },
    ]),
    hints: JSON.stringify(["A tree with n nodes has exactly n-1 edges.", "Use Union-Find to check for cycles."]),
  },
  {
    slug: "accounts-merge",
    title: "Accounts Merge",
    description: "Given a list of accounts where each account is `[name, email1, email2, ...]`, merge accounts that share at least one email. Return merged accounts sorted by email.",
    difficulty: "medium",
    pattern: "union-find",
    category: "graphs",
    phase: 4,
    weekNumber: 7,
    timeComplexity: "O(n * α(n))",
    spaceComplexity: "O(n)",
    correctPattern: "Union Find",
    starterCode: `def accounts_merge(accounts: list) -> list:
    """
    Example:
        accounts_merge([["John","john@mail","john_neo@mail"],["John","john@mail","john00@mail"],["Mary","mary@mail"],["John","johnnybravo@mail"]])
        -> [["John","john00@mail","john@mail","john_neo@mail"],["John","johnnybravo@mail"],["Mary","mary@mail"]]
    """
    pass

import json
data = json.loads(input())
result = accounts_merge(data["accounts"])
print(json.dumps(sorted(result)))`,
    solutionCode: `def accounts_merge(accounts: list) -> list:
    from collections import defaultdict
    parent = {}
    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x
    def union(a, b):
        ra, rb = find(a), find(b)
        if ra != rb:
            parent[ra] = rb

    email_to_name = {}
    for account in accounts:
        name = account[0]
        for email in account[1:]:
            if email not in parent:
                parent[email] = email
            email_to_name[email] = name
            union(account[1], email)

    groups = defaultdict(list)
    for email in parent:
        groups[find(email)].append(email)

    return sorted([[email_to_name[root]] + sorted(emails) for root, emails in groups.items()])

import json
data = json.loads(input())
result = accounts_merge(data["accounts"])
print(json.dumps(sorted(result)))`,
    testCases: JSON.stringify([
      { input: { accounts: [["John", "john@mail", "john_neo@mail"], ["John", "john@mail", "john00@mail"], ["Mary", "mary@mail"], ["John", "johnnybravo@mail"]] }, expectedOutput: [["John", "john00@mail", "john@mail", "john_neo@mail"], ["John", "johnnybravo@mail"], ["Mary", "mary@mail"]] },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { accounts: [["A", "a@b"]] }, expectedOutput: [["A", "a@b"]] },
    ]),
    hints: JSON.stringify(["Use Union-Find on email addresses.", "Union all emails within the same account, then group by root."]),
  },

  // ══════════════════════════════════════════════════════════════
  // SLIDING WINDOW (8 problems)
  // ══════════════════════════════════════════════════════════════
  {
    slug: "minimum-window-substring",
    title: "Minimum Window Substring",
    description: "Given strings `s` and `t`, return the minimum window substring of `s` that contains all characters of `t` (including duplicates). Return \"\" if no such window exists.",
    difficulty: "hard",
    pattern: "sliding-window",
    category: "sliding-window",
    phase: 5,
    weekNumber: 2,
    timeComplexity: "O(n)",
    spaceComplexity: "O(k)",
    correctPattern: "Sliding Window",
    starterCode: `def min_window(s: str, t: str) -> str:
    """
    Example:
        min_window("ADOBECODEBANC", "ABC") -> "BANC"
    """
    pass

import json
data = json.loads(input())
print(json.dumps(min_window(data["s"], data["t"])))`,
    solutionCode: `def min_window(s: str, t: str) -> str:
    from collections import Counter
    need = Counter(t)
    missing = len(t)
    left = start = 0
    min_len = float('inf')
    for right, c in enumerate(s):
        if need[c] > 0:
            missing -= 1
        need[c] -= 1
        while missing == 0:
            if right - left + 1 < min_len:
                min_len = right - left + 1
                start = left
            need[s[left]] += 1
            if need[s[left]] > 0:
                missing += 1
            left += 1
    return "" if min_len == float('inf') else s[start:start + min_len]

import json
data = json.loads(input())
print(json.dumps(min_window(data["s"], data["t"])))`,
    testCases: JSON.stringify([
      { input: { s: "ADOBECODEBANC", t: "ABC" }, expectedOutput: "BANC" },
      { input: { s: "a", t: "a" }, expectedOutput: "a" },
      { input: { s: "a", t: "aa" }, expectedOutput: "" },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { s: "ab", t: "b" }, expectedOutput: "b" },
    ]),
    hints: JSON.stringify(["Expand the right pointer to include all chars of t.", "Shrink the left pointer to find the minimum window."]),
  },
  {
    slug: "longest-repeating-character-replacement",
    title: "Longest Repeating Character Replacement",
    description: "Given a string `s` and an integer `k`, you can change at most `k` characters to any uppercase letter. Return the length of the longest substring containing only one repeating character.",
    difficulty: "medium",
    pattern: "sliding-window",
    category: "sliding-window",
    phase: 2,
    weekNumber: 5,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    correctPattern: "Sliding Window",
    starterCode: `def character_replacement(s: str, k: int) -> int:
    """
    Example:
        character_replacement("ABAB", 2) -> 4
        character_replacement("AABABBA", 1) -> 4
    """
    pass

import json
data = json.loads(input())
print(json.dumps(character_replacement(data["s"], data["k"])))`,
    solutionCode: `def character_replacement(s: str, k: int) -> int:
    count = {}
    max_count = left = result = 0
    for right in range(len(s)):
        count[s[right]] = count.get(s[right], 0) + 1
        max_count = max(max_count, count[s[right]])
        while (right - left + 1) - max_count > k:
            count[s[left]] -= 1
            left += 1
        result = max(result, right - left + 1)
    return result

import json
data = json.loads(input())
print(json.dumps(character_replacement(data["s"], data["k"])))`,
    testCases: JSON.stringify([
      { input: { s: "ABAB", k: 2 }, expectedOutput: 4 },
      { input: { s: "AABABBA", k: 1 }, expectedOutput: 4 },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { s: "AAAA", k: 0 }, expectedOutput: 4 },
    ]),
    hints: JSON.stringify(["Window is valid if (window_size - max_char_count) <= k.", "Track the max frequency character in the window."]),
  },
  {
    slug: "permutation-in-string",
    title: "Permutation in String",
    description: "Given strings `s1` and `s2`, return `True` if `s2` contains a permutation of `s1`. In other words, return true if one of `s1`'s permutations is a substring of `s2`.",
    difficulty: "medium",
    pattern: "sliding-window",
    category: "sliding-window",
    phase: 2,
    weekNumber: 5,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    correctPattern: "Sliding Window",
    starterCode: `def check_inclusion(s1: str, s2: str) -> bool:
    """
    Example:
        check_inclusion("ab", "eidbaooo") -> True
        check_inclusion("ab", "eidboaoo") -> False
    """
    pass

import json
data = json.loads(input())
print(json.dumps(check_inclusion(data["s1"], data["s2"])))`,
    solutionCode: `def check_inclusion(s1: str, s2: str) -> bool:
    from collections import Counter
    if len(s1) > len(s2): return False
    need = Counter(s1)
    window = Counter(s2[:len(s1)])
    if window == need: return True
    for i in range(len(s1), len(s2)):
        window[s2[i]] += 1
        old = s2[i - len(s1)]
        window[old] -= 1
        if window[old] == 0: del window[old]
        if window == need: return True
    return False

import json
data = json.loads(input())
print(json.dumps(check_inclusion(data["s1"], data["s2"])))`,
    testCases: JSON.stringify([
      { input: { s1: "ab", s2: "eidbaooo" }, expectedOutput: true },
      { input: { s1: "ab", s2: "eidboaoo" }, expectedOutput: false },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { s1: "a", s2: "a" }, expectedOutput: true },
      { input: { s1: "abc", s2: "ab" }, expectedOutput: false },
    ]),
    hints: JSON.stringify(["Use a fixed-size sliding window of length len(s1).", "Compare character frequency counts."]),
  },
  {
    slug: "minimum-size-subarray-sum",
    title: "Minimum Size Subarray Sum",
    description: "Given an array of positive integers `nums` and a positive integer `target`, return the minimal length of a contiguous subarray whose sum is >= `target`. Return 0 if no such subarray exists.",
    difficulty: "medium",
    pattern: "sliding-window",
    category: "sliding-window",
    phase: 2,
    weekNumber: 6,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    correctPattern: "Sliding Window",
    starterCode: `def min_sub_array_len(target: int, nums: list) -> int:
    """
    Example:
        min_sub_array_len(7, [2,3,1,2,4,3]) -> 2
    """
    pass

import json
data = json.loads(input())
print(json.dumps(min_sub_array_len(data["target"], data["nums"])))`,
    solutionCode: `def min_sub_array_len(target: int, nums: list) -> int:
    left = total = 0
    result = float('inf')
    for right, n in enumerate(nums):
        total += n
        while total >= target:
            result = min(result, right - left + 1)
            total -= nums[left]
            left += 1
    return result if result != float('inf') else 0

import json
data = json.loads(input())
print(json.dumps(min_sub_array_len(data["target"], data["nums"])))`,
    testCases: JSON.stringify([
      { input: { target: 7, nums: [2, 3, 1, 2, 4, 3] }, expectedOutput: 2 },
      { input: { target: 4, nums: [1, 4, 4] }, expectedOutput: 1 },
      { input: { target: 11, nums: [1, 1, 1, 1, 1, 1, 1, 1] }, expectedOutput: 0 },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { target: 15, nums: [5, 1, 3, 5, 10, 7, 4, 9, 2, 8] }, expectedOutput: 2 },
    ]),
    hints: JSON.stringify(["Use a variable-size sliding window.", "Shrink the window when sum >= target to find the minimum length."]),
  },
  {
    slug: "max-consecutive-ones-iii",
    title: "Max Consecutive Ones III",
    description: "Given a binary array `nums` and an integer `k`, return the maximum number of consecutive 1's if you can flip at most `k` 0's.",
    difficulty: "medium",
    pattern: "sliding-window",
    category: "sliding-window",
    phase: 2,
    weekNumber: 6,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    correctPattern: "Sliding Window",
    starterCode: `def longest_ones(nums: list, k: int) -> int:
    """
    Example:
        longest_ones([1,1,1,0,0,0,1,1,1,1,0], 2) -> 6
    """
    pass

import json
data = json.loads(input())
print(json.dumps(longest_ones(data["nums"], data["k"])))`,
    solutionCode: `def longest_ones(nums: list, k: int) -> int:
    left = zeros = result = 0
    for right in range(len(nums)):
        if nums[right] == 0:
            zeros += 1
        while zeros > k:
            if nums[left] == 0:
                zeros -= 1
            left += 1
        result = max(result, right - left + 1)
    return result

import json
data = json.loads(input())
print(json.dumps(longest_ones(data["nums"], data["k"])))`,
    testCases: JSON.stringify([
      { input: { nums: [1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0], k: 2 }, expectedOutput: 6 },
      { input: { nums: [0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1], k: 3 }, expectedOutput: 10 },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { nums: [1, 1, 1], k: 0 }, expectedOutput: 3 },
    ]),
    hints: JSON.stringify(["Sliding window: track the number of 0's in the window.", "Shrink from the left when zeros exceed k."]),
  },
  {
    slug: "fruit-into-baskets",
    title: "Fruit Into Baskets",
    description: "You have two baskets, each holding one type of fruit. Given an array of fruit types, find the maximum number of fruits you can collect in a contiguous subarray with at most 2 distinct types.",
    difficulty: "medium",
    pattern: "sliding-window",
    category: "sliding-window",
    phase: 2,
    weekNumber: 6,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    correctPattern: "Sliding Window",
    starterCode: `def total_fruit(fruits: list) -> int:
    """
    Example:
        total_fruit([1,2,1]) -> 3
        total_fruit([0,1,2,2]) -> 3
    """
    pass

import json
data = json.loads(input())
print(json.dumps(total_fruit(data["fruits"])))`,
    solutionCode: `def total_fruit(fruits: list) -> int:
    count = {}
    left = result = 0
    for right, f in enumerate(fruits):
        count[f] = count.get(f, 0) + 1
        while len(count) > 2:
            count[fruits[left]] -= 1
            if count[fruits[left]] == 0:
                del count[fruits[left]]
            left += 1
        result = max(result, right - left + 1)
    return result

import json
data = json.loads(input())
print(json.dumps(total_fruit(data["fruits"])))`,
    testCases: JSON.stringify([
      { input: { fruits: [1, 2, 1] }, expectedOutput: 3 },
      { input: { fruits: [0, 1, 2, 2] }, expectedOutput: 3 },
      { input: { fruits: [1, 2, 3, 2, 2] }, expectedOutput: 4 },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { fruits: [3, 3, 3, 1, 2, 1, 1, 2, 3, 3, 4] }, expectedOutput: 5 },
    ]),
    hints: JSON.stringify(["Sliding window with at most 2 distinct elements.", "This is equivalent to 'longest subarray with at most 2 distinct values'."]),
  },
  {
    slug: "grumpy-bookstore-owner",
    title: "Grumpy Bookstore Owner",
    description: "A bookstore owner has `customers[i]` customers at minute `i`. They are grumpy at minute `i` if `grumpy[i] == 1`. They can use a technique to not be grumpy for `minutes` consecutive minutes. Return the maximum number of satisfied customers.",
    difficulty: "medium",
    pattern: "sliding-window",
    category: "sliding-window",
    phase: 2,
    weekNumber: 7,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    correctPattern: "Sliding Window",
    starterCode: `def max_satisfied(customers: list, grumpy: list, minutes: int) -> int:
    """
    Example:
        max_satisfied([1,0,1,2,1,1,7,5], [0,1,0,1,0,1,0,1], 3) -> 16
    """
    pass

import json
data = json.loads(input())
print(json.dumps(max_satisfied(data["customers"], data["grumpy"], data["minutes"])))`,
    solutionCode: `def max_satisfied(customers: list, grumpy: list, minutes: int) -> int:
    base = sum(c for c, g in zip(customers, grumpy) if g == 0)
    bonus = sum(customers[i] * grumpy[i] for i in range(minutes))
    max_bonus = bonus
    for i in range(minutes, len(customers)):
        bonus += customers[i] * grumpy[i]
        bonus -= customers[i - minutes] * grumpy[i - minutes]
        max_bonus = max(max_bonus, bonus)
    return base + max_bonus

import json
data = json.loads(input())
print(json.dumps(max_satisfied(data["customers"], data["grumpy"], data["minutes"])))`,
    testCases: JSON.stringify([
      { input: { customers: [1, 0, 1, 2, 1, 1, 7, 5], grumpy: [0, 1, 0, 1, 0, 1, 0, 1], minutes: 3 }, expectedOutput: 16 },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { customers: [1], grumpy: [0], minutes: 1 }, expectedOutput: 1 },
    ]),
    hints: JSON.stringify(["Calculate the base satisfied customers (when not grumpy).", "Use a sliding window to find which window recovers the most lost customers."]),
  },
  {
    slug: "contains-duplicate-ii",
    title: "Contains Duplicate II",
    description: "Given an integer array `nums` and an integer `k`, return `True` if there are two distinct indices `i` and `j` such that `nums[i] == nums[j]` and `abs(i - j) <= k`.",
    difficulty: "easy",
    pattern: "sliding-window",
    category: "sliding-window",
    phase: 2,
    weekNumber: 7,
    timeComplexity: "O(n)",
    spaceComplexity: "O(k)",
    correctPattern: "Sliding Window",
    starterCode: `def contains_nearby_duplicate(nums: list, k: int) -> bool:
    """
    Example:
        contains_nearby_duplicate([1,2,3,1], 3) -> True
        contains_nearby_duplicate([1,0,1,1], 1) -> True
    """
    pass

import json
data = json.loads(input())
print(json.dumps(contains_nearby_duplicate(data["nums"], data["k"])))`,
    solutionCode: `def contains_nearby_duplicate(nums: list, k: int) -> bool:
    window = set()
    for i, n in enumerate(nums):
        if n in window:
            return True
        window.add(n)
        if len(window) > k:
            window.remove(nums[i - k])
    return False

import json
data = json.loads(input())
print(json.dumps(contains_nearby_duplicate(data["nums"], data["k"])))`,
    testCases: JSON.stringify([
      { input: { nums: [1, 2, 3, 1], k: 3 }, expectedOutput: true },
      { input: { nums: [1, 0, 1, 1], k: 1 }, expectedOutput: true },
      { input: { nums: [1, 2, 3, 1, 2, 3], k: 2 }, expectedOutput: false },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { nums: [1], k: 1 }, expectedOutput: false },
    ]),
    hints: JSON.stringify(["Use a sliding window set of size k.", "Check if the current element is already in the window."]),
  },

  // ══════════════════════════════════════════════════════════════
  // TWO POINTERS (6 problems) — More depth
  // ══════════════════════════════════════════════════════════════
  {
    slug: "remove-duplicates-sorted-array",
    title: "Remove Duplicates from Sorted Array",
    description: "Given a sorted array, remove the duplicates in-place such that each element appears only once. Return the number of unique elements.",
    difficulty: "easy",
    pattern: "two-pointers",
    category: "two-pointers",
    phase: 2,
    weekNumber: 1,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    correctPattern: "Two Pointers",
    starterCode: `def remove_duplicates(nums: list) -> int:
    """
    Example:
        remove_duplicates([1,1,2]) -> 2 (nums becomes [1,2,...])
    """
    pass

import json
data = json.loads(input())
print(json.dumps(remove_duplicates(data["nums"])))`,
    solutionCode: `def remove_duplicates(nums: list) -> int:
    if not nums: return 0
    slow = 0
    for fast in range(1, len(nums)):
        if nums[fast] != nums[slow]:
            slow += 1
            nums[slow] = nums[fast]
    return slow + 1

import json
data = json.loads(input())
print(json.dumps(remove_duplicates(data["nums"])))`,
    testCases: JSON.stringify([
      { input: { nums: [1, 1, 2] }, expectedOutput: 2 },
      { input: { nums: [0, 0, 1, 1, 1, 2, 2, 3, 3, 4] }, expectedOutput: 5 },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { nums: [1] }, expectedOutput: 1 },
      { input: { nums: [] }, expectedOutput: 0 },
    ]),
    hints: JSON.stringify(["Use slow/fast pointers.", "When fast finds a new value, move slow forward and copy."]),
  },
  {
    slug: "sort-colors",
    title: "Sort Colors",
    description: "Given an array with elements 0, 1, and 2 (representing red, white, blue), sort them in-place so that objects of the same color are adjacent. You must solve this without using the library sort function.",
    difficulty: "medium",
    pattern: "two-pointers",
    category: "two-pointers",
    phase: 2,
    weekNumber: 1,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    correctPattern: "Two Pointers",
    starterCode: `def sort_colors(nums: list) -> list:
    """
    Example:
        sort_colors([2,0,2,1,1,0]) -> [0,0,1,1,2,2]
    """
    pass

import json
data = json.loads(input())
print(json.dumps(sort_colors(data["nums"])))`,
    solutionCode: `def sort_colors(nums: list) -> list:
    lo, mid, hi = 0, 0, len(nums) - 1
    while mid <= hi:
        if nums[mid] == 0:
            nums[lo], nums[mid] = nums[mid], nums[lo]
            lo += 1
            mid += 1
        elif nums[mid] == 1:
            mid += 1
        else:
            nums[mid], nums[hi] = nums[hi], nums[mid]
            hi -= 1
    return nums

import json
data = json.loads(input())
print(json.dumps(sort_colors(data["nums"])))`,
    testCases: JSON.stringify([
      { input: { nums: [2, 0, 2, 1, 1, 0] }, expectedOutput: [0, 0, 1, 1, 2, 2] },
      { input: { nums: [2, 0, 1] }, expectedOutput: [0, 1, 2] },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { nums: [0] }, expectedOutput: [0] },
      { input: { nums: [1, 0] }, expectedOutput: [0, 1] },
    ]),
    hints: JSON.stringify(["Dutch National Flag algorithm: three pointers (lo, mid, hi).", "Swap 0s to the left, 2s to the right."]),
  },
  {
    slug: "backspace-string-compare",
    title: "Backspace String Compare",
    description: "Given two strings `s` and `t`, return `True` if they are equal when both are typed into empty text editors. `#` means a backspace character.",
    difficulty: "easy",
    pattern: "two-pointers",
    category: "two-pointers",
    phase: 2,
    weekNumber: 1,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    correctPattern: "Two Pointers",
    starterCode: `def backspace_compare(s: str, t: str) -> bool:
    """
    Example:
        backspace_compare("ab#c", "ad#c") -> True
        backspace_compare("ab##", "c#d#") -> True
    """
    pass

import json
data = json.loads(input())
print(json.dumps(backspace_compare(data["s"], data["t"])))`,
    solutionCode: `def backspace_compare(s: str, t: str) -> bool:
    def build(string):
        stack = []
        for c in string:
            if c == '#':
                if stack: stack.pop()
            else:
                stack.append(c)
        return ''.join(stack)
    return build(s) == build(t)

import json
data = json.loads(input())
print(json.dumps(backspace_compare(data["s"], data["t"])))`,
    testCases: JSON.stringify([
      { input: { s: "ab#c", t: "ad#c" }, expectedOutput: true },
      { input: { s: "ab##", t: "c#d#" }, expectedOutput: true },
      { input: { s: "a#c", t: "b" }, expectedOutput: false },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { s: "", t: "" }, expectedOutput: true },
      { input: { s: "a##c", t: "#a#c" }, expectedOutput: true },
    ]),
    hints: JSON.stringify(["Build the result string using a stack, treating '#' as pop.", "Compare the final strings."]),
  },
  {
    slug: "squares-of-sorted-array",
    title: "Squares of a Sorted Array",
    description: "Given a sorted array of integers, return an array of the squares of each number, also in sorted order.",
    difficulty: "easy",
    pattern: "two-pointers",
    category: "two-pointers",
    phase: 2,
    weekNumber: 2,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    correctPattern: "Two Pointers",
    starterCode: `def sorted_squares(nums: list) -> list:
    """
    Example:
        sorted_squares([-4,-1,0,3,10]) -> [0,1,9,16,100]
    """
    pass

import json
data = json.loads(input())
print(json.dumps(sorted_squares(data["nums"])))`,
    solutionCode: `def sorted_squares(nums: list) -> list:
    n = len(nums)
    result = [0] * n
    left, right = 0, n - 1
    pos = n - 1
    while left <= right:
        if abs(nums[left]) >= abs(nums[right]):
            result[pos] = nums[left] ** 2
            left += 1
        else:
            result[pos] = nums[right] ** 2
            right -= 1
        pos -= 1
    return result

import json
data = json.loads(input())
print(json.dumps(sorted_squares(data["nums"])))`,
    testCases: JSON.stringify([
      { input: { nums: [-4, -1, 0, 3, 10] }, expectedOutput: [0, 1, 9, 16, 100] },
      { input: { nums: [-7, -3, 2, 3, 11] }, expectedOutput: [4, 9, 9, 49, 121] },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { nums: [1] }, expectedOutput: [1] },
      { input: { nums: [-5, -3, -2, -1] }, expectedOutput: [1, 4, 9, 25] },
    ]),
    hints: JSON.stringify(["Use two pointers at both ends.", "The largest square is at one of the ends — fill the result array from the back."]),
  },
  {
    slug: "four-sum",
    title: "4Sum",
    description: "Given an array `nums` and a target, find all unique quadruplets `[a, b, c, d]` such that `a + b + c + d == target`.",
    difficulty: "medium",
    pattern: "two-pointers",
    category: "two-pointers",
    phase: 3,
    weekNumber: 9,
    timeComplexity: "O(n^3)",
    spaceComplexity: "O(n)",
    correctPattern: "Two Pointers",
    starterCode: `def four_sum(nums: list, target: int) -> list:
    """
    Example:
        four_sum([1,0,-1,0,-2,2], 0) -> [[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]
    """
    pass

import json
data = json.loads(input())
result = four_sum(data["nums"], data["target"])
print(json.dumps(sorted([sorted(q) for q in result])))`,
    solutionCode: `def four_sum(nums: list, target: int) -> list:
    nums.sort()
    result = []
    n = len(nums)
    for i in range(n - 3):
        if i > 0 and nums[i] == nums[i-1]: continue
        for j in range(i+1, n - 2):
            if j > i+1 and nums[j] == nums[j-1]: continue
            lo, hi = j+1, n-1
            while lo < hi:
                s = nums[i] + nums[j] + nums[lo] + nums[hi]
                if s < target: lo += 1
                elif s > target: hi -= 1
                else:
                    result.append([nums[i], nums[j], nums[lo], nums[hi]])
                    while lo < hi and nums[lo] == nums[lo+1]: lo += 1
                    while lo < hi and nums[hi] == nums[hi-1]: hi -= 1
                    lo += 1; hi -= 1
    return result

import json
data = json.loads(input())
result = four_sum(data["nums"], data["target"])
print(json.dumps(sorted([sorted(q) for q in result])))`,
    testCases: JSON.stringify([
      { input: { nums: [1, 0, -1, 0, -2, 2], target: 0 }, expectedOutput: [[-2, -1, 1, 2], [-2, 0, 0, 2], [-1, 0, 0, 1]] },
      { input: { nums: [2, 2, 2, 2, 2], target: 8 }, expectedOutput: [[2, 2, 2, 2]] },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { nums: [0, 0, 0, 0], target: 0 }, expectedOutput: [[0, 0, 0, 0]] },
    ]),
    hints: JSON.stringify(["Fix two numbers, then use two pointers for the remaining two.", "Skip duplicates at each level."]),
  },
  {
    slug: "trapping-rain-water-ii",
    title: "Trapping Rain Water (Two Pointers)",
    description: "Given `n` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining. Solve using the two-pointer approach.",
    difficulty: "hard",
    pattern: "two-pointers",
    category: "two-pointers",
    phase: 5,
    weekNumber: 2,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    correctPattern: "Two Pointers",
    starterCode: `def trap(height: list) -> int:
    """
    Example:
        trap([0,1,0,2,1,0,1,3,2,1,2,1]) -> 6
    """
    pass

import json
data = json.loads(input())
print(json.dumps(trap(data["height"])))`,
    solutionCode: `def trap(height: list) -> int:
    left, right = 0, len(height) - 1
    left_max = right_max = water = 0
    while left < right:
        if height[left] < height[right]:
            if height[left] >= left_max:
                left_max = height[left]
            else:
                water += left_max - height[left]
            left += 1
        else:
            if height[right] >= right_max:
                right_max = height[right]
            else:
                water += right_max - height[right]
            right -= 1
    return water

import json
data = json.loads(input())
print(json.dumps(trap(data["height"])))`,
    testCases: JSON.stringify([
      { input: { height: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1] }, expectedOutput: 6 },
      { input: { height: [4, 2, 0, 3, 2, 5] }, expectedOutput: 9 },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { height: [1, 0, 1] }, expectedOutput: 1 },
      { input: { height: [] }, expectedOutput: 0 },
    ]),
    hints: JSON.stringify(["Move the pointer with the smaller height inward.", "Water at each position = min(leftMax, rightMax) - height[i]."]),
  },

  // ══════════════════════════════════════════════════════════════
  // LINKED LIST (6 problems)
  // ══════════════════════════════════════════════════════════════
  {
    slug: "remove-nth-from-end",
    title: "Remove Nth Node From End of List",
    description: "Given a linked list (as an array), remove the nth node from the end and return the modified list.",
    difficulty: "medium",
    pattern: "linked-list",
    category: "linked-list",
    phase: 2,
    weekNumber: 2,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    correctPattern: "Linked List",
    starterCode: `def remove_nth_from_end(head: list, n: int) -> list:
    """
    Example:
        remove_nth_from_end([1,2,3,4,5], 2) -> [1,2,3,5]
    """
    pass

import json
data = json.loads(input())
print(json.dumps(remove_nth_from_end(data["head"], data["n"])))`,
    solutionCode: `def remove_nth_from_end(head: list, n: int) -> list:
    idx = len(head) - n
    return head[:idx] + head[idx+1:]

import json
data = json.loads(input())
print(json.dumps(remove_nth_from_end(data["head"], data["n"])))`,
    testCases: JSON.stringify([
      { input: { head: [1, 2, 3, 4, 5], n: 2 }, expectedOutput: [1, 2, 3, 5] },
      { input: { head: [1], n: 1 }, expectedOutput: [] },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { head: [1, 2], n: 1 }, expectedOutput: [1] },
      { input: { head: [1, 2], n: 2 }, expectedOutput: [2] },
    ]),
    hints: JSON.stringify(["Use two pointers separated by n nodes.", "When the fast pointer reaches the end, the slow pointer is at the node to remove."]),
  },
  {
    slug: "add-two-numbers",
    title: "Add Two Numbers",
    description: "Two non-negative integers are represented as linked lists (arrays) in reverse order. Each node contains a single digit. Add the two numbers and return the sum as a list in reverse order.",
    difficulty: "medium",
    pattern: "linked-list",
    category: "linked-list",
    phase: 2,
    weekNumber: 2,
    timeComplexity: "O(max(m,n))",
    spaceComplexity: "O(max(m,n))",
    correctPattern: "Linked List",
    starterCode: `def add_two_numbers(l1: list, l2: list) -> list:
    """
    Example:
        add_two_numbers([2,4,3], [5,6,4]) -> [7,0,8]  (342 + 465 = 807)
    """
    pass

import json
data = json.loads(input())
print(json.dumps(add_two_numbers(data["l1"], data["l2"])))`,
    solutionCode: `def add_two_numbers(l1: list, l2: list) -> list:
    result = []
    carry = 0
    i = 0
    while i < len(l1) or i < len(l2) or carry:
        total = carry
        if i < len(l1): total += l1[i]
        if i < len(l2): total += l2[i]
        result.append(total % 10)
        carry = total // 10
        i += 1
    return result

import json
data = json.loads(input())
print(json.dumps(add_two_numbers(data["l1"], data["l2"])))`,
    testCases: JSON.stringify([
      { input: { l1: [2, 4, 3], l2: [5, 6, 4] }, expectedOutput: [7, 0, 8] },
      { input: { l1: [0], l2: [0] }, expectedOutput: [0] },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { l1: [9, 9, 9, 9, 9, 9, 9], l2: [9, 9, 9, 9] }, expectedOutput: [8, 9, 9, 9, 0, 0, 0, 1] },
    ]),
    hints: JSON.stringify(["Process digit by digit, tracking carry.", "Don't forget the final carry."]),
  },
  {
    slug: "reorder-list",
    title: "Reorder List",
    description: "Given a list `[L0, L1, ..., Ln]`, reorder it to `[L0, Ln, L1, Ln-1, L2, Ln-2, ...]`.",
    difficulty: "medium",
    pattern: "linked-list",
    category: "linked-list",
    phase: 2,
    weekNumber: 3,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    correctPattern: "Linked List",
    starterCode: `def reorder_list(head: list) -> list:
    """
    Example:
        reorder_list([1,2,3,4]) -> [1,4,2,3]
        reorder_list([1,2,3,4,5]) -> [1,5,2,4,3]
    """
    pass

import json
data = json.loads(input())
print(json.dumps(reorder_list(data["head"])))`,
    solutionCode: `def reorder_list(head: list) -> list:
    if len(head) <= 2: return head
    result = []
    left, right = 0, len(head) - 1
    while left <= right:
        result.append(head[left])
        if left != right:
            result.append(head[right])
        left += 1
        right -= 1
    return result

import json
data = json.loads(input())
print(json.dumps(reorder_list(data["head"])))`,
    testCases: JSON.stringify([
      { input: { head: [1, 2, 3, 4] }, expectedOutput: [1, 4, 2, 3] },
      { input: { head: [1, 2, 3, 4, 5] }, expectedOutput: [1, 5, 2, 4, 3] },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { head: [1] }, expectedOutput: [1] },
      { input: { head: [1, 2] }, expectedOutput: [1, 2] },
    ]),
    hints: JSON.stringify(["Find the middle, reverse the second half, then merge alternately.", "Two pointers from front and back work for array representation."]),
  },
  {
    slug: "swap-nodes-in-pairs",
    title: "Swap Nodes in Pairs",
    description: "Given a linked list (as an array), swap every two adjacent nodes and return the result. You may not modify the values, only the nodes themselves can be changed.",
    difficulty: "medium",
    pattern: "linked-list",
    category: "linked-list",
    phase: 2,
    weekNumber: 3,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    correctPattern: "Linked List",
    starterCode: `def swap_pairs(head: list) -> list:
    """
    Example:
        swap_pairs([1,2,3,4]) -> [2,1,4,3]
    """
    pass

import json
data = json.loads(input())
print(json.dumps(swap_pairs(data["head"])))`,
    solutionCode: `def swap_pairs(head: list) -> list:
    result = list(head)
    for i in range(0, len(result) - 1, 2):
        result[i], result[i+1] = result[i+1], result[i]
    return result

import json
data = json.loads(input())
print(json.dumps(swap_pairs(data["head"])))`,
    testCases: JSON.stringify([
      { input: { head: [1, 2, 3, 4] }, expectedOutput: [2, 1, 4, 3] },
      { input: { head: [] }, expectedOutput: [] },
      { input: { head: [1] }, expectedOutput: [1] },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { head: [1, 2, 3] }, expectedOutput: [2, 1, 3] },
    ]),
    hints: JSON.stringify(["Swap pairs of adjacent elements.", "Handle the case where the list has an odd number of elements."]),
  },
  {
    slug: "rotate-list",
    title: "Rotate List",
    description: "Given a linked list (as an array), rotate the list to the right by `k` places.",
    difficulty: "medium",
    pattern: "linked-list",
    category: "linked-list",
    phase: 2,
    weekNumber: 4,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    correctPattern: "Linked List",
    starterCode: `def rotate_right(head: list, k: int) -> list:
    """
    Example:
        rotate_right([1,2,3,4,5], 2) -> [4,5,1,2,3]
    """
    pass

import json
data = json.loads(input())
print(json.dumps(rotate_right(data["head"], data["k"])))`,
    solutionCode: `def rotate_right(head: list, k: int) -> list:
    if not head: return head
    n = len(head)
    k = k % n
    if k == 0: return head
    return head[-k:] + head[:-k]

import json
data = json.loads(input())
print(json.dumps(rotate_right(data["head"], data["k"])))`,
    testCases: JSON.stringify([
      { input: { head: [1, 2, 3, 4, 5], k: 2 }, expectedOutput: [4, 5, 1, 2, 3] },
      { input: { head: [0, 1, 2], k: 4 }, expectedOutput: [2, 0, 1] },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { head: [1], k: 99 }, expectedOutput: [1] },
      { input: { head: [], k: 0 }, expectedOutput: [] },
    ]),
    hints: JSON.stringify(["k can be larger than the list length — use k % n.", "Split the list at position n-k and reconnect."]),
  },
  {
    slug: "odd-even-linked-list",
    title: "Odd Even Linked List",
    description: "Given a linked list (as an array), group all odd-indexed nodes together followed by even-indexed nodes. The first node is index 1 (odd).",
    difficulty: "medium",
    pattern: "linked-list",
    category: "linked-list",
    phase: 2,
    weekNumber: 4,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    correctPattern: "Linked List",
    starterCode: `def odd_even_list(head: list) -> list:
    """
    Example:
        odd_even_list([1,2,3,4,5]) -> [1,3,5,2,4]
        odd_even_list([2,1,3,5,6,4,7]) -> [2,3,6,7,1,5,4]
    """
    pass

import json
data = json.loads(input())
print(json.dumps(odd_even_list(data["head"])))`,
    solutionCode: `def odd_even_list(head: list) -> list:
    odd = [head[i] for i in range(0, len(head), 2)]
    even = [head[i] for i in range(1, len(head), 2)]
    return odd + even

import json
data = json.loads(input())
print(json.dumps(odd_even_list(data["head"])))`,
    testCases: JSON.stringify([
      { input: { head: [1, 2, 3, 4, 5] }, expectedOutput: [1, 3, 5, 2, 4] },
      { input: { head: [2, 1, 3, 5, 6, 4, 7] }, expectedOutput: [2, 3, 6, 7, 1, 5, 4] },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { head: [1, 2] }, expectedOutput: [1, 2] },
      { input: { head: [1] }, expectedOutput: [1] },
    ]),
    hints: JSON.stringify(["Separate odd and even indexed elements into two lists.", "Concatenate them at the end."]),
  },

  // ══════════════════════════════════════════════════════════════
  // TREE (6 problems) — More depth
  // ══════════════════════════════════════════════════════════════
  {
    slug: "same-tree",
    title: "Same Tree",
    description: "Given the roots of two binary trees (represented as arrays using level-order, with null for missing nodes), check if they are the same.",
    difficulty: "easy",
    pattern: "tree",
    category: "trees",
    phase: 2,
    weekNumber: 8,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    correctPattern: "Tree",
    starterCode: `def is_same_tree(p: list, q: list) -> bool:
    """
    Example:
        is_same_tree([1,2,3], [1,2,3]) -> True
        is_same_tree([1,2], [1,null,2]) -> False
    """
    pass

import json
data = json.loads(input())
print(json.dumps(is_same_tree(data["p"], data["q"])))`,
    solutionCode: `def is_same_tree(p: list, q: list) -> bool:
    return p == q

import json
data = json.loads(input())
print(json.dumps(is_same_tree(data["p"], data["q"])))`,
    testCases: JSON.stringify([
      { input: { p: [1, 2, 3], q: [1, 2, 3] }, expectedOutput: true },
      { input: { p: [1, 2], q: [1, null, 2] }, expectedOutput: false },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { p: [], q: [] }, expectedOutput: true },
      { input: { p: [1], q: [1] }, expectedOutput: true },
    ]),
    hints: JSON.stringify(["Compare both trees node by node.", "Two trees are same if root values match and left/right subtrees are same."]),
  },
  {
    slug: "kth-smallest-bst",
    title: "Kth Smallest Element in BST",
    description: "Given a BST (as a level-order array) and an integer `k`, return the kth smallest element.",
    difficulty: "medium",
    pattern: "bst",
    category: "trees",
    phase: 3,
    weekNumber: 9,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    correctPattern: "BST",
    starterCode: `def kth_smallest(root: list, k: int) -> int:
    """
    Given a BST as a level-order array (null for missing nodes),
    return the kth smallest element.

    Example:
        kth_smallest([3,1,4,null,2], 1) -> 1
    """
    pass

import json
data = json.loads(input())
print(json.dumps(kth_smallest(data["root"], data["k"])))`,
    solutionCode: `def kth_smallest(root: list, k: int) -> int:
    vals = sorted([x for x in root if x is not None])
    return vals[k - 1]

import json
data = json.loads(input())
print(json.dumps(kth_smallest(data["root"], data["k"])))`,
    testCases: JSON.stringify([
      { input: { root: [3, 1, 4, null, 2], k: 1 }, expectedOutput: 1 },
      { input: { root: [5, 3, 6, 2, 4, null, null, 1], k: 3 }, expectedOutput: 3 },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { root: [1], k: 1 }, expectedOutput: 1 },
    ]),
    hints: JSON.stringify(["In-order traversal of a BST gives sorted order.", "The kth element in in-order traversal is the answer."]),
  },
  {
    slug: "binary-tree-right-side-view",
    title: "Binary Tree Right Side View",
    description: "Given a binary tree (as a level-order array), return the values of the nodes you can see from the right side, ordered from top to bottom.",
    difficulty: "medium",
    pattern: "bfs",
    category: "trees",
    phase: 3,
    weekNumber: 9,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    correctPattern: "BFS",
    starterCode: `def right_side_view(root: list) -> list:
    """
    Given a binary tree as level-order array (null for missing),
    return the rightmost node at each level.

    Example:
        right_side_view([1,2,3,null,5,null,4]) -> [1,3,4]
    """
    pass

import json
data = json.loads(input())
print(json.dumps(right_side_view(data["root"])))`,
    solutionCode: `def right_side_view(root: list) -> list:
    if not root: return []
    from collections import deque
    result = []
    queue = deque([0])
    while queue:
        level_size = len(queue)
        for i in range(level_size):
            idx = queue.popleft()
            if i == level_size - 1 and root[idx] is not None:
                result.append(root[idx])
            left = 2 * idx + 1
            right = 2 * idx + 2
            if left < len(root) and root[left] is not None:
                queue.append(left)
            if right < len(root) and root[right] is not None:
                queue.append(right)
    return result

import json
data = json.loads(input())
print(json.dumps(right_side_view(data["root"])))`,
    testCases: JSON.stringify([
      { input: { root: [1, 2, 3, null, 5, null, 4] }, expectedOutput: [1, 3, 4] },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { root: [1] }, expectedOutput: [1] },
      { input: { root: [] }, expectedOutput: [] },
    ]),
    hints: JSON.stringify(["BFS level by level — the last node at each level is visible from the right.", "Alternatively, DFS going right first."]),
  },
  {
    slug: "path-sum",
    title: "Path Sum",
    description: "Given a binary tree (as a level-order array, null for missing) and an integer `targetSum`, determine if the tree has a root-to-leaf path where the sum of node values equals `targetSum`.",
    difficulty: "easy",
    pattern: "tree",
    category: "trees",
    phase: 2,
    weekNumber: 8,
    timeComplexity: "O(n)",
    spaceComplexity: "O(h)",
    correctPattern: "Tree",
    starterCode: `def has_path_sum(root: list, target_sum: int) -> bool:
    """
    Example:
        has_path_sum([5,4,8,11,null,13,4,7,2,null,null,null,1], 22) -> True
    """
    pass

import json
data = json.loads(input())
print(json.dumps(has_path_sum(data["root"], data["target_sum"])))`,
    solutionCode: `def has_path_sum(root: list, target_sum: int) -> bool:
    if not root or root[0] is None: return False
    def dfs(idx, current_sum):
        if idx >= len(root) or root[idx] is None:
            return False
        current_sum += root[idx]
        left = 2 * idx + 1
        right = 2 * idx + 2
        is_leaf = (left >= len(root) or root[left] is None) and (right >= len(root) or root[right] is None)
        if is_leaf:
            return current_sum == target_sum
        return dfs(left, current_sum) or dfs(right, current_sum)
    return dfs(0, 0)

import json
data = json.loads(input())
print(json.dumps(has_path_sum(data["root"], data["target_sum"])))`,
    testCases: JSON.stringify([
      { input: { root: [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1], target_sum: 22 }, expectedOutput: true },
      { input: { root: [1, 2, 3], target_sum: 5 }, expectedOutput: false },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { root: [], target_sum: 0 }, expectedOutput: false },
      { input: { root: [1, 2], target_sum: 1 }, expectedOutput: false },
    ]),
    hints: JSON.stringify(["DFS from root, subtracting each node's value from the target.", "Check if you reach a leaf with sum == 0."]),
  },
  {
    slug: "diameter-of-binary-tree",
    title: "Diameter of Binary Tree",
    description: "Given a binary tree (as a level-order array), return the length of the diameter — the longest path between any two nodes. The path may or may not pass through the root. The length is measured by the number of edges.",
    difficulty: "easy",
    pattern: "tree",
    category: "trees",
    phase: 2,
    weekNumber: 8,
    timeComplexity: "O(n)",
    spaceComplexity: "O(h)",
    correctPattern: "Tree",
    starterCode: `def diameter_of_binary_tree(root: list) -> int:
    """
    Example:
        diameter_of_binary_tree([1,2,3,4,5]) -> 3
    """
    pass

import json
data = json.loads(input())
print(json.dumps(diameter_of_binary_tree(data["root"])))`,
    solutionCode: `def diameter_of_binary_tree(root: list) -> int:
    diameter = 0
    def depth(idx):
        nonlocal diameter
        if idx >= len(root) or root[idx] is None:
            return 0
        left = depth(2 * idx + 1)
        right = depth(2 * idx + 2)
        diameter = max(diameter, left + right)
        return 1 + max(left, right)
    depth(0)
    return diameter

import json
data = json.loads(input())
print(json.dumps(diameter_of_binary_tree(data["root"])))`,
    testCases: JSON.stringify([
      { input: { root: [1, 2, 3, 4, 5] }, expectedOutput: 3 },
      { input: { root: [1, 2] }, expectedOutput: 1 },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { root: [1] }, expectedOutput: 0 },
    ]),
    hints: JSON.stringify(["At each node, diameter = left_depth + right_depth.", "Track the global max diameter while computing depths."]),
  },
  {
    slug: "symmetric-tree",
    title: "Symmetric Tree",
    description: "Given a binary tree (as a level-order array), check if it is a mirror of itself (symmetric around its center).",
    difficulty: "easy",
    pattern: "tree",
    category: "trees",
    phase: 2,
    weekNumber: 9,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    correctPattern: "Tree",
    starterCode: `def is_symmetric(root: list) -> bool:
    """
    Example:
        is_symmetric([1,2,2,3,4,4,3]) -> True
        is_symmetric([1,2,2,null,3,null,3]) -> False
    """
    pass

import json
data = json.loads(input())
print(json.dumps(is_symmetric(data["root"])))`,
    solutionCode: `def is_symmetric(root: list) -> bool:
    if not root: return True
    def is_mirror(i, j):
        if i >= len(root) and j >= len(root): return True
        if i >= len(root) or j >= len(root): return root[i] is None and root[j] is None if max(i,j) < len(root) else i >= len(root) and j >= len(root)
        if root[i] != root[j]: return False
        return is_mirror(2*i+1, 2*j+2) and is_mirror(2*i+2, 2*j+1)
    return is_mirror(0, 0)

import json
data = json.loads(input())
print(json.dumps(is_symmetric(data["root"])))`,
    testCases: JSON.stringify([
      { input: { root: [1, 2, 2, 3, 4, 4, 3] }, expectedOutput: true },
      { input: { root: [1, 2, 2, null, 3, null, 3] }, expectedOutput: false },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { root: [1] }, expectedOutput: true },
    ]),
    hints: JSON.stringify(["A tree is symmetric if left subtree mirrors the right subtree.", "Compare left.left with right.right and left.right with right.left."]),
  },

  // ══════════════════════════════════════════════════════════════
  // MATRIX (4 problems)
  // ══════════════════════════════════════════════════════════════
  {
    slug: "spiral-matrix",
    title: "Spiral Matrix",
    description: "Given an `m x n` matrix, return all elements in spiral order.",
    difficulty: "medium",
    pattern: "arrays",
    category: "matrix",
    phase: 3,
    weekNumber: 10,
    timeComplexity: "O(m*n)",
    spaceComplexity: "O(1)",
    correctPattern: "Arrays",
    starterCode: `def spiral_order(matrix: list) -> list:
    """
    Example:
        spiral_order([[1,2,3],[4,5,6],[7,8,9]]) -> [1,2,3,6,9,8,7,4,5]
    """
    pass

import json
data = json.loads(input())
print(json.dumps(spiral_order(data["matrix"])))`,
    solutionCode: `def spiral_order(matrix: list) -> list:
    result = []
    while matrix:
        result += matrix.pop(0)
        if matrix and matrix[0]:
            for row in matrix:
                result.append(row.pop())
        if matrix:
            result += matrix.pop()[::-1]
        if matrix and matrix[0]:
            for row in reversed(matrix):
                result.append(row.pop(0))
    return result

import json
data = json.loads(input())
print(json.dumps(spiral_order(data["matrix"])))`,
    testCases: JSON.stringify([
      { input: { matrix: [[1, 2, 3], [4, 5, 6], [7, 8, 9]] }, expectedOutput: [1, 2, 3, 6, 9, 8, 7, 4, 5] },
      { input: { matrix: [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]] }, expectedOutput: [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7] },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { matrix: [[1]] }, expectedOutput: [1] },
    ]),
    hints: JSON.stringify(["Process layers: top row, right column, bottom row, left column.", "Shrink boundaries after each layer."]),
  },
  {
    slug: "rotate-image",
    title: "Rotate Image",
    description: "Given an `n x n` 2D matrix, rotate it 90 degrees clockwise in-place.",
    difficulty: "medium",
    pattern: "arrays",
    category: "matrix",
    phase: 3,
    weekNumber: 10,
    timeComplexity: "O(n^2)",
    spaceComplexity: "O(1)",
    correctPattern: "Arrays",
    starterCode: `def rotate(matrix: list) -> list:
    """
    Example:
        rotate([[1,2,3],[4,5,6],[7,8,9]]) -> [[7,4,1],[8,5,2],[9,6,3]]
    """
    pass

import json
data = json.loads(input())
print(json.dumps(rotate(data["matrix"])))`,
    solutionCode: `def rotate(matrix: list) -> list:
    n = len(matrix)
    for i in range(n):
        for j in range(i + 1, n):
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
    for row in matrix:
        row.reverse()
    return matrix

import json
data = json.loads(input())
print(json.dumps(rotate(data["matrix"])))`,
    testCases: JSON.stringify([
      { input: { matrix: [[1, 2, 3], [4, 5, 6], [7, 8, 9]] }, expectedOutput: [[7, 4, 1], [8, 5, 2], [9, 6, 3]] },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { matrix: [[1]] }, expectedOutput: [[1]] },
      { input: { matrix: [[1, 2], [3, 4]] }, expectedOutput: [[3, 1], [4, 2]] },
    ]),
    hints: JSON.stringify(["Transpose the matrix (swap rows and columns).", "Then reverse each row."]),
  },
  {
    slug: "set-matrix-zeroes",
    title: "Set Matrix Zeroes",
    description: "Given an `m x n` matrix, if an element is 0, set its entire row and column to 0. Do it in-place.",
    difficulty: "medium",
    pattern: "arrays",
    category: "matrix",
    phase: 3,
    weekNumber: 10,
    timeComplexity: "O(m*n)",
    spaceComplexity: "O(1)",
    correctPattern: "Arrays",
    starterCode: `def set_zeroes(matrix: list) -> list:
    """
    Example:
        set_zeroes([[1,1,1],[1,0,1],[1,1,1]]) -> [[1,0,1],[0,0,0],[1,0,1]]
    """
    pass

import json
data = json.loads(input())
print(json.dumps(set_zeroes(data["matrix"])))`,
    solutionCode: `def set_zeroes(matrix: list) -> list:
    m, n = len(matrix), len(matrix[0])
    first_row_zero = any(matrix[0][j] == 0 for j in range(n))
    first_col_zero = any(matrix[i][0] == 0 for i in range(m))
    for i in range(1, m):
        for j in range(1, n):
            if matrix[i][j] == 0:
                matrix[i][0] = 0
                matrix[0][j] = 0
    for i in range(1, m):
        for j in range(1, n):
            if matrix[i][0] == 0 or matrix[0][j] == 0:
                matrix[i][j] = 0
    if first_row_zero:
        for j in range(n): matrix[0][j] = 0
    if first_col_zero:
        for i in range(m): matrix[i][0] = 0
    return matrix

import json
data = json.loads(input())
print(json.dumps(set_zeroes(data["matrix"])))`,
    testCases: JSON.stringify([
      { input: { matrix: [[1, 1, 1], [1, 0, 1], [1, 1, 1]] }, expectedOutput: [[1, 0, 1], [0, 0, 0], [1, 0, 1]] },
      { input: { matrix: [[0, 1, 2, 0], [3, 4, 5, 2], [1, 3, 1, 5]] }, expectedOutput: [[0, 0, 0, 0], [0, 4, 5, 0], [0, 3, 1, 0]] },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { matrix: [[1]] }, expectedOutput: [[1]] },
    ]),
    hints: JSON.stringify(["Use the first row and column as markers.", "Process the matrix in two passes: mark, then zero out."]),
  },
  {
    slug: "valid-sudoku",
    title: "Valid Sudoku",
    description: "Determine if a 9x9 Sudoku board is valid. Only the filled cells need to be validated. Each row, column, and 3x3 box must contain digits 1-9 without repetition.",
    difficulty: "medium",
    pattern: "hash-set",
    category: "matrix",
    phase: 3,
    weekNumber: 10,
    timeComplexity: "O(1)",
    spaceComplexity: "O(1)",
    correctPattern: "Hash Set",
    starterCode: `def is_valid_sudoku(board: list) -> bool:
    """
    Example:
        is_valid_sudoku([
            ["5","3",".",".","7",".",".",".","."],
            ["6",".",".","1","9","5",".",".","."],
            [".","9","8",".",".",".",".","6","."],
            ["8",".",".",".","6",".",".",".","3"],
            ["4",".",".","8",".","3",".",".","1"],
            ["7",".",".",".","2",".",".",".","6"],
            [".","6",".",".",".",".","2","8","."],
            [".",".",".","4","1","9",".",".","5"],
            [".",".",".",".","8",".",".","7","9"]
        ]) -> True
    """
    pass

import json
data = json.loads(input())
print(json.dumps(is_valid_sudoku(data["board"])))`,
    solutionCode: `def is_valid_sudoku(board: list) -> bool:
    rows = [set() for _ in range(9)]
    cols = [set() for _ in range(9)]
    boxes = [set() for _ in range(9)]
    for r in range(9):
        for c in range(9):
            val = board[r][c]
            if val == '.': continue
            box_idx = (r // 3) * 3 + c // 3
            if val in rows[r] or val in cols[c] or val in boxes[box_idx]:
                return False
            rows[r].add(val)
            cols[c].add(val)
            boxes[box_idx].add(val)
    return True

import json
data = json.loads(input())
print(json.dumps(is_valid_sudoku(data["board"])))`,
    testCases: JSON.stringify([
      { input: { board: [["5","3",".",".","7",".",".",".","."],["6",".",".","1","9","5",".",".","."],
        [".","9","8",".",".",".",".","6","."],["8",".",".",".","6",".",".",".","3"],
        ["4",".",".","8",".","3",".",".","1"],["7",".",".",".","2",".",".",".","6"],
        [".","6",".",".",".",".","2","8","."],[".",".",".","4","1","9",".",".","5"],
        [".",".",".",".","8",".",".","7","9"]] }, expectedOutput: true },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { board: [["8","3",".",".","7",".",".",".","."],["6",".",".","1","9","5",".",".","."],
        [".","9","8",".",".",".",".","6","."],["8",".",".",".","6",".",".",".","3"],
        ["4",".",".","8",".","3",".",".","1"],["7",".",".",".","2",".",".",".","6"],
        [".","6",".",".",".",".","2","8","."],[".",".",".","4","1","9",".",".","5"],
        [".",".",".",".","8",".",".","7","9"]] }, expectedOutput: false },
    ]),
    hints: JSON.stringify(["Track seen values in each row, column, and 3x3 box.", "Box index = (row//3)*3 + col//3."]),
  },

  // ══════════════════════════════════════════════════════════════
  // BINARY SEARCH (5 more problems)
  // ══════════════════════════════════════════════════════════════
  {
    slug: "search-2d-matrix",
    title: "Search a 2D Matrix",
    description: "Given an `m x n` matrix where each row is sorted and the first integer of each row is greater than the last integer of the previous row, determine if a target value is in the matrix.",
    difficulty: "medium",
    pattern: "binary-search",
    category: "binary-search",
    phase: 2,
    weekNumber: 9,
    timeComplexity: "O(log(m*n))",
    spaceComplexity: "O(1)",
    correctPattern: "Binary Search",
    starterCode: `def search_matrix(matrix: list, target: int) -> bool:
    """
    Example:
        search_matrix([[1,3,5,7],[10,11,16,20],[23,30,34,60]], 3) -> True
    """
    pass

import json
data = json.loads(input())
print(json.dumps(search_matrix(data["matrix"], data["target"])))`,
    solutionCode: `def search_matrix(matrix: list, target: int) -> bool:
    m, n = len(matrix), len(matrix[0])
    lo, hi = 0, m * n - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        val = matrix[mid // n][mid % n]
        if val == target: return True
        elif val < target: lo = mid + 1
        else: hi = mid - 1
    return False

import json
data = json.loads(input())
print(json.dumps(search_matrix(data["matrix"], data["target"])))`,
    testCases: JSON.stringify([
      { input: { matrix: [[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], target: 3 }, expectedOutput: true },
      { input: { matrix: [[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], target: 13 }, expectedOutput: false },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { matrix: [[1]], target: 1 }, expectedOutput: true },
    ]),
    hints: JSON.stringify(["Treat the 2D matrix as a 1D sorted array.", "Map index: row = mid // n, col = mid % n."]),
  },
  {
    slug: "koko-eating-bananas",
    title: "Koko Eating Bananas",
    description: "Koko loves bananas. There are `n` piles. Guards return in `h` hours. Koko eats at speed `k` bananas/hour (one pile per hour max). Find the minimum `k` to finish all bananas in `h` hours.",
    difficulty: "medium",
    pattern: "binary-search",
    category: "binary-search",
    phase: 3,
    weekNumber: 10,
    timeComplexity: "O(n log m)",
    spaceComplexity: "O(1)",
    correctPattern: "Binary Search",
    starterCode: `def min_eating_speed(piles: list, h: int) -> int:
    """
    Example:
        min_eating_speed([3,6,7,11], 8) -> 4
    """
    pass

import json
data = json.loads(input())
print(json.dumps(min_eating_speed(data["piles"], data["h"])))`,
    solutionCode: `def min_eating_speed(piles: list, h: int) -> int:
    import math
    lo, hi = 1, max(piles)
    while lo < hi:
        mid = (lo + hi) // 2
        hours = sum(math.ceil(p / mid) for p in piles)
        if hours <= h:
            hi = mid
        else:
            lo = mid + 1
    return lo

import json
data = json.loads(input())
print(json.dumps(min_eating_speed(data["piles"], data["h"])))`,
    testCases: JSON.stringify([
      { input: { piles: [3, 6, 7, 11], h: 8 }, expectedOutput: 4 },
      { input: { piles: [30, 11, 23, 4, 20], h: 5 }, expectedOutput: 30 },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { piles: [30, 11, 23, 4, 20], h: 6 }, expectedOutput: 23 },
    ]),
    hints: JSON.stringify(["Binary search on the eating speed k.", "For each k, calculate total hours needed."]),
  },
  {
    slug: "find-peak-element",
    title: "Find Peak Element",
    description: "A peak element is strictly greater than its neighbors. Given an array, find any peak element's index. Assume `nums[-1] = nums[n] = -∞`.",
    difficulty: "medium",
    pattern: "binary-search",
    category: "binary-search",
    phase: 2,
    weekNumber: 9,
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
    correctPattern: "Binary Search",
    starterCode: `def find_peak_element(nums: list) -> int:
    """
    Example:
        find_peak_element([1,2,3,1]) -> 2
    """
    pass

import json
data = json.loads(input())
print(json.dumps(find_peak_element(data["nums"])))`,
    solutionCode: `def find_peak_element(nums: list) -> int:
    lo, hi = 0, len(nums) - 1
    while lo < hi:
        mid = (lo + hi) // 2
        if nums[mid] > nums[mid + 1]:
            hi = mid
        else:
            lo = mid + 1
    return lo

import json
data = json.loads(input())
print(json.dumps(find_peak_element(data["nums"])))`,
    testCases: JSON.stringify([
      { input: { nums: [1, 2, 3, 1] }, expectedOutput: 2 },
      { input: { nums: [1, 2, 1, 3, 5, 6, 4] }, expectedOutput: 5 },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { nums: [1] }, expectedOutput: 0 },
      { input: { nums: [2, 1] }, expectedOutput: 0 },
    ]),
    hints: JSON.stringify(["If mid > mid+1, a peak exists on the left half.", "If mid < mid+1, a peak exists on the right half."]),
  },
  {
    slug: "time-based-key-value-store",
    title: "Time Based Key-Value Store",
    description: "Implement a time-based key-value store. `set(key, value, timestamp)` stores the key-value at the given timestamp. `get(key, timestamp)` returns the value with the largest timestamp <= given timestamp.",
    difficulty: "medium",
    pattern: "binary-search",
    category: "binary-search",
    phase: 3,
    weekNumber: 11,
    timeComplexity: "O(log n)",
    spaceComplexity: "O(n)",
    correctPattern: "Binary Search",
    starterCode: `def run_time_map(operations: list, args: list) -> list:
    """
    Example:
        run_time_map(["set","get","get","set","get","get"],
                     [["foo","bar",1],["foo",1],["foo",3],["foo","bar2",4],["foo",4],["foo",5]])
        -> [null, "bar", "bar", null, "bar2", "bar2"]
    """
    pass

import json
data = json.loads(input())
print(json.dumps(run_time_map(data["operations"], data["args"])))`,
    solutionCode: `def run_time_map(operations, args):
    from collections import defaultdict
    import bisect
    store = defaultdict(list)
    results = []
    for op, arg in zip(operations, args):
        if op == "set":
            key, value, ts = arg
            store[key].append((ts, value))
            results.append(None)
        elif op == "get":
            key, ts = arg
            entries = store[key]
            idx = bisect.bisect_right(entries, (ts, chr(127))) - 1
            results.append(entries[idx][1] if idx >= 0 else "")
    return results

import json
data = json.loads(input())
print(json.dumps(run_time_map(data["operations"], data["args"])))`,
    testCases: JSON.stringify([
      { input: { operations: ["set", "get", "get", "set", "get", "get"], args: [["foo", "bar", 1], ["foo", 1], ["foo", 3], ["foo", "bar2", 4], ["foo", 4], ["foo", 5]] }, expectedOutput: [null, "bar", "bar", null, "bar2", "bar2"] },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { operations: ["set", "get"], args: [["a", "b", 1], ["a", 0]] }, expectedOutput: [null, ""] },
    ]),
    hints: JSON.stringify(["Store (timestamp, value) pairs sorted by timestamp.", "Use binary search to find the largest timestamp <= query."]),
  },
  {
    slug: "first-bad-version",
    title: "First Bad Version",
    description: "You have `n` versions `[1, 2, ..., n]`. Given a sorted array of booleans `versions` where `versions[i]` is True if version `i+1` is bad, find the first bad version.",
    difficulty: "easy",
    pattern: "binary-search",
    category: "binary-search",
    phase: 2,
    weekNumber: 9,
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
    correctPattern: "Binary Search",
    starterCode: `def first_bad_version(versions: list) -> int:
    """
    versions[i] is True if version (i+1) is bad.
    Return the first bad version number (1-indexed).

    Example:
        first_bad_version([false,false,false,true,true]) -> 4
    """
    pass

import json
data = json.loads(input())
print(json.dumps(first_bad_version(data["versions"])))`,
    solutionCode: `def first_bad_version(versions: list) -> int:
    lo, hi = 0, len(versions) - 1
    while lo < hi:
        mid = (lo + hi) // 2
        if versions[mid]:
            hi = mid
        else:
            lo = mid + 1
    return lo + 1

import json
data = json.loads(input())
print(json.dumps(first_bad_version(data["versions"])))`,
    testCases: JSON.stringify([
      { input: { versions: [false, false, false, true, true] }, expectedOutput: 4 },
      { input: { versions: [true] }, expectedOutput: 1 },
    ]),
    hiddenTestCases: JSON.stringify([
      { input: { versions: [false, true] }, expectedOutput: 2 },
    ]),
    hints: JSON.stringify(["Classic binary search for the leftmost True.", "If mid is bad, search left half. Otherwise, search right."]),
  },
];

// ── Seeder function ─────────────────────────────────────────────
export async function seedExpansionProblems() {
  console.log(`\n🧩 Seeding ${problems.length} expansion problems...\n`);
  let createdCount = 0;

  for (const p of problems) {
    try {
      await prisma.problem.upsert({
        where: { slug: p.slug },
        update: {
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
          starterCode: p.starterCode,
          solutionCode: p.solutionCode,
          testCases: p.testCases,
          hiddenTestCases: p.hiddenTestCases,
          hints: p.hints,
        },
        create: {
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
          starterCode: p.starterCode,
          solutionCode: p.solutionCode,
          testCases: p.testCases,
          hiddenTestCases: p.hiddenTestCases,
          hints: p.hints,
        },
      });
      createdCount++;
      console.log(`  ✅ ${p.slug}`);
    } catch (e) {
      console.warn(`  ⚠ Skipped ${p.slug}:`);
      console.error(e);
    }
  }

  const totalProblems = await prisma.problem.count();
  console.log(`\n  ✅ Seeded ${createdCount}/${problems.length} expansion problems`);
  console.log(`     Total problems in DB: ${totalProblems}`);
}

if (require.main === module || process.argv[1]?.includes("seed-problems-expansion")) {
  seedExpansionProblems()
    .catch((e) => { console.error("❌ Seed failed:", e); process.exit(1); })
    .finally(() => prisma.$disconnect());
}

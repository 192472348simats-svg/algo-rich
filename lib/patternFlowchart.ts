export interface FlowNode {
  id: string
  question: string
  yes: string       // id of next node or pattern name (prefixed with 'pattern:')
  no: string        // id of next node or pattern name (prefixed with 'pattern:')
}

export const PATTERN_FLOWCHART: FlowNode[] = [
  { id: 'start',       question: 'Is the input a sorted array or can you sort it?',              yes: 'sorted',     no: 'unsorted' },
  { id: 'sorted',      question: 'Are you looking for a pair or triplet that meets a condition?', yes: 'pattern:Two Pointers', no: 'bsearch' },
  { id: 'bsearch',     question: 'Are you searching for a specific value or boundary?',           yes: 'pattern:Binary Search', no: 'pattern:Sliding Window' },
  { id: 'unsorted',    question: 'Does the problem involve a contiguous subarray or substring?',  yes: 'subarray', no: 'graph' },
  { id: 'subarray',    question: 'Do you need to track a window of variable size?',               yes: 'pattern:Sliding Window', no: 'pattern:Prefix Sum' },
  { id: 'graph',       question: 'Is the input a tree or graph?',                                yes: 'treegraph', no: 'linear' },
  { id: 'treegraph',   question: 'Do you need to explore ALL paths or find shortest path?',       yes: 'pattern:DFS', no: 'pattern:BFS' },
  { id: 'linear',      question: 'Do you need to track elements seen before (duplicates/pairs)?', yes: 'pattern:HashMap / HashSet', no: 'ordering' },
  { id: 'ordering',    question: 'Do you need elements in order (min/max repeatedly)?',          yes: 'pattern:Heap / Priority Queue', no: 'pattern:Stack' },
]

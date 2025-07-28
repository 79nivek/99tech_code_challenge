# Sum to N Functions - Performance Analysis

## Overview
This document analyzes three different approaches to calculate the sum of numbers from 1 to n, comparing their performance, complexity, and use cases.

## Function Implementations

### 1. sum_to_n_a - Array + Reduce Approach
```typescript
export function sum_to_n_a(n: number): number {
  return Array.from({ length: n }, (_, i) => i + 1).reduce(
    (acc, curr) => acc + curr,
    0
  );
}
```

#### Execution Flow (n = 5):
```
Step 1: Array.from({ length: 5 }, (_, i) => i + 1)
        Creates: [1, 2, 3, 4, 5]

Step 2: .reduce((acc, curr) => acc + curr, 0)
        Initial: acc = 0
        Iteration 1: acc = 0 + 1 = 1
        Iteration 2: acc = 1 + 2 = 3
        Iteration 3: acc = 3 + 3 = 6
        Iteration 4: acc = 6 + 4 = 10
        Iteration 5: acc = 10 + 5 = 15

Result: 15
```

### 2. sum_to_n_b - Recursive Approach
```typescript
export function sum_to_n_b(n: number): number {
  if (n === 0) return 0;
  return n + sum_to_n_b(n - 1);
}
```

#### Execution Flow (n = 5):
```
Call Stack Visualization:

sum_to_n_b(5)
├── 5 + sum_to_n_b(4)
│   ├── 4 + sum_to_n_b(3)
│   │   ├── 3 + sum_to_n_b(2)
│   │   │   ├── 2 + sum_to_n_b(1)
│   │   │   │   ├── 1 + sum_to_n_b(0)
│   │   │   │   │   └── return 0
│   │   │   │   └── return 1 + 0 = 1
│   │   │   └── return 2 + 1 = 3
│   │   └── return 3 + 3 = 6
│   └── return 4 + 6 = 10
└── return 5 + 10 = 15

Step-by-step:
1. sum_to_n_b(5) → 5 + sum_to_n_b(4)
2. sum_to_n_b(4) → 4 + sum_to_n_b(3)
3. sum_to_n_b(3) → 3 + sum_to_n_b(2)
4. sum_to_n_b(2) → 2 + sum_to_n_b(1)
5. sum_to_n_b(1) → 1 + sum_to_n_b(0)
6. sum_to_n_b(0) → return 0
7. Backtrack: 1 + 0 = 1
8. Backtrack: 2 + 1 = 3
9. Backtrack: 3 + 3 = 6
10. Backtrack: 4 + 6 = 10
11. Backtrack: 5 + 10 = 15

Result: 15
```

### 3. sum_to_n_c - Gauss Formula Approach
```typescript
export function sum_to_n_c(n: number): number {
  return (n * (n + 1)) / 2;
}
```

#### Execution Flow (n = 5):
```
Mathematical Formula: sum(1 to n) = n × (n + 1) ÷ 2

Step 1: n = 5
Step 2: n + 1 = 5 + 1 = 6
Step 3: n × (n + 1) = 5 × 6 = 30
Step 4: ÷ 2 = 30 ÷ 2 = 15

Visual Representation:
    1 + 2 + 3 + 4 + 5 = 15
    │   │   │   │   │
    │   │   │   │   └── 1
    │   │   │   └────── 2
    │   │   └────────── 3
    │   └────────────── 4
    └────────────────── 5

Gauss's Insight:
    Forward:  1 + 2 + 3 + 4 + 5 = 15
    Backward: 5 + 4 + 3 + 2 + 1 = 15
    Add:      (1+5) + (2+4) + 3 = 6 + 6 + 3 = 15
    Pattern:  n pairs of (n+1) + middle term
    Formula:  n × (n+1) ÷ 2

Result: 15
```

## Execution Pattern Comparison

### Memory Usage Visualization (n = 5):

```
sum_to_n_a (Array + Reduce):
Memory: [1, 2, 3, 4, 5] ← Creates full array in memory
Steps:  5 iterations through array
Space:  O(n) - grows with input size

sum_to_n_b (Recursive):
Memory: Call Stack Depth = 5
        [sum_to_n_b(5)] ← Top of stack
        [sum_to_n_b(4)]
        [sum_to_n_b(3)]
        [sum_to_n_b(2)]
        [sum_to_n_b(1)]
        [sum_to_n_b(0)] ← Base case
Steps:  11 total operations (6 calls + 5 returns)
Space:  O(n) - call stack depth grows with input

sum_to_n_c (Gauss Formula):
Memory: Only 3 variables: n, n+1, result
        No arrays, no call stack
Steps:  3 arithmetic operations
Space:  O(1) - constant regardless of input
```

### Time Complexity Visualization:

```
sum_to_n_a: O(n) - Linear Growth
n=1:    █ (1 operation)
n=2:    ██ (2 operations)
n=3:    ███ (3 operations)
n=4:    ████ (4 operations)
n=5:    █████ (5 operations)

sum_to_n_b: O(n) - Linear Growth (with overhead)
n=1:    █ (2 operations: call + return)
n=2:    ██ (4 operations: 2 calls + 2 returns)
n=3:    ███ (6 operations: 3 calls + 3 returns)
n=4:    ████ (8 operations: 4 calls + 4 returns)
n=5:    █████ (10 operations: 5 calls + 5 returns)

sum_to_n_c: O(1) - Constant Time
n=1:    █ (3 operations)
n=2:    █ (3 operations)
n=3:    █ (3 operations)
n=4:    █ (3 operations)
n=5:    █ (3 operations)
n=1000: █ (3 operations)
```

## Performance Comparison

### Complexity Analysis
| Function | Time Complexity | Space Complexity | Approach |
|----------|----------------|------------------|----------|
| `sum_to_n_a` | O(n) | O(n) | Array + Reduce |
| `sum_to_n_b` | O(n) | O(n) | Recursive |
| `sum_to_n_c` | O(1) | O(1) | Gauss Formula |

### Actual Benchmark Results
| Input Size (n) | sum_to_n_a | sum_to_n_b | sum_to_n_c |
|----------------|------------|------------|------------|
| 10             | 0.0020ms   | 0.0007ms   | 0.0002ms   |
| 100            | 0.0044ms   | 0.0013ms   | 0.0000ms   |
| 1,000          | 0.0382ms   | 0.0091ms   | 0.0000ms   |
| 10,000         | 0.3699ms   | 0.0902ms   | 0.0000ms   |
| 100,000        | 4.0485ms   | ❌ Stack Overflow | 0.0003ms |
| 1,000,000      | ❌ Memory Limit | ❌ Stack Overflow | 0.000085ms |

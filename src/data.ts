export interface Problem {
  name: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

export interface DayPlan {
  day: string;
  topic: string;
  problems: Problem[];
}

export interface WeekPlan {
  week: string;
  title: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  probsCount: number;
  days: DayPlan[];
}

export const LEETCODE_PLAN: WeekPlan[] = [
  {
    week: "Week 1",
    title: "Arrays & Strings — Basics",
    level: "Beginner",
    probsCount: 21,
    days: [
      {
        day: "Day 1",
        topic: "Arrays Intro",
        problems: [
          { name: "Two Sum", difficulty: "Easy" },
          { name: "Best Time to Buy & Sell Stock", difficulty: "Easy" },
          { name: "Contains Duplicate", difficulty: "Easy" }
        ]
      },
      {
        day: "Day 2",
        topic: "Array Traversal",
        problems: [
          { name: "Maximum Subarray (Kadane's Algorithm)", difficulty: "Medium" },
          { name: "Product of Array Except Self", difficulty: "Medium" },
          { name: "Single Number", difficulty: "Easy" }
        ]
      },
      {
        day: "Day 3",
        topic: "Strings Intro",
        problems: [
          { name: "Valid Anagram", difficulty: "Easy" },
          { name: "Valid Palindrome", difficulty: "Easy" },
          { name: "Reverse String", difficulty: "Easy" },
          { name: "Longest Common Prefix", difficulty: "Easy" }
        ]
      },
      {
        day: "Day 4",
        topic: "Strings + Hashing",
        problems: [
          { name: "Group Anagrams", difficulty: "Medium" },
          { name: "First Unique Character in String", difficulty: "Easy" },
          { name: "Is Subsequence", difficulty: "Easy" }
        ]
      },
      {
        day: "Day 5",
        topic: "Two Pointers",
        problems: [
          { name: "Valid Palindrome II", difficulty: "Easy" },
          { name: "Move Zeroes", difficulty: "Easy" },
          { name: "Remove Duplicates from Sorted Array", difficulty: "Easy" },
          { name: "Squares of a Sorted Array", difficulty: "Easy" }
        ]
      },
      {
        day: "Day 6-7",
        topic: "Revision + Practice",
        problems: [
          { name: "Merge Sorted Array", difficulty: "Easy" },
          { name: "Rotate Array", difficulty: "Medium" },
          { name: "Find Pivot Index", difficulty: "Easy" },
          { name: "Running Sum of 1d Array", difficulty: "Easy" }
        ]
      }
    ]
  },
  {
    week: "Week 2",
    title: "Sliding Window + HashMaps",
    level: "Beginner",
    probsCount: 18,
    days: [
      {
        day: "Day 8",
        topic: "Sliding Window Basics",
        problems: [
          { name: "Maximum Average Subarray I", difficulty: "Easy" },
          { name: "Minimum Size Subarray Sum", difficulty: "Medium" },
          { name: "Longest Subarray of 1s After Deleting One Element", difficulty: "Medium" }
        ]
      },
      {
        day: "Day 9",
        topic: "Variable Window",
        problems: [
          { name: "Longest Substring Without Repeating Characters", difficulty: "Medium" },
          { name: "Max Consecutive Ones III", difficulty: "Medium" },
          { name: "Permutation in String", difficulty: "Medium" }
        ]
      },
      {
        day: "Day 10",
        topic: "HashMap Patterns",
        problems: [
          { name: "Two Sum (HashMap approach)", difficulty: "Easy" },
          { name: "Subarray Sum Equals K", difficulty: "Medium" },
          { name: "Ransom Note", difficulty: "Easy" }
        ]
      },
      {
        day: "Day 11",
        topic: "Prefix Sum",
        problems: [
          { name: "Range Sum Query - Immutable", difficulty: "Easy" },
          { name: "Contiguous Array", difficulty: "Medium" },
          { name: "Number of Subarrays with Sum = Goal", difficulty: "Medium" }
        ]
      },
      {
        day: "Day 12",
        topic: "Mixed Practice",
        problems: [
          { name: "Find All Anagrams in String", difficulty: "Medium" },
          { name: "Minimum Window Substring", difficulty: "Hard" },
          { name: "Fruit Into Baskets", difficulty: "Medium" }
        ]
      },
      {
        day: "Day 13-14",
        topic: "Revision Week",
        problems: [
          { name: "Longest Repeating Character Replacement", difficulty: "Medium" },
          { name: "Count Number of Nice Subarrays", difficulty: "Medium" },
          { name: "Kth Largest Element in Array", difficulty: "Medium" }
        ]
      }
    ]
  },
  {
    week: "Week 3",
    title: "Linked List + Stack & Queue",
    level: "Intermediate",
    probsCount: 19,
    days: [
      {
        day: "Day 15",
        topic: "Linked List Basics",
        problems: [
          { name: "Reverse Linked List", difficulty: "Easy" },
          { name: "Merge Two Sorted Lists", difficulty: "Easy" },
          { name: "Linked List Cycle", difficulty: "Easy" }
        ]
      },
      {
        day: "Day 16",
        topic: "Fast & Slow Pointers",
        problems: [
          { name: "Middle of the Linked List", difficulty: "Easy" },
          { name: "Remove Nth Node From End of List", difficulty: "Medium" },
          { name: "Palindrome Linked List", difficulty: "Easy" }
        ]
      },
      {
        day: "Day 17",
        topic: "Advanced Linked List",
        problems: [
          { name: "Add Two Numbers", difficulty: "Medium" },
          { name: "Reorder List", difficulty: "Medium" },
          { name: "Intersection of Two Linked Lists", difficulty: "Easy" }
        ]
      },
      {
        day: "Day 18",
        topic: "Stack Basics",
        problems: [
          { name: "Valid Parentheses", difficulty: "Easy" },
          { name: "Min Stack", difficulty: "Medium" },
          { name: "Implement Queue using Stacks", difficulty: "Easy" }
        ]
      },
      {
        day: "Day 19",
        topic: "Monotonic Stack",
        problems: [
          { name: "Daily Temperatures", difficulty: "Medium" },
          { name: "Next Greater Element I", difficulty: "Easy" },
          { name: "Car Fleet", difficulty: "Medium" }
        ]
      },
      {
        day: "Day 20-21",
        topic: "Queue + Deque",
        problems: [
          { name: "Sliding Window Maximum", difficulty: "Hard" },
          { name: "Number of Recent Calls", difficulty: "Easy" },
          { name: "Design Circular Queue", difficulty: "Medium" },
          { name: "Time Needed to Buy Tickets", difficulty: "Easy" }
        ]
      }
    ]
  },
  {
    week: "Week 4",
    title: "Binary Search + Sorting",
    level: "Intermediate",
    probsCount: 18,
    days: [
      {
        day: "Day 22",
        topic: "Binary Search Basics",
        problems: [
          { name: "Binary Search", difficulty: "Easy" },
          { name: "Search Insert Position", difficulty: "Easy" },
          { name: "First Bad Version", difficulty: "Easy" }
        ]
      },
      {
        day: "Day 23",
        topic: "Binary Search on Arrays",
        problems: [
          { name: "Find Minimum in Rotated Sorted Array", difficulty: "Medium" },
          { name: "Search in Rotated Sorted Array", difficulty: "Medium" },
          { name: "Peak Index in a Mountain Array", difficulty: "Medium" }
        ]
      },
      {
        day: "Day 24",
        topic: "Advanced Binary Search",
        problems: [
          { name: "Koko Eating Bananas", difficulty: "Medium" },
          { name: "Capacity To Ship Packages Within D Days", difficulty: "Medium" },
          { name: "Find Peak Element", difficulty: "Medium" }
        ]
      },
      {
        day: "Day 25",
        topic: "Sorting Algorithms",
        problems: [
          { name: "Sort Colors (Dutch National Flag)", difficulty: "Medium" },
          { name: "Merge Intervals", difficulty: "Medium" },
          { name: "Insert Interval", difficulty: "Medium" }
        ]
      },
      {
        day: "Day 26",
        topic: "Custom Sort",
        problems: [
          { name: "Largest Number", difficulty: "Medium" },
          { name: "Relative Sort Array", difficulty: "Easy" },
          { name: "Top K Frequent Elements", difficulty: "Medium" }
        ]
      },
      {
        day: "Day 27-28",
        topic: "Revision + Mixed",
        problems: [
          { name: "Median of Two Sorted Arrays", difficulty: "Hard" },
          { name: "Find K Closest Elements", difficulty: "Medium" },
          { name: "Count Smaller Numbers After Self", difficulty: "Hard" }
        ]
      }
    ]
  },
  {
    week: "Week 5",
    title: "Recursion + Trees",
    level: "Intermediate",
    probsCount: 20,
    days: [
      {
        day: "Day 29",
        topic: "Recursion Basics",
        problems: [
          { name: "Fibonacci Number", difficulty: "Easy" },
          { name: "Power of Two", difficulty: "Easy" },
          { name: "Reverse String (Recursion)", difficulty: "Easy" },
          { name: "Climbing Stairs", difficulty: "Easy" }
        ]
      },
      {
        day: "Day 30",
        topic: "Tree Traversals",
        problems: [
          { name: "Inorder / Preorder / Postorder Traversal", difficulty: "Easy" },
          { name: "Binary Tree Level Order Traversal", difficulty: "Medium" },
          { name: "Maximum Depth of Binary Tree", difficulty: "Easy" }
        ]
      },
      {
        day: "Day 31",
        topic: "Tree Properties",
        problems: [
          { name: "Invert Binary Tree", difficulty: "Easy" },
          { name: "Symmetric Tree", difficulty: "Easy" },
          { name: "Path Sum", difficulty: "Easy" },
          { name: "Diameter of Binary Tree", difficulty: "Easy" }
        ]
      },
      {
        day: "Day 32",
        topic: "BST (Binary Search Tree)",
        problems: [
          { name: "Search in a Binary Search Tree", difficulty: "Easy" },
          { name: "Validate Binary Search Tree", difficulty: "Medium" },
          { name: "Lowest Common Ancestor of BST", difficulty: "Medium" }
        ]
      },
      {
        day: "Day 33",
        topic: "Advanced Tree",
        problems: [
          { name: "Binary Tree Right Side View", difficulty: "Medium" },
          { name: "Count Good Nodes in Binary Tree", difficulty: "Medium" },
          { name: "Construct Tree from Preorder + Inorder", difficulty: "Medium" }
        ]
      },
      {
        day: "Day 34-35",
        topic: "Tree Mixed Practice",
        problems: [
          { name: "Serialize and Deserialize Binary Tree", difficulty: "Hard" },
          { name: "Binary Tree Maximum Path Sum", difficulty: "Hard" },
          { name: "Kth Smallest Element in a BST", difficulty: "Medium" }
        ]
      }
    ]
  },
  {
    week: "Week 6",
    title: "Graphs + BFS/DFS",
    level: "Advanced",
    probsCount: 18,
    days: [
      {
        day: "Day 36",
        topic: "Graph Basics + DFS",
        problems: [
          { name: "Number of Islands", difficulty: "Medium" },
          { name: "Flood Fill", difficulty: "Easy" },
          { name: "Max Area of Island", difficulty: "Medium" }
        ]
      },
      {
        day: "Day 37",
        topic: "BFS",
        problems: [
          { name: "Rotting Oranges", difficulty: "Medium" },
          { name: "01 Matrix", difficulty: "Medium" },
          { name: "Nearest Exit from Entrance in Maze", difficulty: "Medium" }
        ]
      },
      {
        day: "Day 38",
        topic: "Graph Connectivity",
        problems: [
          { name: "Number of Connected Components in Undirected Graph", difficulty: "Medium" },
          { name: "Clone Graph", difficulty: "Medium" },
          { name: "Pacific Atlantic Water Flow", difficulty: "Medium" }
        ]
      },
      {
        day: "Day 39",
        topic: "Cycle Detection + Topological Sort",
        problems: [
          { name: "Course Schedule", difficulty: "Medium" },
          { name: "Course Schedule II", difficulty: "Medium" },
          { name: "Find Eventual Safe States", difficulty: "Medium" }
        ]
      },
      {
        day: "Day 40",
        topic: "Union Find (DSU)",
        problems: [
          { name: "Number of Provinces", difficulty: "Medium" },
          { name: "Redundant Connection", difficulty: "Medium" },
          { name: "Accounts Merge", difficulty: "Medium" }
        ]
      },
      {
        day: "Day 41-42",
        topic: "Shortest Path",
        problems: [
          { name: "Network Delay Time (Dijkstra's Algorithm)", difficulty: "Medium" },
          { name: "Cheapest Flights Within K Stops", difficulty: "Medium" },
          { name: "Word Ladder", difficulty: "Hard" }
        ]
      }
    ]
  },
  {
    week: "Week 7",
    title: "Heap + Greedy",
    level: "Advanced",
    probsCount: 16,
    days: [
      {
        day: "Day 43",
        topic: "Heap Basics",
        problems: [
          { name: "Kth Largest Element in a Stream", difficulty: "Easy" },
          { name: "Last Stone Weight", difficulty: "Easy" },
          { name: "K Closest Points to Origin", difficulty: "Medium" }
        ]
      },
      {
        day: "Day 44",
        topic: "Advanced Heap",
        problems: [
          { name: "Task Scheduler", difficulty: "Medium" },
          { name: "Design Twitter", difficulty: "Medium" },
          { name: "Find Median from Data Stream", difficulty: "Hard" }
        ]
      },
      {
        day: "Day 45",
        topic: "Greedy Basics",
        problems: [
          { name: "Jump Game", difficulty: "Medium" },
          { name: "Jump Game II", difficulty: "Medium" },
          { name: "Gas Station", difficulty: "Medium" }
        ]
      },
      {
        day: "Day 46",
        topic: "Intervals + Greedy",
        problems: [
          { name: "Non-overlapping Intervals", difficulty: "Medium" },
          { name: "Meeting Rooms II", difficulty: "Medium" },
          { name: "Minimum Number of Arrows to Burst Balloons", difficulty: "Medium" }
        ]
      },
      {
        day: "Day 47-48",
        topic: "Mixed Practice",
        problems: [
          { name: "Hand of Straights", difficulty: "Medium" },
          { name: "Partition Labels", difficulty: "Medium" },
          { name: "Reorganize String", difficulty: "Medium" },
          { name: "IPO", difficulty: "Hard" }
        ]
      }
    ]
  },
  {
    week: "Week 8",
    title: "Dynamic Programming",
    level: "Advanced",
    probsCount: 20,
    days: [
      {
        day: "Day 49",
        topic: "1D Dynamic Programming",
        problems: [
          { name: "Climbing Stairs", difficulty: "Easy" },
          { name: "House Robber", difficulty: "Medium" },
          { name: "House Robber II", difficulty: "Medium" },
          { name: "Coin Change", difficulty: "Medium" }
        ]
      },
      {
        day: "Day 50",
        topic: "String DP",
        problems: [
          { name: "Longest Palindromic Substring", difficulty: "Medium" },
          { name: "Palindromic Substrings", difficulty: "Medium" },
          { name: "Longest Common Subsequence", difficulty: "Medium" }
        ]
      },
      {
        day: "Day 51",
        topic: "Knapsack Pattern",
        problems: [
          { name: "Partition Equal Subset Sum", difficulty: "Medium" },
          { name: "Target Sum", difficulty: "Medium" },
          { name: "Last Stone Weight II", difficulty: "Medium" }
        ]
      },
      {
        day: "Day 52",
        topic: "2D Dynamic Programming",
        problems: [
          { name: "Unique Paths", difficulty: "Medium" },
          { name: "Minimum Path Sum", difficulty: "Medium" },
          { name: "Edit Distance", difficulty: "Medium" }
        ]
      },
      {
        day: "Day 53",
        topic: "Advanced DP",
        problems: [
          { name: "Longest Increasing Subsequence", difficulty: "Medium" },
          { name: "Burst Balloons", difficulty: "Hard" },
          { name: "Regular Expression Matching", difficulty: "Hard" }
        ]
      },
      {
        day: "Day 54-56",
        topic: "Final Revision + Mock Interview",
        problems: [
          { name: "Word Break", difficulty: "Medium" },
          { name: "Decode Ways", difficulty: "Medium" },
          { name: "Distinct Subsequences", difficulty: "Hard" },
          { name: "Maximum Product Subarray", difficulty: "Medium" }
        ]
      }
    ]
  }
];

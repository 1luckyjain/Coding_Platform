import React, { useState, useEffect } from "react";
import Header from "./Header";
import Editor from "@monaco-editor/react";

const Problems = () => {
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [testInput, setTestInput] = useState("");
  const [testOutput, setTestOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Sample 40 LeetCode-style problems
  const sampleProblems = [
    {
      id: 1,
      title: "Two Sum",
      difficulty: "Easy",
      acceptance: "45.8%",
      description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
      constraints: `2 <= nums.length <= 10^4
-10^9 <= nums[i] <= 10^9
-10^9 <= target <= 10^9
Only one valid answer exists.`,
      examples: [
        {
          input: "nums = [2,7,11,15], target = 9",
          output: "[0,1]",
          explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
        },
        {
          input: "nums = [3,2,4], target = 6",
          output: "[1,2]"
        }
      ],
      tags: ["Array", "Hash Table"],
      timeLimit: "1s",
      memoryLimit: "256MB"
    },
    {
      id: 2,
      title: "Add Two Numbers",
      difficulty: "Medium",
      acceptance: "36.5%",
      description: `You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.

You may assume the two numbers do not contain any leading zero, except the number 0 itself.`,
      constraints: `The number of nodes in each linked list is in the range [1, 100].
0 <= Node.val <= 9
It is guaranteed that the list represents a number that does not have leading zeros.`,
      examples: [
        {
          input: "l1 = [2,4,3], l2 = [5,6,4]",
          output: "[7,0,8]",
          explanation: "342 + 465 = 807."
        }
      ],
      tags: ["Linked List", "Math", "Recursion"],
      timeLimit: "1s",
      memoryLimit: "256MB"
    },
    {
      id: 3,
      title: "Longest Substring Without Repeating Characters",
      difficulty: "Medium",
      acceptance: "33.2%",
      description: `Given a string s, find the length of the longest substring without repeating characters.`,
      constraints: `0 <= s.length <= 5 * 10^4
s consists of letters, digits, symbols and spaces.`,
      examples: [
        {
          input: "s = \"abcabcbb\"",
          output: "3",
          explanation: "The answer is \"abc\", with the length of 3."
        },
        {
          input: "s = \"bbbbb\"",
          output: "1",
          explanation: "The answer is \"b\", with the length of 1."
        }
      ],
      tags: ["Hash Table", "String", "Sliding Window"],
      timeLimit: "1s",
      memoryLimit: "256MB"
    },
    {
      id: 4,
      title: "Median of Two Sorted Arrays",
      difficulty: "Hard",
      acceptance: "29.8%",
      description: `Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.

The overall run time complexity should be O(log (m+n)).`,
      constraints: `nums1.length == m
nums2.length == n
0 <= m <= 1000
0 <= n <= 1000
1 <= m + n <= 2000
-10^6 <= nums1[i], nums2[i] <= 10^6`,
      examples: [
        {
          input: "nums1 = [1,3], nums2 = [2]",
          output: "2.00000",
          explanation: "merged array = [1,2,3] and median is 2."
        }
      ],
      tags: ["Array", "Binary Search", "Divide and Conquer"],
      timeLimit: "1s",
      memoryLimit: "256MB"
    },
    {
      id: 5,
      title: "Longest Palindromic Substring",
      difficulty: "Medium",
      acceptance: "31.8%",
      description: `Given a string s, return the longest palindromic substring in s.`,
      constraints: `1 <= s.length <= 1000
s consist of only digits and English letters.`,
      examples: [
        {
          input: "s = \"babad\"",
          output: "\"bab\"",
          explanation: "\"aba\" is also a valid answer."
        }
      ],
      tags: ["String", "Dynamic Programming"],
      timeLimit: "1s",
      memoryLimit: "256MB"
    },
    {
      id: 6,
      title: "Zigzag Conversion",
      difficulty: "Medium",
      acceptance: "39.4%",
      description: `The string "PAYPALISHIRING" is written in a zigzag pattern on a given number of rows like this: (you may want to display this pattern in a fixed font for better legibility)`,
      constraints: `1 <= s.length <= 1000
s consists of English letters (lower-case and upper-case), ',' and '.'.
1 <= numRows <= 1000`,
      examples: [
        {
          input: "s = \"PAYPALISHIRING\", numRows = 3",
          output: "\"PAHNAPLSIIGYIR\""
        }
      ],
      tags: ["String"],
      timeLimit: "1s",
      memoryLimit: "256MB"
    },
    {
      id: 7,
      title: "Reverse Integer",
      difficulty: "Medium",
      acceptance: "27.6%",
      description: `Given a signed 32-bit integer x, return x with its digits reversed. If reversing x causes the value to go outside the signed 32-bit integer range [-2^31, 2^31 - 1], then return 0.`,
      constraints: `-2^31 <= x <= 2^31 - 1`,
      examples: [
        {
          input: "x = 123",
          output: "321"
        },
        {
          input: "x = -123",
          output: "-321"
        }
      ],
      tags: ["Math"],
      timeLimit: "1s",
      memoryLimit: "256MB"
    },
    {
      id: 8,
      title: "String to Integer (atoi)",
      difficulty: "Medium",
      acceptance: "16.8%",
      description: `Implement the myAtoi(string s) function, which converts a string to a 32-bit signed integer (similar to C/C++'s atoi).`,
      constraints: `0 <= s.length <= 200
s consists of English letters, digits, ' ', '+', '-', and '.'.`,
      examples: [
        {
          input: "s = \"42\"",
          output: "42"
        },
        {
          input: "s = \"   -42\"",
          output: "-42"
        }
      ],
      tags: ["String", "Math"],
      timeLimit: "1s",
      memoryLimit: "256MB"
    },
    {
      id: 9,
      title: "Palindrome Number",
      difficulty: "Easy",
      acceptance: "48.7%",
      description: `Given an integer x, return true if x is a palindrome, and false otherwise.`,
      constraints: `-2^31 <= x <= 2^31 - 1`,
      examples: [
        {
          input: "x = 121",
          output: "true"
        },
        {
          input: "x = -121",
          output: "false",
          explanation: "From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome."
        }
      ],
      tags: ["Math"],
      timeLimit: "1s",
      memoryLimit: "256MB"
    },
    {
      id: 10,
      title: "Regular Expression Matching",
      difficulty: "Hard",
      acceptance: "27.3%",
      description: `Given an input string s and a pattern p, implement regular expression matching with support for '.' and '*' where:

'.' Matches any single character.
'*' Matches zero or more of the preceding element.
The matching should cover the entire input string (not partial).`,
      constraints: `1 <= s.length <= 20
1 <= p.length <= 30
s contains only lowercase English letters.
p contains only lowercase English letters, '.', and '*'.
It is guaranteed for each appearance of the character '*', there will be a previous valid character to match.`,
      examples: [
        {
          input: "s = \"aa\", p = \"a\"",
          output: "false"
        },
        {
          input: "s = \"aa\", p = \"a*\"",
          output: "true"
        }
      ],
      tags: ["String", "Dynamic Programming", "Recursion"],
      timeLimit: "1s",
      memoryLimit: "256MB"
    },
    {
      id: 11,
      title: "Container With Most Water",
      difficulty: "Medium",
      acceptance: "50.8%",
      description: `You are given an array height where height[i] represents the height of a vertical line drawn at coordinate i. Find two lines that, together with the x-axis, form a container that holds the most water.`,
      constraints: `n == height.length
2 <= n <= 10^5
0 <= height[i] <= 10^4`,
      examples: [
        {
          input: "height = [1,8,6,2,5,4,8,3,7]",
          output: "49",
          explanation: "The above vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, the max area of water the container can contain is 49."
        }
      ],
      tags: ["Array", "Two Pointers", "Greedy"],
      timeLimit: "1s",
      memoryLimit: "256MB"
    },
    {
      id: 12,
      title: "Integer to Roman",
      difficulty: "Medium",
      acceptance: "54.1%",
      description: `Roman numerals are represented by seven different symbols: I, V, X, L, C, D and M.

Given an integer, convert it to a roman numeral.`,
      constraints: `1 <= num <= 3999`,
      examples: [
        {
          input: "num = 3",
          output: "\"III\""
        },
        {
          input: "num = 4",
          output: "\"IV\""
        }
      ],
      tags: ["Hash Table", "Math", "String"],
      timeLimit: "1s",
      memoryLimit: "256MB"
    },
    {
      id: 13,
      title: "Roman to Integer",
      difficulty: "Easy",
      acceptance: "54.3%",
      description: `Roman numerals are represented by seven different symbols: I, V, X, L, C, D and M.

Given a roman numeral, convert it to an integer.`,
      constraints: `1 <= s.length <= 15
s contains only the characters ('I', 'V', 'X', 'L', 'C', 'D', 'M').
It is guaranteed that s is a valid roman numeral in the range [1, 3999].`,
      examples: [
        {
          input: "s = \"III\"",
          output: "3"
        },
        {
          input: "s = \"IV\"",
          output: "4"
        }
      ],
      tags: ["Hash Table", "Math", "String"],
      timeLimit: "1s",
      memoryLimit: "256MB"
    },
    {
      id: 14,
      title: "Longest Common Prefix",
      difficulty: "Easy",
      acceptance: "36.2%",
      description: `Write a function to find the longest common prefix string amongst an array of strings.

If there is no common prefix, return an empty string "".`,
      constraints: `1 <= strs.length <= 200
0 <= strs[i].length <= 200
strs[i] consists of only lower-case English letters.`,
      examples: [
        {
          input: "strs = [\"flower\",\"flow\",\"flight\"]",
          output: "\"fl\""
        },
        {
          input: "strs = [\"dog\",\"racecar\",\"car\"]",
          output: "\"\""
        }
      ],
      tags: ["String"],
      timeLimit: "1s",
      memoryLimit: "256MB"
    },
    {
      id: 15,
      title: "3Sum",
      difficulty: "Medium",
      acceptance: "28.5%",
      description: `Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.

Notice that the solution set must not contain duplicate triplets.`,
      constraints: `0 <= nums.length <= 3000
-10^5 <= nums[i] <= 10^5`,
      examples: [
        {
          input: "nums = [-1,0,1,2,-1,-4]",
          output: "[[-1,-1,2],[-1,0,1]]"
        }
      ],
      tags: ["Array", "Two Pointers", "Sorting"],
      timeLimit: "1s",
      memoryLimit: "256MB"
    },
    {
      id: 16,
      title: "3Sum Closest",
      difficulty: "Medium",
      acceptance: "44.8%",
      description: `Given an integer array nums and a target value target, find three integers in nums such that the sum is closest to target.

Return the sum of the three integers.`,
      constraints: `3 <= nums.length <= 1000
-1000 <= nums[i] <= 1000
-10^4 <= target <= 10^4`,
      examples: [
        {
          input: "nums = [-1,2,1,-4], target = 1",
          output: "2",
          explanation: "The sum that is closest to the target is 2. (-1 + 2 + 1 = 2)."
        }
      ],
      tags: ["Array", "Two Pointers", "Sorting"],
      timeLimit: "1s",
      memoryLimit: "256MB"
    },
    {
      id: 17,
      title: "Letter Combinations of a Phone Number",
      difficulty: "Medium",
      acceptance: "49.4%",
      description: `Given a string containing digits from 2-9 inclusive, return all possible letter combinations that the number could represent.

Return the answer in any order.`,
      constraints: `0 <= digits.length <= 4
digits[i] is a digit in the range ['2', '9'].`,
      examples: [
        {
          input: "digits = \"23\"",
          output: "[\"ad\",\"ae\",\"af\",\"bd\",\"be\",\"bf\",\"cd\",\"ce\",\"cf\"]"
        }
      ],
      tags: ["Hash Table", "String", "Backtracking"],
      timeLimit: "1s",
      memoryLimit: "256MB"
    },
    {
      id: 18,
      title: "4Sum",
      difficulty: "Medium",
      acceptance: "34.1%",
      description: `Given an array nums of n integers, return an array of all the unique quadruplets [nums[a], nums[b], nums[c], nums[d]] such that:

0 <= a, b, c, d < n
a, b, c, and d are distinct.
nums[a] + nums[b] + nums[c] + nums[d] == target`,
      constraints: `1 <= nums.length <= 200
-10^9 <= nums[i] <= 10^9
-10^9 <= target <= 10^9`,
      examples: [
        {
          input: "nums = [1,0,-1,0,-2,2], target = 0",
          output: "[[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]"
        }
      ],
      tags: ["Array", "Two Pointers", "Sorting"],
      timeLimit: "1s",
      memoryLimit: "256MB"
    },
    {
      id: 19,
      title: "Remove Nth Node From End of List",
      difficulty: "Medium",
      acceptance: "40.2%",
      description: `Given the head of a linked list, remove the nth node from the end of the list and return its head.`,
      constraints: `The number of nodes in the list is sz.
1 <= sz <= 30
0 <= Node.val <= 100
1 <= n <= sz`,
      examples: [
        {
          input: "head = [1,2,3,4,5], n = 2",
          output: "[1,2,3,5]"
        }
      ],
      tags: ["Linked List", "Two Pointers"],
      timeLimit: "1s",
      memoryLimit: "256MB"
    },
    {
      id: 20,
      title: "Valid Parentheses",
      difficulty: "Easy",
      acceptance: "41.1%",
      description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
Open brackets must be closed by the same type of brackets.
Open brackets must be closed in the correct order.`,
      constraints: `1 <= s.length <= 10^4
s consists of parentheses only '()[]{}'.`,
      examples: [
        {
          input: "s = \"()\"",
          output: "true"
        },
        {
          input: "s = \"()[]{}\"",
          output: "true"
        },
        {
          input: "s = \"(]\"",
          output: "false"
        }
      ],
      tags: ["String", "Stack"],
      timeLimit: "1s",
      memoryLimit: "256MB"
    },
    {
      id: 21,
      title: "Merge Two Sorted Lists",
      difficulty: "Easy",
      acceptance: "58.1%",
      description: `You are given the heads of two sorted linked lists list1 and list2.

Merge the two lists in a one sorted list. The list should be made by splicing together the nodes of the first two lists.`,
      constraints: `The number of nodes in both lists is in the range [0, 50].
-100 <= Node.val <= 100
Both list1 and list2 are sorted in non-decreasing order.`,
      examples: [
        {
          input: "list1 = [1,2,4], list2 = [1,3,4]",
          output: "[1,1,2,3,4,4]"
        }
      ],
      tags: ["Linked List", "Recursion"],
      timeLimit: "1s",
      memoryLimit: "256MB"
    },
    {
      id: 22,
      title: "Generate Parentheses",
      difficulty: "Medium",
      acceptance: "69.4%",
      description: `Given n pairs of parentheses, write a function to generate all combinations of well-formed parentheses.`,
      constraints: `1 <= n <= 8`,
      examples: [
        {
          input: "n = 3",
          output: "[\"((()))\",\"(()())\",\"(())()\",\"()(())\",\"()()()\"]"
        }
      ],
      tags: ["String", "Backtracking"],
      timeLimit: "1s",
      memoryLimit: "256MB"
    },
    {
      id: 23,
      title: "Merge k Sorted Lists",
      difficulty: "Hard",
      acceptance: "43.6%",
      description: `You are given an array of k linked-lists lists, each linked-list is sorted in ascending order.

Merge all the linked-lists into one sorted linked-list and return it.`,
      constraints: `k == lists.length
0 <= k <= 10^4
0 <= lists[i].length <= 500
-10^4 <= lists[i][j] <= 10^4
lists[i] is sorted in ascending order.
The sum of lists[i].length will not exceed 10^4.`,
      examples: [
        {
          input: "lists = [[1,4,5],[1,3,4],[2,6]]",
          output: "[1,1,2,3,4,4,5,6]"
        }
      ],
      tags: ["Linked List", "Divide and Conquer", "Heap"],
      timeLimit: "1s",
      memoryLimit: "256MB"
    },
    {
      id: 24,
      title: "Swap Nodes in Pairs",
      difficulty: "Medium",
      acceptance: "55.9%",
      description: `Given a linked list, swap every two adjacent nodes and return its head. You must solve the problem without modifying the values in the list's nodes (i.e., only nodes themselves may be changed.)`,
      constraints: `The number of nodes in the list is in the range [1, 100].
0 <= Node.val <= 100`,
      examples: [
        {
          input: "head = [1,2,3,4]",
          output: "[2,1,4,3]"
        }
      ],
      tags: ["Linked List", "Recursion"],
      timeLimit: "1s",
      memoryLimit: "256MB"
    },
    {
      id: 25,
      title: "Reverse Nodes in k-Group",
      difficulty: "Hard",
      acceptance: "46.8%",
      description: `Given a linked list, reverse the nodes of a linked list k at a time and return its modified list.

k is a positive integer and is less than or equal to the length of the linked list. If the number of nodes is not a multiple of k then left-out nodes, in the end, should remain as it is.`,
      constraints: `The number of nodes in the list is n.
1 <= k <= n <= 5000
0 <= Node.val <= 1000`,
      examples: [
        {
          input: "head = [1,2,3,4,5], k = 2",
          output: "[2,1,4,3,5]"
        }
      ],
      tags: ["Linked List", "Recursion"],
      timeLimit: "1s",
      memoryLimit: "256MB"
    },
    {
      id: 26,
      title: "Remove Duplicates from Sorted Array",
      difficulty: "Easy",
      acceptance: "49.2%",
      description: `Given an integer array nums sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once. The relative order of the elements should be kept the same.`,
      constraints: `1 <= nums.length <= 3 * 10^4
-10^4 <= nums[i] <= 10^4
nums is sorted in non-decreasing order.`,
      examples: [
        {
          input: "nums = [1,1,2]",
          output: "2, nums = [1,2,_]"
        }
      ],
      tags: ["Array", "Two Pointers"],
      timeLimit: "1s",
      memoryLimit: "256MB"
    },
    {
      id: 27,
      title: "Remove Element",
      difficulty: "Easy",
      acceptance: "49.5%",
      description: `Given an integer array nums and an integer val, remove all occurrences of val in nums in-place. The order of the elements may be changed. Then return the number of elements in nums which are not equal to val.`,
      constraints: `0 <= nums.length <= 100
0 <= nums[i] <= 50
0 <= val <= 100`,
      examples: [
        {
          input: "nums = [3,2,2,3], val = 3",
          output: "2, nums = [2,2,_,_]"
        }
      ],
      tags: ["Array", "Two Pointers"],
      timeLimit: "1s",
      memoryLimit: "256MB"
    },
    {
      id: 28,
      title: "Find the Index of the First Occurrence in a String",
      difficulty: "Easy",
      acceptance: "35.8%",
      description: `Given two strings needle and haystack, return the index of the first occurrence of needle in haystack, or -1 if needle is not part of haystack.`,
      constraints: `1 <= haystack.length, needle.length <= 10^4
haystack and needle consist of only lowercase English characters.`,
      examples: [
        {
          input: "haystack = \"sadbutsad\", needle = \"sad\"",
          output: "0"
        },
        {
          input: "haystack = \"leetcode\", needle = \"leeto\"",
          output: "-1"
        }
      ],
      tags: ["String", "Two Pointers"],
      timeLimit: "1s",
      memoryLimit: "256MB"
    },
    {
      id: 29,
      title: "Divide Two Integers",
      difficulty: "Medium",
      acceptance: "16.8%",
      description: `Given two integers dividend and divisor, divide two integers without using multiplication, division, and mod operator.

The integer division should truncate toward zero, which means losing its fractional part. For example, 8.345 would be truncated to 8, and -2.7335 would be truncated to -2.`,
      constraints: `-2^31 <= dividend, divisor <= 2^31 - 1
divisor != 0`,
      examples: [
        {
          input: "dividend = 10, divisor = 3",
          output: "3"
        },
        {
          input: "dividend = 7, divisor = -3",
          output: "-2"
        }
      ],
      tags: ["Math", "Binary Search"],
      timeLimit: "1s",
      memoryLimit: "256MB"
    },
    {
      id: 30,
      title: "Substring with Concatenation of All Words",
      difficulty: "Hard",
      acceptance: "31.2%",
      description: `You are given a string s and an array of strings words of the same length. Return all starting indices of substring(s) in s that is a concatenation of each word in words exactly once, without any intervening characters.`,
      constraints: `1 <= s.length <= 10^4
1 <= words.length <= 5000
1 <= words[i].length <= 30
s and words[i] consist of lowercase English letters.`,
      examples: [
        {
          input: "s = \"barfoothefoobarman\", words = [\"foo\",\"bar\"]",
          output: "[0,9]"
        }
      ],
      tags: ["Hash Table", "String", "Sliding Window"],
      timeLimit: "1s",
      memoryLimit: "256MB"
    },
    {
      id: 31,
      title: "Next Permutation",
      difficulty: "Medium",
      acceptance: "34.3%",
      description: `A permutation of an array of integers is an arrangement of its members into a sequence or linear order.

The next permutation of an array of integers is the next lexicographically greater permutation of its integer.`,
      constraints: `1 <= nums.length <= 100
0 <= nums[i] <= 100`,
      examples: [
        {
          input: "nums = [1,2,3]",
          output: "[1,3,2]"
        }
      ],
      tags: ["Array", "Two Pointers"],
      timeLimit: "1s",
      memoryLimit: "256MB"
    },
    {
      id: 32,
      title: "Longest Valid Parentheses",
      difficulty: "Hard",
      acceptance: "29.7%",
      description: `Given a string containing just the characters '(' and ')', return the length of the longest valid (well-formed) parentheses substring.`,
      constraints: `0 <= s.length <= 3 * 10^4
s[i] is '(', or ').`,
      examples: [
        {
          input: "s = \"(()\"",
          output: "2"
        },
        {
          input: "s = \")()())\"",
          output: "4"
        }
      ],
      tags: ["String", "Dynamic Programming", "Stack"],
      timeLimit: "1s",
      memoryLimit: "256MB"
    },
    {
      id: 33,
      title: "Search in Rotated Sorted Array",
      difficulty: "Medium",
      acceptance: "37.4%",
      description: `There is an integer array nums sorted in ascending order (with distinct values).

Prior to being passed to your function, nums is possibly rotated at an unknown pivot index k (1 <= k < nums.length) such that the resulting array is [nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]] (0-indexed).`,
      constraints: `1 <= nums.length <= 5000
-10^4 <= nums[i] <= 10^4
All values of nums are unique.
nums is an ascending array that is possibly rotated.`,
      examples: [
        {
          input: "nums = [4,5,6,7,0,1,2], target = 0",
          output: "4"
        }
      ],
      tags: ["Array", "Binary Search"],
      timeLimit: "1s",
      memoryLimit: "256MB"
    },
    {
      id: 34,
      title: "Find First and Last Position of Element in Sorted Array",
      difficulty: "Medium",
      acceptance: "39.4%",
      description: `Given an array of integers nums sorted in non-decreasing order, find the starting and ending position of a given target value.

If target is not found in the array, return [-1, -1].`,
      constraints: `0 <= nums.length <= 10^5
-10^9 <= nums[i] <= 10^9
nums is a non-decreasing array.
-10^9 <= target <= 10^9`,
      examples: [
        {
          input: "nums = [5,7,7,8,8,10], target = 8",
          output: "[3,4]"
        }
      ],
      tags: ["Array", "Binary Search"],
      timeLimit: "1s",
      memoryLimit: "256MB"
    },
    {
      id: 35,
      title: "Search Insert Position",
      difficulty: "Easy",
      acceptance: "44.6%",
      description: `Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.`,
      constraints: `1 <= nums.length <= 10^4
-10^4 <= nums[i] <= 10^4
nums contains distinct values sorted in ascending order.
-10^4 <= target <= 10^4`,
      examples: [
        {
          input: "nums = [1,3,5,6], target = 5",
          output: "2"
        }
      ],
      tags: ["Array", "Binary Search"],
      timeLimit: "1s",
      memoryLimit: "256MB"
    },
    {
      id: 36,
      title: "Valid Sudoku",
      difficulty: "Medium",
      acceptance: "51.8%",
      description: `Determine if a 9 x 9 Sudoku board is valid. Only the filled cells need to be validated according to the following rules:

Each row must contain the digits 1-9 without repetition.
Each column must contain the digits 1-9 without repetition.
Each of the nine 3 x 3 sub-boxes of the grid must contain the digits 1-9 without repetition.`,
      constraints: `board.length == 9
board[i].length == 9
board[i][j] is a digit or '.'.`,
      examples: [
        {
          input: "board = [[\"5\",\"3\",\".\",\".\",\"7\",\".\",\".\",\".\",\".\"],[\"6\",\".\",\".\",\"1\",\"9\",\"5\",\".\",\".\",\".\"],[\".\",\"9\",\"8\",\".\",\".\",\".\",\".\",\"6\",\".\"],[\"8\",\".\",\".\",\".\",\"6\",\".\",\".\",\".\",\"3\"],[\"4\",\".\",\".\",\"8\",\".\",\"3\",\".\",\".\",\"1\"],[\"7\",\".\",\".\",\".\",\"2\",\".\",\".\",\".\",\"6\"],[\".\",\"6\",\".\",\".\",\".\",\".\",\"2\",\"8\",\".\"],[\".\",\".\",\".\",\"4\",\"1\",\"9\",\".\",\".\",\"5\"],[\".\",\".\",\".\",\".\",\"8\",\".\",\".\",\"7\",\"9\"]]",
          output: "true"
        }
      ],
      tags: ["Array", "Hash Table", "Matrix"],
      timeLimit: "1s",
      memoryLimit: "256MB"
    },
    {
      id: 37,
      title: "Sudoku Solver",
      difficulty: "Hard",
      acceptance: "52.3%",
      description: `Write a program to solve a Sudoku puzzle by filling the empty cells.

A sudoku solution must satisfy all of the following rules:

Each of the digits 1-9 must occur exactly once in each row.
Each of the digits 1-9 must occur exactly once in each column.
Each of the digits 1-9 must occur exactly once in each of the 9 3x3 sub-boxes of the grid.`,
      constraints: `board.length == 9
board[i].length == 9
board[i][j] is a digit or '.'.`,
      examples: [
        {
          input: "board = [[\"5\",\"3\",\".\",\".\",\"7\",\".\",\".\",\".\",\".\"],[\"6\",\".\",\".\",\"1\",\"9\",\"5\",\".\",\".\",\".\"],[\".\",\"9\",\"8\",\".\",\".\",\".\",\".\",\"6\",\".\"],[\"8\",\".\",\".\",\".\",\"6\",\".\",\".\",\".\",\"3\"],[\"4\",\".\",\".\",\"8\",\".\",\"3\",\".\",\".\",\"1\"],[\"7\",\".\",\".\",\".\",\"2\",\".\",\".\",\".\",\"6\"],[\".\",\"6\",\".\",\".\",\".\",\".\",\"2\",\"8\",\".\"],[\".\",\".\",\".\",\"4\",\"1\",\"9\",\".\",\".\",\"5\"],[\".\",\".\",\".\",\".\",\"8\",\".\",\".\",\"7\",\"9\"]]",
          output: "[[\"5\",\"3\",\"4\",\"6\",\"7\",\"8\",\"9\",\"1\",\"2\"],[\"6\",\"7\",\"2\",\"1\",\"9\",\"5\",\"3\",\"4\",\"8\"],[\"1\",\"9\",\"8\",\"3\",\"4\",\"2\",\"5\",\"6\",\"7\"],[\"8\",\"5\",\"9\",\"7\",\"6\",\"1\",\"4\",\"2\",\"3\"],[\"4\",\"2\",\"6\",\"8\",\"5\",\"3\",\"7\",\"9\",\"1\"],[\"7\",\"1\",\"3\",\"9\",\"2\",\"4\",\"8\",\"5\",\"6\"],[\"9\",\"6\",\"1\",\"5\",\"3\",\"7\",\"2\",\"8\",\"4\"],[\"2\",\"8\",\"7\",\"4\",\"1\",\"9\",\"6\",\"3\",\"5\"],[\"3\",\"4\",\"5\",\"2\",\"8\",\"6\",\"1\",\"7\",\"9\"]]"
        }
      ],
      tags: ["Array", "Backtracking", "Matrix"],
      timeLimit: "1s",
      memoryLimit: "256MB"
    },
    {
      id: 38,
      title: "Count and Say",
      difficulty: "Medium",
      acceptance: "45.2%",
      description: `The count-and-say sequence is a sequence of digit strings defined by the recursive formula:

countAndSay(1) = "1"
countAndSay(n) is the way you would "say" the digit string from countAndSay(n-1), which is then converted into a different digit string.`,
      constraints: `1 <= n <= 30`,
      examples: [
        {
          input: "n = 1",
          output: "\"1\""
        },
        {
          input: "n = 4",
          output: "\"1211\""
        }
      ],
      tags: ["String"],
      timeLimit: "1s",
      memoryLimit: "256MB"
    },
    {
      id: 39,
      title: "Combination Sum",
      difficulty: "Medium",
      acceptance: "55.7%",
      description: `Given an array of distinct integers candidates and a target integer target, return a list of all unique combinations of candidates where the chosen numbers sum to target.`,
      constraints: `1 <= candidates.length <= 30
2 <= candidates[i] <= 40
All elements of candidates are distinct.
1 <= target <= 40`,
      examples: [
        {
          input: "candidates = [2,3,6,7], target = 7",
          output: "[[2,2,3],[7]]"
        }
      ],
      tags: ["Array", "Backtracking"],
      timeLimit: "1s",
      memoryLimit: "256MB"
    },
    {
      id: 40,
      title: "Combination Sum II",
      difficulty: "Medium",
      acceptance: "49.7%",
      description: `Given a collection of candidate numbers (candidates) and a target number (target), find all unique combinations in candidates where the candidate numbers sum to target.

Each number in candidates may only be used once in the combination.`,
      constraints: `1 <= candidates.length <= 30
1 <= candidates[i] <= 30
All elements of candidates are unique.`,
      examples: [
        {
          input: "candidates = [10,1,2,7,6,1,5], target = 8",
          output: "[[1,1,6],[1,2,5],[1,7],[2,6]]"
        }
      ],
      tags: ["Array", "Backtracking"],
      timeLimit: "1s",
      memoryLimit: "256MB"
    }
  ];

  useEffect(() => {
    setProblems(sampleProblems);
  }, []);

  useEffect(() => {
    if (selectedProblem) {
      // Set default template based on language
      const templates = {
        javascript: `/**
 * @param {${getParamType(selectedProblem.id)}} ${getParamName(selectedProblem.id)}
 * @return {${getReturnType(selectedProblem.id)}}
 */
function ${getFunctionName(selectedProblem.id)}(${getParamName(selectedProblem.id)}) {
    // Write your code here
    
}`,
        python: `class Solution:
    def ${getFunctionName(selectedProblem.id)}(self, ${getParamName(selectedProblem.id)}):
        """
        :type ${getParamName(selectedProblem.id)}: ${getParamType(selectedProblem.id)}
        :rtype: ${getReturnType(selectedProblem.id)}
        """
        # Write your code here
        pass`,
        java: `class Solution {
    public ${getReturnType(selectedProblem.id)} ${getFunctionName(selectedProblem.id)}(${getParamType(selectedProblem.id)} ${getParamName(selectedProblem.id)}) {
        // Write your code here
    }
}`,
        cpp: `class Solution {
public:
    ${getReturnType(selectedProblem.id)} ${getFunctionName(selectedProblem.id)}(${getParamType(selectedProblem.id)} ${getParamName(selectedProblem.id)}) {
        // Write your code here
    }
};`
      };
      setCode(templates[language] || templates.javascript);
    }
  }, [selectedProblem, language]);

  const getParamType = (problemId) => {
    const types = {
      1: "number[]", 2: "ListNode", 3: "string", 4: "number[]", 5: "string",
      6: "string", 7: "number", 8: "string", 9: "number", 10: "string",
      11: "number[]", 12: "number", 13: "string", 14: "string[]", 15: "number[]",
      16: "number[]", 17: "string", 18: "number[]", 19: "ListNode", 20: "string",
      21: "ListNode", 22: "number", 23: "ListNode[]", 24: "ListNode", 25: "ListNode",
      26: "number[]", 27: "number[]", 28: "string", 29: "number", 30: "string",
      31: "number[]", 32: "string", 33: "number[]", 34: "number[]", 35: "number[]",
      36: "character[][]", 37: "character[][]", 38: "number", 39: "number[]", 40: "number[]"
    };
    return types[problemId] || "any";
  };

  const getReturnType = (problemId) => {
    const types = {
      1: "number[]", 2: "ListNode", 3: "number", 4: "number", 5: "string",
      6: "string", 7: "number", 8: "number", 9: "boolean", 10: "boolean",
      11: "number", 12: "string", 13: "number", 14: "string", 15: "number[][]",
      16: "number", 17: "string[]", 18: "number[][]", 19: "ListNode", 20: "boolean",
      21: "ListNode", 22: "string[]", 23: "ListNode", 24: "ListNode", 25: "ListNode",
      26: "number", 27: "number", 28: "number", 29: "number", 30: "number[]",
      31: "void", 32: "number", 33: "number", 34: "number[]", 35: "number",
      36: "boolean", 37: "void", 38: "string", 39: "number[][]", 40: "number[][]"
    };
    return types[problemId] || "any";
  };

  const getFunctionName = (problemId) => {
    const names = {
      1: "twoSum", 2: "addTwoNumbers", 3: "lengthOfLongestSubstring", 4: "findMedianSortedArrays",
      5: "longestPalindrome", 6: "convert", 7: "reverse", 8: "myAtoi", 9: "isPalindrome",
      10: "isMatch", 11: "maxArea", 12: "intToRoman", 13: "romanToInt", 14: "longestCommonPrefix",
      15: "threeSum", 16: "threeSumClosest", 17: "letterCombinations", 18: "fourSum", 19: "removeNthFromEnd",
      20: "isValid", 21: "mergeTwoLists", 22: "generateParenthesis", 23: "mergeKLists", 24: "swapPairs",
      25: "reverseKGroup", 26: "removeDuplicates", 27: "removeElement", 28: "strStr", 29: "divide",
      30: "findSubstring", 31: "nextPermutation", 32: "longestValidParentheses", 33: "search", 34: "searchRange",
      35: "searchInsert", 36: "isValidSudoku", 37: "solveSudoku", 38: "countAndSay", 39: "combinationSum",
      40: "combinationSum2"
    };
    return names[problemId] || "solve";
  };

  const getParamName = (problemId) => {
    const names = {
      1: "nums, target", 2: "l1, l2", 3: "s", 4: "nums1, nums2", 5: "s",
      6: "s, numRows", 7: "x", 8: "s", 9: "x", 10: "s, p",
      11: "height", 12: "num", 13: "s", 14: "strs", 15: "nums",
      16: "nums, target", 17: "digits", 18: "nums, target", 19: "head, n", 20: "s",
      21: "list1, list2", 22: "n", 23: "lists", 24: "head", 25: "head, k",
      26: "nums", 27: "nums, val", 28: "haystack, needle", 29: "dividend, divisor", 30: "s, words",
      31: "nums", 32: "s", 33: "nums, target", 34: "nums, target", 35: "nums, target",
      36: "board", 37: "board", 38: "n", 39: "candidates, target", 40: "candidates, target"
    };
    return names[problemId] || "input";
  };

  const filteredProblems = problems.filter(problem => {
    const matchesDifficulty = difficultyFilter === "all" || problem.difficulty.toLowerCase() === difficultyFilter;
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         problem.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesDifficulty && matchesSearch;
  });

  const handleRunCode = async () => {
    setIsRunning(true);
    try {
      const response = await fetch('http://localhost:8080/api/v1/problems/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sourceCode: code,
          language: language,
          input: testInput,
          problemId: selectedProblem?.id
        }),
      });

      const result = await response.json();
      
      if (response.ok) {
        const output = result.success 
          ? `✅ ${result.status}\nTime: ${result.time}\nMemory: ${result.memory}\n\nOutput:\n${result.output}`
          : `❌ ${result.status}\nError: ${result.error || result.output}\nTime: ${result.time}\nMemory: ${result.memory}`;
        
        setTestOutput(output);
      } else {
        setTestOutput(`❌ Error: ${result.message || 'Failed to run code'}`);
      }
    } catch (error) {
      console.error('Run code error:', error);
      setTestOutput(`❌ Network Error: Failed to connect to server`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    setIsRunning(true);
    try {
      const response = await fetch('http://localhost:8080/api/v1/problems/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sourceCode: code,
          language: language,
          problemId: selectedProblem?.id
        }),
      });

      const result = await response.json();
      
      if (response.ok) {
        let outputMessage = `📊 Submission Results:\n\n`;
        outputMessage += `Score: ${result.score}%\n`;
        outputMessage += `Passed: ${result.passedTestCases}/${result.totalTestCases} test cases\n\n`;
        
        if (result.success) {
          outputMessage += `🎉 ${result.message}\n\n`;
        } else {
          outputMessage += `❌ ${result.message}\n\n`;
        }

        // Show test case results
        result.results.forEach((testCase, index) => {
          outputMessage += `Test Case ${index + 1}: ${testCase.isHidden ? '(Hidden)' : '(Visible)'}\n`;
          outputMessage += `Status: ${testCase.success ? '✅ Passed' : '❌ Failed'}\n`;
          if (!testCase.success && !testCase.isHidden) {
            outputMessage += `Input: ${testCase.input}\n`;
            outputMessage += `Expected: ${testCase.expectedOutput}\n`;
            outputMessage += `Actual: ${testCase.actualOutput}\n`;
          }
          outputMessage += `Time: ${testCase.time}, Memory: ${testCase.memory}\n\n`;
        });

        setTestOutput(outputMessage);
      } else {
        setTestOutput(`❌ Error: ${result.message || 'Failed to submit code'}`);
      }
    } catch (error) {
      console.error('Submit code error:', error);
      setTestOutput(`❌ Network Error: Failed to connect to server`);
    } finally {
      setIsRunning(false);
    }
  };

  if (selectedProblem) {
    return (
      <>
        <Header />
        <div className="flex h-screen pt-16">
          {/* Left Panel - Problem Description */}
          <div className="w-1/2 overflow-y-auto border-r border-gray-300 p-6">
            <div className="mb-4">
              <button
                onClick={() => setSelectedProblem(null)}
                className="text-blue-600 hover:text-blue-800 mb-4"
              >
                ← Back to Problems
              </button>
              <h1 className="text-2xl font-bold mb-2">{selectedProblem.title}</h1>
              <div className="flex gap-2 mb-4">
                <span className={`px-2 py-1 rounded text-sm ${
                  selectedProblem.difficulty === "Easy" ? "bg-green-100 text-green-800" :
                  selectedProblem.difficulty === "Medium" ? "bg-yellow-100 text-yellow-800" :
                  "bg-red-100 text-red-800"
                }`}>
                  {selectedProblem.difficulty}
                </span>
                <span className="px-2 py-1 rounded text-sm bg-gray-100 text-gray-800">
                  Acceptance: {selectedProblem.acceptance}
                </span>
              </div>
              <div className="flex gap-2 flex-wrap mb-4">
                {selectedProblem.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 rounded text-sm bg-blue-100 text-blue-800">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <div className="whitespace-pre-wrap text-gray-700">{selectedProblem.description}</div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Constraints</h2>
              <div className="whitespace-pre-wrap text-gray-700 font-mono text-sm bg-gray-50 p-3 rounded">
                {selectedProblem.constraints}
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Examples</h2>
              {selectedProblem.examples.map((example, index) => (
                <div key={index} className="mb-4 border border-gray-200 rounded p-3">
                  <div className="mb-2">
                    <strong>Input:</strong> {example.input}
                  </div>
                  <div className="mb-2">
                    <strong>Output:</strong> {example.output}
                  </div>
                  {example.explanation && (
                    <div className="text-gray-600">
                      <strong>Explanation:</strong> {example.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 p-3 rounded">
                <strong>Time Limit:</strong> {selectedProblem.timeLimit}
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <strong>Memory Limit:</strong> {selectedProblem.memoryLimit}
              </div>
            </div>
          </div>

          {/* Right Panel - Code Editor */}
          <div className="w-1/2 flex flex-col">
            {/* Language Selector */}
            <div className="border-b border-gray-300 p-4">
              <div className="flex justify-between items-center">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-1"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                </select>
                <div className="flex gap-2">
                  <button
                    onClick={handleRunCode}
                    disabled={isRunning}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
                  >
                    {isRunning ? "Running..." : "Run Code"}
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isRunning}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    {isRunning ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </div>
            </div>

            {/* Code Editor */}
            <div className="flex-1">
              <Editor
                height="100%"
                language={language}
                value={code}
                onChange={(value) => setCode(value)}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: "on",
                  roundedSelection: false,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                }}
              />
            </div>

            {/* Console/Output */}
            <div className="border-t border-gray-300 h-48">
              <div className="border-b border-gray-200 p-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab("input")}
                    className={`px-3 py-1 rounded text-sm ${
                      activeTab === "input" ? "bg-gray-200" : ""
                    }`}
                  >
                    Input
                  </button>
                  <button
                    onClick={() => setActiveTab("output")}
                    className={`px-3 py-1 rounded text-sm ${
                      activeTab === "output" ? "bg-gray-200" : ""
                    }`}
                  >
                    Output
                  </button>
                </div>
              </div>
              <div className="p-3 h-32 overflow-y-auto">
                {activeTab === "input" ? (
                  <textarea
                    value={testInput}
                    onChange={(e) => setTestInput(e.target.value)}
                    placeholder="Enter custom test input here..."
                    className="w-full h-full border border-gray-300 rounded p-2 font-mono text-sm resize-none"
                  />
                ) : (
                  <div className="font-mono text-sm">
                    {testOutput || "Output will appear here..."}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">LeetCode Problems</h1>
        
        {/* Filters and Search */}
        <div className="mb-6 flex gap-4 items-center">
          <input
            type="text"
            placeholder="Search problems..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 border border-gray-300 rounded px-4 py-2"
          />
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* Problems Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Difficulty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acceptance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tags
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProblems.map((problem) => (
                <tr
                  key={problem.id}
                  onClick={() => setSelectedProblem(problem)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {problem.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {problem.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      problem.difficulty === "Easy" ? "bg-green-100 text-green-800" :
                      problem.difficulty === "Medium" ? "bg-yellow-100 text-yellow-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      {problem.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {problem.acceptance}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-1 flex-wrap">
                      {problem.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                          {tag}
                        </span>
                      ))}
                      {problem.tags.length > 3 && (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                          +{problem.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProblems.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No problems found matching your criteria.
          </div>
        )}
      </div>
    </>
  );
};

export default Problems;

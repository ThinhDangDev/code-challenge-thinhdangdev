/**
 * Problem 1: Three ways to sum to n
 *
 * This file contains three unique implementations of the sum_to_n function.
 * Each approach demonstrates a different algorithmic strategy.
 */

/**
 * Implementation A: Iterative approach using a for loop
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 *
 * This is the most straightforward approach, iterating through
 * numbers from 1 to n and accumulating the sum.
 */
const sum_to_n_a = function (n: number): number {
  if (n <= 0) return 0;

  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
};

/**
 * Implementation B: Mathematical formula approach
 * Time Complexity: O(1)
 * Space Complexity: O(1)
 *
 * Uses the arithmetic series formula: sum = n * (n + 1) / 2
 * This is the most efficient approach for large values of n.
 */
const sum_to_n_b = function (n: number): number {
  if (n <= 0) return 0;

  return (n * (n + 1)) / 2;
};

/**
 * Implementation C: Recursive approach
 * Time Complexity: O(n)
 * Space Complexity: O(n) due to call stack
 *
 * Uses recursion with the principle that sum(n) = n + sum(n-1)
 * Base case: sum(1) = 1, sum(0) = 0
 */
const sum_to_n_c = function (n: number): number {
  if (n <= 0) return 0;
  if (n === 1) return 1;

  return n + sum_to_n_c(n - 1);
};

// Export the functions for testing
export { sum_to_n_a, sum_to_n_b, sum_to_n_c };

// Demonstration
if (require.main === module) {
  const testValue = 5;
  console.log(`Testing with n = ${testValue}:`);
  console.log(`sum_to_n_a(${testValue}) = ${sum_to_n_a(testValue)}`);
  console.log(`sum_to_n_b(${testValue}) = ${sum_to_n_b(testValue)}`);
  console.log(`sum_to_n_c(${testValue}) = ${sum_to_n_c(testValue)}`);

  const testValue2 = 100;
  console.log(`\nTesting with n = ${testValue2}:`);
  console.log(`sum_to_n_a(${testValue2}) = ${sum_to_n_a(testValue2)}`);
  console.log(`sum_to_n_b(${testValue2}) = ${sum_to_n_b(testValue2)}`);
  console.log(`sum_to_n_c(${testValue2}) = ${sum_to_n_c(testValue2)}`);
}

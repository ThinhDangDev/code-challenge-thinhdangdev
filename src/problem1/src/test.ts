/**
 * Test suite for the three sum_to_n implementations
 */

import { sum_to_n_a, sum_to_n_b, sum_to_n_c } from "./index";

interface TestCase {
  input: number;
  expected: number;
  description: string;
}

const testCases: TestCase[] = [
  { input: 0, expected: 0, description: "Zero input" },
  { input: 1, expected: 1, description: "Single number" },
  { input: 5, expected: 15, description: "Small positive number (1+2+3+4+5)" },
  { input: 10, expected: 55, description: "Medium positive number" },
  { input: 100, expected: 5050, description: "Large positive number" },
  { input: -5, expected: 0, description: "Negative number" },
  { input: 1000, expected: 500500, description: "Very large number" },
];

function runTests(): void {
  const functions = [
    { name: "sum_to_n_a (Iterative)", fn: sum_to_n_a },
    { name: "sum_to_n_b (Mathematical)", fn: sum_to_n_b },
    { name: "sum_to_n_c (Recursive)", fn: sum_to_n_c },
  ];

  let totalTests = 0;
  let passedTests = 0;

  for (const { name, fn } of functions) {
    console.log(`\n📋 Testing ${name}:`);
    console.log("─".repeat(50));

    for (const testCase of testCases) {
      totalTests++;
      const result = fn(testCase.input);
      const passed = result === testCase.expected;

      if (passed) {
        passedTests++;
        console.log(`${testCase.description}: ${testCase.input} → ${result}`);
      } else {
        console.log(
          `${testCase.description}: Expected ${testCase.expected}, got ${result}`
        );
      }
    }
  }

  console.log("\n" + "=".repeat(50));
  console.log(`Test Results: ${passedTests}/${totalTests} tests passed`);

  if (passedTests === totalTests) {
    console.log("All tests passed!");
  } else {
    console.log("Some tests failed!");
    process.exit(1);
  }
}

// Run tests
if (require.main === module) {
  runTests();
}

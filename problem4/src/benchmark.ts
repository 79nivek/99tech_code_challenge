import { sum_to_n_a, sum_to_n_b, sum_to_n_c } from "./sum-to-n";

/**
 * Benchmark utility to measure execution time
 */
function benchmark(fn: () => void, iterations: number = 1000): number {
  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    fn();
  }
  const end = performance.now();
  return (end - start) / iterations; // Average time per iteration
}

/**
 * Run performance comparison tests
 */
function runBenchmarks() {
  console.log("🚀 Performance Comparison: Sum to N Functions\n");
  console.log("=" .repeat(60));

  const testCases = [10, 100, 1000, 10000, 100000, 1000000, 10000000];

  for (const n of testCases) {
    console.log(`\n📊 Testing with n = ${n.toLocaleString()}`);
    console.log("-".repeat(40));

    // Test sum_to_n_a (Array + Reduce)
    try {
      const timeA = benchmark(() => sum_to_n_a(n), 100);
      console.log(`sum_to_n_a: ${timeA.toFixed(6)}ms (Array + Reduce)`);
    } catch (error) {
      console.log(`sum_to_n_a: ❌ Error - ${error instanceof Error ? error.message : String(error)}`);
    }

    // Test sum_to_n_b (Recursive)
    try {
      const timeB = benchmark(() => sum_to_n_b(n), 100);
      console.log(`sum_to_n_b: ${timeB.toFixed(6)}ms (Recursive)`);
    } catch (error) {
      console.log(`sum_to_n_b: ❌ Error - ${error instanceof Error ? error.message : String(error)}`);
    }

    // Test sum_to_n_c (Gauss Formula)
    try {
      const timeC = benchmark(() => sum_to_n_c(n), 100);
      console.log(`sum_to_n_c: ${timeC.toFixed(6)}ms (Gauss Formula)`);
    } catch (error) {
      console.log(`sum_to_n_c: ❌ Error - ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  console.log("\n" + "=".repeat(60));
}

// Run the benchmarks
runBenchmarks(); 
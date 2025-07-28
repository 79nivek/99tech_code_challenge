/**
 * @description sum_to_n_a is a brute force solution that uses a for loop and javascript's built in array methods to sum the numbers from 1 to n
 * @param n - the number to sum to
 * @returns the sum of all numbers from 1 to n
 */
export function sum_to_n_a(n: number): number {
  if (n <= 0) return 0;
  return Array.from({ length: n }, (_, i) => i + 1).reduce(
    (acc, curr) => acc + curr,
    0
  );
}

/**
 * @description sum_to_n_b uses Recursive Approach to sum the numbers from 1 to n
 * @param n - the number to sum to
 * @returns the sum of all numbers from 1 to n
*/
export function sum_to_n_b(n: number): number {
  if (n <= 0) return 0;
  return n + sum_to_n_b(n - 1);
}

/**
 * @description sum_to_n_c uses Gauss's formula to sum the numbers from 1 to n
 * @param n - the number to sum to
 * @returns the sum of all numbers from 1 to n
 */
export function sum_to_n_c(n: number): number {
  if (n <= 0) return 0;
  return (n * (n + 1)) / 2;
}

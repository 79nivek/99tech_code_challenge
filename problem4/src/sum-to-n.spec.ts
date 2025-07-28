import { sum_to_n_a, sum_to_n_b, sum_to_n_c } from "./sum-to-n";

describe("sum_to_n_a", () => {
  it("should return the sum of all numbers from 1 to n", () => {
    expect(sum_to_n_a(10)).toBe(55);
  });

  it("should return 0 for 0", () => {
    expect(sum_to_n_a(0)).toBe(0);
  });

  it("should return 0 for -1", () => {
    expect(sum_to_n_a(-1)).toBe(0);
  });
});

describe("sum_to_n_b", () => {
  it("should return the sum of all numbers from 1 to n", () => {
    expect(sum_to_n_b(10)).toBe(55);
  });

  it("should return 0 for 0", () => {
    expect(sum_to_n_b(0)).toBe(0);
  });

  it("should return 0 for -1", () => {
    expect(sum_to_n_b(-1)).toBe(0);
  });
});

describe("sum_to_n_c", () => {
  it("should return the sum of all numbers from 1 to n", () => {
    expect(sum_to_n_c(10)).toBe(55);
  });

  it("should return 0 for 0", () => {
    expect(sum_to_n_c(0)).toBe(0);
  });

  it("should return 0 for -1", () => {
    expect(sum_to_n_c(-1)).toBe(0);
  });
});

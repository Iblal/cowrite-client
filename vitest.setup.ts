import "@testing-library/jest-dom/vitest";

declare module "vitest" {
  interface Assertion<T = any> {
    toBeInTheDocument(): void;
  }
}

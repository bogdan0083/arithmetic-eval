import { describe, it } from "node:test";
import {evaluateString} from "../evaluator";
import assert from "node:assert";

describe("evaluator", () => {
  it("should evaluate a simple string expression", () => {
    const result = evaluateString("10 + 22 - (66 / 33)");
    const expected = 30;

    assert.strictEqual(result, expected);
  });
  it("should evaluate a complex string expression", () => {
    const result = evaluateString("10 - 61 / (11 * (5 + 2) - 2^4) + 3");
    const expected = 12;

    assert.strictEqual(result, expected);
  });

});
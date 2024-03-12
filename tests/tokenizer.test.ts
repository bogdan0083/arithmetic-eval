import { describe, it } from "node:test";
import {
  convertToPostfix,
  tokenize,
  TNum,
  TBinaryOperator,
  TParenthesis,
} from "../tokenizer";
import assert from "node:assert";

describe("tokenizer", () => {
  it("should tokenize a string WITH spaces", () => {
    const result = tokenize("10 - 61 / (11 * (5 + 2) - 2^4) + 3");
    const expected = [
      new TNum(10),
      new TBinaryOperator("-"),
      new TNum(61),
      new TBinaryOperator("/"),
      new TParenthesis("("),
      new TNum(11),
      new TBinaryOperator("*"),
      new TParenthesis("("),
      new TNum(5),
      new TBinaryOperator("+"),
      new TNum(2),
      new TParenthesis(")"),
      new TBinaryOperator("-"),
      new TNum(2),
      new TBinaryOperator("^"),
      new TNum(4),
      new TParenthesis(")"),
      new TBinaryOperator("+"),
      new TNum(3),
    ];

    assert.deepEqual(result, expected);
  });
  
  it("should tokenize a string WITHOUT spaces", () => {
    const result = tokenize("10-61/(11*(5+2)-2^4)+3");
    const expected = [
      new TNum(10),
      new TBinaryOperator("-"),
      new TNum(61),
      new TBinaryOperator("/"),
      new TParenthesis("("),
      new TNum(11),
      new TBinaryOperator("*"),
      new TParenthesis("("),
      new TNum(5),
      new TBinaryOperator("+"),
      new TNum(2),
      new TParenthesis(")"),
      new TBinaryOperator("-"),
      new TNum(2),
      new TBinaryOperator("^"),
      new TNum(4),
      new TParenthesis(")"),
      new TBinaryOperator("+"),
      new TNum(3),
    ];

    assert.deepEqual(result, expected);
  });
  

  it("should convert tokens to postfix", () => {
    const result = convertToPostfix(
      tokenize("10 - 61 / (11 * (5 + 2) - 2^4) + 3"),
    );

    // 10 61 11 5 2 + * 2 4 ^ - / - 3 +
    const expected = [
      new TNum(10),
      new TNum(61),
      new TNum(11),
      new TNum(5),
      new TNum(2),
      new TBinaryOperator("+"),
      new TBinaryOperator("*"),
      new TNum(2),
      new TNum(4),
      new TBinaryOperator("^"),
      new TBinaryOperator("-"),
      new TBinaryOperator("/"),
      new TBinaryOperator("-"),
      new TNum(3),
      new TBinaryOperator("+"),
    ];

    assert.deepEqual(result, expected);
  });
  
});

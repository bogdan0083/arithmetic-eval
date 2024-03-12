import tokenize from "./tokenizer.js";
import {
  convertToPostfix,
  TNum,
  TBinaryOperator,
  Token,
  BinaryOperatorSymbol,
} from "./tokenizer.js";

type OperatorEvalMap = {
  [key in BinaryOperatorSymbol]: (a: number, b: number) => TNum;
};

type EvaluatorOptions = {
  printSteps: boolean;
};

/**
 * Evaluates a list of tokens in infix notation
 */
const evaluateTokens = (
  tokens: Token<any>[],
  opts: EvaluatorOptions = { printSteps: false },
): number => {
  // convert tokens to postfix first
  const converted = convertToPostfix(tokens);

  const stack = [] as TNum[];

  const evaluateBinaryExpression = (a: TNum, b: TNum, op: TBinaryOperator) => {
    const operatorEvalMap: OperatorEvalMap = {
      "+": (a, b) => new TNum(a + b),
      "-": (a, b) => new TNum(a - b),
      "*": (a, b) => new TNum(a * b),
      "/": (a, b) => new TNum(a / b),
      "^": (a, b) => new TNum(Math.pow(a, b)),
    };

    return operatorEvalMap[op.value](a.value, b.value);
  };

  converted.forEach((t) => {
    if (t instanceof TNum) {
      stack.push(t);
    } else if (t instanceof TBinaryOperator) {
      const b = stack.pop();
      const a = stack.pop();
      if (a && b) {
        const result = evaluateBinaryExpression(a, b, t);
        if (opts.printSteps) {
          console.info(
            `Evaluating ${a.value} ${t.value} ${b.value} = ${result.value}`,
          );
        }
        stack.push(result);
      }
    }
  });

  if (stack.length > 1) {
    throw Error(
      "Whoops. After evaluating, stack has more than 1 element. Looks like arithmetic expression is wrong",
    );
  }

  return stack[0].value;
};

const evaluateString = (
  str: string,
  opts: EvaluatorOptions = { printSteps: false },
): number => {
  const tokens = tokenize(str);
  return evaluateTokens(tokens, opts);
};

export default evaluateTokens;
export { evaluateTokens, evaluateString };

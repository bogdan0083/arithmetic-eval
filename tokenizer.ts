export interface Token<T> {
  value: T;
  toString: () => string;
}

export type BinaryOperatorSymbol = "-" | "+" | "*" | "/" | "^";
type ParenthesisSymbol = "(" | ")";

export class TNum implements Token<number> {
  value;
  constructor(value: number) {
    this.value = value;
  }

  toString() {
    return this.value.toString();
  }
}

export class TBinaryOperator implements Token<BinaryOperatorSymbol> {
  value;
  constructor(value: BinaryOperatorSymbol) {
    this.value = value;
  }

  toString() {
    return this.value;
  }
}

export class TParenthesis implements Token<ParenthesisSymbol> {
  value;
  constructor(value: ParenthesisSymbol) {
    this.value = value;
  }

  toString() {
    return this.value;
  }
}

const grammar = {
  num: /^([0-9]*[.])?[0-9]+/,
  binaryOperator: /^[\-\+\*\/\^]/,
  parenthesis: /^[\(\)]/,
  space: /^(\s+)/,
};

enum OperatorPrecedence {
  Low,
  Medium,
  High,
}

const getOperatorPrecendence = (
  op: BinaryOperatorSymbol,
): OperatorPrecedence => {
  if (op === "^") {
    return OperatorPrecedence.High;
  } else if (op === "*" || op === "/") {
    return OperatorPrecedence.Medium;
  } else {
    return OperatorPrecedence.Low;
  }
};

/**
 * Converts tokens in infix notation to tokens in postfix notation
 */
export const convertToPostfix = (tokens: Token<any>[]): Token<any>[] => {
  const stack: Token<any>[] = [];
  const postfixTokens: Token<any>[] = [];

  tokens.forEach((t) => {
    if (t instanceof TNum) {
      postfixTokens.push(t);
    } else if (t instanceof TParenthesis) {
      const isOpeningParen = t.value === "(";
      const isClosingParen = t.value === ")";

      // @TODO: handle case when there's closing paren but no open paren
      // @TODO: handle case when there's open paren but no closing paren
      if (isOpeningParen) {
        stack.push(t);
        return;
      }

      if (isClosingParen) {
        let operatorOrParen = stack.pop();
        while (operatorOrParen) {
          if (operatorOrParen.value === "(") {
            break;
          }

          if (operatorOrParen.value === ")") {
            throw Error(
              "whoops. We found ) while searching for (. But we shouldn't found it. Looks like arithmetic expression is wrong",
            );
          }

          postfixTokens.push(operatorOrParen);
          operatorOrParen = stack.pop();
        }
      }
    } else if (t instanceof TBinaryOperator) {
      // @TODO: handle two ^^
      const isEmpty = stack.length == 0;
      const precedence = getOperatorPrecendence(t.value);

      if (isEmpty) {
        stack.push(t);
      } else {
        const lastTokenInStack = stack[stack.length - 1];

        if (lastTokenInStack.value === "(") {
          stack.push(t);
          return;
        }

        const lastTokenPrecedence = getOperatorPrecendence(
          lastTokenInStack.value,
        );

        if (precedence > lastTokenPrecedence) {
          stack.push(t);
        } else if (precedence <= lastTokenPrecedence) {
          let poppedOp = stack.pop();

          while (poppedOp) {
            let poppedOpPrecedence = getOperatorPrecendence(poppedOp.value);

            if (poppedOpPrecedence < precedence) {
              break;
            }

            postfixTokens.push(poppedOp);

            const last = stack[stack.length - 1];
            if (last && last.value === "(") {
              // terminate while loop if we encountered (
              // we don't want to pop out of parenthesis
              break;
            }

            poppedOp = stack.pop();
          }

          stack.push(t);
        }
      }
    }
  });

  if (stack.length !== 0) {
    let popped = stack.pop();
    while (popped) {
      postfixTokens.push(popped);
      popped = stack.pop();
    }
  }

  return postfixTokens;
};

// @TODO handle space. As tokens? As raws?
export const tokenize = (str: string) => {
  const loop = (s: string, tokens: Token<any>[]): Token<any>[] => {
    if (s.length <= 0) {
      return tokens;
    }

    if (grammar.space.exec(s)) {
      const [val] = grammar.space.exec(s) as RegExpExecArray;
      return loop(s.substring(val.length), [...tokens]);
    }

    if (grammar.num.exec(s)) {
      const [val] = grammar.num.exec(s) as RegExpExecArray;
      return loop(s.substring(val.length), [
        ...tokens,
        new TNum(parseFloat(val)),
      ]);
    }

    if (grammar.binaryOperator.exec(s)) {
      const [val] = grammar.binaryOperator.exec(s) as RegExpExecArray;
      return loop(s.substring(1), [
        ...tokens,
        new TBinaryOperator(val as BinaryOperatorSymbol),
      ]);
    }

    if (grammar.parenthesis.exec(s)) {
      const [val] = grammar.parenthesis.exec(s) as RegExpExecArray;
      return loop(s.substring(1), [
        ...tokens,
        new TParenthesis(val as ParenthesisSymbol),
      ]);
    }

    throw Error(`unknown token: ${s}`);
  };

  return loop(str, []);
};

export default tokenize;

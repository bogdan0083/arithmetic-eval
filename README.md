# Arithmetic Eval
Dead simple arithmetic evaluator created for educational purposes. It doesn't use [eval()](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/eval) but contains custom tokenizer and evaluator. It correctly handles precedence of operators and parenthesis.

!(example)[https://github.com/bogdan0083/arithmetic-eval/blob/master/example.gif)]


## Installation

I didn't provide npm package because it was created solely for educational purposes and has no practical use. But if you want to play with it just run:

TODO
`npm i arithmetic-eval`

```
Usage: arithmetic-eval [options]

Options:
  -e, --expression <exp>  expression to evaluate
  -s, --print-steps       print each step while evaluating (default: false)
  -r, --repl              run interactive repl (default: false)
  -h, --help              display help for command

```

## How does it work?

It first tries to parse symbols as a list of tokens. Then tokens are converted to [Postfix notation](https://en.wikipedia.org/wiki/Reverse_Polish_notation) and finaly evaluated.




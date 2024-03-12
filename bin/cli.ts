#!/usr/bin/env node

import { program } from "commander";
import { evaluateString } from "../evaluator.js";
import runRepl from "../repl.js";

program
  .option("-e, --expression <exp>", "expression to evaluate")
  .option("-s, --print-steps", "print each step while evaluating", false)
  .option("-r, --repl", "run interactive repl", false);

program.parse();

const options = program.opts();

if (!options.repl) {

  if (!options.expression) {
    console.error("Please provide expression to evaluate");
    process.exit(1);
  }
  const result = evaluateString(options.expression, {
    printSteps: options.printSteps,
  });
  console.log(result)
} else {
  runRepl({ printSteps: options.printSteps });
}

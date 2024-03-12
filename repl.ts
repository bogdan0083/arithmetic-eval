import { evaluateString } from "./evaluator.js";
import * as repl from "node:repl";

type ReplOptions = {
  printSteps: boolean;
};

// @ts-ignore
function myRepl(cmd, callback, opts) {
  const sliced = cmd.slice(0, -1); // trim ';' at the end
  let result;
  try {
    result = evaluateString(sliced, opts);
  } catch (e) {
    console.error(e);
  }

  callback(null, result);
}

const runRepl = (opts: ReplOptions) =>
  repl.start({
    prompt: "> ",
    eval: (cmd: string, _ctx, _filename, callback) => myRepl(cmd, callback, opts),
  });

export default runRepl;

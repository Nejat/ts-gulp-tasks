import { ShellExec } from "./shell-exec";

export class TSCompile extends ShellExec {

  /**
   * Compiles the provide project using a local instance of the Typescript compiler
   * @param tsconfig - typescript project configuration
   * @param done     - callback that signals task completion
   */
  protected static tsc(tsconfig: string, done: Function) {
    TSCompile.exec(`node ./node_modules/typescript/lib/tsc.js -p ${tsconfig}`, done);
  }
}

const exec = require("child_process").exec;

import { ChildProcessExecCallback } from "./definitions";

export class ShellExec {

  protected static exec(cmd: string, done: Function): void {
    exec(cmd, ShellExec.execOutput(done));
  }

  /**
   * process the output of all executed child processes
   * @param done - signals task completion
   * @returns {ChildProcessExecCallback}
   */
  protected static execOutput (done: Function): ChildProcessExecCallback {

    return (error: Error, stdout: string, stderr: string): void => {
      if (error) {
        console.error(stderr);
        done(error);
      } else {
        console.log(stdout);
        done();
      }
    };
  }
}

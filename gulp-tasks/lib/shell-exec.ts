///<reference path="../lib/definitions.d.ts"/>

const exec = require("child_process").exec;

export class ShellExec {

  protected static exec(cmd: string, done: Function): void {
    exec(cmd, ShellExec.execOutput(done));
  }

  /**
   * process the output of all executed child processes
   * @param done - callback that signals task completion
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

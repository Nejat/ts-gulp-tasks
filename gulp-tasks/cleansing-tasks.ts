///<reference path="../typings/index.d.ts"/>

import * as gulp from "gulp";
import * as fs   from "fs";
import * as glob from "glob";

const del = require("del");

import { Task, Gulp } from "../src/index";
import { settings }   from "./lib/gulp-settings";

/**
 * array of globs of the project's build output
 * @type {string[]}
 */
const CLEAN_BUILD: string[] = [
  `${settings.compileOutput}/**/*.+(js|d.ts|js.map)`,
  // in case declarations are not saved to the same output root
  `${settings.declarationOutput}/**/*.+(js|d.ts|js.map)`
];

/**
 * array of globs of the project's tests output
 * @type {string[]}
 */
const CLEAN_TESTS: string[] = [
  `${settings.testsPath}/**/*.js`,
  `${settings.srcPath}/**/*.js`
];

/**
 * array of globs of the project's residual output files
 * @type {string[]}
 */
const CLEAN_UP_GLOBS: string[] = [
  ...CLEAN_TESTS,
  ".nyc_output",
  "coverage",
];

/**
 * array of globs for all non-essential project files, including dev dependencies and residual project files
 * @type {string[]}
 */
const CLEAN_RESET_GLOBS: string[] = [
  ...CLEAN_BUILD,
  ...CLEAN_UP_GLOBS,
  `${settings.jsonSchemasOutput}/**`,
  "typings/**",
  "node_modules"
];

@Gulp(gulp)
class Cleansing {

  /**
   * Task: "clean"
   * removes javascript build files
   * @param done - signals task completion
   */
  @Task()
  static "clean"(done: Function): void {

    del.sync(CLEAN_BUILD);

    // clean up any empty folders
    Cleansing.deleteEmptyFolders(CLEAN_BUILD);

    done();
  }

  /**
   * Task: "clean"
   * removes javascript tests build files
   * @param done - signals task completion
   */
  @Task()
  static "clean-tests"(done: Function): void {

    del.sync(CLEAN_TESTS);

    Cleansing.deleteEmptyFolders(CLEAN_TESTS);

    done();
  }

  /**
   * Task: "clean-up"
   * deletes the project's residual output files
   * @param done - signals task completion
   */
  @Task()
  static "clean-up" (done: Function): void {

    del.sync(CLEAN_UP_GLOBS);

    Cleansing.deleteEmptyFolders(CLEAN_UP_GLOBS);

    done();
  }

  /**
   * Task: "clean-reset"
   * deletes all non-essential project files, including dev dependencies and residual project files
   * @param done - signals task completion
   */
  @Task()
  static  "clean-reset" (done: Function): void {

    del.sync(CLEAN_RESET_GLOBS);

    Cleansing.deleteEmptyFolders(CLEAN_RESET_GLOBS);

    done();
  }

  /**
   * delete empty folder trees, patterns are striped to the most recent parent
   * using this task will require the npm "bootstrap" script to restore all essential development tools
   * @param globs - glob patterns to delete
   */
  private static deleteEmptyFolders(globs: string[]) {

    globs.map((pattern: string) => {
            pattern = pattern.replace("\\", "/");

            if (glob.hasMagic(pattern)) {
              let ok: boolean = true;

              return pattern.split("/")
                            .filter((part: string) => ok ? ok = part.indexOf("*") === -1 : false)
                            .join("/");
            } else {
              return pattern;
            }
         })
         .forEach((path: string): void => {
           if (fs.existsSync(path) &&
               glob.sync(`${path}/**/*`)
                   .filter((file: string) => fs.statSync(file).isFile())
                   .length === 0 ) {
             del.sync(path);
           }
         });
  }
}

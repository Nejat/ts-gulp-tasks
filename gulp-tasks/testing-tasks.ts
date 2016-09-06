///<reference path="./lib/definitions.d.ts"/>

import * as gulp from "gulp";

const tapColorize = require("tap-colorize");
const tape        = require("gulp-tape");

import { Task, Gulp } from "../src/index";

import { settings }       from "./lib/gulp-settings";
import { TSCompile }      from "./lib/ts-compile";

@Gulp(gulp)
class Testing extends TSCompile {

  /**
   * Task: "tests"
   * requires "tests-build", runs unit tests w/tape, reports w/tap-colorize
   * @returns {ReadableStream} - piped result of tape
   */
  @Task("build-tests")
  static "tests"(): NodeJS.ReadableStream {

    return gulp.src(`${settings.testsPath}/**/*.js`)
      .pipe(tape({
        reporter: tapColorize()
      }));
  }

  /**
   * Task: "coverage"
   * requires "tests-build", runs unit tests w/tap to produce a code coverage report
   * @param done - callback that signals task completion
   */
  @Task("build-tests")
  static "coverage"(done: Function): void {

    Testing.exec(Testing.coverageCommand(settings.testsMainFile, settings.coverageReport), done);
  }

  /**
   * Task: "tests-build"
   * requires "tests-lint", "tests-clean", compiles the typescript written tests using the locally installed version of typescript
   * @param done - callback that signals task completion
   */
  @Task("ts-lint-tests", "clean-tests")
  static "build-tests"(done: Function): void {

    Testing.tsc(settings.testsTsconfig, done);
  }

  /**
   * build the shell command to test code coverage
   * @param tests      - test file
   * @param report     - code coverage report type
   * @returns {string} - shell command
   */
  private static coverageCommand(tests: string, report: CoverageReport) {

    return `node ./node_modules/tap/bin/run.js ${tests} --coverage --coverage-report=${report}`;
  }
}

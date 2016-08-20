///<reference path="../typings/index.d.ts"/>

import * as gulp   from "gulp";
import * as tslint from "gulp-tslint";

import { Task, Gulp } from "../src/index";

import { settings }   from "./lib/gulp-settings";

@Gulp(gulp)
class Linting {

  /**
   * Task: "ts-lint"
   * lints the project typescript source
   * @returns {NodeJS.ReadableStream} - result of task
   */
  @Task()
  static "ts-lint"(): NodeJS.ReadableStream {

    return this.lint(settings.srcPath, settings.tsLintRules);
  }

  /**
   * Task: "ts-lint-tests"
   * lints the tests typescript source
   * @returns {NodeJS.ReadableStream} - result of task
   */
  @Task()
  static "ts-lint-tests"(): NodeJS.ReadableStream {

    return this.lint(settings.testsPath, settings.tsLintRules);
  }

  /**
   * lints the typescript files in root path with the selected rules
   * @param root  - root path of tests
   * @param rules - optional, configuration rules object or path for an external tslint rules file
   * @returns {NodeJS.ReadableStream} - result of gulp pipeline
   */
  private static lint(root: string, rules?: string|{}): NodeJS.ReadableStream {
    return gulp.src(root + "/**/*.ts")
               .pipe(tslint({
                  configuration: rules,
                  tslint:        require("tslint")
               }))
               .pipe(tslint.report({}));
  }
}

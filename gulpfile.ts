import * as gulp from "gulp";

import { Task, Gulp } from "./src/index";

import { settings }   from "./gulp-tasks/lib/gulp-settings";
import { TSCompile }  from "./gulp-tasks/lib/ts-compile";

/**
 * Gulp task definition class
 */
@Gulp(gulp)
class GulpFile extends TSCompile {

  /**
   * Task: "default"
   * requires the "build" task, performs no additional functionality otherwise
   * @param done - signals task completion
   */
  @Task("build")
  static "default"(done: Function): void {

    done();
  }

  /**
   * Task: "build"
   * requires the "tslint" & "clean" tasks, compiles the typescript project using the locally installed version of typescript
   * @param done - signals task completion
   */
  @Task("ts-lint", "clean")
  static "build"(done: Function): void {

    GulpFile.tsc(settings.buildTsconfig, done);
  }
}

// this project was developed using JetBrain's WebStorm IDE, which has a "Gulp" task runner, that lists tasks in the order in
// which they are registered. hence, the task imports at the end of this file
import "./gulp-tasks/testing-tasks";
import "./gulp-tasks/linting-tasks";
import "./gulp-tasks/cleansing-tasks";
import "./gulp-tasks/misc-tasks";

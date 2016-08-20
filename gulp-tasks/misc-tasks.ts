///<reference path="../typings/index.d.ts"/>

import * as gulp from "gulp";

const rename = require("gulp-rename");
const json   = require("gulp-json");

import { Task, Gulp } from "../src/index";

import { settings }   from "./lib/gulp-settings";
import { RenamePath } from "./lib/definitions";

@Gulp(gulp)
class MiscTasks {

  /**
   * Task: "update-schemas"
   * downloads json schema files for ide support
   * @returns {NodeJS.ReadWriteStream}
   */
  @Task()
  static "update-schemas" (): NodeJS.ReadWriteStream {

    return gulp.src(settings.jsonSchemas)
               .pipe(json())
               .pipe(rename((path: RenamePath) => {
                 if (!/schema/i.test(path.basename)) {
                   path.basename += "-schema";
                 }
               }))
               .pipe(gulp.dest(settings.jsonSchemasOutput));
  }
}

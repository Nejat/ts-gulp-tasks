///<reference path="../lib/definitions.d.ts"/>

import * as fs   from "fs";

/**
 * optional, external settings file name
 * @type {string}
 */
const GULP_SETTINGS: string = "./gulp-tasks/settings/gulp-settings.json";

/**
 * typical default settings
 * @type {Settings}
 */
const DEFAULT_SETTINGS: Settings = {
  buildTsconfig:     "./tsconfig.json",
  buildRenaming:     { dirname: "" },
  compileOutput:     "./release",
  coverageReport:    "text",
  declarationOutput: "./release",
  jsonSchemas:       "./gulp-tasks/settings/schema-sources.json",
  jsonSchemasOutput: "json-schemas",
  srcPath:           "./src",
  testsMainFile:     "./tests/index-tests.js",
  testsPath:         "./tests",
  testsTsconfig:     "./tests/tsconfig.json",
  tsLintRules:       "./tslint.json"
};

/**
 * settings for gulp tasks, merging of default settings and, if it exists, external settings file
 * @type {Settings}
 */
export const settings: Settings = Object.assign({}, DEFAULT_SETTINGS, fs.exists(GULP_SETTINGS) ? require(GULP_SETTINGS) || {} : {});


/**
 * gulp-rename option patterns
 */
export interface RenamePath {
  basename?: string;
  dirname?:  string;
  extname?:  string;
  prefix?:   string;
  suffix?:   string;
}

/**
 * defines gulp task settings
 */
export interface Settings {
  buildTsconfig:     string;          // tsconfig for compiling the project
  buildRenaming:     RenamePath;      // optional renaming rules for build
  compileOutput:     string;          // compilation output folder
  coverageReport:    CoverageReport;  // identifies coverage report format
  declarationOutput: string;          // declarations output folder
  jsonSchemas:       string;          // json schema source urls configuration
  jsonSchemasOutput: string;          // json schema output folder
  srcPath:           string;          // source folder
  testsMainFile:     string;          // main test file
  testsPath:         string;          // test source folder
  testsTsconfig:     string;          // tsconfig for compiling tests
  tsLintRules:       string;          // tslint rules file
}

/**
 * defines the child_process.exec callback signature
 */
export interface  ChildProcessExecCallback {
  (error: Error, stdout: string, stderr: string): void;
}

/**
 * tap --coverage-report values
 */
export type CoverageReport = "clover" | "cobertura" | "html" | "json" | "json-summary" | "teamcity" | "text" | "text-lcov" | "text-summary";

import { Gulp, Task, SetGulpOptions } from "../src/index";

import * as gulp  from "gulp";
import * as tape  from "tape";
import * as sinon from "sinon";

const captureOutput = require("catch-stdout");

tape("setting gulp options", test => {

  test.plan(4);

  test.doesNotThrow(SetGulpOptions, "calling set gulps options without parameters is allowed, though it accomplishes nothing");

  test.doesNotThrow(() => {
    SetGulpOptions({
      allowSpacesInTaskNames: true,
      outputGulpSetup: true
    });
  }, "setting all options is valid");

  test.doesNotThrow(() => {
    SetGulpOptions({
      allowSpacesInTaskNames: true,
    });
  }, "setting only the allowSpacesInTaskName option is valid");

  test.doesNotThrow(() => {
    SetGulpOptions({
      outputGulpSetup: true
    });
  }, "setting only the outputGulpSetup option is valid");

  SetGulpOptions({
    allowSpacesInTaskNames: false,
    outputGulpSetup: false
  });
});

tape("gulp class decorator", test => {

  const stubby = sinon.stub(gulp, "task");

  test.plan(3);

  test.throws(() => Gulp(undefined), "expects an argument");

  test.throws(() => Gulp({} as gulp.Gulp), "expects an instance of gulp");

  test.doesNotThrow(() => Gulp(gulp), "accepts an instance of gulp");

  stubby.restore();
});

tape("task method decorator", test => {

  const TASK_NAME             = "gulp-task";
  const TASK_NAME_WITH_SPACES = TASK_NAME.replace("-", " ");

  const EXPECTED_NAME_WITH_SPACES_MSG = /has spaces/;
  const EXPECTED_PROPERTY_GET_SET_MSG = /^(?=.*static)(?=.*property).*/;
  const EXPECTED_STATIC_METHOD_MSG    = /^(?=.*static)(?!.*property).*/;

  const taskFn     = Task();
  const funcTarget = sinon.stub() as Function;
// ^(?:[^\/]+|\.{0,2})(\/[^\/\*]+)+
  test.plan(9);

  test.doesNotThrow(() => Task(), "can be defined without dependent tasks");

  test.doesNotThrow(() => Task("previous"), "can be defined with a single dependent task");

  test.doesNotThrow(() => Task("previous", "prelude"), "can be defined with multiple dependent tasks");

  test.throws(() => {
    taskFn(funcTarget, TASK_NAME_WITH_SPACES, {} as TypedPropertyDescriptor<Function>);
  }, EXPECTED_NAME_WITH_SPACES_MSG, "spaces in task taskName are not allowed by default");

  SetGulpOptions({
    allowSpacesInTaskNames: true
  });

  test.doesNotThrow(() => {
    taskFn(funcTarget, TASK_NAME_WITH_SPACES, {} as TypedPropertyDescriptor<Function>);
  }, "spaces in task names are allowed with the 'allowSpacesInTaskNames' option set to 'true'");

  SetGulpOptions({
    allowSpacesInTaskNames: false
  });

  test.throws(() => {
    taskFn(funcTarget, TASK_NAME_WITH_SPACES, {} as TypedPropertyDescriptor<Function>);
  }, EXPECTED_NAME_WITH_SPACES_MSG, "switching 'allowSpacesInTaskNames' options to 'false' does not allow spaces in task names");

  test.throws(() => {
    taskFn(funcTarget, TASK_NAME, { get: "getter" } as any);
  }, EXPECTED_PROPERTY_GET_SET_MSG, "decorating a property getter is not allowed");

  test.throws(() => {
    taskFn(funcTarget, TASK_NAME, { set: "setter" } as any);
  }, EXPECTED_PROPERTY_GET_SET_MSG, "decorating a property setter is not allowed");

  test.throws(() => {
    const target = {};

    taskFn(target, TASK_NAME, {} as TypedPropertyDescriptor<Function>);
  }, EXPECTED_STATIC_METHOD_MSG, "decorating an instance method is not allowed");
});

class GulpTasksTesting {

  static other () {}

  static build (done: Function) {
    done();
  }

  static clean () {}
}

tape("gulp task registration", test => {

  let tasks      = [];
  let dependents = [];

  const stubby = sinon.stub(gulp, "task", (name: string, dependentTasks: string[], cb: (done: Function) => void) => {
    tasks.push(name);

    if (dependentTasks) {
      dependents.push(dependentTasks);
    }

    cb(() => {});
  });

  const otherFn    = Task("clean", "build");
  const buildFn    = Task("clean");
  const cleanFn    = Task();
  const descriptor = { target: "GulpFile" };
  const classFn    = Gulp(gulp);

  test.plan(9);

  // noinspection TypeScriptValidateTypes
  classFn(GulpTasksTesting);

  test.deepEquals(tasks, [], "gulp class without tasks");

  cleanFn(GulpTasksTesting, "clean", descriptor);

  tasks = [];

  // noinspection TypeScriptValidateTypes
  classFn(GulpTasksTesting);

  test.deepEquals(tasks, [ "clean" ], "gulp class can have task(s)");
  test.deepEquals(dependents, [], "gulp class with task(s) that do not have dependent tasks");

  buildFn(GulpTasksTesting, "build", descriptor);

  tasks      = [];
  dependents = [];

  // noinspection TypeScriptValidateTypes
  classFn(GulpTasksTesting);

  test.deepEquals(tasks, [ "clean", "build" ], "gulp class can have task(s)");
  test.deepEquals(dependents, [ [ "clean" ] ], "gulp class with a task that have no dependent tasks and a single dependent task");

  // noinspection TypeScriptValidateTypes
  classFn(GulpTasksTesting);

  SetGulpOptions({
    outputGulpSetup: true
  });

  let output = captureOutput();

  tasks      = [];
  dependents = [];

  otherFn(GulpTasksTesting, "other", descriptor);

  // noinspection TypeScriptValidateTypes
  classFn(GulpTasksTesting);

  let gulpOutput: string = output();

  test.deepEquals(tasks, [ "clean", "build", "other" ], "gulp class can have task(s)");
  test.deepEquals(dependents, [ [ "clean" ], [ "clean", "build" ] ], "gulp class with task(s) that have no dependent tasks, a single dependent task and multiple dependent tasks");

  test.deepEquals(
    gulpOutput,
    "GulpTasksTesting defines 3 task(s)\n    clean: run nothing else first\n    build: run clean first\n    other: run [ clean, build ] first\n",
    "can output task configuration with 'outputGulpSetup' option set to 'true'"
  );

  SetGulpOptions({
    outputGulpSetup: false
  });

  output = captureOutput();

  // noinspection TypeScriptValidateTypes
  classFn(GulpTasksTesting);

  test.deepEquals(output(), "", "switching 'outputGulpSetup' option to 'false' suppresses task configuration output");

  stubby.restore();
});

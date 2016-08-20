[![npm version](https://badge.fury.io/js/ts-gulp-tasks.svg)](https://badge.fury.io/js/ts-gulp-tasks)
Master: [![Build Status](https://travis-ci.org/Nejat/ts-gulp-tasks.svg?branch=master)](https://travis-ci.org/Nejat/ts-gulp-tasks)
Develop: [![Build Status](https://travis-ci.org/Nejat/ts-gulp-tasks.svg?branch=develop)](https://travis-ci.org/Nejat/ts-gulp-tasks)

:: [Usage](#usage)
:: [API](#api)
:: [Installation](#installation)
:: [Running Gulp Tasks](#running-gulp-tasks)
<!--
: [Details Explained](#details-explained)
-->

# Write Gulp Tasks with [Typescript](https://www.typescriptlang.org)

Utilize custom
[Decorators](https://www.typescriptlang.org/docs/handbook/decorators.html)
to convert classes and their `static` methods to
[Gulp](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md)
tasks, optionally define dependency tasks, work with existing gulp
[plugin(s)](http://gulpjs.com/plugins/) 
and enjoy `Typescript`'s strongly typed benefits.

## Usage

```typescript
import { Gulp, Task, SetGulpOptions } from "ts-gulp-tasks";

import * as gulp from "gulp";
import * as tsc  from "gulp-typescript";
import * as maps from "gulp-sourcemaps";
import * as lint from "gulp-tslint";

const del = require("del");

SetGulpOptions({
  "allowSpacesInTaskNames": false,
  "outputGulpSetup":        true
});

@Gulp(gulp)
class GulpFile {

  @Task("build")
  static default(done: Function): void {
    done();
  }

  @Task("clean", "tslint-src")
  static build(): NodeJS.ReadableStream {
    let ts = tsc.createProject("tsconfig.json");

    return ts.src()
             .pipe(maps.init())
             .pipe(tsc(ts)).js
             .pipe(maps.write())
             .pipe(gulp.dest("release"));
  }

  @Task()
  static clean(done: Function): void {
    del.sync([ "release\\**\\*" ]);

    done();
  }

  @Task()
  static "tslint-src"(): NodeJS.ReadableStream {
    return gulp.src([ "src\\**\\*.ts" ])
               .pipe(lint({
                  configuration: "tslint.json"
               }))
               .pipe(lint.report());
  }
}
```

## API

[@Gulp](#gulpinstance) class and [@Task](#taskdependenttasks) method
[Decorators](https://www.typescriptlang.org/docs/handbook/decorators.html)
are used to setup gulp tasks. 

### `@Gulp([instance])`

The `@Gulp` class decorator indicates that a `class` contains `Gulp` task(s).

`instance` is a required parameter expecting an instance of `gulp`, to which
[tasks](#taskdependenttasks) are registered.

> ##### _Organizing Gulp Tasks_
> Tasks can be organized across multiple classes and across multiple external
> files.
>
> Use the `import` statement to include externally defined task registrations
> in your `gulpfile.ts`
>
> ```typescript
> import "./gulp-tasks/linting-tasks";
> ```
> _* see this project's_ 
> [`gulpfile.ts`](https://github.com/Nejat/ts-gulp-tasks/blob/master/gulpfile.ts)
> _for an advanced example_

#### `@Task([...dependentTasks])`

The `@Task` decorator registers a class' `static` method as a `Gulp` task.

* `dependentTasks` is an optional list of dependent task names.
* The `@Task` decorator captures and uses the method name as the task's name.
* Use quote marks around the method name to include none standard symbols, such
as _hyphens_.
* Task methods should either call the provided `done` callback `Function`,
return an event `stream` or return a `Promise`.

> as [defined](https://github.com/gulpjs/gulp/blob/master/docs/API.md#gulptaskname--deps--fn)
> by `Gulp` functionality, all dependent tasks execute asynchronously

> using `@Task` on a `static` method of class not decorated with `@Gulp` will
> fail to register the method as a `Gulp` task. 

#### `SetGulpOptions([options])`

Use the `SetGulpOptions` method to set `ts-gulp-tasks` options.

`options` is an `object` literal, that defines the following options

* `allowSpacesInTaskNames`, defaults to _false_, if set to _true_ allows spaces
in task names
* `outputGulpSetup`, defaults to _false_, if set to _true_ output's all tasks,
including dependent tasks, to _`stdout`_.

> `outputGulpSetup: true` _example output ..._
> ```
> GulpFile defines 3 task(s)
>     clean: run nothing else first
>     build: run clean first
>     clean-test: run nothing else first
>     test: run [ clean-test, build ] first
> ```

> _* use_ `SetGulpOptions` _before the first_ `@Gulp` _class definition or an
> import which contains external definitions._

## Installation

Use the following `npm` command line, in the root folder of your project, to
install the `ts-gulp-tasks` package locally and save it as a dev dependency
in your project's `packages.json`.

```
<your-app-root> $ npm i -D ts-gulp-tasks
```

## Running Gulp Tasks

Use Gulp's support for [LiftOff](https://github.com/js-cli/js-liftoff)
and [Interpret](https://github.com/js-cli/js-interpret), which uses a local
installation of [ts-node](https://www.npmjs.com/package/ts-node), to
interpret and run `Typescript` code in [`Node`](https://nodejs.org).

You need to do two things to get this working:

* first, install `ts-node` locally, _it's recommended to save it as a dev
dependency_
* second, ensure the `experimentalDecorators`
[tsconfig](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)
setting is set to _`true`_

voilà ... gulp will work as expected.

```
<your-app-root> $ gulp build
```

### Installing `ts-node`

Use the following `npm` command line, in the root folder of your project, to
install the `ts-node` package locally and save it as a dev dependency
in your project's `packages.json`.

```
<your-app-root> $ npm i -D ts-node
```

> if your project's `tsconfig.json` needs to be different from your `gulpfile.ts`
> configuration, which is highly probable (_this project required it_), `ts-node` can
> be set to use a different configuration file with the `TS_NODE_PROJECT` environment
> variable set to a `gulpfile.ts` specific configurations file. _see this project's
> "build" | "test"_ `npm` _scripts for an_
> [_example_](https://github.com/Nejat/ts-gulp-tasks/blob/master/packages.json).

### WebStorm

The very latest version of [WebStorm](https://www.jetbrains.com/webstorm/),
(_2016.2.2 as of this writing_), has a `Gulp` task runner that automatically recognizes
and supports `gulpfile.ts`, if you have `ts-node` locally installed.

> The only caveat being is you to set `TS_NODE_PROJECT` environment option to point to
> your custom `tsconfig.json`, using the 
> [Gulp Settings](https://www.jetbrains.com/help/webstorm/2016.2/gulp-tool-window.html)
> dialog, _if it differs from your project's configuration file, which it most likely will._

<!--## Details Explained
### How it Works
### Rationalization
#### Choice of `static` Methods
#### Testing `@Decorators`
-->

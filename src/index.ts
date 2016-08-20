import * as gulp from "gulp";

/**
 * type of method name
 */
type MethodName = string;

/**
 * Gulp task registration metadata
 */
interface GulpTask {
  dependentTasks?: string[];
  taskName:        MethodName;
}

/**
 * Gulp class decorator factory for registering a class with gulp tasks
 */
export interface GulpDecorator {
  /**
   * @param instance - an instance of gulp
   */
  (instance: gulp.Gulp): ClassDecorator;
}

/**
 * Task method decorator factory for registering a gulp task
 */
export interface TaskDecorator {
  /**
   * @param dependentTasks - optional, a single or array of strings identifying dependent tasks
   */
  (...dependentTasks: string[]): MethodDecorator;
}

/**
 * Gulp Tasks Options
 */
export interface Options {
  /**
   * default 'false', if set to true allows spaces in task names
   *
   * * spaces are not recommended if gulp is being used a shell commandline
   */
  allowSpacesInTaskNames?: boolean;

  /**
   * default 'false", if set true output's tasks defined, including dependent tasks, to stdout
   */
  outputGulpSetup?:        boolean;
}

/**
 * Option Defaults, see Options interface definition
 * @type {Options}
 */
const DEFAULT_OPTIONS: Options = {
  allowSpacesInTaskNames: false,
  outputGulpSetup:        false
};

/**
 * dictionary of gulp classes and the tasks they define
 * @type {Map<Function, GulpTask[]>}
 */
const gulpTasks: Map<Function, GulpTask[]> = new Map<Function, GulpTask[]>();

/**
 * options used for when registering gulp tasks with decorators
 * @type {Options}
 */
let gulpOptions: Options = DEFAULT_OPTIONS;

/**
 * sets gulp options
 * @param options, optional {Options} parameter
 * @constructor
 */
export const SetGulpOptions: (options?: Options) => void =
  (options?: Options): void => {
    gulpOptions = Object.assign(gulpOptions, options || DEFAULT_OPTIONS);
  };

/**
 * decorator factory for registering a class as gulp task provider
 * @param instance - instance of gulp
 * @returns {ClassDecorator}
 * @constructor
 */
export const Gulp: GulpDecorator =
  (instance: gulp.Gulp): ClassDecorator => {

    if (!instance || !instance.task || typeof instance.task !== "function") {
      throw new Error("An instance of gulp is required!");
    }

    // noinspection JSUnusedLocalSymbols
    return (target: Function): void => {

      if (gulpTasks.has(target)) {

        const tasks: GulpTask[] = gulpTasks.get(target);

        if (gulpOptions.outputGulpSetup) {
          console.log(`${target.name} defines ${tasks.length} task(s)`);
        }

        tasks.forEach((task: GulpTask): void => {

          instance.task(task.taskName,
                        task.dependentTasks.length > 0 ? task.dependentTasks : undefined,
                        (done?: Function) => {
                          return target[task.taskName](done);
                        });

          if (gulpOptions.outputGulpSetup) {
            const toString: (tasks: string[]) => string =
              (tasks: string[]): string =>
                tasks && tasks.length > 1 ? `[ ${tasks.join(", ")} ]` : tasks[0];

            console.log(`    ${task.taskName}: run ${task.dependentTasks.length > 0 ? toString(task.dependentTasks) : "nothing else"} first`);
          }
        });
      }
    };
};

/**
 * decorator factory for registering a class' static method as a task
 * @param dependentTasks {DependentTasks} - optional list of dependent tasks
 * @returns {MethodDecorator}
 * @constructor
 */
export const Task: TaskDecorator = (...dependentTasks: string[]): MethodDecorator => {

  return (target: Function, taskName: MethodName, descriptor: TypedPropertyDescriptor<Function>): void => {
      if (!gulpOptions.allowSpacesInTaskNames && /\s/.test(taskName)) {
      throw new Error(`Task '${taskName}' has spaces, which is not recommended for gulp task names. See GulpOptions to allow spaces.`);
    }

    if (descriptor && descriptor.get || descriptor.set) {
      throw new Error(`Task '${taskName}' can not be a property getter or setter, it must be a static method!`);
    }

    if (!(target instanceof Function)) {
      throw new Error(`Task '${taskName}' must be a static method!`);
    }

    if (!gulpTasks.has(target)) {
      gulpTasks.set(target, []);
    }

    gulpTasks.get(target).push({
      dependentTasks,
      taskName
    });
  };
};

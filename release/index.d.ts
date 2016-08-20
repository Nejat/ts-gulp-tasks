import * as gulp from "gulp";
export interface GulpDecorator {
    (instance: gulp.Gulp): ClassDecorator;
}
export interface TaskDecorator {
    (...dependentTasks: string[]): MethodDecorator;
}
export interface Options {
    allowSpacesInTaskNames?: boolean;
    outputGulpSetup?: boolean;
}
export declare const SetGulpOptions: (options?: Options) => void;
export declare const Gulp: GulpDecorator;
export declare const Task: TaskDecorator;

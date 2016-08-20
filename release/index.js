"use strict";
const DEFAULT_OPTIONS = {
    allowSpacesInTaskNames: false,
    outputGulpSetup: false
};
const gulpTasks = new Map();
let gulpOptions = DEFAULT_OPTIONS;
exports.SetGulpOptions = (options) => {
    gulpOptions = Object.assign(gulpOptions, options || DEFAULT_OPTIONS);
};
exports.Gulp = (instance) => {
    if (!instance || !instance.task || typeof instance.task !== "function") {
        throw new Error("An instance of gulp is required!");
    }
    return (target) => {
        if (gulpTasks.has(target)) {
            const tasks = gulpTasks.get(target);
            if (gulpOptions.outputGulpSetup) {
                console.log(`${target.name} defines ${tasks.length} task(s)`);
            }
            tasks.forEach((task) => {
                instance.task(task.taskName, task.dependentTasks.length > 0 ? task.dependentTasks : undefined, (done) => {
                    return target[task.taskName](done);
                });
                if (gulpOptions.outputGulpSetup) {
                    const toString = (tasks) => tasks && tasks.length > 1 ? `[ ${tasks.join(", ")} ]` : tasks[0];
                    console.log(`    ${task.taskName}: run ${task.dependentTasks.length > 0 ? toString(task.dependentTasks) : "nothing else"} first`);
                }
            });
        }
    };
};
exports.Task = (...dependentTasks) => {
    return (target, taskName, descriptor) => {
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
//# sourceMappingURL=index.js.map
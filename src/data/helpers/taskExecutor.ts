import { ResponseError } from "./tryFetch";

export abstract class Task {
  isCanceled: boolean;
  constructor() {
    this.isCanceled = false;
  }

  abstract run(): Promise<void>;
  cancel() {
    this.isCanceled = true;
  }
}

export class TaskExecutor {
  taskList: Array<Task>;
  cleanUpOnFailTask?: () => Promise<void>;
  constructor(taskList: Array<Task>, cleanUpOnFailTask?: () => Promise<void>) {
    this.taskList = taskList;
    this.cleanUpOnFailTask = cleanUpOnFailTask;
  }

  private recurse = async (taskList: Array<Task>, position = 0) => {
    if (position < taskList.length) {
      const currentTask = taskList[position];

      if (currentTask.isCanceled) {
        return;
      }
      await currentTask.run();

      await this.recurse(taskList, (position = position + 1));
    }
  };

  async execute(): Promise<void | ResponseError> {
    try {
      await this.recurse(this.taskList);
    } catch (error) {
      await this.cancel();
      return error;
    }
  }

  async cancel(): Promise<void> {
    this.taskList.forEach((task) => task.cancel());

    if (this.cleanUpOnFailTask) {
      await this.cleanUpOnFailTask();
    }
  }
}

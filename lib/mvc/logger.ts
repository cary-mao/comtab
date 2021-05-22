interface TaskLog {
  name: string;
  logs: Array<Array<any>>;
}

export default class Logger {
  tasks: Array<TaskLog> = [];
  currTask: string;
  currIdx: number = -1;
  immediate: boolean = false;
  record (name: string, log: Array<any>) {
    if (this.currTask === name) {
      this.tasks[this.tasks.length - 1].logs.push(log);
    } else {
      // log auto
      if (this.immediate && this.currIdx >= 0) {
        this.log(this.currIdx);
      }

      this.currTask = name;
      this.tasks.push({name, logs: [log]});
      this.currIdx++;
    }
  }
  log (idx: number) {
    // Reflect.apply(console.log, console, this.tasks[idx].logs);
    this.tasks[idx].logs.forEach(log => Reflect.apply(console.log, console, log));
  }
  scopeLog (start = 0, end = this.tasks.length) {
    while (start < end) {
      console.log(
        `%c task ${start}: %c ${this.tasks[start].name} `,
        'color: red; weight: bold',
        'color: blue'
      );
      console.log('%c -------------------------- ', 'color: orange');
      this.log(start);
      console.log('%c -------------------------- ', 'color: orange');
      console.log('\n\n')
      start++;
    }
  }
}
import DataProxy from './DataProxy';
import Logger from './mvc/logger';
import Panel from './panel/Panel';
import PanelTab from './tab/PanelTab';

type ACCEPT_TYPES = 'insertPanelToTabHeader';

type SharedDataType = 'init' | 'tmpPanelFromTabDrag' | ACCEPT_TYPES;

interface SharedData {
  type: SharedDataType;
  panel?: Panel;
  tab?: PanelTab;
  task: string;
  readonly debugger: boolean;
}

const data: SharedData = {
  task: 'init',
  type: 'init',
  // @ts-ignore
  debugger: import.meta.env.NODE === 'development'
};

export const logger = new Logger();

class SharedDataProxy extends DataProxy<SharedData> {
  setTask (task: string) {
    this.value.task = task;
  }
  // resetTask () {
  //   this.value.task = 'init';
  // }
  resetWithoutTask () {
    const task = this.value.task;
    this.reset();
    this.setTask(task);
  }
}

export default new SharedDataProxy(data);
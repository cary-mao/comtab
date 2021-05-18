import DataProxy from './DataProxy';
import Panel from './panel/Panel';
import PanelTab from './tab/PanelTab';

type SharedDataType = 'init' | 'tmpPanelFromTabDrag';

interface SharedData {
  type: SharedDataType;
  panel?: Panel;
  tab?: PanelTab;
}

const data: SharedData = {
  type: 'init'
}

export default new DataProxy(data);
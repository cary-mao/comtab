import { pull } from 'lodash';
import ModelEvent from '../mvc/events/ModelEvent';
import Model from '../mvc/Model';
import PanelTab from '../tab/PanelTab';
import { merge, genId, isDef } from '../utils';
import Panel from './Panel';
import PanelView from './PanelView';

interface PanelState {
  id: string;
  position: Position;
  actived: boolean;
  zIndex: number;
  tabs: Array<PanelTab>;
  handleVisible: boolean;
  _tabSplitEnabled: boolean;
  _dragEnabled: boolean;
  _clickActivateEnabled: boolean;
  _headerSplitEnabled: boolean;
  width: number;
  height: number;
  groupIdxes: [number, number];
}

export interface Position {
  left: number;
  top: number;
}

export interface PanelOptions {
  position?: Position;
  zIndex?: number;
  actived?: boolean;
  tabs?: Array<PanelTab>;
  width?: number;
  height?: number;
  groupIdxes?: [number, number];
}

export default class PanelModel extends Model {
  setGroupIdxes(idxes: [number, number]) {
    this._state.groupIdxes = idxes;
  }
  setHandleVisible(visible: boolean) {
    this._state.handleVisible = visible;
    this.notify(new ModelEvent(false), 'setHandleVisible', visible);
  }
  protected _view: PanelView;
  setSize(size: { width?: number; height?: number }) {
    this._view.setSize(size);
  }
  setZIndex(zIndex: number) {
    this._state.zIndex = zIndex;
    this.notify(new ModelEvent(false), 'setZIndex', zIndex);
  }
  private _state: PanelState = {
    id: genId('panel'),
    position: { left: 0, top: 0 },
    zIndex: 0,
    actived: false,
    tabs: [],
    handleVisible: true,
    _tabSplitEnabled: true,
    _dragEnabled: true,
    _clickActivateEnabled: true,
    _headerSplitEnabled: false,
    width: 200,
    height: 200,
    groupIdxes: null
  };
  host: Panel;

  constructor(opts: PanelOptions, host: Panel) {
    super();
    merge(this._state, opts);
    this.host = host;
  }

  setPosition(position) {
    merge(this._state.position, position);
    this.notify(new ModelEvent(false), 'setPanelPosition', this._state.position);
  }

  activate() {
    this._state.actived = true;
    this.notify(new ModelEvent(), 'activatePanel', this.host);
  }

  deactivate() {
    this._state.actived = false;
    this.notify(new ModelEvent(), 'deactivatePanel');
  }

  deleteTab(tab: PanelTab) {
    pull(this._state.tabs, tab);
    this.notify(new ModelEvent(), 'deleteTab', { tab });
  }

  addTabs(...tabs: Array<PanelTab>) {
    this._state.tabs = this._state.tabs.concat(tabs);
    this.notify(new ModelEvent(false), 'addTabs', tabs);
  }

  toggleTabSplitEvent(enable?: boolean) {
    this._state._tabSplitEnabled = isDef(enable) ? enable : !this._state._tabSplitEnabled;
    this.notify(new ModelEvent(false), 'toggleTabSplitEvent', this._state._tabSplitEnabled);
  }

  toggleDragEvent(enable?: boolean) {
    this._state._dragEnabled = isDef(enable) ? enable : !this._state._dragEnabled;
    this.notify(new ModelEvent(false), 'togglePanelDragEvent', this._state._dragEnabled);
  }

  toggleClickActivateEnabled(enable?: boolean) {
    this._state._clickActivateEnabled = isDef(enable) ? enable : !this._state._clickActivateEnabled;
    this.notify(new ModelEvent(false), 'toggleClickActivateEnabled', this._state._clickActivateEnabled);
  }

  toggleHeaderSplitEnabled(enable?: boolean) {
    this._state._headerSplitEnabled = isDef(enable) ? enable : !this._state._headerSplitEnabled;
    this.notify(new ModelEvent(false), 'toggleHeaderSplitEnabled', this._state._headerSplitEnabled);
  }

  getState() {
    return this._state;
  }
}

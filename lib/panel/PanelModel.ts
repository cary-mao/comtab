import { pull } from 'lodash';
import ModelEvent from '../mvc/events/ModelEvent';
import Model from '../mvc/Model';
import PanelTab from '../tab/PanelTab';
import { merge, genId, isDef } from '../utils';
import Panel from './Panel';

interface PanelState {
  id: string;
  position: Position;
  actived: boolean;
  zIndex: number;
  tabs: Array<PanelTab>;
  _tabSplitEnabled: boolean;
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
}

export default class PanelModel extends Model {
  setZIndex(zIndex: number) {
    this._state.zIndex = zIndex;
    this.notify(new ModelEvent(false), 'setZIndex', zIndex);
  }
  private _state: PanelState = {
    id: genId('panel'),
    position: {left: 0, top: 0},
    zIndex: 0,
    actived: false,
    tabs: [],
    _tabSplitEnabled: true
  };
  host: Panel;

  constructor (opts: PanelOptions, host: Panel) {
    super();
    merge(this._state, opts);
    this.host = host;
  }

  setPosition (position) {
    merge(this._state.position, position);
    this.notify(new ModelEvent(false), 'setPanelPosition', this._state.position);
  }

  activate () {
    this._state.actived = true;
    this.notify(new ModelEvent(), 'activatePanel', this.host);
  }

  deactivate () {
    this._state.actived = false;
    this.notify(new ModelEvent(), 'deactivatePanel');
  }

  deleteTab(tab: PanelTab) {
    pull(this._state.tabs, tab);
    this.notify(new ModelEvent(), 'deleteTab', {tab});
  }

  toggleTabSplitEvent (enable?: boolean) {
    this._state._tabSplitEnabled = isDef(enable) ? enable : !this._state._tabSplitEnabled;
    this.notify(new ModelEvent(false), 'toggleTabSplitEvent', this._state._tabSplitEnabled);
  }

  getState () {
    return this._state;
  }
}
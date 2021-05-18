import ModelEvent from '../mvc/events/ModelEvent';
import Model from '../mvc/Model';
import { merge } from '../utils';
import PanelTab from './PanelTab';
import PanelTabView from './PanelTabView';

export interface PanelTabState extends PanelTabOptions {
  actived: boolean;
  _tabHandleEnabled: boolean;
}

export interface PanelTabOptions {
  btnText: string;
  content: HTMLElement | string;
  actived?: boolean;
}

export default class PanelTabModel extends Model {
  protected _view!: PanelTabView;
  host!: PanelTab;
  private _state: PanelTabState = {
    btnText: 'btn',
    content: '<p>This is content.<p>',
    actived: false,
    _tabHandleEnabled: false
  };

  constructor (opts: PanelTabOptions, host: PanelTab) {
    super();
    merge(this._state, opts);
    this.host = host; 
  }

  toggleTabHandleEvent(enable: boolean) {
    if (this._state._tabHandleEnabled !== enable) {
      this._state._tabHandleEnabled = enable;
      this.notify(new ModelEvent(false), 'toggleTabHandleEvent', enable);
    }
  }

  activate (event: ModelEvent = new ModelEvent()) {
    if (!this._state.actived) {
      this._state.actived = true;
      this.notify(event, 'activateTab', {targetModel: this});
    }
  }

  deactivate (event: ModelEvent = new ModelEvent()) {
    this._state.actived = false;
    this.notify(event, 'deactivateTab');
  }

  getState () {
    return this._state;
  }
}
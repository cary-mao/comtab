import PanelGroup from "../group/PanelGroup";
import ModelEvent from "../mvc/events/ModelEvent";
import Model from "../mvc/Model";
import Panel from "../panel/Panel";
import { pull, merge } from "../utils";

export interface PanelStageState {
  panels: Array<Panel>;
  groups: Array<PanelGroup>;
  stage: string | HTMLElement;
}

export interface PanelStageOptions {
  panels?: Array<Panel>;
  groups?: Array<PanelGroup>;
  stage?: string | HTMLElement;
}

export default class PanelStageModel extends Model {
  private _state: PanelStageState = {
    panels: [],
    groups: [],
    stage: 'body'
  };

  constructor (state: PanelStageOptions) {
    super();
    merge(this._state, state);
    // init components
  }

  getState () {
    return this._state;
  }

  addPanel (panel: Panel) {
    this._state.panels.push(panel);
    this.notify(new ModelEvent(false), 'addPanel', panel);
  }

  deletePanel (panel: Panel) {
    pull(this._state.panels, panel);
    this.notify(new ModelEvent(false), 'deletePanel', panel);
  }
}
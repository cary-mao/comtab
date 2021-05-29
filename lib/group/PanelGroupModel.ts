import ModelEvent from "../mvc/events/ModelEvent";
import Model from "../mvc/Model";
import Panel from "../panel/Panel";
import { Position } from "../panel/PanelModel";
import { genId, merge } from "../utils";
import PanelGroup from "./PanelGroup";
import PanelGroupView from "./PanelGroupView";

type GroupMatrix = Array<Array<Panel>>;

interface PanelGroupState {
  id: string;
  matrix: GroupMatrix;
  position: Position;
  autoPos: boolean; // if true, change position auto.
  zIndex: number;
}

export interface PanelGroupOptions {
  matrix?: GroupMatrix;
  position?: Position;
  autoPos?: boolean;
}

export default class PanelGroupModel extends Model {
  private _state: PanelGroupState = {
    matrix: [],
    position: null,
    autoPos: true,
    id: genId('panelGroup'),
    zIndex: 0
  };
  protected _view: PanelGroupView;
  host: PanelGroup;

  constructor (opts: PanelGroupOptions, host: PanelGroup) {
    super()
    this.host = host;
    merge(this._state, opts);
  }

  setZIndex (zIndex: number) {
    this._state.zIndex = zIndex;
    this.notify(new ModelEvent(false), 'setZIndex', zIndex);
  }

  getState () {
    return this._state;
  }
}
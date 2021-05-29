import PanelStage from "../stage/PanelStage";
import PanelGroupController from "./PanelGroupController";
import PanelGroupModel, { PanelGroupOptions } from "./PanelGroupModel";
import PanelGroupView from "./PanelGroupView";

export default class PanelGroup {
  _model: PanelGroupModel;
  _view: PanelGroupView;
  _controller: PanelGroupController;

  constructor (opts: PanelGroupOptions) {
    this._model = new PanelGroupModel(opts, this);
    this._view = new PanelGroupView(this);
    this._controller = new PanelGroupController(this._model, this._view, this);
    this._init();
  }

  private _init () {
    const state = this._model.getState();
    this._view.create();

    state.matrix.forEach(r => r.forEach(c => {
      c._controller.setParent(this._controller);
    }));
  }

  get state () {
    return this._model.getState();
  }

  setZIndex (zIndex: number) {
    this._model.setZIndex(zIndex);
  }
}
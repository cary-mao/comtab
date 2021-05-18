import PanelController from "../panel/PanelController";
import PanelTabController from "./PanelTabController";
import PanelTabModel, { PanelTabOptions } from "./PanelTabModel";
import PanelTabView from "./PanelTabView";

export default class PanelTab {
  _model: PanelTabModel;
  _view: PanelTabView;
  _controller: PanelTabController;
  
  constructor (state: PanelTabOptions) {
    this._model = new PanelTabModel(state, this);
    this._view = new PanelTabView(this);
    this._controller = new PanelTabController(this._model, this._view, this);
    this._init();
  }

  private _init () {
    const state = this._model.getState();
    this._view.create(state);
  }

  getParent () {
    return (this._controller.getParent() as PanelController).host;
  }

  static copy (tab: PanelTab) {
    return new PanelTab(tab._model.getState());
  }
}
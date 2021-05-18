import Panel from '../panel/Panel';
import PanelStageController from './PanelStageController';
import PanelStageModel, { PanelStageOptions } from './PanelStageModel';
import PanelStageView from './PanelStageView';

export default class PanelStage {
  private _model: PanelStageModel;
  private _view: PanelStageView;
  private _controller: PanelStageController;
  private _stage: JQuery;
  
  constructor (state: PanelStageOptions) {
    this._model = new PanelStageModel(state);
    this._view = new PanelStageView();
    this._controller = new PanelStageController(this._model, this._view);
    this._init();
  }

  addPanel (panel: Panel) {
    this._model.addPanel(panel);
  }

  deletePanel (panel: Panel) {
    this._model.deletePanel(panel);
  }

  private _init () {
    const state = this._model.getState();
    this._view.create(state);
    state.panels.forEach(p => p._controller.setParent(this._controller));
  }
}

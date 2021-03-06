import PanelGroup from '../group/PanelGroup';
import Panel from '../panel/Panel';
import PanelLayer from './PanelLayer';
import PanelStageController from './PanelStageController';
import PanelStageModel, { PanelStageOptions } from './PanelStageModel';
import PanelStageView from './PanelStageView';

export default class PanelStage {
  deleteGroup(host: PanelGroup) {
    this._model.deleteGroup(host);
  }
  private _model: PanelStageModel;
  private _view: PanelStageView;
  private _controller: PanelStageController;
  panelLayer: PanelLayer = new PanelLayer();

  constructor(state: PanelStageOptions) {
    this._model = new PanelStageModel(state);
    this._view = new PanelStageView();
    this._controller = new PanelStageController(this._model, this._view, this);
    this._init();
  }

  addPanel(panel: Panel) {
    this._model.addPanel(panel);
  }

  deletePanel(panel: Panel) {
    this._model.deletePanel(panel);
  }

  private _init() {
    const state = this._model.getState();
    this._view.create(state);
    state.panels.forEach((p) => {
      p._controller.setParent(this._controller);
      this.panelLayer.add(p);
    });
    state.groups.forEach((g) => {
      g._controller.setParent(this._controller);
      // remove the panel from panelLayer
      // and add group in panelLayer
      g.state.matrix.forEach((r) => r.forEach((c) => this.panelLayer.remove(c)));
      this.panelLayer.add(g);
    });
  }
}

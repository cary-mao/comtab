import PanelGroupController from '../group/PanelGroupController';
import PanelController from '../panel/PanelController';
import PanelStageController from '../stage/PanelStageController';
import { cloneDeep } from '../utils';
import PanelTabController from './PanelTabController';
import PanelTabModel, { PanelTabOptions } from './PanelTabModel';
import PanelTabView from './PanelTabView';

export default class PanelTab {
  _model: PanelTabModel;
  _view: PanelTabView;
  _controller: PanelTabController;

  constructor(state: PanelTabOptions) {
    this._model = new PanelTabModel(state, this);
    this._view = new PanelTabView(this);
    this._controller = new PanelTabController(this._model, this._view, this);
    this._init();
  }

  private _init() {
    const state = this._model.getState();
    this._view.create(state);
  }

  getParent() {
    return (this._controller.getParent() as PanelController).host;
  }

  getPanelLayer() {
    let groupOrStageController = this._controller.getParent().getParent();
    if (groupOrStageController instanceof PanelGroupController) {
      groupOrStageController = groupOrStageController.getParent();
    }
    return (groupOrStageController as PanelStageController).host.panelLayer;
  }

  static copy(tab: PanelTab) {
    return new PanelTab(cloneDeep(tab._model.getState()));
  }
}

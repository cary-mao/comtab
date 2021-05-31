import Controller from '../mvc/Controller';
import ModelEvent from '../mvc/events/ModelEvent';
import ViewEvent from '../mvc/events/ViewEvent';
import PanelStageController from '../stage/PanelStageController';
import PanelGroup from './PanelGroup';
import PanelGroupModel from './PanelGroupModel';
import PanelGroupView from './PanelGroupView';

export default class PanelGroupController extends Controller {
  protected _view: PanelGroupView;
  protected _model: PanelGroupModel;
  host: PanelGroup;
  _parent: PanelStageController;

  constructor(model: PanelGroupModel, view: PanelGroupView, host: PanelGroup) {
    super(model, view);
    this.host = host;
  }

  dispatchModel(event: ModelEvent, type: string, payload) {
    if (type === 'setZIndex') {
      this._view.setZIndex(payload);
    } else if (type === 'deletePanel') {
      this._view.deletePanel(payload);

      const state = this._model.getState();
      // if only one panel in matrix
      if (state.matrix.length === 1 && state.matrix[0].length === 1) {
        this._view.freePanel(state.matrix[0][0]);
        this._parent.host.deleteGroup(this.host);
      }
    }
  }
  dispatchView(event: ViewEvent, ...args: any[]) {
    throw new Error('Method not implemented.');
  }
}

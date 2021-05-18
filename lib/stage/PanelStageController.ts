import Controller from "../mvc/Controller";
import ModelEvent from "../mvc/events/ModelEvent";
import ViewEvent from "../mvc/events/ViewEvent";
import PanelStageModel, { PanelStageOptions } from "./PanelStageModel";
import PanelStageView from "./PanelStageView";

export default class PanelStageController extends Controller {
  protected _model!: PanelStageModel;
  protected _view: PanelStageView;

  dispatchModel (event: ModelEvent, type: string, payload) {
    if (type === 'addPanel') {
      this._view.addPanel(payload);
    } else if (type === 'deletePanel') {
      this._view.deletePanel(payload);
    }
  }
  
  dispatchView (event: ModelEvent, args) {
   
  }
}
import Controller from "../mvc/Controller";
import ModelEvent from "../mvc/events/ModelEvent";
import ViewEvent from "../mvc/events/ViewEvent";
import PanelGroup from "./PanelGroup";
import PanelGroupModel from "./PanelGroupModel";
import PanelGroupView from "./PanelGroupView";

export default class PanelGroupController extends Controller {
  protected _view: PanelGroupView;
  host: PanelGroup;

  constructor (model: PanelGroupModel, view: PanelGroupView, host: PanelGroup) {
    super(model, view);
    this.host = host;
  }

  dispatchModel(event: ModelEvent, type: string, payload) {
    if (type === 'setZIndex') {
      this._view.setZIndex(payload);
    }
  }
  dispatchView(event: ViewEvent, ...args: any[]) {
    throw new Error("Method not implemented.");
  }

}
import Controller from "../mvc/Controller";
import ModelEvent from "../mvc/events/ModelEvent";
import ViewEvent from "../mvc/events/ViewEvent";
import Panel from "../panel/Panel";
import PanelController from "../panel/PanelController";
import PanelModel from "../panel/PanelModel";
import PanelView from "../panel/PanelView";
import PanelTab from "./PanelTab";
import PanelTabModel from "./PanelTabModel";
import PanelTabView from "./PanelTabView";
import ShareData from '../share';

export default class PanelTabController extends Controller {
  protected _view!: PanelTabView;
  protected _model!: PanelTabModel;
  protected _parent!: PanelController;
  host!: PanelTab;

  constructor (model: PanelTabModel, view: PanelTabView, host: PanelTab) {
    super(model, view);
    this.host = host;
  }

  dispatchModel(event: ModelEvent, type: string, payload) {
    if (type === 'deactivateTab') {
      this._view.deactivate();
      return;
    }
    // activateTab is executed by panel when it existed.
    if (type === 'activateTab' && !this._parent) {
      this._view.activate();
      return;
    }
    if (type === 'toggleTabHandleEvent') {
      this._view.toggleTabHandleEvent(payload);
      event.stopPropagation();
    }
  }
  dispatchView(event: ViewEvent, ...args: any[]) {
    throw new Error("Method not implemented.");
  }
}
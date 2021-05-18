import Controller from "../mvc/Controller";
import ModelEvent from "../mvc/events/ModelEvent";
import ViewEvent from "../mvc/events/ViewEvent";
import PanelTab from "../tab/PanelTab";
import Panel from "./Panel";
import PanelModel, { Position } from "./PanelModel";
import PanelView from "./PanelView";

export default class PanelController extends Controller {
  protected _model!: PanelModel;
  protected _view!: PanelView;
  host!: Panel;

  constructor (model: PanelModel, view: PanelView, host: Panel) {
    super(model, view);
    this.host = host;
  }

  dispatchModel(event: ModelEvent, type: string, payload) {
    // console.log(event, type, args)
    // console.log(arguments)
    // console.log(type)
    if (type === 'activateTab') {
      const targetModel = payload.targetModel;
      this._model.getState().tabs.forEach(t => {
        // debugger
        const model = t._model;
        const isActived = model.getState().actived;
        const isTarget = targetModel === model;
        if (isTarget) {
          t._view.activate();
        } else if (isActived) {
          model.deactivate(new ModelEvent(false));
        }
      });

      event.stopPropagation();
    } else if (type === 'deleteTab') {
      const tab = payload.tab as PanelTab;
      tab._view.remove();
    } else if (type === 'setPanelPosition') {
      this._view.setPosition(payload);
    } else if (type === 'toggleTabSplitEvent') {
      this._view.setTabSplitEvent(payload);
    }
  }
  dispatchView(event: ViewEvent, ...args: any[]) {
    throw new Error("Method not implemented.");
  }
  getModel () {
    return this._model;
  }
}
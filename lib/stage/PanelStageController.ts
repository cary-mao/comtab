import Controller from "../mvc/Controller";
import ModelEvent from "../mvc/events/ModelEvent";
import Panel from "../panel/Panel";
import PanelStage from "./PanelStage";
import PanelStageModel from "./PanelStageModel";
import PanelStageView from "./PanelStageView";
import ShareData from '../share';
import PanelController from "../panel/PanelController";

export default class PanelStageController extends Controller {
  protected _model!: PanelStageModel;
  protected _view: PanelStageView;
  host!: PanelStage;

  constructor (model: PanelStageModel, view: PanelStageView, host: PanelStage) {
    super(model, view);
    this.host = host;
  }

  dispatchModel (event: ModelEvent, type: string, payload) {
    if (type === 'addPanel') {
      this.host.panelLayer.add(payload);
      (payload as Panel)._controller.setParent(this);
      this._view.addPanel(payload);
    } else if (type === 'deletePanel') {
      this.host.panelLayer.remove(payload);
      this._view.deletePanel(payload);
    } else if (type === 'activatePanel') {
      this.host.panelLayer.activate(payload);
    }
  }
  
  dispatchView (event: ModelEvent, type: string, payload) {
    if (type === 'tmpPanelFromTabDrop') {
      const originPanel = ShareData.value.tab.getParent();
      // delete origin tab
      originPanel.deleteTab(ShareData.value.tab);
      // create new elements of newPanel
      // setTimeout(() => {
      ShareData.value.panel._view.create();
      ShareData.value.panel.setPosition(payload.offset);
      originPanel._view.refreshTabSplitEvent();
      this._model.addPanel(ShareData.value.panel);
      // })
      // reset the type
      // ShareData.resetWithoutTask();
      // ShareData.value.type = 'init'
    }
  }
}
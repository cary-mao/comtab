import PanelGroupController from "../group/PanelGroupController";
import Controller from "../mvc/Controller";
import ModelEvent from "../mvc/events/ModelEvent";
import ViewEvent from "../mvc/events/ViewEvent";
import ShareData from "../share";
import PanelStageController from "../stage/PanelStageController";
import PanelTab from "../tab/PanelTab";
import Panel from "./Panel";
import PanelModel, { Position } from "./PanelModel";
import PanelView from "./PanelView";

export default class PanelController extends Controller {
  protected _model!: PanelModel;
  protected _view!: PanelView;
  protected _parent!: PanelStageController | PanelGroupController;
  host!: Panel;

  constructor (model: PanelModel, view: PanelView, host: Panel) {
    super(model, view);
    this.host = host;
  }

  dispatchModel(event: ModelEvent, type: string, payload) {
    // activatePanel is executed by stage
    if (type === 'activateTab') {
      this._model.getState().tabs.forEach(t => {
        // debugger
        const model = t._model;
        const isActived = model.getState().actived;
        const isTarget = payload === model;
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

      if (tab._model.getState().actived) {
        this._model.getState().tabs[0]._model.activate();
      }

      event.stopPropagation();
    } else if (type === 'setPanelPosition') {
      this._view.setPosition(payload);
      event.stopPropagation();
    } else if (type === 'toggleTabSplitEvent') {
      this._view.setTabSplitEvent(payload);
    } else if (type === 'togglePanelDragEvent') {
      this._view.setDragEvent(payload);
    } else if (type === 'toggleClickActivateEnabled') {
      this._view.setClickActivateEvent(payload);
    } else if (type === 'setZIndex') {
      this._view.setZIndex(payload);
    } else if (type === 'addTabs') {
      (payload as Array<PanelTab>).forEach(t => {
        t._controller.setParent(this);
      });
      this._view.addTabs(payload);
      this._model.toggleTabSplitEvent(this._model.getState().tabs.length > 1);
      event.stopPropagation();
    } else if (type === 'setHandleVisible') {
      this._view.setHandleVisble(payload);
    }
  }
  dispatchView(event: ViewEvent, type: string, payload) {
    if (type === 'panelDragStart') {
      ShareData.value.panel = payload;
    } else if (type === 'insertPanelToTabHeader') {
      const draggingPanel = ShareData.value.panel as Panel;

      if (this._parent instanceof PanelStageController) {
        this._parent.host.deletePanel(draggingPanel);
      } else if (this._parent instanceof PanelGroupController) {
        this._parent._parent.host.deletePanel(draggingPanel);
      }
      
      draggingPanel.state.tabs.forEach(t => {
        t._model.deactivate(new ModelEvent(false));
        t._view.create();
      });
      // ShareData.resetWithoutTask();
      Reflect.apply(this._model.addTabs, this._model, draggingPanel.state.tabs);
      
      event.stopPropagation();
    } else if (type === 'insertTmpPanelToTabHeader') {
      const originPanel = ShareData.value.tab.getParent();
      originPanel.deleteTab(ShareData.value.tab);
      ShareData.value.panel._view.create();
      ShareData.value.panel.setPosition(payload.offset);
      originPanel._view.refreshTabSplitEvent();
      ShareData.value.panel.state.tabs.forEach(t => {
        t._model.deactivate(new ModelEvent(false));
        t._view.create();
      });
      
      Reflect.apply(this._model.addTabs, this._model, ShareData.value.panel.state.tabs);
      event.stopPropagation();
    }
  }
  getModel () {
    return this._model;
  }
}
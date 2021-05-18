import CLASSES from "../classes";
import View from "../mvc/View";
import Panel from "../panel/Panel";
import PanelController from "../panel/PanelController";
import ShareData from "../share";
import PanelStageModel, { PanelStageState } from "./PanelStageModel";

export default class PanelStageView extends View {
  private _$wrapper: JQuery;
  protected _model: PanelStageModel;

  create (state: PanelStageState) {
    this._$wrapper = $(state.stage as JQuery.PlainObject).addClass(CLASSES.STAGE);
    state.panels.forEach(p => this.addPanel(p));

    this.bindEvents();
  }

  addPanel (panel: Panel) {
    this._$wrapper.append(panel._view.getElements().wrapper);
  }

  deletePanel (panel: Panel) {

  }

  bindEvents () {
    this._$wrapper.droppable({
      drop: (event, ui) => {
        const type = ShareData.value.type;
        if (type === 'tmpPanelFromTabDrag') {
          // delete origin tab
          ShareData.value.tab.getParent().deleteTab(ShareData.value.tab);
          // create new elements of newPanel
          // setTimeout(() => {
          ShareData.value.panel._view.create();
          ShareData.value.panel.setPosition(ui.offset);
          (ShareData.value.tab._controller.getParent() as PanelController).host.refreshTabSplitEvent();
          this._model.addPanel(ShareData.value.panel);
          // })
          // reset the type
          ShareData.reset();
        }
      }
    });
  }
}
import CLASSES from "../classes";
import ViewEvent from "../mvc/events/ViewEvent";
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
    panel._view.getElements().wrapper.remove();
  }

  bindEvents () {
    this._$wrapper.droppable({
      drop: (event, ui) => {
        const type = ShareData.value.type;
        if (type === 'tmpPanelFromTabDrag') {
          ShareData.setTask('tmpPanelFromTabDrag');
          this.notify(new ViewEvent(), 'tmpPanelFromTabDrag', ui);
          // ShareData.resetTask();
        }
      }
    });
  }
}
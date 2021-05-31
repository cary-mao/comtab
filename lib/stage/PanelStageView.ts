import CLASSES from '../classes';
import PanelGroup from '../group/PanelGroup';
import ViewEvent from '../mvc/events/ViewEvent';
import View from '../mvc/View';
import Panel from '../panel/Panel';
import ShareData from '../share';
import PanelStageModel, { PanelStageState } from './PanelStageModel';

export default class PanelStageView extends View {
  private _$wrapper: JQuery;
  protected _model: PanelStageModel;

  create(state: PanelStageState) {
    this._$wrapper = $(state.stage as JQuery.PlainObject).addClass(CLASSES.STAGE);
    state.panels.forEach((p) => this.addPanel(p));
    state.groups.forEach((g) => this.addGroup(g));

    this.bindEvents();
  }

  addPanel(panel: Panel) {
    this._$wrapper.append(panel._view.getElements().wrapper);
  }

  addGroup(group: PanelGroup) {
    this._$wrapper.append(group._view.getElements().wrapper);
  }

  deletePanel(panel: Panel) {
    panel._view.getElements().wrapper.remove();
  }

  bindEvents() {
    this._$wrapper.droppable({
      drop: (event, ui) => {
        const type = ShareData.value.type;
        if (type === 'tmpPanelFromTabDrag') {
          ShareData.setTask('tmpPanelFromTabDrop');
          ShareData.value.type = 'tmpPanelFromTabDrop';
          this.notify(new ViewEvent(), 'tmpPanelFromTabDrop', ui);
          // ShareData.resetTask();
        } else if (type === 'splitPanelFromGroup') {
          ShareData.setTask('splitPanelFromGroupDrop');
          ShareData.value.type = 'splitPanelFromGroupDrop';
          this.notify(new ViewEvent(), 'splitPanelFromGroupDrop', ui);
        }
      }
    });
  }
}

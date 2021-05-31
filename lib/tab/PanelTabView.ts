import CLASSES from '../classes';
import ViewEvent from '../mvc/events/ViewEvent';
import View from '../mvc/View';
import Panel from '../panel/Panel';
import { createElementWithClass, isDef } from '../utils';
import PanelTab from './PanelTab';
import PanelTabController from './PanelTabController';
import PanelTabModel, { PanelTabState } from './PanelTabModel';
import ShareData from '../share';

export default class PanelTabView extends View {
  toggleTabHandleEvent(enable: boolean) {
    if (enable) {
      this._$btn.addClass(CLASSES.PANE_HANDLE);
    } else {
      this._$btn.removeClass(CLASSES.PANE_HANDLE);
    }
  }
  private _$btn: JQuery;
  private _$content: JQuery;
  protected _model: PanelTabModel;
  protected _controller: PanelTabController;
  host: PanelTab;
  events: {
    tabSplit?: JQuery;
    btnClickFn?: JQuery.TypeEventHandler<HTMLElement, undefined, HTMLElement, HTMLElement, 'mousedown'>;
  } = {};

  constructor(host: PanelTab) {
    super();
    this.host = host;
  }

  create(state?: PanelTabState) {
    state = state || this._model.getState();
    this._$btn = createElementWithClass(CLASSES.TAB_BTN).text(state.btnText);
    this._$content = $(state.content as JQuery.PlainObject).addClass(CLASSES.TAB_CONTENT);

    if (state.actived) {
      this.activate();
    }

    if (state._tabHandleEnabled) {
      this.toggleTabHandleEvent(true);
    }

    this.bindEvents();
  }

  bindEvents() {
    this.events.btnClickFn = () => {
      ShareData.setTask('activateTab');
      this._model.activate();
    };
    this._$btn.on('mousedown', this.events.btnClickFn);
    this.events.tabSplit = this._$btn.draggable({
      delay: 200,
      helper: () => {
        ShareData.setTask('tmpPanelFromTabDrag');
        const newPanel = Panel.copyPanelByTabs(this.host);
        newPanel._view.setZIndex(this.host.getPanelLayer().getTopZIndex() + 1);
        ShareData.value.panel = newPanel;
        ShareData.value.tab = this.host;
        ShareData.value.type = 'tmpPanelFromTabDrag';
        return newPanel._view.getElements().wrapper;
      }
    });
  }

  destoryEvents() {
    this._$btn.off('mousedown', this.events.btnClickFn);
    this.events.tabSplit.draggable('destroy');
  }

  toggleTabSplitEvent(enable?: boolean) {
    enable = isDef(enable) ? enable : this.events.tabSplit.draggable('option', 'disabled');

    const t = this.events.tabSplit;
    // this.events.tabSplit.draggable(enable ? 'enable' : 'disable');
    this.events.tabSplit.draggable(enable ? 'enable' : 'disable');
  }

  activate() {
    this._$content.addClass(CLASSES.TAB_CONTENT_ACTIVE);
    this._$btn.addClass(CLASSES.TAB_BTN_ACTIVE);
  }

  deactivate() {
    this._$content.removeClass(CLASSES.TAB_CONTENT_ACTIVE);
    this._$btn.removeClass(CLASSES.TAB_BTN_ACTIVE);
  }

  getElements() {
    return {
      btn: this._$btn,
      content: this._$content
    };
  }

  remove() {
    this._$btn.remove();
    this._$content.remove();
  }
}

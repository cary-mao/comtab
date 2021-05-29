import View from "../mvc/View";
import PanelTab from "../tab/PanelTab";
import CLASSES from '../classes';
import { createElementWithClass } from "../utils";
import PanelModel, { Position } from "./PanelModel";
import Panel from "./Panel";
import ViewEvent from "../mvc/events/ViewEvent";
import ShareData from '../share';

export default class PanelView extends View {
  setSize(size: {width?: number, height?: number}) {
    this._$wrapper.css({
      width: size.width ? size.width + 'px': undefined,
      height: size.height ? size.height + 'px': undefined
    });
  }
  refreshTabSplitEvent () {
    const state = this._model.getState();
    if (state.tabs.length <= 1 && state._tabSplitEnabled) {
      this._model.toggleTabSplitEvent(false);
      return;
    }
    if (state.tabs.length > 1 && !state._tabSplitEnabled) {
      this._model.toggleTabSplitEvent(true);
      return;
    }
  }
  addTabs(tabs: Array<PanelTab>) {
    tabs.forEach(t => {
      const {btn, content} = t._view.getElements();
      this._$header.append(btn);
      this._$wrapper.append(content);
    });
  }
  setZIndex(zIndex: number) {
    this._$wrapper.css('z-index', zIndex);
  }
  private _$wrapper: JQuery;
  private _$panelHandle: JQuery;
  private _$header: JQuery;
  protected _model!: PanelModel;
  host: Panel;
  events: {
    panelDrag?: JQuery;
  } = {};

  constructor (host: Panel) {
    super();
    this.host = host;
  }

  setTabSplitEvent (enable: boolean) {
    const tabs = this._model.getState().tabs;
    tabs.forEach(t => {
      t._view.toggleTabSplitEvent(enable);
      this.toggleDragPanelWithTabEvent(t, !enable);
    });
  }

  toggleDragPanelWithTabEvent (tab: PanelTab, enable: boolean) {
    tab._model.toggleTabHandleEvent(enable);
  }

  setPosition (position: Position) {
    this._$wrapper.css({
      left: position.left + 'px',
      top: position.top + 'px'
    });
  }

  create () {
    const tabs = this._model.getState().tabs;
    this._createElements();
    this._$wrapper.append(this._$panelHandle).append(this._$header);

    tabs.forEach(t => {
      const {btn, content} = t._view.getElements();
      this._$wrapper.append(content);
      this._$header.append(btn);
    });

    this.bindEvents();
  }

  bindEvents () {
    this._$wrapper.on('mousedown', () => {
      ShareData.setTask('activatePanel');
      this._model.activate();
      // ShareData.resetTask();
    });
    this.events.panelDrag = this._$wrapper.draggable({
      handle: '.' + CLASSES.PANE_HANDLE,
      start: () => {
        ShareData.setTask('panelDragStart');
        ShareData.value.type = 'panelDragging';
        this.notify(new ViewEvent(false), 'panelDragStart', this.host);
        // ShareData.resetTask();
      }
    });
    this._$header.droppable({
      tolerance: 'pointer',
      greedy: true,
      drop: () => {
        if (ShareData.value.type === 'tmpPanelFromTabDrag') {
          this.notify(new ViewEvent(), 'insertTmpPanelToTabHeader', this.host);

          return;
        }

        ShareData.setTask('insertPanelToTabHeader');
        this.notify(new ViewEvent(), 'insertPanelToTabHeader', this.host);
        // ShareData.resetTask();
      }
    });
  }

  /**
   * create elements for panel
   */
  private _createElements () {
    this._$wrapper = createElementWithClass(CLASSES.PANE);
    this._$panelHandle = createElementWithClass(CLASSES.PANE_HANDLE);
    this._$header = createElementWithClass(CLASSES.TAB_HEADER);
  }

  getElements () {
    return {
      wrapper: this._$wrapper,
      handle: this._$panelHandle,
      header: this._$header
    }
  }
}
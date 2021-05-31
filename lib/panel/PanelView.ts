import View from '../mvc/View';
import PanelTab from '../tab/PanelTab';
import CLASSES from '../classes';
import { createElementWithClass } from '../utils';
import PanelModel, { Position } from './PanelModel';
import Panel from './Panel';
import ViewEvent from '../mvc/events/ViewEvent';
import ShareData from '../share';
import PanelStage from '../stage/PanelStage';

export default class PanelView extends View {
  private _$wrapper: JQuery;
  private _$panelHandle: JQuery;
  private _$header: JQuery;
  protected _model!: PanelModel;
  host: Panel;
  events: {
    panelDrag?: JQuery;
    headerSplit?: JQuery;
    clickActivateFn?: JQuery.TypeEventHandler<HTMLElement, undefined, HTMLElement, HTMLElement, 'mousedown'>;
  } = {};

  constructor(host: Panel) {
    super();
    this.host = host;
  }

  setHeaderSplitEvent(enable: boolean) {
    this.events.headerSplit.draggable(enable ? 'enable' : 'disable');
  }

  splitFromContainer() {}

  setHandleVisble(visible: boolean) {
    const fn = visible ? 'show' : 'hide';
    this._$panelHandle[fn]();
  }

  setClickActivateEvent(enable = true) {
    const fn = enable ? 'on' : 'off';
    // @ts-ignore
    this._$wrapper[fn]('mousedown', this.events.clickActivateFn);
  }

  setDragEvent(enable = true) {
    this.events.panelDrag.draggable(enable ? 'enable' : 'disable');
  }

  setSize(size: { width?: number; height?: number }) {
    this._$wrapper.css({
      width: size.width ? size.width + 'px' : undefined,
      height: size.height ? size.height + 'px' : undefined
    });
  }

  /**
   *
   * @param force force refresh split event even if state._tabSplitEnabled is right.
   * @returns
   */
  refreshTabSplitEvent(force = false) {
    const state = this._model.getState();
    if (state.tabs.length <= 1 && (state._tabSplitEnabled || force)) {
      this._model.toggleTabSplitEvent(false);
      return;
    }
    if (state.tabs.length > 1 && (!state._tabSplitEnabled || force)) {
      this._model.toggleTabSplitEvent(true);
      return;
    }
  }

  addTabs(tabs: Array<PanelTab>) {
    tabs.forEach((t) => {
      const { btn, content } = t._view.getElements();
      this._$header.append(btn);
      this._$wrapper.append(content);
    });
  }

  setZIndex(zIndex: number) {
    this._$wrapper.css('z-index', zIndex);
  }

  setTabSplitEvent(enable: boolean) {
    const tabs = this._model.getState().tabs;
    tabs.forEach((t) => {
      t._view.toggleTabSplitEvent(enable);
      this.toggleDragPanelWithTabEvent(t, !enable);
    });
  }

  toggleDragPanelWithTabEvent(tab: PanelTab, enable: boolean) {
    tab._model.toggleTabHandleEvent(enable);
  }

  setPosition(position: Position) {
    this._$wrapper.css({
      left: position.left + 'px',
      top: position.top + 'px'
    });
  }

  create() {
    const tabs = this._model.getState().tabs;
    this._createElements();
    this._$wrapper.append(this._$panelHandle).append(this._$header);

    tabs.forEach((t) => {
      const { btn, content } = t._view.getElements();
      this._$wrapper.append(content);
      this._$header.append(btn);
    });

    this.bindEvents();

    const state = this._model.getState();
    if (!state._headerSplitEnabled) {
      this.setHeaderSplitEvent(false);
    }
  }

  bindEvents() {
    this.events.headerSplit = this._$header.draggable({
      // handle can't equal to draggable host(this._$header)
      // handle: '.' + CLASSES.TAB_HEADER,
      cancel: '.' + CLASSES.TAB_BTN,
      delay: 300,
      helper: () => {
        const panel = Panel.copy(this.host);
        panel._model.setHandleVisible(false);
        panel._view.setZIndex(this.host.getPanelLayer().getTopZIndex() + 1);
        ShareData.setTask('splitPanelFromGroup');
        ShareData.value.type = 'splitPanelFromGroup';
        ShareData.value.panel = panel;
        ShareData.value.origin = this.host;
        return panel._view.getElements().wrapper;
      }
    });
    this.events.clickActivateFn = () => {
      ShareData.setTask('activatePanel');
      this._model.activate();
      // ShareData.resetTask();
    };
    this._$wrapper.on('mousedown', this.events.clickActivateFn);
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
      accept() {
        return ['tmpPanelFromTabDrag', 'panelDragging'].some((v) => v === ShareData.value.type);
      },
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
  private _createElements() {
    this._$wrapper = createElementWithClass(CLASSES.PANE);
    this._$panelHandle = createElementWithClass(CLASSES.PANE_HANDLE);
    this._$header = createElementWithClass(CLASSES.TAB_HEADER);
  }

  getElements() {
    return {
      wrapper: this._$wrapper,
      handle: this._$panelHandle,
      header: this._$header
    };
  }
}

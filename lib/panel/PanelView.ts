import View from "../mvc/View";
import PanelTab from "../tab/PanelTab";
import CLASSES from '../classes';
import { createElementWithClass } from "../utils";
import PanelModel, { Position } from "./PanelModel";
import Panel from "./Panel";

export default class PanelView extends View {
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
    this.events.panelDrag = this._$wrapper.css({
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
      this._model.activate();
    });
    this._$wrapper.draggable({
      handle: '.' + CLASSES.PANE_HANDLE
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
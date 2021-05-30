import CLASSES from '../classes';
import View from '../mvc/View';
import Panel from '../panel/Panel';
import { Position } from '../panel/PanelModel';
import PanelView from '../panel/PanelView';
import { createElementWithClass } from '../utils';
import PanelGroup from './PanelGroup';
import PanelGroupModel from './PanelGroupModel';
import ShareData from '../share';

export default class PanelGroupView extends View {
  protected _model: PanelGroupModel;
  host: PanelGroup;
  private _$wrapper: JQuery;

  constructor(host: PanelGroup) {
    super();
    this.host = host;
  }

  create() {
    const state = this._model.getState();

    this._$wrapper = createElementWithClass(CLASSES.PANE_GROUP);
    this.refreshPosition();
    state.matrix.forEach((r) => r.forEach((c) => this.addPanel(c)));

    this.restrictPanels();
    this.bindEvents();
  }

  restrictPanels() {
    const state = this._model.getState();
    state.matrix.forEach((r, ri) => {
      r.forEach((c) => {
        c._model.toggleDragEvent(false);
        c._model.toggleClickActivateEnabled(false);

        // hide the handle
        if (ri !== 0) {
          c._model.setHandleVisible(false);
        }
      });
    });
  }

  bindEvents() {
    this._$wrapper.on('mousedown', () => {
      ShareData.setTask('activateGroup');
      this._model.activate();
    });
    this._$wrapper.draggable({
      handle: '.' + CLASSES.PANE_HANDLE,
      start() {
        ShareData.setTask('groupDragging');
        ShareData.value.type = 'groupDragging';
      }
    });
  }

  getElements() {
    return {
      wrapper: this._$wrapper
    };
  }

  setZIndex(zIndex: number) {
    this._$wrapper.css('z-index', zIndex);
  }

  addPanel(panel: Panel) {
    this._$wrapper.append(panel._view.getElements().wrapper);
  }

  refreshPosition() {
    const state = this._model.getState();

    const wrapperPosition = state.position ? state.position : state.matrix[0][0].getPosition();
    this.setPosition(wrapperPosition);

    if (state.autoPos) {
      // the column width is refer to first row.
      let data = [];
      let offsetX = [0];
      let offsetY = [];
      for (let rowIdx = 0, rowLen = state.matrix.length; rowIdx < rowLen; rowIdx++) {
        const row = state.matrix[rowIdx];
        for (let colIdx = 0, colLen = row.length; colIdx < colLen; colIdx++) {
          const panel = row[colIdx];

          if (!data[rowIdx]) {
            data[rowIdx] = [];
          }

          data[rowIdx][colIdx] = {};

          if (rowIdx === 0) {
            // record horizontal offset of column
            offsetX[colIdx + 1] = offsetX[colIdx] + panel.width;
            data[rowIdx][colIdx].left = offsetX[colIdx];
          } else {
            data[rowIdx][colIdx].width = state.matrix[0][colIdx].width;
          }

          // offsetY records vertical offset of each column
          if (!offsetY[colIdx]) {
            offsetY[colIdx] = [0];
            // data[colIdx] = [];
          }

          offsetY[colIdx][rowIdx + 1] = offsetY[colIdx][rowIdx] + panel.height;
          data[rowIdx][colIdx].top = offsetY[colIdx][rowIdx];
        }
      }

      data.forEach((r, ri) => {
        r.forEach((c, ci) => {
          const panel = state.matrix[ri][ci];
          panel.setPosition(c);
          if (c.width) {
            panel.setSize(c);
          }
        });
      });
    }
  }

  setPosition(wrapperPosition: Position) {
    PanelView.prototype.setPosition.call(this, wrapperPosition);
  }
}

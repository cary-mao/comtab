import CLASSES from "../classes";
import View from "../mvc/View";
import { Position } from "../panel/PanelModel";
import PanelView from "../panel/PanelView";
import { createElementWithClass } from "../utils";
import PanelGroup from "./PanelGroup";
import PanelGroupModel from "./PanelGroupModel";

export default class PanelGroupView extends View {
  protected _model: PanelGroupModel;
  host: PanelGroup;
  private _$wrapper: JQuery;

  constructor (host: PanelGroup) {
    super();
    this.host = host;
  }

  create () {
    this._$wrapper = createElementWithClass(CLASSES.PANE_GROUP);
    this.refreshPosition();
  }

  getElements () {
    return {
      wrapper: this._$wrapper
    }
  }

  setZIndex (zIndex: number) {
    this._$wrapper.css('z-index', zIndex);
  }

  refreshPosition () {
    const state = this._model.getState();

    const wrapperPosition = state.autoPos ? state.matrix[0][0].getPosition() : state.position;
    this.setPosition(wrapperPosition)
    
    // the column width is refer to first row.
    let offsetX = [0];
    let offsetY = [];
    let data = [];

    for (let rowIdx = 0, rowLen = state.matrix.length; rowIdx < rowLen; rowIdx++) {
      const row = state.matrix[rowIdx];
      for (let colIdx = 0, colLen = row.length; colIdx < colLen; colIdx++) {
        const panel = row[colIdx];

        if (!data[rowIdx]) {
          data[rowIdx] = [];
        }

        data[rowIdx][colIdx] = {};

        if (rowIdx === 0) {
          offsetX[rowIdx + 1] = offsetX[rowIdx] + panel.width;
          data[rowIdx][colIdx].left = offsetX[rowIdx];
        } else {
          data[rowIdx][colIdx].width = state.matrix[0][colIdx].width;
        }

        if (!offsetY[colIdx]) {
          offsetY[colIdx] = [0];
          data[colIdx] = [];
        }

        offsetY[colIdx][rowIdx + 1] = offsetY[colIdx][rowIdx] + panel.height;
        data[rowIdx][colIdx].top =  offsetY[colIdx][rowIdx];
      }
    }

    data.forEach((r, ri) => {
      r.forEach((c, ci) => {
        state.matrix[ri][ci].setPosition(c);
        if (c.width) {
          state.matrix[ri][ci].setSize(c);
        }
      });
    })
  }

  setPosition(wrapperPosition: Position) {
    PanelView.prototype.setPosition.call(this, wrapperPosition);
  }
}
import Panel from "../panel/Panel";
import { _createPureObject } from "../utils";

interface PanelMap {
  [key: string]: Panel;
}

export default class PanelLayer {
  private _panelMap: PanelMap = _createPureObject(null);
  private _panelCount = 0;
  private _topZIndex = 0;

  add (panel: Panel) {
    const id = panel.state.id;
    this._panelMap[id] = panel;
    this._topZIndex = this._panelCount++;
    panel.setZIndex(this._panelCount-1);
  }

  remove (id: string) {
    var matchPanel = this._panelMap[id];
    // fix:bug maybe panel was destoryed by group
    if (!matchPanel) return;
    // normalize panel layer
    // only keep the max zindex correct, not reset
    if (this._topZIndex === matchPanel.state.zIndex) {
      this._topZIndex--;
    }
    delete this._panelMap[id];
    this._panelCount--;
  }

  activate (panel: Panel) {
    // not the top-level layer
    if (panel.state.zIndex !== this._topZIndex) {
      for (var k in this._panelMap) {
        var v = this._panelMap[k]
        if (v.state.zIndex > panel.state.zIndex) {
          v.setZIndex(v.state.zIndex-1);
        }
      }
      panel.setZIndex(this._topZIndex);
    }
  }
}
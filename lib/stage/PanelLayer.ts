import PanelGroup from '../group/PanelGroup';
import Panel from '../panel/Panel';
import { values, _createPureObject } from '../utils';

type LayerObject = Panel | PanelGroup;

interface PanelMap {
  [key: string]: LayerObject;
}

export default class PanelLayer {
  private _panelMap: PanelMap = _createPureObject(null);
  private _panelCount = 0;
  private _topZIndex = 0;

  getCount() {
    return this._panelCount;
  }

  getTopZIndex() {
    return this._topZIndex;
  }

  add(panel: LayerObject) {
    const id = panel.state.id;
    this._panelMap[id] = panel;
    this._topZIndex = this._panelCount++;
    panel.setZIndex(this._panelCount - 1);
  }

  remove(panel: LayerObject) {
    const matchPanel = this._panelMap[panel.state.id];
    // fix:bug maybe panel was destoryed by group
    if (!matchPanel) return;
    // normalize panel layer
    if (this._topZIndex === matchPanel.state.zIndex) {
      this._topZIndex--;
    }
    delete this._panelMap[panel.state.id];
    // reset zIndex, because remove the other panel if not reset, it will make a mistake
    // that exist two panels have same zIndex
    const arr = values(this._panelMap).sort((a, b) => a.state.zIndex - b.state.zIndex);
    arr.forEach((v, i) => i === v.state.zIndex || v.setZIndex(i));

    this._panelCount--;
  }

  activate(panel: LayerObject) {
    // not the top-level layer
    if (panel.state.zIndex !== this._topZIndex) {
      for (const k in this._panelMap) {
        const v = this._panelMap[k];
        if (v.state.zIndex > panel.state.zIndex) {
          v.setZIndex(v.state.zIndex - 1);
        }
      }
      panel.setZIndex(this._topZIndex);
    }
  }
}

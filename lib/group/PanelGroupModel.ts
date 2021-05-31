import ModelEvent from '../mvc/events/ModelEvent';
import Model from '../mvc/Model';
import Panel from '../panel/Panel';
import { Position } from '../panel/PanelModel';
import { genId, merge, zip } from '../utils';
import PanelGroup from './PanelGroup';
import PanelGroupView from './PanelGroupView';

type GroupMatrix = Array<Array<Panel>>;

interface PanelGroupState {
  id: string;
  matrix: GroupMatrix;
  position: Position;
  autoPos: boolean; // if true, change position auto.
  zIndex: number;
}

export interface PanelGroupOptions {
  matrix?: GroupMatrix;
  position?: Position;
  autoPos?: boolean;
}

export default class PanelGroupModel extends Model {
  setPosition(position: Position, notify = true) {
    this._state.position = position;
    if (notify) {
      this.notify(new ModelEvent(false), 'setPosition', position);
    }
  }
  activate() {
    this.notify(new ModelEvent(), 'activateGroup', this.host);
  }
  private _state: PanelGroupState = {
    matrix: [],
    position: null,
    autoPos: true,
    id: genId('panelGroup'),
    zIndex: 0
  };
  protected _view: PanelGroupView;
  host: PanelGroup;

  constructor(opts: PanelGroupOptions, host: PanelGroup) {
    super();
    this.host = host;
    merge(this._state, opts);
  }

  deletePanel(panel: Panel) {
    const matrix = this._state.matrix;
    const [r, c] = panel.state.groupIdxes;
    if (this._state.matrix[r][c] === panel) {
      const matrixT = zip(matrix);
      matrixT[c].splice(r, 1);

      if (matrixT[c].length === 0) {
        matrixT.splice(c, 1);
      }

      const result = [];
      zip(matrixT).forEach((r, ri) => {
        const cArr = r.filter((c) => !!c);
        if (cArr.length) {
          result[ri] = cArr;
        }
      });

      this._state.matrix = result;

      this.notify(new ModelEvent(false), 'deletePanel', panel);
    }
  }

  setZIndex(zIndex: number) {
    this._state.zIndex = zIndex;
    this.notify(new ModelEvent(false), 'setZIndex', zIndex);
  }

  getState() {
    return this._state;
  }
}

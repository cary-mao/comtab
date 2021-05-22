import ModelEvent from "../mvc/events/ModelEvent";
import PanelTab from "../tab/PanelTab";
import { merge } from "../utils";
import PanelController from "./PanelController";
import PanelModel, {PanelOptions, Position} from './PanelModel';
import PanelView from "./PanelView";

export default class Panel {
  // only can be use by father component outside
  _model: PanelModel;
  _view: PanelView;
  _controller: PanelController;

  constructor (opts: PanelOptions) {
    this._model = new PanelModel(opts, this);
    this._view = new PanelView(this);
    this._controller = new PanelController(this._model, this._view, this);
    this._init();
  }

  /**
   * carefully: the result of this method should be read-only.
   */
  get state () {
    return this._model.getState();
  }

  setZIndex (zIndex: number) {
    this._model.setZIndex(zIndex);
  }

  setPosition (position?: Position) {
    this._model.setPosition(position)
  }

  private _init () {
    const state = this._model.getState();
    this._view.create();
    state.tabs.forEach(t => t._controller.setParent(this._controller));

    this._view.refreshTabSplitEvent();
  }

  deleteTab (tab: PanelTab) {
    this._model.deleteTab(tab);
  }

  static copyPanelByTabs (...tabs: Array<PanelTab>) {
    const copyTabs = tabs.map(t => {
      const copyTab = PanelTab.copy(t);
      copyTab._model.activate(new ModelEvent(false));
      return copyTab;
    })
    
    return new Panel({
      tabs: copyTabs
    });
  }
}
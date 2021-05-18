import { bindOthers, notify, notifyFn } from "./common";
import Controller from "./Controller";
import Model from "./Model";

export default abstract class View {
  protected _controller!: Controller;
  protected _model!: Model;
  notify: notifyFn;

  // abstract receive (...args);
  bind = bindOthers;
  linkModel (model: Model) {
    this._model = model;
  }
}

View.prototype.notify = function (...args) {
  notify(this._controller.dispatch, this._controller, args);
}
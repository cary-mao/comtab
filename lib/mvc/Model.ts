import { notifyFn, notify, bindOthers } from './common';
import Controller from './Controller'
import View from './View';

export default abstract class Model {
  protected _data = Object.create(null);
  protected _controller!: Controller;
  protected _view!: View;
  notify: notifyFn;

  // abstract receive (...args);
  bind = bindOthers;
  linkView (view: View) {
    this._view = view;
  }
}

Model.prototype.notify = function (...args) {
  notify(this._controller.dispatch, this._controller, args);
}
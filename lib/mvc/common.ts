/**
 * common logic
 */
import Controller from './Controller';
import MVCEvent from './events/Event';
import Model from './Model';
import View from './View';

/**
 * notify the updated to controller
 * @param {MVCEvent} event
 * @param {...any} [args]
 */
export interface notifyFn {
  (event: MVCEvent, ...args): void;
}

export function notify(fn: Function, thisArg, args) {
  Reflect.apply(fn, thisArg, args);
}

/**
 * bind a controller
 * @param {Controller} controller
 * @param {Model | View} other
 */
export function bindOthers(controller: Controller, other: Model | View) {
  this._controller = controller;
  if (this instanceof Model) {
    (this as Model).linkView(other as View);
  } else {
    (this as View).linkModel(other as Model);
  }
}

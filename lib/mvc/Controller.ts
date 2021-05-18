import { notify } from "./common";
import Model from "./Model";
import View from "./View";
import ModelEvent from './events/ModelEvent';
import ViewEvent from "./events/ViewEvent";

export default abstract class Controller {
  protected _model!:Model;
  protected _view!:View;
  protected _parent:Controller | undefined;

  constructor (model: Model, view: View) {
    this.link(model, view);
  }

  /**
   * dispatch the handler when received the message
   * @param {ModelEvent | ViewEvent} event
   * @param {...any} args
   */
  dispatch (...args) {
    const event = args[0] as ModelEvent | ViewEvent;
    const name = event.getTypeName();
    const dispatchTo = this[`dispatch${name}`]
    Reflect.apply(dispatchTo, this, args);
    this.propagation(event, args.slice(1));
  };

  /**
   * dispatch the handler when received the message
   * @param {ModelEvent} event
   * @param {...any} args
   */
  abstract dispatchModel (event: ModelEvent, ...args);

  /**
   * dispatch the handler when received the message
   * @param {ModelEvent | ViewEvent} event
   * @param {...any} args
   */
  abstract dispatchView (event: ViewEvent, ...args);

  /**
   * 
   * @param model 
   * @param view 
   */
  // protected _getTargetByEvent (event: ModelEvent | ViewEvent) {
  //   return this['_' + event.getTypeName().toLowerCase()] as Model | View;
  // }

  /**
   * link a model and a view
   */
  link (model: Model, view: View) {
    model.bind(this, view);
    view.bind(this, model);
    this._model = model;
    this._view = view;
  }

  setParent (controller: Controller) {
    this._parent = controller;
  }

  getParent () {
    return this._parent;
  }

  /**
   * bubble
   */
  propagation (event: ModelEvent | ViewEvent, args: Array<any>) {
    // console.log(arguments)
    if (this._parent && event.isPropagation()) {
      event.progagation();
      Reflect.apply(this._parent.dispatch, this._parent, [event, ...args]);
    }
  }
}
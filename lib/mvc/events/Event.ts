import { substring } from "../../utils";

export default class MVCEvent {
  private _isBubble!: boolean;
  protected _bubble!:boolean;
  type!: string;

  constructor (type: string, bubble = true) {
    this.type = type + 'Event';
    this._bubble = bubble;
    this._isBubble = false;
  }

  isType (name: string) {
    return this.getTypeName() === name;
  }

  getTypeName () {
    return substring(this.type, 0, -5);
  }

  /**
   * prevent the notify to bubble
   */
  stopPropagation () {
    this._bubble = false;
  }

  /**
   * bubble available
   */
  isPropagation () {
    return this._bubble;
  }

  /**
   * bubble processing
   */
  progagation () {
    this._isBubble = true;
  }

  isBubble () {
    return this._isBubble;
  }
}
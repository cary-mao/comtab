import { cloneDeep } from "./utils";

export default class DataProxy<T> {
  private _value: T;
  private _initValue: T;

  constructor (value: T) {
    this._value = value;
    this._initValue = cloneDeep(value);
  }

  set value (value: T) {
    this._value = value;
  }

  get value () {
    return this._value;
  }

  reset () {
    this._value = cloneDeep(this._initValue);
  }
}

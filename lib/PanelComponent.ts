import { merge } from './utils';

/**
 * A MVC-Based Component
 * It's implemented with reference to React Component and Model-View-Controller architecture pattern.
 */
export default class PanelComponent<T> {
  private _oldState: T;
  private _state: T;

  setState(state: T) {
    this._oldState = this._state;
    merge(this._state, state);
    this.render();
  }

  render() {}

  _diff(oldState: T, state: T) {}

  static isComponent(value) {
    return value instanceof PanelComponent;
  }
}

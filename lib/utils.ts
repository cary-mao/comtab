/**
 * A utilities that support ES5 browsers and above (ie10+, edge12+, chrome23+, safari6+, opeara15+)
 * For more compatibility details, see https://www.caniuse.com/es5
 * 
 * Most methods of this file are using lodash currently.
 * For more details, see https://lodash.com/
 * To make it easy to remove later, I don't use lodash directly in other source files at the moment
 * that is because I tend to use vanilla.js
 */
import _ from 'lodash';

export function assign (object, ...source) {
  return _.assign(object, source);
}

export function forEach (collection, cb) {
  return _.forEach(collection, cb);
}

export function merge (...args) {
  return _.merge.apply(null, args);
}

export function mergeWith (...args) {
  return _.mergeWith.apply(null, args);
}

export function pull (...args) {
  return _.pull.apply(null, args)
}

export function isPlainObject (value) {
  return _.isPlainObject(value);
}

export function cloneDeep (value) {
  return _.cloneDeep(value);
}

export function isDef (value) {
  return value === void(0);
}

export function substring (string: string, start: number, end: number) {
  return string.substring(start, end < 0 ? string.length + end : end);
}

export function applyMixins(derivedCtor: any, constructors: any[]) {
  constructors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      Object.defineProperty(
        derivedCtor.prototype,
        name,
        Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
          Object.create(null)
      );
    });
  });
}

export function _createPureObject(obj) {
  var description = {}
  if (obj) {
    for (var k in obj) {
      // fix:bug if obj is a pure object, it hasn't hasOwnProperty
      if (!obj.hasOwnProperty || obj.hasOwnProperty(k)) {
        description[k] = {
          value: obj[k],
          writable: true,
          configurable: true,
          enumerable: true
        }
      }
    }
  }

  return Object.create(null, description)
}

export function genId(prefix = '') {
  var len = 32
  var radix = 16
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  var uuid = [], i
  radix = radix || chars.length
  if (len) {
    for (i = 0; i < len; i++)uuid[i] = chars[0 | Math.random() * radix]
  } else {
    var r
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
    uuid[14] = '4'
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16
        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r]
      }
    }
  }
  return prefix + uuid.join('')
}


/**
 * using JQuery in the following code.
 * Carefully, all element in these code are the instance of JQuery.
 */

/**
 * create element
 * @param {string} cls classname
 * @param {string} tag 
 */
export function createElementWithClass (cls: string, tag = 'div') {
  return $(`<${tag} class="${cls}">`);
}

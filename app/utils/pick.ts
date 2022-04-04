/**
 ** Create an object composed of the picked object properties
 * @param {Object} object
 * @param {string[]} keys
 * @returns {Object}
 */
const pick = <T = Record<string, unknown>>(object: T, keys: string[]) => {
  return keys.reduce((obj: Record<string, unknown>, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      obj[key] = (object as Record<string, unknown>)[key];
    }
    return obj as T;
  }, {});
};

export default pick;

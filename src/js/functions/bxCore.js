;(function (window) {
  if (!!window.BX) {
    return
  }

  let BX = {}

  BX.type = {
    isString: function (item) {
      return item === ''
        ? true
        : item
        ? typeof item == 'string' || item instanceof String
        : false
    },
    isNotEmptyString: function (item) {
      return BX.type.isString(item) ? item.length > 0 : false
    },
    isBoolean: function (item) {
      return item === true || item === false
    },
    isNumber: function (item) {
      return item === 0
        ? true
        : item
        ? typeof item == 'number' || item instanceof Number
        : false
    },
    isFunction: function (item) {
      return item === null
        ? false
        : typeof item == 'function' || item instanceof Function
    },
    isElementNode: function (item) {
      //document.body.ELEMENT_NODE;
      return (
        item &&
        typeof item == 'object' &&
        'nodeType' in item &&
        item.nodeType == 1 &&
        item.tagName &&
        item.tagName.toUpperCase() != 'SCRIPT' &&
        item.tagName.toUpperCase() != 'STYLE' &&
        item.tagName.toUpperCase() != 'LINK'
      )
    },
    isDomNode: function (item) {
      return item && typeof item == 'object' && 'nodeType' in item
    },
    isArray: function (item) {
      return item && Object.prototype.toString.call(item) == '[object Array]'
    },
    isDate: function (item) {
      return item && Object.prototype.toString.call(item) == '[object Date]'
    },
    isNotEmptyObject: function (item) {
      for (let i in item) {
        if (item.hasOwnProperty(i)) return true
      }

      return false
    },
  }

  BX.ajax = function () {}
  BX.showWait = function () {}
  BX.closeWait = function () {}

  window.BX = BX
})(window)

(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var _validForm = require('./src/valid-form');

var _validForm2 = _interopRequireDefault(_validForm);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.ValidForm = _validForm2.default;
window.ValidForm.toggleInvalidClass = _validForm.toggleInvalidClass;
window.ValidForm.handleCustomMessages = _validForm.handleCustomMessages;
window.ValidForm.handleCustomMessageDisplay = _validForm.handleCustomMessageDisplay;

},{"./src/valid-form":3}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clone = clone;
exports.defaults = defaults;
exports.insertAfter = insertAfter;
exports.insertBefore = insertBefore;
exports.forEach = forEach;
exports.debounce = debounce;
function clone(obj) {
  var copy = {};
  for (var attr in obj) {
    if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
  }
  return copy;
}

function defaults(obj, defaultObject) {
  obj = clone(obj || {});
  for (var k in defaultObject) {
    if (obj[k] === undefined) obj[k] = defaultObject[k];
  }
  return obj;
}

function insertAfter(refNode, nodeToInsert) {
  var sibling = refNode.nextSibling;
  if (sibling) {
    var _parent = refNode.parentNode;
    _parent.insertBefore(nodeToInsert, sibling);
  } else {
    parent.appendChild(nodeToInsert);
  }
}

function insertBefore(refNode, nodeToInsert) {
  var parent = refNode.parentNode;
  parent.insertBefore(nodeToInsert, refNode);
}

function forEach(items, fn) {
  if (!items) return;
  if (items.forEach) {
    items.forEach(fn);
  } else {
    for (var i = 0; i < items.length; i++) {
      fn(items[i], i, items);
    }
  }
}

function debounce(ms, fn) {
  var timeout = void 0;
  var debouncedFn = function debouncedFn() {
    clearTimeout(timeout);
    timeout = setTimeout(fn, ms);
  };
  return debouncedFn;
}

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toggleInvalidClass = toggleInvalidClass;
exports.handleCustomMessages = handleCustomMessages;
exports.handleCustomMessageDisplay = handleCustomMessageDisplay;
exports.default = validForm;

var _util = require('./util');

// toggleInvalidClass

function toggleInvalidClass(input, invalidClass) {
  input.addEventListener('invalid', function () {
    input.classList.add(invalidClass);
  });

  input.addEventListener('input', function () {
    if (input.validity.valid) {
      input.classList.remove(invalidClass);
    }
  });
}

// handleCustomMessages

var errorProps = ['badInput', 'patternMismatch', 'rangeOverflow', 'rangeUnderflow', 'stepMismatch', 'tooLong', 'tooShort', 'typeMismatch', 'valueMissing', 'customError'];

function getCustomMessage(input, customMessages) {
  customMessages = customMessages || {};
  var localErrorProps = [input.type + 'Mismatch'].concat(errorProps);
  var validity = input.validity;

  for (var i = 0; i < localErrorProps.length; i++) {
    var prop = localErrorProps[i];
    if (validity[prop]) {
      return input.getAttribute('data-' + prop) || customMessages[prop];
    }
  }
}

function handleCustomMessages(input, customMessages) {
  function checkValidity() {
    var message = input.validity.valid ? null : getCustomMessage(input, customMessages);
    input.setCustomValidity(message || '');
  }
  input.addEventListener('input', checkValidity);
  input.addEventListener('invalid', checkValidity);
}

// handleCustomMessageDisplay

function handleCustomMessageDisplay(input, options) {
  var validationErrorClass = options.validationErrorClass,
      validationErrorParentClass = options.validationErrorParentClass,
      errorPlacement = options.errorPlacement;


  function checkValidity(options) {
    var insertError = options.insertError;

    var parentNode = input.parentNode;
    var errorNode = parentNode.querySelector('.' + validationErrorClass) || document.createElement('div');

    if (!input.validity.valid && input.validationMessage) {
      errorNode.className = validationErrorClass;
      errorNode.textContent = input.validationMessage;

      if (insertError) {
        errorPlacement === 'before' ? (0, _util.insertBefore)(input, errorNode) : (0, _util.insertAfter)(input, errorNode);
        parentNode.classList.add(validationErrorParentClass);
      }
    } else {
      parentNode.classList.remove(validationErrorParentClass);
      errorNode.remove();
    }
  }
  input.addEventListener('input', function () {
    // We can only update the error or hide it on input.
    // Otherwise it will show when typing.
    checkValidity({ insertError: false });
  });
  input.addEventListener('invalid', function (e) {
    e.preventDefault();
    // We can also create the error in invalid.
    checkValidity({ insertError: true });
  });
}

var defaultOptions = {
  invalidClass: 'invalid',
  validationErrorClass: 'validation-error',
  validationErrorParentClass: 'has-validation-error',
  customMessages: {},
  errorPlacement: 'before'

  // validForm

};function validForm(element, options) {
  if (!element || !element.nodeName) {
    throw new Error('First arg to validForm must be a form, input, select, or textarea');
  }

  var inputs = void 0;
  var type = element.nodeName.toLowerCase();

  options = (0, _util.defaults)(options, defaultOptions);
  if (type === 'form') {
    inputs = element.querySelectorAll('input, select, textarea');
    focusInvalidInput(element, inputs);
  } else if (type === 'input' || type === 'select' || type === 'textarea') {
    inputs = [element];
  } else {
    throw new Error('Only form, input, select, or textarea elements are supported');
  }

  validFormInputs(inputs, options);
}

function focusInvalidInput(form, inputs) {
  var focusFirst = (0, _util.debounce)(100, function () {
    var invalidNode = form.querySelector(':invalid');
    if (invalidNode) invalidNode.focus();
  });
  (0, _util.forEach)(inputs, function (input) {
    return input.addEventListener('invalid', focusFirst);
  });
}

function validFormInputs(inputs, options) {
  var invalidClass = options.invalidClass,
      customMessages = options.customMessages;

  (0, _util.forEach)(inputs, function (input) {
    toggleInvalidClass(input, invalidClass);
    handleCustomMessages(input, customMessages);
    handleCustomMessageDisplay(input, options);
  });
}

},{"./util":2}]},{},[1]);

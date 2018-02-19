(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
'use strict';

var _validForm = require('./src/valid-form');

var _validForm2 = _interopRequireDefault(_validForm);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (typeof module === 'undefined') {
  window.ValidForm = _validForm2.default;
  ValidForm.toggleInvalidClass = _validForm.toggleInvalidClass;
  ValidForm.handleCustomMessages = _validForm.handleCustomMessages;
  ValidForm.handleCustomMessageDisplay = _validForm.handleCustomMessageDisplay;
} else {
  module.exports = {
    'default': _validForm2.default,
    toggleInvalidClass: _validForm.toggleInvalidClass,
    handleCustomMessages: _validForm.handleCustomMessages,
    handleCustomMessageDisplay: _validForm.handleCustomMessageDisplay
  };
}

},{"./src/valid-form":3}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clone = clone;
exports.defaults = defaults;
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

function toggleInvalidClass(input, invalidClassName) {
  input.addEventListener('invalid', function () {
    input.classList.add(invalidClassName);
  });

  input.addEventListener('input', function () {
    if (input.validity.valid) {
      input.classList.remove(invalidClassName);
    }
  });
}

// handleCustomMessages

function getCustomMessage(type, validity, customMessages) {
  customMessages = customMessages || {};
  if (validity.typeMismatch) {
    return customMessages[type + 'Mismatch'];
  } else {
    for (var invalidKey in customMessages) {
      if (validity[invalidKey]) return customMessages[invalidKey];
    }
  }
}

function handleCustomMessages(input, customMessages) {
  function checkValidity() {
    var message = input.validity.valid ? null : getCustomMessage(input.type, input.validity, customMessages);
    input.setCustomValidity(message || '');
  }
  input.addEventListener('input', checkValidity);
  input.addEventListener('invalid', checkValidity);
}

// handleCustomMessageDisplay

function handleCustomMessageDisplay(input, options) {
  function checkValidity(options) {
    var insertError = options.insertError;
    var validationErrorClass = 'validation-error';
    var parentErrorClass = 'has-validation-error';

    var parent = input.parentNode;
    var error = parent.querySelector('.' + validationErrorClass) || document.createElement('div');

    if (!input.validity.valid && input.validationMessage) {
      error.className = validationErrorClass;
      error.textContent = input.validationMessage;

      if (insertError) {
        parent.insertBefore(error, input);
        parent.classList.add(parentErrorClass);
      }
    } else {
      parent.classList.remove(parentErrorClass);
      error.remove();
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
  invalidClassName: 'invalid',
  customMessages: {},
  errorPlacement: 'before'

  // validForm

};function validForm(input, options) {
  options = (0, _util.defaults)(options, defaultOptions);
  var _options = options,
      invalidClassName = _options.invalidClassName,
      customMessages = _options.customMessages;

  toggleInvalidClass(input, invalidClassName);
  handleCustomMessages(input, customMessages);
  handleCustomMessageDisplay(input, options);
}

},{"./util":2}]},{},[1]);

(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
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

var errorProps = ['badInput', 'patternMismatch', 'rangeOverflow', 'rangeUnderflow', 'stepMismatch', 'tooLong', 'tooShort', 'typeMismatch', 'valueMissing'];

function getCustomMessage(input, customMessages) {
  customMessages = customMessages || {};
  var localErrorProps = [input.type + 'Mismatch'].concat(errorProps);
  var validity = input.validity;

  for (var i = 0; i < localErrorProps.length; i++) {
    var prop = localErrorProps[i];
    if (validity[prop]) {
      return customMessages[prop] || input.getAttribute('data-' + prop);
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
    input.focus();
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

};function validForm(input, options) {
  options = (0, _util.defaults)(options, defaultOptions);
  var _options = options,
      invalidClass = _options.invalidClass,
      customMessages = _options.customMessages;

  toggleInvalidClass(input, invalidClass);
  handleCustomMessages(input, customMessages);
  handleCustomMessageDisplay(input, options);
}

},{"./util":2}]},{},[1]);

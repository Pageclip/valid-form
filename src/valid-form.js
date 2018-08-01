import {defaults, forEach, debounce, insertAfter, insertBefore} from './util'

// toggleInvalidClass

export function toggleInvalidClass (input, invalidClass) {
  input.addEventListener('invalid', function () {
    input.classList.add(invalidClass)
  })

  input.addEventListener('input', function () {
    if (input.validity.valid) {
      input.classList.remove(invalidClass)
    }
  })
}

// handleCustomMessages

const errorProps = [
  'badInput',
  'patternMismatch',
  'rangeOverflow',
  'rangeUnderflow',
  'stepMismatch',
  'tooLong',
  'tooShort',
  'typeMismatch',
  'valueMissing',
  'customError'
]

function getCustomMessage (input, customMessages) {
  customMessages = customMessages || {}
  const localErrorProps = [`${input.type}Mismatch`].concat(errorProps)
  const validity = input.validity

  for (let i = 0; i < localErrorProps.length; i++) {
    const prop = localErrorProps[i]
    if (validity[prop]) {
      return input.getAttribute(`data-${prop}`) || customMessages[prop]
    }
  }
}

export function handleCustomMessages (input, customMessages) {
  function checkValidity () {
    const message = input.validity.valid
      ? null
      : getCustomMessage(input, customMessages)
    input.setCustomValidity(message || '')
  }
  input.addEventListener('input', checkValidity)
  input.addEventListener('invalid', checkValidity)
}

// handleCustomMessageDisplay

export function handleCustomMessageDisplay (input, options) {
  const {
    validationErrorClass,
    validationErrorParentClass,
    errorPlacement
  } = options

  function checkValidity (options) {
    const {insertError} = options
    const parentNode = input.parentNode
    const errorNode = parentNode.querySelector(`.${validationErrorClass}`) || document.createElement('div')

    if (!input.validity.valid && input.validationMessage) {
      errorNode.className = validationErrorClass
      errorNode.textContent = input.validationMessage

      if (insertError) {
        errorPlacement === 'before'
          ? insertBefore(input, errorNode)
          : insertAfter(input, errorNode)
        parentNode.classList.add(validationErrorParentClass)
      }
    } else {
      parentNode.classList.remove(validationErrorParentClass)
      errorNode.remove()
    }
  }
  input.addEventListener('input', function () {
    // We can only update the error or hide it on input.
    // Otherwise it will show when typing.
    checkValidity({insertError: false})
  })
  input.addEventListener('invalid', function (e) {
    e.preventDefault()
    // We can also create the error in invalid.
    checkValidity({insertError: true})
  })
}

const defaultOptions = {
  invalidClass: 'invalid',
  validationErrorClass: 'validation-error',
  validationErrorParentClass: 'has-validation-error',
  customMessages: {},
  errorPlacement: 'before'
}

// validForm

export default function validForm (element, options) {
  if (!element || !element.nodeName) {
    throw new Error('First arg to validForm must be a form, input, select, or textarea')
  }

  let inputs
  const type = element.nodeName.toLowerCase()

  options = defaults(options, defaultOptions)
  if (type === 'form') {
    inputs = element.querySelectorAll('input, select, textarea')
    focusInvalidInput(element, inputs)
  } else if (type === 'input' || type === 'select' || type === 'textarea') {
    inputs = [element]
  } else {
    throw new Error('Only form, input, select, or textarea elements are supported')
  }

  validFormInputs(inputs, options)
}

function focusInvalidInput (form, inputs) {
  const focusFirst = debounce(100, () => {
    const invalidNode = form.querySelector(':invalid')
    if (invalidNode) invalidNode.focus()
  })
  forEach(inputs, (input) => input.addEventListener('invalid', focusFirst))
}

function validFormInputs (inputs, options) {
  const {invalidClass, customMessages} = options
  forEach(inputs, function (input) {
    toggleInvalidClass(input, invalidClass)
    handleCustomMessages(input, customMessages)
    handleCustomMessageDisplay(input, options)
  })
}

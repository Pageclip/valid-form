import validForm, {
  toggleInvalidClass,
  handleCustomMessages,
  handleCustomMessageDisplay
} from './src/valid-form'

if (typeof module === 'undefined') {
  window.ValidForm = validForm
  ValidForm.toggleInvalidClass = toggleInvalidClass
  ValidForm.handleCustomMessages = handleCustomMessages
  ValidForm.handleCustomMessageDisplay = handleCustomMessageDisplay
} else {
  module.exports = {
    'default': validForm,
    toggleInvalidClass,
    handleCustomMessages,
    handleCustomMessageDisplay
  }
}

# ValidForm

ValidForm is a thin JavaScript wrapper on the HTML5 Form Validation features. It is very small at about 200 lines of code (7k, 5.6k compressed), and it has _no dependencies_. Nope, none.

For background, check out the [blog post](https://pageclip.co/blog/2018-02-20-you-should-use-html5-form-validation.html) that lead to this module.

The HTML5 form validation features are pretty good, but have a couple warts. ValidForm is a layer on the HTML5 features and attempts to augment them with three things:

1. An `invalid` class on inputs when they are invalid. This class provides better user feedback than the `:input` pseudo selector.
2. Support for displaying custom messages by way of HTML attributes or an object on initialization.
3. Validation error messages are displayed in a custom div.

What does it look like (with custom styles)?

<img width="448" alt="screen shot 2018-02-19 at 1 49 08 pm" src="https://user-images.githubusercontent.com/69169/36398386-bb53733a-157b-11e8-9ef4-847b959a5a85.png">

[Try it out &rarr;](http://valid-form.pageclip.co)

## Installing

### Without npm / yarn

If you just want to include a script in an HTML file, you can find the `valid-form.js` and `valid-form.min.js` in the `dist` folder.

There will be a `ValidForm` global.

So you can call `ValidForm(formElement, options)`. Other functions exposed will be properties on `ValidForm`. For example, `ValidForm.handleCustomMessageDisplay(input, options)`

And usage:

```html
<script>
  var formElement = document.querySelector('form')
  ValidForm(formElement)
</script>
```

### With npm / yarn / webpack

```sh
npm install @pageclip/valid-form
# or
yarn add @pageclip/valid-form
```

(Apologies for the scoped package. [NPM is annoying](https://github.com/npm/npm/issues/19438))

Then import it like so:

```js
import ValidForm from '@pageclip/valid-form'
const formElement = document.querySelector('form')
ValidForm(formElement)
```

Or import the other exposed functions if you want to:

```js
import {
  toggleInvalidClass,
  handleCustomMessages,
  handleCustomMessageDisplay
} from '@pageclip/valid-form'
```

## Usage

For the tl;dr, check out the example [code](/Pageclip/valid-form/blob/master/index.html), and see it [in action](http://valid-form.pageclip.co).

The main function is `ValidForm()` which you call with a `<form>` element.

```js
const formElement = document.querySelector('form')
ValidForm(formElement, options) // options optional
```

It will hook the `invalid` and `input` events for `<input>`, `<select>`, and `<textarea>` elements.

You can use any HTML5 validation attributes on these inputs and `ValidForm` will display the same things you would get with raw HTML5 form validation. e.g. `required`, `pattern`, `type`, etc.

```html
<form method="post" action="/">
  <div class="form-group">
    <input required type="email" pattern="[ab]+@.+" />
  </div>

  <div class="form-group">
    <select required>
      <option value="">pick one!</option>
      <option value="cat">Cat</option>
      <option value="dog">Dog</option>
      <option value="catdog">Catdog</option>
    </select>
  </div>

  <div class="form-group">
    <textarea required pattern="[ab ]+"></textarea>
  </div>
</form>
```

CSS styles are __not__ provided by `ValidForm`, so you will need to do your thing. Fortunately, the amount of CSS required is small.

As an example, if you are using bootstrap and all the `ValidForm` defaults, here is how to recreate the example in the image at the top of this readme.

```css
/*
  Style the input itself when it is invalid
*/
.form-control.invalid {
  border-color: red;
}

/*
  Style the validation errors.

  By default, `ValidForm` inserts the `.validation-error` div
  _before_ the input. So we abs position in the top right.

  Why insert before? It is nicer on the user than inserting
  after the input and moving elements down the page.
*/
.form-group {
  position: relative;
}
.form-group .validation-error {
  position: absolute;
  right: 0;
  top: 1px;

  color: red;
  font-size: 14px;
}
```

### The `invalid` Class

The `:invalid` pseudo selector built into the browser isn't very good. If your input is `required` and empty on page load, `:invalid` is true. If you style `:invalid` with, say, a red border, all required fields will be red on page load. Kinda dumb.

The `invalid` class is added only after the user submits the form, then stays until the user fixes the input. An example of what it will generate:

```html
<form method="post" action="/">
  <div class="form-group">
    <!-- invalid class added by ValidForm -->
    <input required class="invalid" type="email" pattern="[ab]+@.+" />
  </div>
</form>
```

And you can style it like so

```css
.invalid {
  border-color: red;
}
```

The class name is configurable in options.

### Custom Messages

Custom messages can be specified in 2 ways:

1. As attributes on the input
2. In a `customMessages` object on the options to `ValidForm()`

Naming of these is based on the [ValidityState](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState) object provided by the browser. For attributes, prepend a `data-`, for the options object use them as is.

Specifying as attributes:

```html
  <form method="post" action="/">
    <input
      required
      type="email"
      pattern="[ab]+@.+"
      data-valueMissing="Enter something, plz"
      data-patternMismatch="Just give me a's and b's"
      data-rangeOverflow="Number too low!"
      data-rangeUnderflow="Number too high!"
      data-stepMismatch="Step doesn't fit into my notches!"
      data-tooLong="Text is too long"
      data-tooShort="Text is too short"
      data-typeMismatch="Hey, this isn't an email"
      data-badInput="Something bad happened"
      />
    </form>
```

Specifying as an object:

```js
const formElement = document.querySelector('form')
ValidForm(formElement, {
  customMessages: {
    valueMissing: "Enter something, plz",
    patternMismatch: "Just give me a's and b's",
    rangeOverflow: "Number too low!",
    rangeUnderflow: "Number too high!",
    stepMismatch: "Step doesn't fit into my notches!",
    tooLong: "Text is too long",
    tooShort: "Text is too short",
    typeMismatch: "Hey, this isn't the correct type",
    badInput: "Something bad happened"

    // Special mismatches for different input types: `${type}Mismatch`
    emailMismatch: "Hey, this isn't an email",
    urlMismatch: "Not a URL :(",
    numberMismatch: "Nope, not a number!",
  }
})
```

Attributes take precedence over the object. So you can provide blanket custom messages with the `customMessages` object, then override with any input specific messages as attributes on the input.

### Custom Message Display

When there is an invalid input, `ValidForm` will do 2 things:

1. Insert a message `<div class="validation-error" />` either before (default) or after the input. Placement and classname are configurable.
2. Add a class (`has-validation-error` is default) to the input's parent element.

When the user fixes the error, the message `div` and the parent class will be removed.

An example of the markup when there is an error:

```html
<form method="post" action="/">
  <div class="form-group has-validation-error">
    <div class="validation-error">Oops, there was an error!</div>
    <input required class="invalid" type="email" pattern="[ab]+@.+" />
  </div>
</form>
```

## API

### ValidForm(element, options)

The main function, and the one you should probably use. e.g.

```js
const formElement = document.querySelector('form')
ValidForm(formElement, {
  invalidClass: 'form-input_invalid',
  errorPlacement: 'after',
  customMessages: {
    valueMissing: 'Enter something tho.'
  }
})
```

* `element` - Can be a `<form>`, `<input>`, `<select>`, or `<textarea>` element. It will throw an error if anything else. When it is a `form`, it will properly focus the first invalid input on submission.
* `options` - (optional) Object
  * `invalidClass` - (default: `'invalid'`) Class applied to input when invalid
  * `validationErrorClass` - (default: `'validation-error'`) Class applied to error message `<div>` when there is a validation error,
  * `validationErrorParentClass` - (default: `'has-validation-error'`) Class applied to ,
  * `errorPlacement` - (default: `'before'`) Where to insert the error message node. It can be `'before'` or `'after'`
  * `customMessages` - (default: `{}`) See [custom messages](#custom-messages) section. When nothing is specified, and for any non-specified message, the browser-default messages will be shown.

`ValidForm()` calls all the following functions. If you want super custom behavior, you can use the following 3 functions.

### toggleInvalidClass(input, invalidClass)

Hooks the `input` and `invalid` events on an input.

* `input` - A `<input>`, `<select>`, or `<textarea>` element.
* `invalidClass` - String class to be applied to input when invalid

### handleCustomMessages(input, customMessages)

Deals with showing custom messages.

* `input` - A `<input>`, `<select>`, or `<textarea>` element.
* `customMessages` - (default: `{}`) See [custom messages](#custom-messages) section. When nothing is specified, and for any non-specified message, the browser-default messages will be shown.

### handleCustomMessageDisplay(input, options)

Shows validation messages in a custom div when there is a validation error.

* `input` - A `<input>`, `<select>`, or `<textarea>` element.
* `options` - (optional) Object
  * `validationErrorClass` - (default: `'validation-error'`) Class applied to error message `<div>` when there is a validation error,
  * `validationErrorParentClass` - (default: `'has-validation-error'`) Class applied to ,
  * `errorPlacement` - (default: `'before'`) Where to insert the error message node. It can be `'before'` or `'after'`

## Developing

Write code in `src`, yo.

```sh
yarn install
yarn build # build all the js
yarn site  # run the example site
```

The site is available at http://localhost:8080.

## License

MIT

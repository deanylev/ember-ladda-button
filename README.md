ember-ladda-button
==============================================================================

Ember wrapper for [Ladda](https://github.com/hakimel/Ladda) spinner buttons.

Installation
------------------------------------------------------------------------------

```
ember install ember-ladda-button
```

Usage
------------------------------------------------------------------------------

The button is themeless, so you will need to style it yourself.

Example usage:

```
<LaddaButton @action={{this.functionThatDoesNotReturnPromise}} @buttonStyle="zoom-out" @inFlight={{this.inFlight}} @text="My Button" @type="submit" />

<LaddaButton @action={{this.functionThatReturnsPromise}} @buttonStyle="expand-down" as |longPress longProgress|>
  {{#if longPress}}
    Long Press Text
  {{else}}
    Short Press Text
  {{/if}}

  {{longProgress}}% of the way to a long press!
</LaddaButton>
```

You can set the default spinner style attributes using the included service:

```
@service laddaButton;

constructor() {
  super(...arguments);

  this.laddaButton.buttonStyle = 'expand-left';
  this.laddaButton.spinnerColor = '#007eff';
  this.laddaButton.spinnerLines = 10;
  this.laddaButton.spinnerSize = 30;
}
```

The arguments you can pass are:

* `action` - The function to call when the button is clicked. If this returns a promise, the button will start spinning when it is clicked, and stop spinning when the promise resolves or rejects. It is called with a boolean indicating whether or not the button was long pressed (if a `longDelay` argument was passed)

* `buttonStyle` - How the spinner should appear while it is active - `'expand-left'` | `'expand-right'` | `'expand-up'` | `'expand-down'` | `'contract'` | `'contract-overlay'` | `'zoom-in'` | `'zoom-out'` | `'slide-left'` | `'slide-right'` | `'slide-up'` | `'slide-down'` - (defaults to `'expand-right'`)

* `disabled` - The `disabled` attribute for the button element - (defaults to `false`)

* `inFlight` - Whether the button should currently be spinning (alternative to returning a promise in `action`) - (defaults to `false`)

* `longDelay` - How long it should take before the button has been considered long pressed (see `action`) (defaults to `undefined`)

* `spinnerColor` - The colour of the spinner - any valid CSS colour value - (defaults to `#fff`)

* `spinnerLines` - The number of lines to be displayed in the spinner - (defaults to 12)

* `spinnerSize`- Pixel dimensions of the spinner - (defaults to dynamic size based on the button height)

* `text` - Text to be displayed on the button (alternative to passing a block) (defaults to `undefined`)

* `type` - The `type` attribute for the button element - `button` | `reset` | `submit` - (defaults to `button`)

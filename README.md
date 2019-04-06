ember-ladda-button
==============================================================================

Ember wrapper for Ladda spinner buttons. Note: these buttons are themeless, you will need to provide your own CSS to style them.


Compatibility
------------------------------------------------------------------------------

* Ember.js v2.18 or above
* Ember CLI v2.13 or above


Installation
------------------------------------------------------------------------------

```
ember install ember-ladda-button
```


Usage
------------------------------------------------------------------------------

```
{{#ladda-button buttonStyle="zoom-out" action=(action "functionThatReturnsPromise")}}My Button{{/ladda-button}}

{{ladda-button text="My Button" type="submit" buttonStyle="zoom-out" action=(action "functionThatReturnsPromise")}}
```

You can set the default button style using the included service.

```
laddaButton: Ember.inject.service(),

init() {
  this._super(...arguments);

  this.set('laddaButton.buttonStyle', 'zoom-out');
}
```


Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).

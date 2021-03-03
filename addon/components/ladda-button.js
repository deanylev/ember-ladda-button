import Component from '@ember/component';
import * as Ladda from 'ladda';
import layout from '../templates/components/ladda-button';
import { inject } from '@ember/service';
import { or } from '@ember/object/computed';
import { resolve } from 'rsvp';

export default Component.extend({
  laddaButton: inject(),

  // meant to be overriden
  action: () => resolve(),
  buttonStyle: null,
  disabled: false,
  inFlight: false,
  spinnerColor: null,
  spinnerLines: null,
  spinnerSize: null,
  text: '',
  type: 'button',

  attributeBindings: [
    '_buttonStyle:data-style',
    '_disabled:disabled',
    '_spinnerColor:data-spinner-color',
    '_spinnerLines:data-spinner-lines',
    '_spinnerSize:data-spinner-size',
    'type'
  ],
  classNames: ['ladda-button'],
  layout,
  tagName: 'button',

  // Ladda usually disables/undisables depending on whether it's spinning
  // or not, but this is incompatible with our bindings, so that behaviour
  // is disabled in our fork, and we manage it with this instead
  _disabled: or('disabled', 'inFlight', '_inFlightPromise'),

  _buttonStyle: or('buttonStyle', 'laddaButton.buttonStyle'),
  _spinnerColor: or('spinnerColor', 'laddaButton.spinnerColor'),
  _spinnerLines: or('spinnerLines', 'laddaButton.spinnerLines'),
  _spinnerSize: or('spinnerSize', 'laddaButton.spinnerSize'),

  _inFlightPromise: false,
  _ladda: null,

  didInsertElement() {
    this._super(...arguments);

    this.set('_ladda', Ladda.create(this.element));

    if (this.get('inFlight')) {
      this.updateLoadingState();
    }
  },

  didUpdateAttrs() {
    this._super(...arguments);

    this.updateLoadingState();
  },

  willDestroy() {
    this.get('_ladda').remove();

    this._super(...arguments);
  },

  updateLoadingState() {
    if (this.get('inFlight') || this.get('_inFlightPromise')) {
      if (!this.get('_ladda').isLoading()) {
        this.get('_ladda').start();
      }
    } else {
      this.get('_ladda').stop();
    }
  },

  click() {
    if (this._disabled) {
      return;
    }

    const maybePromise = this.action();
    // duck typing instead of explicitly checking the instance
    // class because it can be a Promise or RSVP.Promise
    if (maybePromise && typeof maybePromise.finally === 'function') {
      this.set('_inFlightPromise', true);
      this.updateLoadingState();
      maybePromise.finally(() => {
        if (!this.get('isDestroying') && !this.get('isDestroyed')) {
          this.set('_inFlightPromise', false);
          this.updateLoadingState();
        }
      });
    }
  }
});

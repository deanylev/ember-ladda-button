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
  inFlight: false,
  spinnerColor: null,
  spinnerLines: null,
  spinnerSize: null,
  text: '',

  attributeBindings: [
    '_buttonStyle:data-style',
    '_spinnerSize:data-spinner-size',
    '_spinnerColor:data-spinner-color',
    '_spinnerLines:data-spinner-lines',
    'disabled',
    'type'
  ],
  layout,
  tagName: 'button',

  _buttonStyle: or('buttonStyle', 'laddaButton.buttonStyle'),
  _spinnerColor: or('spinnerColor', 'laddaButton.spinnerColor'),
  _spinnerLines: or('spinnerLines', 'laddaButton.spinnerLines'),
  _spinnerSize: or('spinnerSize', 'laddaButton.spinnerSize'),

  ladda: null,

  didInsertElement() {
    this._super(...arguments);

    this.set('ladda', Ladda.create(this.element));

    if (this.get('inFlight')) {
      this.updateLoadingState();
    }
  },

  didUpdateAttrs() {
    this._super(...arguments);

    this.updateLoadingState();
  },

  willDestroy() {
    this.get('ladda').remove();

    this._super(...arguments);
  },

  updateLoadingState() {
    if (this.get('inFlight')) {
      this.get('ladda').start();
    } else {
      this.get('ladda').stop();
    }
  },

  click() {
    const maybePromise = this.action();
    // duck typing instead of explicitly checking the instance
    // class because it can be a Promise or RSVP.Promise
    if (maybePromise && typeof maybePromise.finally === 'function') {
      this.set('inFlight', true);
      this.updateLoadingState();
      maybePromise.finally(() => {
        if (!this.get('isDestroying') && !this.get('isDestroyed')) {
          this.set('inFlight', false);
          this.updateLoadingState();
        }
      });
    }
  }
});

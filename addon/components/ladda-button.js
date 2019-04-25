import Component from '@ember/component';
import layout from '../templates/components/ladda-button';
import Ember from 'ember';
import * as Ladda from 'ladda';

export default Component.extend({
  laddaButton: Ember.inject.service(),

  // meant to be overriden
  text: '',
  buttonStyle: null,
  spinnerSize: null,
  spinnerColor: null,
  spinnerLines: null,
  inFlight: false,
  action: () => Ember.RSVP.resolve(),

  layout,
  ladda: null,
  tagName: 'button',

  _rendered: false,

  attributeBindings: [
    '_buttonStyle:data-style',
    '_spinnerSize:data-spinner-size',
    '_spinnerColor:data-spinner-color',
    '_spinnerLines:data-spinner-lines',
    'disabled',
    'type'
  ],

  _buttonStyle: Ember.computed.or('buttonStyle', 'laddaButton.buttonStyle'),
  _spinnerSize: Ember.computed.or('spinnerSize', 'laddaButton.spinnerSize'),
  _spinnerColor: Ember.computed.or('spinnerColor', 'laddaButton.spinnerColor'),
  _spinnerLines: Ember.computed.or('spinnerLines', 'laddaButton.spinnerLines'),

  inFlightDidChange: Ember.observer('inFlight', function() {
    this.updateLoadingState();
  }),

  init() {
    this._super(...arguments);

    this.set('_rendered', true);
  },

  didInsertElement() {
    this._super(...arguments);

    this.set('ladda', Ladda.create(document.getElementById(this.get('elementId'))));

    if (this.get('inFlight')) {
      Ember.run.next(() => {
        this.updateLoadingState();
      });
    }
  },

  willDestroy() {
    this.set('_rendered', false);

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
    if (typeof maybePromise.finally === 'function') {
      this.set('inFlight', true);
      maybePromise.finally(() => {
        if (this.get('_rendered')) {
          this.set('inFlight', false);
        }
      });
    }
  }
});

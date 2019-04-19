/* global Ladda */

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
  action: () => Ember.RSVP.resolve(),

  layout,
  ladda: null,
  tagName: 'button',

  _buttonStyle: Ember.computed.or('buttonStyle', 'laddaButton.buttonStyle'),
  _spinnerSize: Ember.computed.or('spinnerSize', 'laddaButton.spinnerSize'),
  _spinnerColor: Ember.computed.or('spinnerColor', 'laddaButton.spinnerColor'),
  _spinnerLines: Ember.computed.or('spinnerLines', 'laddaButton.spinnerLines'),

  attributeBindings: [
    '_buttonStyle:data-style',
    '_spinnerSize:data-spinner-size',
    '_spinnerColor:data-spinner-color',
    '_spinnerLines:data-spinner-lines',
    'disabled',
    'type'
  ],

  didInsertElement() {
    this.set('ladda', Ladda.create(document.getElementById(this.get('elementId'))));
  },

  click() {
    this.get('ladda').start();
    this.action().finally(() => this.get('ladda').stop());
  }
});

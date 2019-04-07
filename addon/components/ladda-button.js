/* global Ladda */

import Component from '@ember/component';
import layout from '../templates/components/ladda-button';
import Ember from 'ember';
import * as Ladda from 'ladda';

export default Component.extend({
  laddaButton: Ember.inject.service(),

  // meant to be overriden
  text: '',
  buttonStyle: '',
  action: () => Ember.RSVP.resolve(),

  layout,
  ladda: null,
  tagName: 'button',
  _buttonStyle: Ember.computed.or('buttonStyle', 'laddaButton.buttonStyle'),
  attributeBindings: ['_buttonStyle:data-style', 'disabled', 'type'],

  didInsertElement() {
    this.set('ladda', Ladda.create(document.getElementById(this.get('elementId'))));
  },

  click() {
    this.get('ladda').start();
    this.action().finally(() => this.get('ladda').stop());
  }
});

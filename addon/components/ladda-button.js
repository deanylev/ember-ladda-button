/* global Ladda */

import Component from '@ember/component';
import layout from '../templates/components/ladda-button';
import Ember from 'ember';
import * as Ladda from 'ladda';

export default Component.extend({
  layout,
  ladda: null,
  tagName: 'button',
  attributeBindings: ['buttonStyle:data-style', 'type'],

  text: '',
  buttonStyle: 'expand-right',
  action: () => Ember.RSVP.resolve(),

  didInsertElement() {
    this.set('ladda', Ladda.create(document.getElementById(this.get('elementId'))));
  },

  click() {
    this.get('ladda').start();
    this.action().finally(() => this.get('ladda').stop());
  }
});

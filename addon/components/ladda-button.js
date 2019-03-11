import Component from '@ember/component';
import layout from '../templates/components/ladda-button';
import { v4 } from 'ember-uuid';

export default Component.extend({
  layout,
  ladda: null,
  instanceId: v4(),

  buttonStyle: 'expand-right',
  action: () => Ember.RSVP.resolve(),

  didInsertElement() {
    this.set('ladda', Ladda.create(document.getElementById(this.get('instanceId'))));
  },

  actions: {
    onClick() {
      this.get('ladda').start();
      this.action().finally(() => this.get('ladda').stop());
    }
  }
});

import Controller from '@ember/controller';
import { Promise } from 'rsvp';

export default Controller.extend({
  actions: {
    test() {
      return new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
});

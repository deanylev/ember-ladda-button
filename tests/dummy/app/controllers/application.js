import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    test() {
      return new Promise((resolve, reject) => setTimeout(resolve, 2000));
    }
  }
});

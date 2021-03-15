import Controller from '@ember/controller';
import { action } from '@ember/object';
import { Promise } from 'rsvp';

export default class ApplicationController extends Controller {
  @action
  test() {
    return new Promise((resolve) => setTimeout(resolve, 2000));
  }
}

import Service from '@ember/service';

export type ButtonStyle = 'contract' | 'contract-overlay' | 'expand-down' | 'expand-left' | 'expand-right' | 'expand-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'slide-up' | 'zoom-in' | 'zoom-out';

export default class LaddaButtonService extends Service {
  buttonStyle: ButtonStyle = 'expand-right';
  spinnerColor: null | string = null;
  spinnerLines: null | number = null;
  spinnerSize: null | number = null;
}

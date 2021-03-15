import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import { LaddaButton as Ladda, create } from 'ladda';

import LaddaButtonService, { ButtonStyle } from 'ember-ladda-button/services/ladda-button';

interface Action {
  (): unknown;
  (): Promise<unknown>;
}

interface Args {
  action?: Action;
  buttonStyle?: ButtonStyle;
  class?: string;
  disabled?: boolean;
  inFlight?: boolean;
  spinnerColor?: string;
  spinnerLines?: number;
  spinnerSize?: number;
  text?: string;
  type?: 'button' | 'reset' | 'submit';
}

export default class LaddaButton extends Component<Args> {
  @service declare laddaButton: LaddaButtonService;

  @tracked inFlightPromise = false;
  ladda: null | Ladda = null;

  get buttonStyle() {
    return this.args.buttonStyle ?? this.laddaButton.buttonStyle;
  }

  // Ladda usually disables/undisables depending on whether it's spinning
  // or not, but this is incompatible with our bindings, so that behaviour
  // is disabled in our fork, and we manage it with this instead
  get disabled() {
    return this.args.disabled || this.args.inFlight || this.inFlightPromise;
  }

  get spinnerColor() {
    return this.args.spinnerColor ?? this.laddaButton.spinnerColor;
  }

  get spinnerLines() {
    return this.args.spinnerLines ?? this.laddaButton.spinnerLines;
  }

  get spinnerSize() {
    return this.args.spinnerSize ?? this.laddaButton.spinnerSize;
  }

  get type() {
    return this.args.type ?? 'button';
  }

  @action
  didInsert(element: HTMLButtonElement) {
    this.ladda = create(element);

    if (this.args.inFlight) {
      this.updateLoadingState();
    }
  }

  @action
  handleClick() {
    const { action } = this.args;
    if (!action || this.disabled) {
      return;
    }

    const maybePromise = action();
    // duck typing instead of explicitly checking the instance
    // class because it can be a Promise or RSVP.Promise
    if (maybePromise && typeof (maybePromise as Promise<unknown>).finally === 'function') {
      this.inFlightPromise = true;
      this.updateLoadingState();
      (maybePromise as Promise<unknown>).finally(() => {
        if (!this.isDestroying) {
          this.inFlightPromise = false;
          this.updateLoadingState();
        }
      });
    }
  }

  @action
  updateLoadingState() {
    if (this.args.inFlight || this.inFlightPromise) {
      if (!this.ladda?.isLoading()) {
        this.ladda?.start();
      }
    } else {
      this.ladda?.stop();
    }
  }

  willDestroy() {
    this.ladda?.remove();
  }
}

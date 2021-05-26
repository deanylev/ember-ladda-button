import { action } from '@ember/object';
import { cancel, later, run } from '@ember/runloop';
import { EmberRunTimer } from '@ember/runloop/types';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import { LaddaButton as Ladda, create } from 'ladda';

import LaddaButtonService, { ButtonStyle } from 'ember-ladda-button/services/ladda-button';

interface Action {
  (longPress: boolean): unknown;
  (longPress: boolean): Promise<unknown>;
}

interface Args {
  action?: Action;
  buttonStyle?: ButtonStyle;
  class?: string;
  disabled?: boolean;
  inFlight?: boolean;
  longDelay?: number;
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
  longLater: EmberRunTimer | null = null;
  @tracked longPress = false;
  @tracked longProgress = 0;
  longProgressInterval: number | null = null;

  get buttonStyle() {
    return this.args.buttonStyle ?? this.laddaButton.buttonStyle;
  }

  // Ladda usually disables/undisables depending on whether it's spinning
  // or not, but this is incompatible with our bindings, so that behaviour
  // is disabled in our fork, and we manage it with this instead
  get disabled() {
    return this.args.disabled || this.args.inFlight || this.inFlightPromise;
  }

  get inFlight() {
    return this.args.inFlight || this.inFlightPromise
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

  cancelLongTimers() {
    if (this.longLater) {
      cancel(this.longLater);
      this.longLater = null;
    }

    if (this.longProgressInterval) {
      clearInterval(this.longProgressInterval);
      this.longProgressInterval = null;
    }
  }

  clearLongState() {
    this.longPress = false;
    this.longProgress = 0;
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
      this.clearLongState();
      this.cancelLongTimers();
      return;
    }

    if (!this.longPress) {
      this.longProgress = 0;
      this.cancelLongTimers();
    }

    const maybePromise = action(this.longPress);
    // duck typing instead of explicitly checking the instance
    // class because it can be a Promise or RSVP.Promise
    if (maybePromise && typeof (maybePromise as Promise<unknown>).finally === 'function') {
      this.inFlightPromise = true;
      this.updateLoadingState();
      (maybePromise as Promise<unknown>).finally(() => {
        if (!this.isDestroying) {
          this.inFlightPromise = false;
          this.clearLongState();
          this.updateLoadingState();
        }
      });
    } else {
      this.clearLongState();
    }
  }

  @action
  handleMouseDown() {
    const { longDelay } = this.args;
    if (longDelay) {
      this.longLater = later(this, () => {
        this.longProgress = 100;
        this.longPress = true;

        if (this.longProgressInterval) {
          clearInterval(this.longProgressInterval);
          this.longProgressInterval = null;
        }
      }, longDelay);

      const startedAt = performance.now();
      this.longProgressInterval = window.setInterval(() => {
        run(() => {
          const elapsed = performance.now() - startedAt;
          this.longProgress = Math.round(elapsed / longDelay * 100);
        });
      }, 50);
    }
  }

  @action
  handleMouseLeave() {
    this.longPress = false;
    this.longProgress = 0;
    this.cancelLongTimers();
  }

  @action
  updateLoadingState() {
    if (this.inFlight) {
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

import { get } from '@client-utils/transport';

import type { InitParams, PingCallback } from './types';

class Observer {
  private callback: PingCallback;
  private interval: number;
  private url: string;
  private pingId: number;
  private deliveryAttempt: number;
  private intervalInstance: NodeJS.Timer;

  constructor(params: InitParams) {
    const { url, callback, interval } = params;

    this.url = url;
    this.callback = callback;
    this.interval = interval;

    this.pingId = 0;
    this.deliveryAttempt = 0;
  }

  public start(): void {
    this.intervalInstance = setInterval(() => this.ping(), this.interval);
  }

  public stop(): void {
    clearInterval(this.intervalInstance);
  }

  private ping(): void {
    const startTS = Date.now();
    get(this.url)
      .then(() => {
        const pingTS = Date.now();

        this.callback({
          pingId: this.pingId++,
          deliveryAttempt: this.deliveryAttempt,
          date: startTS,
          responseTime: pingTS - startTS,
        });
      })
      .catch(() => null)
      .finally(() => (this.deliveryAttempt += 1));
  }
}

export default Observer;

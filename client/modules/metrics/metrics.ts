import { post } from '@client-utils/transport';

import type { ServerResponse } from '@client-utils/transport';
import type { InitParams, Statistic } from './types';

class Metrics<M extends {}> {
  private metricsUrl: string;
  private timeout: number;
  private retryDelay: number;
  private requestsCount: number;
  private successfulRequests: number;
  private internalServerErrors: number;
  private timeoutedRequests: number;
  private pendingRequests: number;
  private onAttempt: (data: M) => void;
  private onSuccess: (data: M) => void;
  private onFail: (data: M) => void;
  private onTimeout: (data: M) => void;

  constructor(params: InitParams<M>) {
    const {
      metricsUrl,
      timeout,
      retryDelay,
      onAttempt,
      onSuccess,
      onFail,
      onTimeout,
    } = params;

    this.metricsUrl = metricsUrl;
    this.timeout = timeout;
    this.retryDelay = retryDelay;

    this.onAttempt = onAttempt;
    this.onSuccess = onSuccess;
    this.onFail = onFail;
    this.onTimeout = onTimeout;

    this.requestsCount = 0;
    this.successfulRequests = 0;
    this.internalServerErrors = 0;
    this.timeoutedRequests = 0;
    this.pendingRequests = 0;
  }

  public sendMetrics(data: M, attempt = 0): void {
    const controller = new AbortController();
    let timer: NodeJS.Timer;
    this.requestsCount += 1;
    this.pendingRequests += 1;

    if (this.onAttempt) {
      this.onAttempt(data);
    }

    post(this.metricsUrl, { signal: controller.signal }, data)
      .then(() => {
        this.successfulRequests += 1;

        if (this.onSuccess) {
          this.onSuccess(data);
        }
      })
      .catch((response: ServerResponse) => {
        if (response.statusCode >= 500) {
          this.internalServerErrors += 1;
        }

        if (this.onFail) {
          this.onFail(data);
        }

        const retryDelay = Math.pow(2, attempt) * this.retryDelay;
        setTimeout(() => this.sendMetrics(data, attempt + 1), retryDelay);
      })
      .finally(() => {
        clearTimeout(timer);
        this.pendingRequests -= 1;
      });

    timer = setTimeout(() => {
      controller.abort();
      this.timeoutedRequests += 1;

      if (this.onTimeout) {
        this.onTimeout(data);
      }
    }, this.timeout);
  }

  public get statistic(): Statistic {
    return {
      totalRequests: this.requestsCount - this.pendingRequests,
      successfulRequests: this.successfulRequests,
      internalErrors: this.internalServerErrors,
      timeoutedRequests: this.timeoutedRequests,
    };
  }
}

export default Metrics;

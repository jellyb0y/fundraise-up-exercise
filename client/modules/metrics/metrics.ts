import { post } from '@client-utils/transport';

import type { ServerResponse } from '@client-utils/transport';
import type { InitParams, Statistic } from './types';

class Metrics<M extends {}> {
  private metricsUrl: string;
  private timeout: number;
  private requestsCount: number;
  private successfulRequests: number;
  private internalServerErrors: number;
  private timeoutedRequests: number;
  private pendingRequests: number;
  private failedRequests: number;

  constructor(params: InitParams) {
    const { metricsUrl, timeout } = params;

    this.metricsUrl = metricsUrl;
    this.timeout = timeout;

    this.requestsCount = 0;
    this.successfulRequests = 0;
    this.internalServerErrors = 0;
    this.timeoutedRequests = 0;
    this.pendingRequests = 0;
    this.failedRequests = 0;
  }

  public sendMetrics(data: M): void {
    const controller = new AbortController();
    let timer: NodeJS.Timer;
    this.requestsCount += 1;
    this.pendingRequests += 1;

    post(this.metricsUrl, { signal: controller.signal }, data)
      .then(() => {
        this.successfulRequests += 1;
      })
      .catch((response: ServerResponse) => {
        if (response.statusCode >= 500) {
          this.internalServerErrors += 1;
        }

        this.failedRequests += 1;
      })
      .finally(() => {
        clearTimeout(timer);
        this.pendingRequests -= 1;
      });

    timer = setTimeout(() => {
      controller.abort();
      this.timeoutedRequests += 1;
    }, this.timeout);
  }

  public getStatistic(): Statistic {
    return {
      totalRequests: this.requestsCount - this.pendingRequests,
      successfulRequests: this.successfulRequests,
      internalErrors: this.internalServerErrors,
      failedRequests: this.failedRequests,
      timeoutedRequests: this.timeoutedRequests,
    };
  }
}

export default Metrics;

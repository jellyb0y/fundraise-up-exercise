import { PingData } from '@server-types';

import type { Statistic } from './types';

class Metrics {
  private totalPings: number;
  private totalTime: number;
  private minPing: number;
  private maxPing: number;

  constructor() {
    this.totalPings = 0;
    this.totalTime = 0;
  }

  public pushMetrics(data: PingData) {
    const { responseTime } = data;

    this.totalPings += 1;
    this.totalTime += responseTime;

    if (!this.minPing || responseTime < this.minPing) {
      this.minPing = responseTime;
    }

    if (!this.maxPing || responseTime > this.maxPing) {
      this.maxPing = responseTime;
    }
  }

  public get statistic(): Statistic {
    const averagePing = this.totalTime / this.totalPings;
    const medianPing = (this.maxPing + this.minPing) / 2;

    return {
      averagePing: averagePing || 0,
      medianPing: medianPing || 0,
    };
  }
}

export default Metrics;

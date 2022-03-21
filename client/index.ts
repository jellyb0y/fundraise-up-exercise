import Metrics from '@client-modules/metrics';
import Observer from '@client-modules/observer';

import {
  METRICS_RETRY_DELAY,
  METRICS_TIMEOUT,
  METRICS_URL,
  PING_INTERVAL,
  PING_URL,
} from '@client-constants';

import type { PingData } from '@client-modules/observer';

const metrics = new Metrics<PingData>({
  timeout: METRICS_TIMEOUT,
  metricsUrl: METRICS_URL,
  retryDelay: METRICS_RETRY_DELAY,
});

const observer = new Observer({
  callback: (data) => metrics.sendMetrics(data),
  interval: PING_INTERVAL,
  url: PING_URL,
});

observer.start();

const handleProccessInterupt = () => {
  const {
    totalRequests,
    successfulRequests,
    internalErrors,
    timeoutedRequests,
  } = metrics.statistic;

  console.log(
    '\n' +
      `Total requests: ${totalRequests}\n` +
      `Successful request: ${successfulRequests}\n` +
      `Internal errors: ${internalErrors}\n` +
      `Timeouted requests: ${timeoutedRequests}`
  );

  process.exit();
};

process.on('SIGINT', handleProccessInterupt);
process.on('SIGTERM', handleProccessInterupt);

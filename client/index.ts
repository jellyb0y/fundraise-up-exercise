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

const onAttempt = ({ pingId }: PingData) =>
  console.log(`Attempt to send pingId: ${pingId}`);

const onSuccess = ({ pingId }: PingData) =>
  console.log(`Succeeded to send pingId: ${pingId}`);

const onFail = ({ pingId }: PingData) =>
  console.log(`Failed to send pingId: ${pingId}`);

const onTimeout = ({ pingId }: PingData) =>
  console.log(`Timout error while sending pingId: ${pingId}`);

const metrics = new Metrics<PingData>({
  timeout: METRICS_TIMEOUT,
  metricsUrl: METRICS_URL,
  retryDelay: METRICS_RETRY_DELAY,
  onAttempt,
  onSuccess,
  onFail,
  onTimeout,
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

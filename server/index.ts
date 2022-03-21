import handler, { Events } from '@server-modules/handler';
import Metrics from '@server-modules/metrics';

import { createServer } from '@server-utils/server';

import { SERVER_HOST, SERVER_PORT } from '@server-constants';

import type { PingData } from '@server-types';

const metrics = new Metrics();

const server = createServer<PingData>((data, session) => {
  const event = handler(session);

  if (event === Events.GoodResponse) {
    console.log('Received data:', data);
  }

  metrics.pushMetrics(data);
}, console.error);

server.listen(SERVER_PORT, SERVER_HOST);

const handleProccessInterupt = () => {
  const { averagePing, medianPing } = metrics.statistic;

  console.log(
    '\n' +
      `Average ping: ${averagePing.toFixed(2)}\n` +
      `Median ping: ${medianPing.toFixed(2)}`
  );

  process.exit();
};

process.on('SIGINT', handleProccessInterupt);
process.on('SIGTERM', handleProccessInterupt);

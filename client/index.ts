import Observer from '@client-modules/observer';

import { PING_INTERVAL, PING_URL } from '@client-constants';

const observer = new Observer({
  interval: PING_INTERVAL,
  url: PING_URL,
  callback: console.log,
});

observer.start();

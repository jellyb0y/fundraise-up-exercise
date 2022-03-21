import { getRandomEvent } from '@server-utils/random';

import {
  BAD_RESPONSE_RATE,
  GOOD_RESPONSE_RATE,
  TIMEOUT_RESPONSE_RATE,
} from '@server-constants';

import type { Session } from '@server-utils/server';

export enum Events {
  GoodResponse = 'goodResponse',
  BadResponse = 'badResponse',
  TimeoutResponse = 'timeoutResponse',
}

const handler = (session: Session): string => {
  const { write, close } = session;

  const event = getRandomEvent({
    [Events.GoodResponse]: GOOD_RESPONSE_RATE,
    [Events.BadResponse]: BAD_RESPONSE_RATE,
    [Events.TimeoutResponse]: TIMEOUT_RESPONSE_RATE,
  });

  switch (event) {
    case Events.GoodResponse:
      write('OK');
      close();
      return Events.GoodResponse;

    case Events.BadResponse:
      close(500);
      return Events.BadResponse;

    case Events.TimeoutResponse:
      return Events.TimeoutResponse;

    default:
      close();
  }
};

export default handler;

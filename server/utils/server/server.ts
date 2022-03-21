import http from 'http';

import type { Callback, ErrorCallback, Session } from './types';

export const createServer = <T>(
  callback: Callback<T>,
  errorCallback: ErrorCallback
) =>
  http.createServer(async (req, res) => {
    const close = (code = 200): void => {
      res.statusCode = code;
      res.end();
    };

    const write = (message: string): void => {
      res.write(message);
    };

    const session: Session = {
      req,
      res,
      write,
      close,
    };

    try {
      const buffers = [];

      for await (const chunk of req) {
        buffers.push(chunk);
      }

      const dataString = Buffer.concat(buffers).toString();
      const data = JSON.parse(dataString);

      callback(data, session);
    } catch (error) {
      errorCallback(error);
      close(500);
    }
  });

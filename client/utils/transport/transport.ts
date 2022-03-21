import { ClientRequest, request as httpRequest } from 'http';
import { request as httpsRequest } from 'https';

import type { IncomingMessage, RequestOptions } from 'http';
import type { RequestParams, ServerResponse } from './types';

const transport = <T extends {}>(
  url: string,
  params?: RequestOptions,
  data?: T,
  dontFollow = false
): Promise<ServerResponse> =>
  new Promise((resolve, reject) => {
    if (!url) {
      reject('Invalid url');
      return;
    }

    const [_, protocol, host, port, path] =
      url.match(/^(http:\/\/|https:\/\/)([^/:]+)(:\d{1,5})?(.*)?$/) || [];

    if (!host) {
      reject('Invalid host');
      return;
    }

    const requestParams: RequestOptions = {
      host,
      port: port?.replace(':', ''),
      protocol: protocol?.replace('//', ''),
      path,
      ...params,
    };

    const requestData = data && JSON.stringify(data);

    if (params.method === 'POST' && requestData) {
      requestParams.headers = {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestData),
        ...params?.headers,
      };
    }

    const handleResponse = (res: IncomingMessage) => {
      const { method, statusCode, statusMessage, headers } = res;

      if (!dontFollow && headers.location) {
        resolve(transport(headers.location, params, data));
        return;
      }

      let body = '';
      res.on('data', (chunk) => {
        body += chunk.toString();
      });

      res.on('end', () => {
        const response = {
          method,
          url,
          statusCode,
          statusMessage,
          headers,
          body,
        };

        if (statusMessage === 'OK') {
          resolve(response);
        } else {
          reject(response);
        }
      });
    };

    let request: ClientRequest;
    if (requestParams.protocol === 'https:') {
      request = httpsRequest(requestParams, handleResponse);
    } else {
      request = httpRequest(requestParams, handleResponse);
    }

    if (requestData) {
      request.write(requestData);
    }

    request.end();
    request.on('error', reject);
  });

export const get = (
  url: string,
  params?: RequestParams,
  dontFollow = false
): Promise<ServerResponse> =>
  transport(
    url,
    {
      ...params,
      method: 'GET',
    },
    undefined,
    dontFollow
  );

export const post = <T extends {}>(
  url: string,
  params?: RequestParams,
  data?: T,
  dontFollow = false
): Promise<ServerResponse> =>
  transport(
    url,
    {
      ...params,
      method: 'POST',
    },
    data,
    dontFollow
  );

export default transport;

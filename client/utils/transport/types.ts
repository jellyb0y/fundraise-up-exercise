import { IncomingHttpHeaders, RequestOptions } from 'http';

export type RequestParams = Omit<RequestOptions, 'method'>;

export interface ServerResponse {
  headers: IncomingHttpHeaders;
  body: string;
  method?: string;
  url?: string;
  statusCode?: number;
  statusMessage?: string;
}

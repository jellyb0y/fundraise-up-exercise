import { IncomingMessage, ServerResponse } from 'http';

export type CloseCallback = (code?: number) => void;

export type WriteCallback = (message: string) => void;

export interface Session {
  req: IncomingMessage;
  res: ServerResponse;
  write: WriteCallback;
  close: CloseCallback;
}

export type Callback<T> = (data: T, session: Session) => void;

export type ErrorCallback = (error: Error) => void;

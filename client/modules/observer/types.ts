export interface PingData {
  pingId: number;
  deliveryAttempt: number;
  date: number;
  responseTime: number;
}

export type PingCallback = (response: PingData) => void;

export interface InitParams {
  url: string;
  callback: PingCallback;
  interval: number;
}

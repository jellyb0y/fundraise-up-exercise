export interface InitParams {
  metricsUrl: string;
  timeout: number;
}

export interface Statistic {
  totalRequests: number;
  successfulRequests: number;
  internalErrors: number;
  failedRequests: number;
  timeoutedRequests: number;
}

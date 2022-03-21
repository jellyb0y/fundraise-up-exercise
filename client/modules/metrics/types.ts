export interface InitParams {
  metricsUrl: string;
  timeout: number;
  retryDelay: number;
}

export interface Statistic {
  totalRequests: number;
  successfulRequests: number;
  internalErrors: number;
  timeoutedRequests: number;
}

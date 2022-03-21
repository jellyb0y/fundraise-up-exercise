export interface InitParams {
  metricsUrl: string;
  timeout: number;
}

export interface Statistic {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  timeoutedRequests: number;
}

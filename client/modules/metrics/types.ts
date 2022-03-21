export interface InitParams<M> {
  metricsUrl: string;
  timeout: number;
  retryDelay: number;
  onAttempt?: (data: M) => void;
  onSuccess?: (data: M) => void;
  onFail?: (data: M) => void;
  onTimeout?: (data: M) => void;
}

export interface Statistic {
  totalRequests: number;
  successfulRequests: number;
  internalErrors: number;
  timeoutedRequests: number;
}

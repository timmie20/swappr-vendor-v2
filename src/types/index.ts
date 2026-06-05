export type Dropdown = {
  label: string;
  value: string;
};

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiReject {
  message: string;
  statusCode: number;
  error?: string;
}

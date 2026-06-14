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

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-object-type
export type KeyedApiResponse<TData extends Record<string, any> = {}> = {
  message?: string;
} & TData;

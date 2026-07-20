export type Dropdown = {
  label: string;
  value: string;
};

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiReject {
  message?: string | string[];
  error?: string;
  statusCode?: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-object-type
export type KeyedApiResponse<TData extends Record<string, any> = {}> = {
  message?: string;
} & TData;

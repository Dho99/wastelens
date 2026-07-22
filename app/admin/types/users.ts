export type User = {
  id: string;
  nama: string;
  email: string;
  role: string;
  status: string;
  saldo_koin: number;
  createdAt: string;
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ListResult<T> = {
  items: T[];
  pagination: Pagination;
};

export type CreateUserPayload = Record<string, string | boolean>;

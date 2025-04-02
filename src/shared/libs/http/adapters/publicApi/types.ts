import type { Method } from '../../types';

export enum SecuredUrlType {
  SECURED = 'secured',
  ANON = 'anon',
}

export enum SecuredType {
  SECURED = 'PublicSecured',
  ANON = 'PublicAnon',
}

export type PublicApiV1Params = {
  url: string;
  type(securedType: string): string;
  secured?: boolean;
  data?: Record<string, unknown>;
};
export enum PublicApiV1ErrorType {
  VALIDATION = 'VALIDATION',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
}
export type PublicApiV1ResponsePagination = {
  pageNumber: number;
  perPage: number;
  total: number;
};

export type PublicApiV1ResponseSuccess<T> = {
  responseId: string;
  error: null;
  data: T;
  pagination?: PublicApiV1ResponsePagination;
};
export type PublicApiV1ResponseError = {
  responseId: string;
  error: {
    type: PublicApiV1ErrorType;
    description: string;
  };
  data: null;
};
export type PublicApiV1Response<T> = PublicApiV1ResponseSuccess<T> | PublicApiV1ResponseError;

export type PublicApiParams = {
  data?: Record<string, unknown>;
  method?: Method;
};

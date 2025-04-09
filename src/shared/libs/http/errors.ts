export enum JsonHttpErrorType {
  JSON_PARSE = 'JSON_PARSE',
  SERVER = 'SERVER',
  TIMEOUT = 'TIMEOUT',
  UNKNOWN = 'UNKNOWN',
}
export type JsonHttpErrorBase = {
  url: string;
  method: string;
};
export type JsonHttpErrorJsonParseParams = JsonHttpErrorBase & {
  type: JsonHttpErrorType.JSON_PARSE;
  textOutput: string;
};
export type JsonHttpErrorServerParams = JsonHttpErrorBase & {
  type: JsonHttpErrorType.SERVER;
  status: number;
  statusText: string;
  data?: unknown;
};
export type JsonHttpErrorTimeoutParams = JsonHttpErrorBase & {
  type: JsonHttpErrorType.TIMEOUT;
  error: unknown;
};
export type JsonHttpErrorUnknownParams = JsonHttpErrorBase & {
  type: JsonHttpErrorType.UNKNOWN;
  error: unknown;
};

export type JsonHttpErrorParams =
  | JsonHttpErrorJsonParseParams
  | JsonHttpErrorServerParams
  | JsonHttpErrorTimeoutParams
  | JsonHttpErrorUnknownParams;

export class JsonHttpError<T extends JsonHttpErrorParams = JsonHttpErrorParams> extends Error {
  public error: T;

  constructor(error: T) {
    super();
    this.error = error;
  }
}

type TypeLess<T> = Omit<T, 'type'>;
export class JsonHttpServerError extends JsonHttpError<JsonHttpErrorServerParams> {
  constructor(error: TypeLess<JsonHttpErrorServerParams>) {
    super({
      ...error,
      type: JsonHttpErrorType.SERVER,
    });
  }
}

export class JsonHttpJsonParseError extends JsonHttpError {
  constructor(error: TypeLess<JsonHttpErrorJsonParseParams>) {
    super({
      ...error,
      type: JsonHttpErrorType.JSON_PARSE,
    });
  }
}

export class JsonHttpTimeoutError extends JsonHttpError {
  constructor(error: TypeLess<JsonHttpErrorTimeoutParams>) {
    super({
      ...error,
      type: JsonHttpErrorType.TIMEOUT,
    });
  }
}

export class JsonHttpUnknownError extends JsonHttpError {
  constructor(error: TypeLess<JsonHttpErrorUnknownParams>) {
    super({
      ...error,
      type: JsonHttpErrorType.UNKNOWN,
    });
  }
}

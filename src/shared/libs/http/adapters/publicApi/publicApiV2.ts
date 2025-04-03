import { v4 as uuid } from 'uuid';
import { jsonHttp } from '../../http';
import { type PublicApiV1Params, type PublicApiV1Response, SecuredType, SecuredUrlType } from './types';

export function publicApiV2<R = unknown>(params: PublicApiV1Params) {
  const { url, type, secured = false, data = {} } = params;
  const trimmedUrl = url[0] === '/' ? url.slice(1) : url;

  const securedType = secured ? SecuredUrlType.SECURED : SecuredUrlType.ANON;
  return jsonHttp<PublicApiV1Response<R>>(`/public-api/v2/json/${securedType}/${trimmedUrl}`, {
    method: 'post',
    body: JSON.stringify({
      type: type(secured ? SecuredType.SECURED : SecuredType.ANON),
      requestId: uuid(),
      ...data,
    }),
  });
}

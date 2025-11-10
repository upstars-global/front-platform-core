import { v4 as uuid } from 'uuid';
import { jsonHttp } from '../../http';
import { type PublicApiV1Params, type PublicApiV1Response, SecuredType, SecuredUrlType } from './types';

/**
 * add "/public-api/v1/json/" + "secured/" or "anon/" (depends on the `secured` options in arguments, "anon" default)
 * and trim the url you passed
 *
 * POST method - default
 *
 * publicApiV1({ url: "verify-email" }); // /public-api/v1/json/anon/verify-email
 *
 * publicApiV1({ url: "verify-email", secured: true }); // /public-api/v1/json/secured/verify-email
 *
 * publicApiV1({ url: "upload", formData: myFormData }); // Send FormData with multipart/form-data
 */
export function publicApiV1<R = unknown>(params: PublicApiV1Params) {
  const { url, type, secured = false, data = {}, formData } = params;
  const trimmedUrl = url[0] === '/' ? url.slice(1) : url;

  const securedType = secured ? SecuredUrlType.SECURED : SecuredUrlType.ANON;
  const requestId = uuid();
  const typeValue = type(secured ? SecuredType.SECURED : SecuredType.ANON);

  let body: string | FormData;

  if (formData) {
    // When using FormData, append type and requestId to it
    formData.append('type', typeValue);
    formData.append('requestId', requestId);
    body = formData;
  } else {
    // Use JSON for regular data
    body = JSON.stringify({
      type: typeValue,
      requestId,
      ...data,
    });
  }

  return jsonHttp<PublicApiV1Response<R>>(`/public-api/v1/json/${securedType}/${trimmedUrl}`, {
    method: 'post',
    body,
  });
}

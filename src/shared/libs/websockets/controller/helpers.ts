import { isServer } from '../../../helpers';

function makeid(length: number) {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result = result + characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function getWebsocketsPath(hostnameAndProtocol?: string | null) {
  if (isServer) {
    throw new Error('websocketController should work only in browser');
  }
  const defaultHostNameAndProtocol = `wss://${window.location.hostname}`
  const selectedHostNameAndProtocol = hostnameAndProtocol || defaultHostNameAndProtocol;

  const serverId = Math.floor(Math.random() * 100);
  const sessionId = makeid(8);
  return `${selectedHostNameAndProtocol}/sock/${ serverId }/${ sessionId }/websocket`;
}

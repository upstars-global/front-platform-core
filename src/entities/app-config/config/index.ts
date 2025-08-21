type MirrorDomainKeyGetter = string | null;
type FreshChatConfigKeyGetter = string | null;

let mirrorDomainKeyGetter: MirrorDomainKeyGetter = null;
let freshChatConfigKeyGetter: FreshChatConfigKeyGetter = null;

export function getConfig() {
  return {
    mirrorDomainKeyGetter,
    freshChatConfigKeyGetter,
  };
}

export const configAppGlobalConfig = {
  setMirrorDomainKey: (value: string) => {
    mirrorDomainKeyGetter = value;
  },
  setFreshChatConfigKey: (value: string) => {
    freshChatConfigKeyGetter = value;
  },
};

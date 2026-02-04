## [7.10.0](https://github.com/upstars-global/front-platform-core/compare/v7.9.0...v7.10.0) (2026-02-02)

### 🚀 Features

* **FP-4474:** add GBP currency to Currency enum
 ([5623f38](https://github.com/upstars-global/front-platform-core/commit/5623f3886d84dcc39457601f3483fd052cc495c8))

## [7.9.0](https://github.com/upstars-global/front-platform-core/compare/v7.8.0...v7.9.0) (2026-01-08)

### 🚀 Features

* **FP-4441:** track window close events to distinguish fetch errors caused by navigation
 ([5516df8](https://github.com/upstars-global/front-platform-core/commit/5516df81c5599b3063f880e2692a73d51e4143ea))

## [7.8.0](https://github.com/upstars-global/front-platform-core/compare/v7.7.0...v7.8.0) (2026-01-07)

### 🐛 Bug Fixes

* **FP-4400:** handle local storage errors in client notifications logic
 ([daf2d53](https://github.com/upstars-global/front-platform-core/commit/daf2d53192b79a986aee5e960dc8b086a924b9fc))



### 🚀 Features

* **FP-4400:** add client notifications handling with API integration and local storage support
 ([90e3d98](https://github.com/upstars-global/front-platform-core/commit/90e3d98037b17cc33c8143256a91db74c4443b7d))


* **FP-4400:** simplify client notifications type structure and API usage
 ([1f22f33](https://github.com/upstars-global/front-platform-core/commit/1f22f33d4d2e1ca354ee4878f4ba31febe25b614))


* **FP-4400:** update client notification error message, add notification id to message
 ([364e81c](https://github.com/upstars-global/front-platform-core/commit/364e81ce6cc41baaf530f3ce5190e23d80cd05a6))



### 🔨 Refactoring

* **FP-4400:** add custom error class for client notifications and improve error handling
 ([ce5f1e6](https://github.com/upstars-global/front-platform-core/commit/ce5f1e6dc1a0ce1149668565076e5425fea653ad))


* **FP-4400:** add export to ClientNotificationError class
 ([5c188c1](https://github.com/upstars-global/front-platform-core/commit/5c188c12528dcc2a52286423b372caa55d1c7d03))


* **FP-4400:** remove redundant error handling in client notifications logic
 ([6677bde](https://github.com/upstars-global/front-platform-core/commit/6677bde9f3a96b9912e34f6f88b754f8a4555ae1))


* **FP-4400:** rename and update client notifications logic
 ([f06bc09](https://github.com/upstars-global/front-platform-core/commit/f06bc095b58d14885ddf8a7b07560c4d0234da70))


* **FP-4400:** replace manual local storage handling with LocalStorageKeyController
 ([24b90b7](https://github.com/upstars-global/front-platform-core/commit/24b90b78eb54f42ace9946250d2384f3138e52e7))


* **FP-4400:** simplify error handling in client notifications logic
 ([b225481](https://github.com/upstars-global/front-platform-core/commit/b225481d8fcc70baba4eb1b497f7aab679725c81))

## [7.7.0](https://github.com/upstars-global/front-platform-core/compare/v7.6.0...v7.7.0) (2025-12-31)

### 🐛 Bug Fixes

* **FP-4407:**  `loadStatusData` add ` reload: true ` in `useInitStatusVipSettingWebsockets`
 ([b3dc9b3](https://github.com/upstars-global/front-platform-core/commit/b3dc9b3b54e569d0a3a6e560bc8486ba3457b100))



### 🚀 Features

* **FP-4407:** add `useInitStatusVipSettingWebsockets` to handle SEASON_CHANGED events
 ([44c9e2c](https://github.com/upstars-global/front-platform-core/commit/44c9e2cc68b1a99aaf7927774111dd870adff907))



### 🔨 Refactoring

* **FP-4407:** remove unused `useUserProfile` import and references from websocket handlers
 ([a72fb38](https://github.com/upstars-global/front-platform-core/commit/a72fb387df3ddf50319f2334d3eecaab1ffbaf75))

## [7.6.0](https://github.com/upstars-global/front-platform-core/compare/v7.5.3...v7.6.0) (2025-12-18)

### 🚀 Features

* **FP-4230:** add remind form and restore password request functionality
 ([47a67bf](https://github.com/upstars-global/front-platform-core/commit/47a67bf29d3fa8a0db9cc046f7756ab4f25f501f))


* **FP-4230:** added clearGLobalError
 ([4b4d5ea](https://github.com/upstars-global/front-platform-core/commit/4b4d5eab74c7a67610384587f9453bb6cf3e0a24))


* **FP-4230:** added tests for new email regex
 ([a9c0835](https://github.com/upstars-global/front-platform-core/commit/a9c08352f4650bf9aa2f8473f53b41359520d6b4))


* **FP-4230:** change restore scheme
 ([e491567](https://github.com/upstars-global/front-platform-core/commit/e4915679a5a6c98e882707b9c7d5613060a2e57d))


* **FP-4230:** change schema for auth
 ([8249163](https://github.com/upstars-global/front-platform-core/commit/8249163c6959109dd9cf0ae691c048b1a4d2fd8c))


* **FP-4230:** export hook error constants
 ([c0bc2f6](https://github.com/upstars-global/front-platform-core/commit/c0bc2f6aea8f3b0fb6b53b48198acde8667c84b5))


* **FP-4230:** fix test cases
 ([bd1e0e4](https://github.com/upstars-global/front-platform-core/commit/bd1e0e45f889b5c500533244ee572c8d74433fbc))


* **FP-4230:** fixed edge case
 ([76786ee](https://github.com/upstars-global/front-platform-core/commit/76786ee9022ca23650ab2e194e56dc8a0b0cdb2f))


* **FP-4230:** fixed path
 ([91b0237](https://github.com/upstars-global/front-platform-core/commit/91b02374a09ffd37c8b6804ea8d71287b8ab62ec))


* **FP-4230:** lint fix
 ([34bc89e](https://github.com/upstars-global/front-platform-core/commit/34bc89e39a2a4573c31384278e3e157df79f869c))


* **FP-4230:** lint fix
 ([6bb7efd](https://github.com/upstars-global/front-platform-core/commit/6bb7efd39dbf51a91720eb26b8df069bcec25d90))


* **FP-4230:** moved hook names to consts
 ([c24130e](https://github.com/upstars-global/front-platform-core/commit/c24130e2441ecb6f25213d77a2d4c3b06616d503))


* **FP-4230:** simplify test data structure by removing unnecessary spread operator
 ([45e384d](https://github.com/upstars-global/front-platform-core/commit/45e384d41fefc822aa65770b589b6375bbab67ed))


* **FP-4276:** custom error sorting
 ([ec634d1](https://github.com/upstars-global/front-platform-core/commit/ec634d1662add191de4c178241e5f1bcab7d4cbc))


* **FP-4276:** fix test cases
 ([eac2158](https://github.com/upstars-global/front-platform-core/commit/eac21586584b8ca925095cd78fa8adf2fc1ee510))


* **FP-4276:** useRestorePasswordForm
 ([45f8366](https://github.com/upstars-global/front-platform-core/commit/45f83664a57b160c06426b8f7ee0bf98216b673b))

## [7.5.3](https://github.com/upstars-global/front-platform-core/compare/v7.5.2...v7.5.3) (2025-12-16)

### 🔧 Maintenance

* fix pnpm-lock.yaml
 ([21e177e](https://github.com/upstars-global/front-platform-core/commit/21e177e3db84dd70cc79dbc026eda2e99293fcaa))


* migrate from yarn to pnpm. fix linter errors
 ([a9f1140](https://github.com/upstars-global/front-platform-core/commit/a9f1140e30074d5d1db8b1b7acdf82e25e30d582))


* readme.md update
 ([d659099](https://github.com/upstars-global/front-platform-core/commit/d659099fa429d6fe60ee19cbf3c5cfb41a336a13))


* remove pnpm-workspace.yaml
 ([90317f2](https://github.com/upstars-global/front-platform-core/commit/90317f2ea70a8a4650f616e77be34b63ad2d3c3d))


* removed dependency
 ([8a07f95](https://github.com/upstars-global/front-platform-core/commit/8a07f95edbbd85e32e476fc341a99da8cc3753de))

## [7.5.2](https://github.com/upstars-global/front-platform-core/compare/v7.5.1...v7.5.2) (2025-12-11)

### 🐛 Bug Fixes

* **FP-4287:** add descriptive messages to JsonHttpError classes for Sentry
 ([4f08e50](https://github.com/upstars-global/front-platform-core/commit/4f08e504c6b44981885214c531f8ab719d474806))

## [7.5.1](https://github.com/upstars-global/front-platform-core/compare/v7.5.0...v7.5.1) (2025-12-10)

### 🔧 Maintenance

* **FP-4294:** remove `LivespinsDataResource` and `loadLivespinsData` API method
 ([8989f5d](https://github.com/upstars-global/front-platform-core/commit/8989f5d7623f13edd38ff2d6b1905951d321d88e))

## [7.5.0](https://github.com/upstars-global/front-platform-core/compare/v7.4.0...v7.5.0) (2025-12-10)

### 🐛 Bug Fixes

* **FP-4200:** simplify `fillUrlWithUserCredentials` logic and remove legacy placeholder support
 ([3010e1c](https://github.com/upstars-global/front-platform-core/commit/3010e1c4dd11a1392c98c1172ee1bbbd6129c534))



### 🚀 Features

* **FP-4200:** add `useUserWithCredentials` hook to populate query params with user data
 ([ab20c15](https://github.com/upstars-global/front-platform-core/commit/ab20c15a6c7acc89aa7671414671fb2377165121))



### 🔨 Refactoring

* **FP-4200:** rename `useUserWithCredentials` to `useFillWithUserData` and update method logic
 ([8abece4](https://github.com/upstars-global/front-platform-core/commit/8abece454e07cbaa75a818ea2489a144b64ab7c2))

## [7.4.0](https://github.com/upstars-global/front-platform-core/compare/v7.3.0...v7.4.0) (2025-12-08)

### 🚀 Features

* **FP-3983:** useCountriesData
 ([14894d7](https://github.com/upstars-global/front-platform-core/commit/14894d7fa37e75b3a94639b3defc8035b9c2cc35))

## [7.3.0](https://github.com/upstars-global/front-platform-core/compare/v7.2.0...v7.3.0) (2025-12-08)

### 🚀 Features

* **FP-4046:** add `users.session.invalidate` event type to `UserEvents`
 ([935eb72](https://github.com/upstars-global/front-platform-core/commit/935eb72d57645e3cb809a5d7093eef021bc11ae0))


* **FP-4046:** integrate `users.session.invalidate` websocket handling in `useWebsocketsBootstrap`
 ([0246116](https://github.com/upstars-global/front-platform-core/commit/02461162a2918b85fdb11abab8b30721d01c6b70))

## [7.2.0](https://github.com/upstars-global/front-platform-core/compare/v7.1.0...v7.2.0) (2025-12-01)

### 🚀 Features

* **FP-4274:** describe type for ws message UserBalanceWebsocketTypes.TRANSACTION_CONFIRMED
 ([638e8db](https://github.com/upstars-global/front-platform-core/commit/638e8db97b2813d1f9945e2b36c223c900b31ef0))

## [7.1.0](https://github.com/upstars-global/front-platform-core/compare/v7.0.1...v7.1.0) (2025-11-27)

### 🐛 Bug Fixes

* **FP-3954:** added test to exclude in tsconfig.json
 ([ecfbe71](https://github.com/upstars-global/front-platform-core/commit/ecfbe717d3594372482eff64a76b8180d4bafd82))


* **FP-3954:** default generic parameter
 ([c42e941](https://github.com/upstars-global/front-platform-core/commit/c42e9415fe1918aa428020100549c7505ea8c1c3))


* **FP-3954:** fixed schemas; changed validationMode
 ([ea3031f](https://github.com/upstars-global/front-platform-core/commit/ea3031f20892682e3b845cc84be2797237bf31b9))


* **FP-3954:** fixed tests
 ([f0de109](https://github.com/upstars-global/front-platform-core/commit/f0de1091abc174d83a3b3b60c164fccfd0732f22))


* **FP-3954:** fixed vue dom compiler problem and added passwordMinLength for createPasswordSchema
 ([f5820cd](https://github.com/upstars-global/front-platform-core/commit/f5820cd3b0e6f81e9fff31fe520cb57d2aa2b08e))


* **FP-3954:** fixed vue version; better error handling; correct zod import
 ([b881865](https://github.com/upstars-global/front-platform-core/commit/b881865b23b34a2445bda0c409641fa3b7d3ce00))


* **FP-3954:** fixed wrong file name
 ([0870fdf](https://github.com/upstars-global/front-platform-core/commit/0870fdfce469c141fb56883f60f8c7e15a1c5485))


* **FP-3954:** import fix
 ([16a7fd7](https://github.com/upstars-global/front-platform-core/commit/16a7fd7280a7183499aefd4d27691b9ada871b40))


* **FP-3954:** remove unused createSmsSchema function and related regex
 ([dbe26bc](https://github.com/upstars-global/front-platform-core/commit/dbe26bc2af0e72ee8c28f783ed01eeaea2f9aec0))


* **FP-3954:** remove unused SMS schema tests and related code
 ([a417f69](https://github.com/upstars-global/front-platform-core/commit/a417f693f0906bafa724a9184099b058fef5d254))



### 🚀 Features

* **FP-3954:** add backend error keys and update validation logic
 ([45171cb](https://github.com/upstars-global/front-platform-core/commit/45171cb446f9d9ddd106a9b06ce0334cff0fed39))


* **FP-3954:** add RegistrationFormSchema
 ([acb225f](https://github.com/upstars-global/front-platform-core/commit/acb225f388322b6221279494a00c0cc6c4cc78b6))


* **FP-3954:** added readme.md
 ([7363a3b](https://github.com/upstars-global/front-platform-core/commit/7363a3bbd81a16b264f5f6aaa25751acd04ba617))


* **FP-3954:** remove unused optional fields from registration schema
 ([7c90075](https://github.com/upstars-global/front-platform-core/commit/7c9007563fe5f59520620eb03f33f2b8be80931c))


* **FP-3954:** rename BACKEND_ERROR_KEY to AUTH_BACKEND_ERROR_KEY for clarity
 ([24f1e18](https://github.com/upstars-global/front-platform-core/commit/24f1e18f50781213454d4ad721f0c9404e5a1b01))


* **FP-3954:** replace 'RulesNotAccepted' key with 'Required' for acceptTerms validation
 ([61f472e](https://github.com/upstars-global/front-platform-core/commit/61f472eb08fc375085bb65654e3dd7a55c454786))


* **FP-3954:** tests, new mapper, mapErrorFields
 ([067d258](https://github.com/upstars-global/front-platform-core/commit/067d258131d1a8216453432d4110fc06e2afd191))


* **FP-3954:** update vue version to 3.5.24
 ([6d234d2](https://github.com/upstars-global/front-platform-core/commit/6d234d26a6767206041e16d8e0d924531d852189))


* **FP-3954:** useFormValidation
 ([1b8d252](https://github.com/upstars-global/front-platform-core/commit/1b8d25263ebcd86ce811bd5026076b78dd980cd4))


* **FP-3954:** validation WIP
 ([78d6733](https://github.com/upstars-global/front-platform-core/commit/78d673377bbe963b877716a3196d068d0e75d521))


* **FP-3954:** validation WIP
 ([6c5e408](https://github.com/upstars-global/front-platform-core/commit/6c5e408b7a121816f07a665fe81b7591a08a0fa8))



### 🧪 Testing

* **FP-4134:** add test coverage for cashbox features
 ([e9c9ed6](https://github.com/upstars-global/front-platform-core/commit/e9c9ed6bc5ce162a35a6b827f49c3e879e84bfed))


* **FP-4134:** add test coverage for cashbox features
 ([10e60f9](https://github.com/upstars-global/front-platform-core/commit/10e60f90c9233038ef4c4fbbd4f40aacca1be211))

## [7.0.1](https://github.com/upstars-global/front-platform-core/compare/v7.0.0...v7.0.1) (2025-11-25)

### 🐛 Bug Fixes

* **FP-3838:** fixed /en-IN/en case
 ([9b004cd](https://github.com/upstars-global/front-platform-core/commit/9b004cd92dcc02229fac00b1f447da174e5f1f1d))

## [7.0.0](https://github.com/upstars-global/front-platform-core/compare/v6.1.0...v7.0.0) (2025-11-24)

### ⚠ BREAKING CHANGES

* **FP-3838:** localeUpdateHook was deleted

### 🔨 Refactoring

* **FP-3838:** multiLangUpdateLocale refactored
 ([79b3631](https://github.com/upstars-global/front-platform-core/commit/79b3631a1268e0867854208bd55b70debce6a89b))



    **BREAKING CHANGE**: localeUpdateHook was deleted

## [6.1.0](https://github.com/upstars-global/front-platform-core/compare/v6.0.1...v6.1.0) (2025-11-18)

### 🚀 Features

* **FP-4146:** Add `isDynamicStatusVip` computed property to enhance dynamic status handling
 ([b94569b](https://github.com/upstars-global/front-platform-core/commit/b94569bfc5370ac43e9e459c93c8c5cd82878f90))

## [6.0.1](https://github.com/upstars-global/front-platform-core/compare/v6.0.0...v6.0.1) (2025-11-10)

### 🐛 Bug Fixes

* **FP-4062:** fixed cookies set on safari
 ([6bd6653](https://github.com/upstars-global/front-platform-core/commit/6bd66534746dd929b324d9a15b6f011eac39c312))

## [6.0.0](https://github.com/upstars-global/front-platform-core/compare/v5.1.0...v6.0.0) (2025-11-10)

### ⚠ BREAKING CHANGES

* **FP-3982:** IRegisterDTO renamed to RegisterDTO

### 🐛 Bug Fixes

* **FP-3982:** fixed wrong import; changed condition
 ([68352ca](https://github.com/upstars-global/front-platform-core/commit/68352cac70dd6b198e4584b29be236cb3ca1b887))



### 🚀 Features

* **FP-3982:** added fingerprintHelper and client logger
 ([4c3b1bb](https://github.com/upstars-global/front-platform-core/commit/4c3b1bb05a1175a288ac30ee3823767e9144f8fd))



    **BREAKING CHANGE**: IRegisterDTO renamed to RegisterDTO
* **FP-3982:** change path and add isServer
 ([268dd64](https://github.com/upstars-global/front-platform-core/commit/268dd64da44778d0e8e4b5ba6c508c2a0d393310))

## [5.1.0](https://github.com/upstars-global/front-platform-core/compare/v5.0.0...v5.1.0) (2025-11-07)

### 🚀 Features

* **FP-4137:** do not set Content-Type in jsonHttp in case if it is FormData
 ([44980e7](https://github.com/upstars-global/front-platform-core/commit/44980e7c61af4d11d465fe19d0bb2050dbcd6c53))


* **FP-4137:** extend jsonHttp with new Content-Type
 ([ac59a85](https://github.com/upstars-global/front-platform-core/commit/ac59a8554d6cca690b4a1cb30e64c68c508e6ecf))


* **FP-4137:** extend publicApiV1 and jsonHttp to handle FormData
 ([e199ad1](https://github.com/upstars-global/front-platform-core/commit/e199ad1682d5f0012b22cbc3c87c221b15e9cdbd))

## [5.0.0](https://github.com/upstars-global/front-platform-core/compare/v4.0.0...v5.0.0) (2025-11-03)

### ⚠ BREAKING CHANGES

* **FP-3180:** websocketUrl was deleted; fixed types

### 🚀 Features

* **FP-3180:** add user balance
 ([8cc2849](https://github.com/upstars-global/front-platform-core/commit/8cc284966017bacf0eb1f5562ee78c1455d021ab))


* **FP-3180:** move user-balance websocket to core
 ([dd17cef](https://github.com/upstars-global/front-platform-core/commit/dd17cefb001fe3fe0cc6aeb674269ef99871cea7))


* **FP-3180:** websocketUrl was deleted; fixed types
 ([44ebdc1](https://github.com/upstars-global/front-platform-core/commit/44ebdc1ec2421c8bc9bf61d4d97b3f697d92396f))



    **BREAKING CHANGE**: websocketUrl was deleted; fixed types

## [4.0.0](https://github.com/upstars-global/front-platform-core/compare/v3.2.0...v4.0.0) (2025-10-22)

### ⚠ BREAKING CHANGES

* **FP-3958:** IUserStrategiesResource was renamed to UserStrategiesResource

### 🐛 Bug Fixes

* **FP-3958:** fixed wrong import
 ([b3fac36](https://github.com/upstars-global/front-platform-core/commit/b3fac367d84203bb88d2b9ed60b0e18b8b1d4480))



### 🚀 Features

* **FP-3958:** added useAuthUserStrategiesStore
 ([c85a889](https://github.com/upstars-global/front-platform-core/commit/c85a8897b7ef6b215d0a63a7f0745c4f940a52b4))



    **BREAKING CHANGE**: IUserStrategiesResource was renamed to UserStrategiesResource

## [3.2.0](https://github.com/upstars-global/front-platform-core/compare/v3.1.1...v3.2.0) (2025-10-09)

### 🚀 Features

* **FP-3173:** added cashbox to core
 ([3607c13](https://github.com/upstars-global/front-platform-core/commit/3607c13fb199b23dcbadb672226a439cc02af023))


* **FP-3173:** export COINS
 ([99c9e32](https://github.com/upstars-global/front-platform-core/commit/99c9e3271de4587d8f2d8d5955ebf1b8c4b251fe))

## [3.1.1](https://github.com/upstars-global/front-platform-core/compare/v3.1.0...v3.1.1) (2025-10-01)

### 🐛 Bug Fixes

* **FP-3707:** correct `lastLevel` assignment to use dynamic `levels` length
 ([451b1f4](https://github.com/upstars-global/front-platform-core/commit/451b1f4a0b80bc2da225ffa7520def2bf076eda1))

## [3.1.0](https://github.com/upstars-global/front-platform-core/compare/v3.0.0...v3.1.0) (2025-10-01)

### 🚀 Features

* **FP-3922:** add config for toggling user progressions websockets
 ([5f04181](https://github.com/upstars-global/front-platform-core/commit/5f041814c6898d21b73711a62619bc7ae46b70cc))



    enabled by default for backward compatibility

## [3.0.0](https://github.com/upstars-global/front-platform-core/compare/v2.1.0...v3.0.0) (2025-09-30)

### ⚠ BREAKING CHANGES

* **websockets:** add websockets start and stop in auth feature,
websockets should be configured in target projects

### 🐛 Bug Fixes

* **FP-3707:** add level validation to prevent emitting `level-confirm` for invalid levels
 ([6b5e056](https://github.com/upstars-global/front-platform-core/commit/6b5e056d1ea536533555bf5d4a16b4351112d0df))


* **FP-3707:** adjust level comparison logic to prevent emitting invalid `level-up` events
 ([03f729d](https://github.com/upstars-global/front-platform-core/commit/03f729d304aa9e09b2113dd440a96befb43da85a))


* **FP-3707:** set `secured` flag to false in VIP settings API request
 ([b15a922](https://github.com/upstars-global/front-platform-core/commit/b15a9228e3a63a6cd1a191584f0c828bc0ba8ae8))



### 🚀 Features

* **FP-3500:** Add `isLastLevel` computed property and update `nextLevelOrStatus` logic
 ([6c4b7a0](https://github.com/upstars-global/front-platform-core/commit/6c4b7a01e97644521d3f01e4bf8dc03f784b31d7))


* **FP-3648:** add `getStatusNameByCode` utility and update `RewardType` field definitions
 ([73cab86](https://github.com/upstars-global/front-platform-core/commit/73cab86026c898943ac3082ab26a38c3b59fc2e8))



    - Introduce `getStatusNameByCode` to fetch status name by code.

    - Rename `winLimit` to `limit` in `RewardType`.
* **FP-3707:** Add `getRewardGifts` utility to filter rewards by type
 ([50060be](https://github.com/upstars-global/front-platform-core/commit/50060bef822b5a3608fdc50391d1ed974288b206))


* **FP-3707:** add `isCurrentStatusVipBase` computed property to determine VIP base status
 ([9608424](https://github.com/upstars-global/front-platform-core/commit/960842443d6aa1a0f48a55119276490a2754fd0c))


* **FP-3707:** add `nextLevelGiftCount` computed property to track next level rewards
 ([ac353ca](https://github.com/upstars-global/front-platform-core/commit/ac353ca7944415817f779aa93054de3433444ce1))


* **FP-3707:** add current and next level or status, add current progression type and isLastStatus flag
 ([96170b1](https://github.com/upstars-global/front-platform-core/commit/96170b15bfd34bce24fa8caa92ef31513776582b))


* **FP-3707:** add mapped progressions values
 ([8528f9b](https://github.com/upstars-global/front-platform-core/commit/8528f9ba570f9f5ba73be6cc9f319bf4e88a1731))


* **FP-3707:** add number formatters, add number thousands formatter
 ([8ea2f14](https://github.com/upstars-global/front-platform-core/commit/8ea2f14164d544edaf85c4dfe8fc45e18d148234))


* **FP-3707:** add pointsData calculation
 ([d8b0700](https://github.com/upstars-global/front-platform-core/commit/d8b07005175b98acb4b80d48c1115632d8e12fd4))


* **FP-3707:** Add reward filtering utilities and expand Rewards types
 ([312f848](https://github.com/upstars-global/front-platform-core/commit/312f8487baf23d18d5f5384d0681b8cf59e0f844))



    - Introduce `getWeeklyCashbackFields` and `getRewardGiftTitle` utilities.

    - Extend `Rewards` type with structured fields for Cashback, Gift, Freespin, and Cash.
* **FP-3707:** change request secured to anon
 ([0c7bb16](https://github.com/upstars-global/front-platform-core/commit/0c7bb16f796e33c01dd161f9239cd532e7ca2901))


* **FP-3707:** change request secured to secured
 ([794ab6f](https://github.com/upstars-global/front-platform-core/commit/794ab6fee482c0290a163b48ff5543fdc8569716))


* **FP-3707:** data optimisation, add computed data directly to store to prevent recalculations
 ([d4fbb5f](https://github.com/upstars-global/front-platform-core/commit/d4fbb5fe100885fd9458503cfd2f83087dc56e73))


* **FP-3707:** extend `RewardsTypeDepositBonusValue` with percentage-based fields
 ([6f94e1e](https://github.com/upstars-global/front-platform-core/commit/6f94e1e625800b8b16233e866a0286a39fa0aab2))



    - Add `isBonusAsPercent` and `isWinLimitAsPercent` to `RewardsTypeDepositBonusValue`.
* **FP-3707:** fix sp xp calculation
 ([20c9e9e](https://github.com/upstars-global/front-platform-core/commit/20c9e9e815ecd0d2a875cdd8dc4e84d476d637b2))


* **FP-3707:** remove using deprecated
 ([b000789](https://github.com/upstars-global/front-platform-core/commit/b000789521db0e31ce6f123853b073d0e306e344))


* **FP-3707:** update user progressions behaviour, restructure it
 ([b889a48](https://github.com/upstars-global/front-platform-core/commit/b889a48640a4fcd51c11254cb266de8673b60598))


* **FP-3708:** Add `isAutoConfirmed` to User dynamic and update Status types
 ([6d0fa39](https://github.com/upstars-global/front-platform-core/commit/6d0fa39146fa14c01690f3d0e8163af36b93a94b))



    - Add `title` and `promo_text` to Status types.

    - Refine `staticRewards` type definitions in Status API types.
* **FP-3708:** Add `isDynamicStatusAutoConfirmed` computed property and update exports
 ([caa7313](https://github.com/upstars-global/front-platform-core/commit/caa7313e80515b359fe54f94611df000910d2d7d))


* **FP-3708:** Adjust staticLevels logic and refine isDynamicStatus condition
 ([895f14d](https://github.com/upstars-global/front-platform-core/commit/895f14d2d884ed8447e06cc99f2348ec93163824))


* **FP-3708:** Refine isDynamicStatus logic and update UserStatusResource usage
 ([2c958f6](https://github.com/upstars-global/front-platform-core/commit/2c958f6e07bc82b531c8d0852a004f572cb70e04))



    - Modify `isDynamicStatus` to validate `code` against `BASE_VIP`.

    - Adjust `code` type in `StatusProgressions` to ensure non-nullability.
* **FP-3778:** add `selfExclusionEnabled` support and update version to 2.1.0
 ([c97ec4e](https://github.com/upstars-global/front-platform-core/commit/c97ec4e94613d705e3fd01622260c21b283fe748))


* **FP-3779:** introduce `BetField` type and update `RewardsTypeFreeSpinsValue.bet` definition
 ([6adf0d3](https://github.com/upstars-global/front-platform-core/commit/6adf0d38d132c2b5cfffeb5900999592a5cac485))


* **FP-3825:** add websockets for user entity
 ([5d20bac](https://github.com/upstars-global/front-platform-core/commit/5d20bacc2c508775b11422e5222de42741dab8fb))



    - add handling user progressions websockets (update progressions, emit related events)

    - add user event progressions.static.level-up

    - add user event progressions.dynamic.level-up

    - add user event progressions.dynamic.level-confirm

    - add global websockets bootstrap feature
* **websockets:** add websockets libs
 ([551db7b](https://github.com/upstars-global/front-platform-core/commit/551db7b3de0566347029c090b640767e936aa400))



    **BREAKING CHANGE**: add websockets start and stop in auth feature,
websockets should be configured in target projects

### 🔧 Maintenance

* **FP-3502:** add `weeklyCashback` mapping to levels and statuses
 ([5dab3a6](https://github.com/upstars-global/front-platform-core/commit/5dab3a697527dfe795ceb0ab3b54b6a5dd4167c2))



    - Map `weeklyCashback` rewards in `MappedStaticLevel` and `MappedDynStatus`.

    - Introduce `isIcon` bonus comparator to track increasing cashback values.

    - Update type definitions for `weeklyCashback` in `MappedStaticLevel` and `MappedDynStatus`.
* **FP-3626:** introduce environment entity and remove global.d.ts**
 ([c0f7705](https://github.com/upstars-global/front-platform-core/commit/c0f770514a01dd37aa01eceaeba6e2a6bfd54a31))


* **FP-3626:** update `promo_text` to `promoText` and add `lastMappedStaticLevel`
 ([4eec259](https://github.com/upstars-global/front-platform-core/commit/4eec2595f9d2a5f274ddde52152b9dc3ead02aa3))


* **FP-3707:** remove unused `getRewardGiftTitle` utility and streamline reward handling
 ([7b0d059](https://github.com/upstars-global/front-platform-core/commit/7b0d05908b1153ca2dc90cfa06555c88165e2ee8))


* **FP-3707:** rename `bonus` to `cashbackPercent` in `weeklyCashback` definitions
 ([e412693](https://github.com/upstars-global/front-platform-core/commit/e4126933143ac66aaccd783e908d4939a3baea78))


* **FP-3707:** replace `Gift` with `DepositBonus` reward type and update related utilities
 ([8915595](https://github.com/upstars-global/front-platform-core/commit/8915595d232b37cba42774c208a5f705e2f6e90d))



    - Update `Rewards` type definitions to include `DepositBonus` and refine field structures.

    - Adjust `getRewardGifts` and `getRewardGiftTitle` utilities to use the new reward type.
* **FP-3707:** update `RewardType` and utilities to streamline reward handling
 ([446b743](https://github.com/upstars-global/front-platform-core/commit/446b743b76f87d854a8d1df8f62df98914e15d8c))



### 🔨 Refactoring

* **FP-3626:** extend type UserProfileResource with new field registrationDate
 ([90e4161](https://github.com/upstars-global/front-platform-core/commit/90e41619f9b4cc9844d3633ff92ffbe99693d799))


* **FP-3825:** change condition direction
 ([0b2878e](https://github.com/upstars-global/front-platform-core/commit/0b2878e8bdfff0a79b60f22b404c83251a5c1519))


* **websockets:** update rename websocket to websockets in config
 ([a4c861e](https://github.com/upstars-global/front-platform-core/commit/a4c861e5c34b3159868d61e64622c34e95e9a9b2))

## [2.1.0](https://github.com/upstars-global/front-platform-core/compare/v2.0.0...v2.1.0) (2025-09-29)

### 🚀 Features

* **FP-3778:** added selfExclusionEnabled
 ([794fd2b](https://github.com/upstars-global/front-platform-core/commit/794fd2b5f6a5369fda0e091717d31b95197ac546))

## [2.0.0](https://github.com/upstars-global/front-platform-core/compare/v1.8.1...v2.0.0) (2025-09-17)

### ⚠ BREAKING CHANGES

* **FP-3163:** global.d.ts was removed

### 🚀 Features

* **FP-3163:** added new entity environment
 ([c2b18a7](https://github.com/upstars-global/front-platform-core/commit/c2b18a7c0dbe2da3563a1841824c65bd2c9279f4))


* **FP-3163:** export config module
 ([33e4dfb](https://github.com/upstars-global/front-platform-core/commit/33e4dfb6231206da2694fc7e87e60d800036b273))


* **FP-3163:** fixes in multilang store
 ([6df1583](https://github.com/upstars-global/front-platform-core/commit/6df15838fe35231b95983f7168bbfa9399f64551))


* **FP-3163:** global.d.ts was removed
 ([7967144](https://github.com/upstars-global/front-platform-core/commit/7967144a3339a85ae66c5780f07c69e67d6b1cc6))


* **FP-3163:** new environment config
 ([7802b0d](https://github.com/upstars-global/front-platform-core/commit/7802b0d07643d38a0daed9650f2526bb8b8e9da1))



    **BREAKING CHANGE**: global.d.ts was removed

### 🔨 Refactoring

* **FP-3163:** integrate configEnvironment for dynamic environment settings
 ([f28ca39](https://github.com/upstars-global/front-platform-core/commit/f28ca397bbb97c3bcba51bbd885ec55975b97908))



### 🧪 Testing

* **commit lint:** add commit lint
 ([c1e8f91](https://github.com/upstars-global/front-platform-core/commit/c1e8f91c6e4684d9f3220d6a1738e0f22111f546))

## [1.8.1](https://github.com/upstars-global/front-platform-core/compare/v1.8.0...v1.8.1) (2025-09-09)

### 🔨 Refactoring

* **FP-3705:** extend app-config with new required field digitainRestricted
 ([da3374c](https://github.com/upstars-global/front-platform-core/commit/da3374c5923206fe44e65ebe62468520f9e73839))

## [1.8.0](https://github.com/upstars-global/front-platform-core/compare/v1.7.0...v1.8.0) (2025-09-08)

### 🐛 Bug Fixes

* **FP-3172:** fix peer dependency
 ([11d2a37](https://github.com/upstars-global/front-platform-core/commit/11d2a3711e0cbd125a90532b84a4fb2cf1a5e326))



### 🚀 Features

* **FP-3172:** fix incorrect export
 ([f919681](https://github.com/upstars-global/front-platform-core/commit/f9196815bc557dda3bbfdde847e980a48205efb6))



### 🔧 Maintenance

* **release:** 1.8.0 [skip ci]
 ([b801980](https://github.com/upstars-global/front-platform-core/commit/b80198026f03600a6f7b71b0b8bc1ca509a8e415))

## [1.8.0](https://github.com/upstars-global/front-platform-core/compare/v1.7.0...v1.8.0) (2025-09-04)

### 🐛 Bug Fixes

* **FP-3172:** fix peer dependency
 ([11d2a37](https://github.com/upstars-global/front-platform-core/commit/11d2a3711e0cbd125a90532b84a4fb2cf1a5e326))



### 🚀 Features

* **FP-3172:** fix incorrect export
 ([f919681](https://github.com/upstars-global/front-platform-core/commit/f9196815bc557dda3bbfdde847e980a48205efb6))

## [1.7.0](https://github.com/upstars-global/front-platform-core/compare/v1.6.0...v1.7.0) (2025-08-28)

### 🚀 Features

* **FP-3165:** added new entity server
 ([45d09f7](https://github.com/upstars-global/front-platform-core/commit/45d09f7c664e73c170528cc2152b24e8e92939fd))

## [1.6.0](https://github.com/upstars-global/front-platform-core/compare/v1.5.0...v1.6.0) (2025-08-28)

### 🚀 Features

* **FP-3164:** added app-config
 ([ba527fe](https://github.com/upstars-global/front-platform-core/commit/ba527fe83bc277f1135d7b05ec0f403969fc355e))

## [1.5.0](https://github.com/upstars-global/front-platform-core/compare/v1.4.0...v1.5.0) (2025-08-07)

### 🚀 Features

* **FP-3406:** Create httpRequestDurationHook
 ([6dff67a](https://github.com/upstars-global/front-platform-core/commit/6dff67aa90a247e057a93c9ccc976f62293f040b))

## [1.4.0](https://github.com/upstars-global/front-platform-core/compare/v1.3.0...v1.4.0) (2025-07-31)

### 🐛 Bug Fixes

* **FP-3162:** fix loadContext return type
 ([7c0daf3](https://github.com/upstars-global/front-platform-core/commit/7c0daf32b1b900bb6e956a94161bc896196d7de2))



### 🚀 Features

* **FP-3162:** add context entity
 ([1c929cf](https://github.com/upstars-global/front-platform-core/commit/1c929cf204e951ff002001914ed33223e25757c1))

## [1.3.0](https://github.com/upstars-global/front-platform-core/compare/v1.2.0...v1.3.0) (2025-07-23)

### 🐛 Bug Fixes

* **FP-3157:** check is server and not load profile on the server side
 ([103c2bd](https://github.com/upstars-global/front-platform-core/commit/103c2bd301274fd551f7388d2fc06d3138cd4526))



### 🚀 Features

* **FP-3157:** add auth entity
 ([54958eb](https://github.com/upstars-global/front-platform-core/commit/54958eb869f6b55535a8eadd90ebd9689185a6d7))


* **FP-3157:** add auth feature - login, logout, register, changePassword, fetch all user data, captcha, add configs
 ([9574c97](https://github.com/upstars-global/front-platform-core/commit/9574c976503a1c1b2855aa92727966a68e61e8d1))


* **FP-3157:** add createPromiseHook for config hooks creation
 ([94ac494](https://github.com/upstars-global/front-platform-core/commit/94ac4943df6cd2ad54210fd3821b229d0f42c91a))


* **FP-3157:** add global default locale config
 ([f94313f](https://github.com/upstars-global/front-platform-core/commit/f94313f4cbcd9000f7a55441250322831c0259b2))


* **FP-3157:** add global types
 ([f54c446](https://github.com/upstars-global/front-platform-core/commit/f54c4469a4be8704f3538f5637e5f2228eb089f4))


* **FP-3157:** add isServer helper
 ([f2b10a1](https://github.com/upstars-global/front-platform-core/commit/f2b10a1184f4db2b3adc01b1b3e29452a85ac4a3))


* **FP-3157:** add logger helper
 ([d535618](https://github.com/upstars-global/front-platform-core/commit/d5356185d260598f0164b490ff1d386406e98645))


* **FP-3157:** add new shared types
 ([2e7ffb8](https://github.com/upstars-global/front-platform-core/commit/2e7ffb87950e65f2751be942c710a16b013f799e))


* **FP-3157:** add promise helpers, promiseMemo and safePromise/safePromiseAll
 ([d4857e2](https://github.com/upstars-global/front-platform-core/commit/d4857e2da94edee52dd58b7881fb7c1b1b058972))


* **FP-3157:** add user entity - api, events, store, composables
 ([be7d664](https://github.com/upstars-global/front-platform-core/commit/be7d664b758fd713c6c4e2132cd1cf47ab8d8fa4))


* **FP-3157:** add variables to Localisation type, update dev dependencies
 ([8145218](https://github.com/upstars-global/front-platform-core/commit/8145218875642f339bd508e6000baec2de665565))


* **FP-3157:** move pinia and vue as peerDependencies
 ([68463e3](https://github.com/upstars-global/front-platform-core/commit/68463e3502b5ea16bd98d794c42bfb61cc73dd6a))



### 🔧 Maintenance

* **FP-3157:** add packageManager to package.json to work with corepack enabled
 ([f21da12](https://github.com/upstars-global/front-platform-core/commit/f21da129946aa907952d7922c56407049c554a97))



### 📖 Documentation

* **FP-3157:** add comments for api adapters
 ([01942e5](https://github.com/upstars-global/front-platform-core/commit/01942e5eca6fb4f087752d4a815a513b13eaea3d))


* **FP-3157:** update local-dev.md, add pnp local dev support
 ([2165f9a](https://github.com/upstars-global/front-platform-core/commit/2165f9afd2c2cf0188109148340f8ac52a3e399b))

## [1.2.0](https://github.com/upstars-global/front-platform-core/compare/v1.1.0...v1.2.0) (2025-04-15)

### 🚀 Features

* remove [@core](https://github.com/core) alias, update docs
 ([00a84b3](https://github.com/upstars-global/front-platform-core/commit/00a84b353e32365e8e6775e587b9a4e58db66c26))



### 📖 Documentation

* fix semantic release commit text type notation doc
 ([0c6f31d](https://github.com/upstars-global/front-platform-core/commit/0c6f31da69b3f4192bf193a12cc85c2bdcc09d67))

## [1.1.0](https://github.com/upstars-global/front-platform-core/compare/v1.0.1...v1.1.0) (2025-04-10)

### 🚀 Features

* **FP-2948:** test commit
 ([590d4cd](https://github.com/upstars-global/front-platform-core/commit/590d4cd01afdef3a7874860e3a5ef793aeb8995f))

## [1.0.1](https://github.com/upstars-global/front-platform-core/compare/v1.0.0...v1.0.1) (2025-04-02)

### 🔧 Maintenance

* update "chore" release settings
 ([364ca34](https://github.com/upstars-global/front-platform-core/commit/364ca34de9aa6987ebf8a7467c10f08da54a1b01))



### 📖 Documentation

* update docs, add local-dev.md
 ([8eb0d96](https://github.com/upstars-global/front-platform-core/commit/8eb0d96013fe74cfddb0fee29c23ed3867234881))

## 1.0.0 (2025-03-27)

### 🐛 Bug Fixes

* add changelog-template-commit.hbs
 ([b44d90a](https://github.com/upstars-global/front-platform-core/commit/b44d90a78eae593d21bac226a7bbbce148899761))


* add conventional-changelog-conventionalcommits
 ([c60c32f](https://github.com/upstars-global/front-platform-core/commit/c60c32f6baf4a114b3b7c2f5646ca12093751d73))


* add slack support
 ([51d3aaa](https://github.com/upstars-global/front-platform-core/commit/51d3aaab2b836a73132d66aa9c56674aade5faf7))


* adjust exit code for missing Slack webhook URL
 ([55a02ac](https://github.com/upstars-global/front-platform-core/commit/55a02acf8c74bee5b93fe8900b8b12d2e54c2d85))


* change release.config.mjs to cjs
 ([d8359a0](https://github.com/upstars-global/front-platform-core/commit/d8359a03b7d48aed4a1b16e63440b7b71a71c478))


* disable Slack notification on release
 ([9a78169](https://github.com/upstars-global/front-platform-core/commit/9a78169c024a769cf39b44e836377b1d3769c923))


* package.json
 ([317324d](https://github.com/upstars-global/front-platform-core/commit/317324da39876f71b1d3462314cbcac80b7429b6))


* rename release.config.js to .mjs
 ([65eb9cc](https://github.com/upstars-global/front-platform-core/commit/65eb9cc24935924adbb7e64a16291bfb8c82c496))


* try to use module instead of common js
 ([943a573](https://github.com/upstars-global/front-platform-core/commit/943a57371785ff9940dcdf895ecbd96b6cd6b2e6))


* update lint-staged
 ([1b4e91c](https://github.com/upstars-global/front-platform-core/commit/1b4e91c4ac969c8e0462e10644c1de9367d94020))



### 🚀 Features

* test linter
 ([255fe6f](https://github.com/upstars-global/front-platform-core/commit/255fe6f5f7b28c65749feff9ba782a2218322c2d))


* test linter
 ([c2c46af](https://github.com/upstars-global/front-platform-core/commit/c2c46af309c6a66f1c9c7691dde111ee4a741bb5))


* test linter
 ([e353cd6](https://github.com/upstars-global/front-platform-core/commit/e353cd6a7f57fbdbb0a37912dd85c247bea8e9cc))


* test linter
 ([754666e](https://github.com/upstars-global/front-platform-core/commit/754666e8e57b654ebc42980bc5b57721b22e8938))


* test new github app tokens
 ([4e4c6e8](https://github.com/upstars-global/front-platform-core/commit/4e4c6e8bbfa39254c39e32326849216af70add0e))


* test semantic release
 ([8263ecc](https://github.com/upstars-global/front-platform-core/commit/8263ecc6310ffdaf184fc247c8880fdd25277697))



### 🔧 Maintenance

* add GitHub Actions workflow for linting and type checking
 ([f52c6be](https://github.com/upstars-global/front-platform-core/commit/f52c6bed72156902fd5748116dd5daeea7ae4afd))


* **release:** 1.1.1 [skip ci]
 ([3319e33](https://github.com/upstars-global/front-platform-core/commit/3319e335aa9162122340e969be36cbd5e4992882))


* **release:** 1.1.2 [skip ci]
 ([c3ddb78](https://github.com/upstars-global/front-platform-core/commit/c3ddb78b2fcae033593f13a05f6b492f4335fbd9))


* **release:** 1.1.3 [skip ci]
 ([88e387a](https://github.com/upstars-global/front-platform-core/commit/88e387a4a5ff1a3717bfec7737f38bec6c571167))


* **release:** 1.2.0 [skip ci]
 ([639b138](https://github.com/upstars-global/front-platform-core/commit/639b138aa84bd362597224e0571d115b7c11161f))


* **release:** 1.2.1 [skip ci]
 ([40c2b62](https://github.com/upstars-global/front-platform-core/commit/40c2b6215e7f77ebacfcdc5329abfefd10e5216b))


* **release:** 1.3.0 [skip ci]
 ([f7b3b11](https://github.com/upstars-global/front-platform-core/commit/f7b3b1165ba4c210729ae1bdd1c7f5b47b2820f5))



### 📖 Documentation

* add back links
 ([3e1d16c](https://github.com/upstars-global/front-platform-core/commit/3e1d16c70b2b434c467c3c1ab04df09fe2383b93))

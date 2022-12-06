if (!self.define) {
  let e,
    i = {};
  const s = (s, c) => (
    (s = new URL(s + ".js", c).href),
    i[s] ||
      new Promise((i) => {
        if ("document" in self) {
          const e = document.createElement("script");
          (e.src = s), (e.onload = i), document.head.appendChild(e);
        } else (e = s), importScripts(s), i();
      }).then(() => {
        let e = i[s];
        if (!e) throw new Error(`Module ${s} didn’t register its module`);
        return e;
      })
  );
  self.define = (c, a) => {
    const n =
      e ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href;
    if (i[n]) return;
    let r = {};
    const o = (e) => s(e, n),
      f = { module: { uri: n }, exports: r, require: o };
    i[n] = Promise.all(c.map((e) => f[e] || o(e))).then((e) => (a(...e), r));
  };
}
define(["./workbox-7e688afb"], function (e) {
  "use strict";
  self.addEventListener("message", (e) => {
    e.data && "SKIP_WAITING" === e.data.type && self.skipWaiting();
  }),
    e.precacheAndRoute(
      [
        {
          url: "css/animation.css",
          revision: "ff9c48d50e3093ef75a12fa8860a664d",
        },
        { url: "css/fonts.css", revision: "3d358e1132fcb4b551a2df832a8316a0" },
        { url: "css/main.css", revision: "dfa328e59e72aee5b9a941609774675c" },
        {
          url: "css/position.css",
          revision: "7baf65c375131ad6820f571f4ff7502a",
        },
        { url: "css/reset.css", revision: "e56be516a87051ba3ae1ed36d9974306" },
        {
          url: "css/responsive.css",
          revision: "930f58f8491c382ef8910a5d271573e4",
        },
        {
          url: "fonts/alatsi.ttf",
          revision: "cf6ac7f805753ad4173e054c5fbbc2ae",
        },
        {
          url: "fonts/chewy.ttf",
          revision: "53ee0977b5f9f3afc1d18b4419264c8b",
        },
        {
          url: "fonts/chivo.ttf",
          revision: "56aab5a087c88eb8a2e2b6436f364978",
        },
        {
          url: "fonts/comfortaa.ttf",
          revision: "26795cfa08319b4e939b9c26dfc59311",
        },
        {
          url: "fonts/fredoka_one.ttf",
          revision: "58cc117001de0d11fef59a00943ddd81",
        },
        { url: "fonts/gugi.ttf", revision: "d215cc8654cb6b434182cc9150415cc0" },
        {
          url: "fonts/julee.ttf",
          revision: "375ced07f361f6e67b860f33d6021d9d",
        },
        { url: "fonts/lato.ttf", revision: "122dd68d69fe9587e062d20d9ff5de2a" },
        {
          url: "fonts/libre_franklin.ttf",
          revision: "99bb071fcb1c3001c785f659bfbfdbf2",
        },
        {
          url: "fonts/lobster.ttf",
          revision: "c3191f3b933ae0bd46335e178744326e",
        },
        {
          url: "fonts/londrina_solid.ttf",
          revision: "0e0c966ac6cad3afcfd672c96197f360",
        },
        {
          url: "fonts/merriweather.ttf",
          revision: "edeb9be6212b698f26264b80ef2e52ea",
        },
        {
          url: "fonts/nerko_one.ttf",
          revision: "fb333fdb03d2649922187ac18d22da8e",
        },
        {
          url: "fonts/oleo_script.ttf",
          revision: "4c19154f6343b5405936c31968ce978c",
        },
        {
          url: "fonts/open_sans.ttf",
          revision: "996d0154a25c63500dee2ae91e4f2ea7",
        },
        {
          url: "fonts/outfit.ttf",
          revision: "af01d64463c2f8878fe4aeeec6253a4a",
        },
        {
          url: "fonts/patrick_hand.ttf",
          revision: "0b94e62171b862ddb28135554050f315",
        },
        {
          url: "fonts/permanent_marker.ttf",
          revision: "c863f8028c2505f92540e0ba7c379002",
        },
        {
          url: "fonts/pt_mono.ttf",
          revision: "844e8fa6bb3441effec73e976764c535",
        },
        {
          url: "fonts/pt_sans.ttf",
          revision: "5b127e9e1cedad57860a5bb8b2cc9d61",
        },
        {
          url: "fonts/roboto.ttf",
          revision: "8a36205bd9b83e03af0591a004bc97f4",
        },
        {
          url: "fonts/rubik.ttf",
          revision: "20ddc780bbcdba3faf2d82754abe4c69",
        },
        {
          url: "fonts/satisfy.ttf",
          revision: "aaa5880c7a5f7e479e31a4412452d8a9",
        },
        {
          url: "fonts/signika.ttf",
          revision: "833993b6f5b7896825505de8aaa49665",
        },
        {
          url: "fonts/source_code_pro.ttf",
          revision: "846ad017921bac28ddb313763eb7c6ad",
        },
        {
          url: "fonts/ubuntu.ttf",
          revision: "84ea7c5c9d2fa40c070ccb901046117d",
        },
        {
          url: "fonts/vt323.ttf",
          revision: "034de38c65e202c1cc838e7d014385fd",
        },
        { url: "FUNDING.yml", revision: "c21af649c611bd5a3389bd3401dd5c71" },
        {
          url: "img/favicon.png",
          revision: "1c87d3cf2709e4cf04427b35e3047851",
        },
        {
          url: "img/icons/loading.svg",
          revision: "461cbf1518433090ac0d50d14070097d",
        },
        {
          url: "img/logos/white_penguin.png",
          revision: "4af174c330d334424b2e206cc9dc4c62",
        },
        {
          url: "img/pwa/badges/android_en.png",
          revision: "0fb68f4e9f4829171a3fcdd8d8410512",
        },
        {
          url: "img/pwa/badges/windows_en.png",
          revision: "b0fcac80538b2edd50436817b1fb7fc4",
        },
        {
          url: "img/pwa/icons/mathcard_icon_1024x1024.png",
          revision: "4e52a18c195b7af39155d53f0be04ad4",
        },
        {
          url: "img/pwa/icons/mathcard_icon_128x128.png",
          revision: "d33bffd0bccac163f5575f928cbae659",
        },
        {
          url: "img/pwa/icons/mathcard_icon_144x144.png",
          revision: "1d3cc5d09339fc4187a2e5e82baeac8f",
        },
        {
          url: "img/pwa/icons/mathcard_icon_192x192.png",
          revision: "27c71222559035c5c4a37a011b4032e2",
        },
        {
          url: "img/pwa/icons/mathcard_icon_256x256.png",
          revision: "38eeaf16e116ae9324d4f81a99a94225",
        },
        {
          url: "img/pwa/icons/mathcard_icon_32x32.png",
          revision: "93315d129a301b730e65926b45f21a59",
        },
        {
          url: "img/pwa/icons/mathcard_icon_384x384.png",
          revision: "74992ebfafe8328cfc6a619b6e41eb15",
        },
        {
          url: "img/pwa/icons/mathcard_icon_48x48.png",
          revision: "24900beb20e71c8aeaabc1599b684e19",
        },
        {
          url: "img/pwa/icons/mathcard_icon_512x512.png",
          revision: "a2a626f530578cb8096c3e2feeefbc06",
        },
        {
          url: "img/pwa/icons/mathcard_icon_64x64.png",
          revision: "2ebdcda46f5be99bc08d1e3e2b1d61b9",
        },
        {
          url: "img/pwa/icons/mathcard_icon_72x72.png",
          revision: "b813b98ca492b21cd8e9cf2f7848ecd8",
        },
        {
          url: "img/pwa/icons/mathcard_icon_96x96.png",
          revision: "0cc32eee294bc5f828291312380b77e3",
        },
        {
          url: "img/pwa/screenshots/spanish/computer_basic_calculations.png",
          revision: "f026643a68070a9482e27204b39b2b7b",
        },
        {
          url: "img/pwa/screenshots/spanish/computer_currencies.png",
          revision: "5274514df88223554190690264cb1079",
        },
        {
          url: "img/pwa/screenshots/spanish/computer_customization_calculator.png",
          revision: "3e703b19d756f1cf71263105139149af",
        },
        {
          url: "img/pwa/screenshots/spanish/computer_personalized_calculator.png",
          revision: "963050d0085dea4e2548434e07a0c6db",
        },
        {
          url: "img/pwa/screenshots/spanish/mobile_basic_calculations.png",
          revision: "573f6991664029e1ac94d31152968ae0",
        },
        {
          url: "img/pwa/screenshots/spanish/mobile_currencies.png",
          revision: "88ed7ef068d29ea276dd75fbfe249b49",
        },
        {
          url: "img/pwa/screenshots/spanish/mobile_customization_calculator.png",
          revision: "bfd0092f5bcf2040e9dc2e3c35bb5412",
        },
        {
          url: "img/pwa/screenshots/spanish/mobile_personalized_calculator.png",
          revision: "f9a5cb6d3581fe7164abd36b08b00446",
        },
        {
          url: "img/pwa/screenshots/spanish/tablet_10inch_basic_calculations.png",
          revision: "5d2f0f4873492ce10b1f1d8d6ac5c0f4",
        },
        {
          url: "img/pwa/screenshots/spanish/tablet_10inch_currencies.png",
          revision: "dfa8a44ba76df639166d59305acb41df",
        },
        {
          url: "img/pwa/screenshots/spanish/tablet_10inch_customization_calculator.png",
          revision: "d7f1abd1fb22d4fb8781df1e892c5e5a",
        },
        {
          url: "img/pwa/screenshots/spanish/tablet_10inch_personalized_calculator.png",
          revision: "62839454e085af797477c4765a0f9235",
        },
        {
          url: "img/pwa/screenshots/spanish/tablet_7inch_basic_calculations.png",
          revision: "1f40d0d5109a9e7f55270ad39bdc8a08",
        },
        {
          url: "img/pwa/screenshots/spanish/tablet_7inch_currencies.png",
          revision: "baf6fb0c4dadf32f3a9cc19317824f87",
        },
        {
          url: "img/pwa/screenshots/spanish/tablet_7inch_customization_calculator.png",
          revision: "adbe1cf15eb48a1f59265e2a278e0efa",
        },
        {
          url: "img/pwa/screenshots/spanish/tablet_7inch_personalized_calculator.png",
          revision: "2c0f48f654b29de156559b860a418503",
        },
        { url: "index.html", revision: "79f82b8bd7a42cdc3dc2dc83bbc36808" },
        {
          url: "js/html5_qrcode.js",
          revision: "8ee1a862df07ab20670775ac32c56da4",
        },
        { url: "js/main.js", revision: "5f987e1c62cc1792a3ebe99807c6f173" },
        { url: "js/utility.js", revision: "411004a5c21f2dee4e63e0009c2d44c4" },
        {
          url: "json/currencies.js",
          revision: "0d2e5b8e0000c60cdc11fb2fd6540686",
        },
        {
          url: "json/languages.js",
          revision: "8f067d815da5c1ec94ff0785443968bc",
        },
        {
          url: "json/settings.js",
          revision: "6e17660d5eed88106191c21edfd52a99",
        },
        { url: "manifest.json", revision: "18f0b494200902961655aa32f612e486" },
        { url: "README.md", revision: "1c7f532f0f00bc6f55fd064dbd44c217" },
      ],
      { ignoreURLParametersMatching: [/^utm_/, /^fbclid$/] }
    );
});
//# sourceMappingURL=sw.js.map

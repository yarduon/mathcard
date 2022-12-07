if (!self.define) {
  let e,
    s = {};
  const i = (i, n) => (
    (i = new URL(i + ".js", n).href),
    s[i] ||
      new Promise((s) => {
        if ("document" in self) {
          const e = document.createElement("script");
          (e.src = i), (e.onload = s), document.head.appendChild(e);
        } else (e = i), importScripts(i), s();
      }).then(() => {
        let e = s[i];
        if (!e) throw new Error(`Module ${i} didn’t register its module`);
        return e;
      })
  );
  self.define = (n, c) => {
    const a =
      e ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href;
    if (s[a]) return;
    let r = {};
    const o = (e) => i(e, a),
      f = { module: { uri: a }, exports: r, require: o };
    s[a] = Promise.all(n.map((e) => f[e] || o(e))).then((e) => (c(...e), r));
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
        { url: "css/fonts.css", revision: "122ffaf98be03a4ee40c3502f0211e40" },
        { url: "css/main.css", revision: "7f2c45135dbfe3ad88268801264c904d" },
        {
          url: "css/position.css",
          revision: "7baf65c375131ad6820f571f4ff7502a",
        },
        { url: "css/reset.css", revision: "e56be516a87051ba3ae1ed36d9974306" },
        {
          url: "css/responsive.css",
          revision: "29bd8ecb075ec4953a6df1b9b1001ffc",
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
          url: "img/pwa/screenshots/english/computer_calculations_en.png",
          revision: "f026643a68070a9482e27204b39b2b7b",
        },
        {
          url: "img/pwa/screenshots/english/computer_currencies_en.png",
          revision: "f7e2d95bd9d3fb5b7cbe43e4ae74e9fd",
        },
        {
          url: "img/pwa/screenshots/english/computer_customization_en.png",
          revision: "d1d7ff5d41d7cc6fed04b41a39047f71",
        },
        {
          url: "img/pwa/screenshots/english/computer_personalized_calculator_en.png",
          revision: "963050d0085dea4e2548434e07a0c6db",
        },
        {
          url: "img/pwa/screenshots/english/mobile_calculations_en.png",
          revision: "1e7ea7d1b63e21319498909ff24d33c9",
        },
        {
          url: "img/pwa/screenshots/english/mobile_currencies_en.png",
          revision: "8733191d33ec260c107866218a0283b6",
        },
        {
          url: "img/pwa/screenshots/english/mobile_customization_en.png",
          revision: "8198d4ce272c8b1d0f1a88e73e4f1330",
        },
        {
          url: "img/pwa/screenshots/english/mobile_personalized_calculator_en.png",
          revision: "1234eb4489d58d49294b75411e654f8d",
        },
        {
          url: "img/pwa/screenshots/english/tablet_10inch_calculations_en.png",
          revision: "5d2f0f4873492ce10b1f1d8d6ac5c0f4",
        },
        {
          url: "img/pwa/screenshots/english/tablet_10inch_currencies_en.png",
          revision: "09b8f439cdc05a998f10eb97f2aebffd",
        },
        {
          url: "img/pwa/screenshots/english/tablet_10inch_customization_en.png",
          revision: "9d238f5bbd05d6af706dd8ab0e5f55a6",
        },
        {
          url: "img/pwa/screenshots/english/tablet_10inch_personalized_calculator_en.png",
          revision: "62839454e085af797477c4765a0f9235",
        },
        {
          url: "img/pwa/screenshots/english/tablet_7inch_calculations_en.png",
          revision: "1f40d0d5109a9e7f55270ad39bdc8a08",
        },
        {
          url: "img/pwa/screenshots/english/tablet_7inch_currencies_en.png",
          revision: "4983b0b05513dcd8b86d1d2e0a5583e9",
        },
        {
          url: "img/pwa/screenshots/english/tablet_7inch_customization_en.png",
          revision: "76b17918b8ae9bcd9f5be4b42430be0e",
        },
        {
          url: "img/pwa/screenshots/english/tablet_7inch_personalized_calculator_en.png",
          revision: "8209d317a15cd7f5564aca3050373a5c",
        },
        {
          url: "img/pwa/screenshots/spanish/computer_calculations_spa.png",
          revision: "f026643a68070a9482e27204b39b2b7b",
        },
        {
          url: "img/pwa/screenshots/spanish/computer_currencies_spa.png",
          revision: "f9b96ddc1a8feb78ca57446b6c2f57fc",
        },
        {
          url: "img/pwa/screenshots/spanish/computer_customization_spa.png",
          revision: "d1d7ff5d41d7cc6fed04b41a39047f71",
        },
        {
          url: "img/pwa/screenshots/spanish/computer_personalized_calculator_spa.png",
          revision: "963050d0085dea4e2548434e07a0c6db",
        },
        {
          url: "img/pwa/screenshots/spanish/mobile_calculations_spa.png",
          revision: "1e7ea7d1b63e21319498909ff24d33c9",
        },
        {
          url: "img/pwa/screenshots/spanish/mobile_currencies_spa.png",
          revision: "74e2e0b99593d8bb48b100a27e420ef0",
        },
        {
          url: "img/pwa/screenshots/spanish/mobile_customization_spa.png",
          revision: "8198d4ce272c8b1d0f1a88e73e4f1330",
        },
        {
          url: "img/pwa/screenshots/spanish/mobile_personalized_calculator_spa.png",
          revision: "1234eb4489d58d49294b75411e654f8d",
        },
        {
          url: "img/pwa/screenshots/spanish/tablet_10inch_calculations_spa.png",
          revision: "5d2f0f4873492ce10b1f1d8d6ac5c0f4",
        },
        {
          url: "img/pwa/screenshots/spanish/tablet_10inch_currencies_spa.png",
          revision: "dfaf6991d8d33dcae89138f35ddfc226",
        },
        {
          url: "img/pwa/screenshots/spanish/tablet_10inch_customization_spa.png",
          revision: "9d238f5bbd05d6af706dd8ab0e5f55a6",
        },
        {
          url: "img/pwa/screenshots/spanish/tablet_10inch_personalized_calculator_spa.png",
          revision: "62839454e085af797477c4765a0f9235",
        },
        {
          url: "img/pwa/screenshots/spanish/tablet_7inch_calculations_spa.png",
          revision: "1f40d0d5109a9e7f55270ad39bdc8a08",
        },
        {
          url: "img/pwa/screenshots/spanish/tablet_7inch_currencies_spa.png",
          revision: "21ebe1a596f3d64f54b27ef159813757",
        },
        {
          url: "img/pwa/screenshots/spanish/tablet_7inch_customization_spa.png",
          revision: "76b17918b8ae9bcd9f5be4b42430be0e",
        },
        {
          url: "img/pwa/screenshots/spanish/tablet_7inch_personalized_calculator_spa.png",
          revision: "8209d317a15cd7f5564aca3050373a5c",
        },
        { url: "index.html", revision: "57756682d7855305f83a44725c3297dd" },
        {
          url: "js/html5_qrcode.js",
          revision: "8ee1a862df07ab20670775ac32c56da4",
        },
        { url: "js/main.js", revision: "8dfb245483b1d0e08c3b33329f77c440" },
        { url: "js/utility.js", revision: "12525c02b3d704bd2209e7f68bfd9a8c" },
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
        { url: "manifest.json", revision: "6cb33cddf128cb5a1cf9c5142f7cce50" },
        { url: "README.md", revision: "1c7f532f0f00bc6f55fd064dbd44c217" },
      ],
      { ignoreURLParametersMatching: [/^utm_/, /^fbclid$/] }
    );
});
//# sourceMappingURL=sw.js.map

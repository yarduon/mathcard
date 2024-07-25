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
define(["./workbox-168f09f0"], function (e) {
  "use strict";
  self.addEventListener("message", (e) => {
    e.data && "SKIP_WAITING" === e.data.type && self.skipWaiting();
  }),
    e.precacheAndRoute(
      [
        {
          url: "css/animation.css",
          revision: "4f947abc2c7e4bfba25118edad286256",
        },
        { url: "css/fonts.css", revision: "122ffaf98be03a4ee40c3502f0211e40" },
        { url: "css/main.css", revision: "68e9ef7d99cb6989c923f6e0d4c1e71e" },
        {
          url: "css/position.css",
          revision: "4e9a66945d59b5d8bc65cf8fbbb0dbc1",
        },
        { url: "css/reset.css", revision: "e56be516a87051ba3ae1ed36d9974306" },
        {
          url: "css/responsive.css",
          revision: "e90d6b341517b62a28557ff5ae90d8fb",
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
          revision: "ff1e810060516a2de54155e6b70b1c58",
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
          revision: "b6b9126078296fa72462aa6e30c7b8a3",
        },
        {
          url: "img/pwa/screenshots/english/computer_currencies_en.png",
          revision: "820ffcc89571ea477f0edcc4204bdb27",
        },
        {
          url: "img/pwa/screenshots/english/computer_customization_en.png",
          revision: "f87b41e149356c7e53352d7f061a9274",
        },
        {
          url: "img/pwa/screenshots/english/computer_personalized_calculator_en.png",
          revision: "f1893ea3783911b6031981825be2eb93",
        },
        {
          url: "img/pwa/screenshots/english/mobile_calculations_en.png",
          revision: "0b44632ec3cbb3cf5d0ead054b1f38c2",
        },
        {
          url: "img/pwa/screenshots/english/mobile_currencies_en.png",
          revision: "2534ef25d00100f5441fb61821fe8df8",
        },
        {
          url: "img/pwa/screenshots/english/mobile_customization_en.png",
          revision: "bf5a8f22a94a1fe3a38398568c4e27a1",
        },
        {
          url: "img/pwa/screenshots/english/mobile_personalized_calculator_en.png",
          revision: "65babc9f0b1b7b1452ff42666d9f6f0e",
        },
        {
          url: "img/pwa/screenshots/english/tablet_10inch_calculations_en.png",
          revision: "e5405cb0bfa9033af98632f9b51f8ee7",
        },
        {
          url: "img/pwa/screenshots/english/tablet_10inch_currencies_en.png",
          revision: "96ce7c1c0ba1086c8d2ad5748f814a00",
        },
        {
          url: "img/pwa/screenshots/english/tablet_10inch_customization_en.png",
          revision: "50aaeb62fc1478482b60cd9aebef45c2",
        },
        {
          url: "img/pwa/screenshots/english/tablet_10inch_personalized_calculator_en.png",
          revision: "f899093604fc4ab3e43ff5cde940c601",
        },
        {
          url: "img/pwa/screenshots/english/tablet_7inch_calculations_en.png",
          revision: "b324bc7f45eb4860f7a42f105797ac94",
        },
        {
          url: "img/pwa/screenshots/english/tablet_7inch_currencies_en.png",
          revision: "3833f31cd58d41c148b15068429410f7",
        },
        {
          url: "img/pwa/screenshots/english/tablet_7inch_customization_en.png",
          revision: "bcd5c29b448cc5fc542635b0b9b7ee6e",
        },
        {
          url: "img/pwa/screenshots/english/tablet_7inch_personalized_calculator_en.png",
          revision: "87c6283808e40bcdc92f139eefe53f16",
        },
        {
          url: "img/pwa/screenshots/spanish/computer_calculations_spa.png",
          revision: "b6b9126078296fa72462aa6e30c7b8a3",
        },
        {
          url: "img/pwa/screenshots/spanish/computer_currencies_spa.png",
          revision: "25e20b24237a7320cf6664987551cc70",
        },
        {
          url: "img/pwa/screenshots/spanish/computer_customization_spa.png",
          revision: "f87b41e149356c7e53352d7f061a9274",
        },
        {
          url: "img/pwa/screenshots/spanish/computer_personalized_calculator_spa.png",
          revision: "f1893ea3783911b6031981825be2eb93",
        },
        {
          url: "img/pwa/screenshots/spanish/mobile_calculations_spa.png",
          revision: "0b44632ec3cbb3cf5d0ead054b1f38c2",
        },
        {
          url: "img/pwa/screenshots/spanish/mobile_currencies_spa.png",
          revision: "902f571fed3363702e4016fdbc18ed04",
        },
        {
          url: "img/pwa/screenshots/spanish/mobile_customization_spa.png",
          revision: "bf5a8f22a94a1fe3a38398568c4e27a1",
        },
        {
          url: "img/pwa/screenshots/spanish/mobile_personalized_calculator_spa.png",
          revision: "65babc9f0b1b7b1452ff42666d9f6f0e",
        },
        {
          url: "img/pwa/screenshots/spanish/tablet_10inch_calculations_spa.png",
          revision: "e5405cb0bfa9033af98632f9b51f8ee7",
        },
        {
          url: "img/pwa/screenshots/spanish/tablet_10inch_currencies_spa.png",
          revision: "737eb85bd043c84b42917852261236ed",
        },
        {
          url: "img/pwa/screenshots/spanish/tablet_10inch_customization_spa.png",
          revision: "50aaeb62fc1478482b60cd9aebef45c2",
        },
        {
          url: "img/pwa/screenshots/spanish/tablet_10inch_personalized_calculator_spa.png",
          revision: "f899093604fc4ab3e43ff5cde940c601",
        },
        {
          url: "img/pwa/screenshots/spanish/tablet_7inch_calculations_spa.png",
          revision: "b324bc7f45eb4860f7a42f105797ac94",
        },
        {
          url: "img/pwa/screenshots/spanish/tablet_7inch_currencies_spa.png",
          revision: "fde11fcc1e8e75f21a168118b15d637f",
        },
        {
          url: "img/pwa/screenshots/spanish/tablet_7inch_customization_spa.png",
          revision: "bcd5c29b448cc5fc542635b0b9b7ee6e",
        },
        {
          url: "img/pwa/screenshots/spanish/tablet_7inch_personalized_calculator_spa.png",
          revision: "87c6283808e40bcdc92f139eefe53f16",
        },
        { url: "index.html", revision: "1e73c4c21faa9bb3f02eaa105dda9384" },
        { url: "js/main.js", revision: "851da225f288c7b36caab3f07480cb1f" },
        {
          url: "js/qr-scanner-worker.min.js",
          revision: "28f5cc01d4e18e99a0d2abe39b8b5159",
        },
        {
          url: "js/qr-scanner.min.js",
          revision: "848256f9ad8d61ceb831ddbb54ac5998",
        },
        { url: "js/utility.js", revision: "b25901e60eafbd21c4602daa712f339d" },
        {
          url: "json/currencies.js",
          revision: "0d2e5b8e0000c60cdc11fb2fd6540686",
        },
        {
          url: "json/languages.js",
          revision: "d0bc90ce200734f0126f729a0599546c",
        },
        {
          url: "json/settings.js",
          revision: "6e17660d5eed88106191c21edfd52a99",
        },
        { url: "manifest.json", revision: "3fa0e87e064b8c3fdbf2903499d062ab" },
        { url: "README.md", revision: "fe125e50d1ff9ba39b67a493b8b8f32d" },
      ],
      { ignoreURLParametersMatching: [/^utm_/, /^fbclid$/] }
    );
});
//# sourceMappingURL=sw.js.map

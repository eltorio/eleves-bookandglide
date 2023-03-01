/*!
=========================================================
* © 2023 Ronan LE MEILLAT for Les Ailes du Mont-Blanc
=========================================================
This website use:
- Vite, Vue3, FontAwesome 6, TailwindCss 3
- And many others
*/
import { createApp, getCurrentInstance } from "vue";
import App from "@/App.vue";
import { createWebHistory, createRouter, RouteRecordRaw } from "vue-router";
import { createI18n } from "vue-i18n";
import { createPinia } from "pinia";
import "@/index.scss";

import enUS from "@/locales/en-US.json";

type MessageSchema = typeof enUS;
type Messages = { "fr-FR"?: MessageSchema; "en-US"?: MessageSchema };

const routes = [
  {
    path: "/",
    component: () => import("@/views/IndexPage.vue"),
    name: "index",
  },
] as RouteRecordRaw[];

import { availableLanguages } from "@/config/locales.js";
const i18n = createI18n<
  [MessageSchema | string],
  typeof availableLanguages[number]
>({
  locale: "en-US",
  legacy: false,
  fallbackLocale: "fr-FR",
  messages: {
    "fr-FR": "", //will be lazily loaded in HeaderMain/changeLang(locale)
    "en-US": enUS,
    "es-ES": "",
  },
});

const router = createRouter({
  scrollBehavior(to) {
    if (to.hash) {
      return {
        el: to.hash,
      };
    }
  },
  history: createWebHistory(),
  routes,
});

const pinia = createPinia();
const app = createApp(App);

console.log(import.meta.url)
app.use(pinia).use(i18n).use(router);
app.mount("#app");

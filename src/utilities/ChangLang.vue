<!--
=========================================================
* © 2025 Ronan LE MEILLAT for Les Ailes du Mont-Blanc
=========================================================
This website use:
- Vite, Vue3, FontAwesome 6, TailwindCss 3
- And many others
-->
<template>
    <div class="relative inline-block text-left z-50">
        <div>
            <button @click="langOpen = !langOpen" type="button" class=" " id="menu-button" aria-expanded="true"
                aria-haspopup="true">
                <span class="hidden sm:inline-flex">{{ t("nav_lang") }}&nbsp;</span>
                <img class="inline-flex cursor-pointer w-4 h-4 self-center"
                    :src="svgs[`../assets/lang/${locale.substring(3).toLowerCase()}.svg`].default" />
            </button>
        </div>
        <div v-if="langOpen" class="
                        origin-top-right
                        absolute
                        right-0
                        -mt-1
                        w-6
                        focus:outline-none
                        block
                      " role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
            <div class="py-1" role="none">
                <span v-for="lang in availableLocales" :key="`locale-${lang}`" :value="lang">
                    <img @click="changeLang(lang)" class="cursor-pointerw-6 h-6"
                        :src="svgs[`../assets/lang/${lang.substring(3).toLowerCase()}.svg`].default" />
                </span>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { useLocaleStore } from '@/utilities/LocaleHelper.js'
import { useRoute,useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
const svgs = import.meta.glob('../assets/lang/*.svg', { eager: true })
const langOpen = ref(false)
const localeCounter = useLocaleStore()
const {locale,availableLocales,messages,fallbackLocale,t} = useI18n({})
const route = useRoute()
const router = useRouter()

const changeLang = (wantedLocale: string) => {
    console.log(`Locale change #${localeCounter.count}`)
    
    if ((locale.value != wantedLocale) && availableLocales.includes(wantedLocale)) {
        localeCounter.count++
        document.querySelector('html')?.setAttribute('lang', wantedLocale)
        router.replace({ query: { lang: wantedLocale } })
        console.log(`Change locale from ${locale.value} to ${wantedLocale}`);
        if ((messages as any).value[wantedLocale].length == 0) {
            import(`@/locales/${wantedLocale}.json`).then((loadedMessages) => {
                (messages as any).value[wantedLocale] = loadedMessages;
                console.log(`Lazily loaded ${wantedLocale} messages`);
                locale.value = wantedLocale;
                langOpen.value = false;
            });
        } else {
            locale.value = wantedLocale;
            langOpen.value = false;
        }
        if (wantedLocale === 'fr-FR') {
            fallbackLocale.value = 'en-US'
        }
        else {
            fallbackLocale.value = 'fr-FR'
        }
    }
}

onBeforeMount(() => {
    if ((route.query.lang !== undefined) && route.query.lang !== locale.value) {
        changeLang(route.query.lang as string)
    } else if (localeCounter.count === 0) {
        const mainLang = window.navigator.language
        console.log(`Main lang:${mainLang}`)
        if (availableLocales.includes(mainLang)) {
            changeLang(mainLang)
        }
    }
})
</script>
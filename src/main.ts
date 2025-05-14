import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import '@/assets/colors.scss'

import { createI18n } from 'vue-i18n';

import type { LanguageType } from './stores/userPreferences'

import ES from './locales/es.json'
import EN from './locales/en.json'
import RU from './locales/ru.json'
import FR from './locales/fr.json'
import DE from './locales/de.json'
import PT from './locales/pt.json'
import PL from './locales/pl.json'
import IT from './locales/it.json'
import NL from './locales/nl.json'
import SV from './locales/sv.json'
import UK from './locales/uk.json'
import RO from './locales/ro.json'
import SR from './locales/sr.json'
import CS from './locales/cs.json'
import EL from './locales/el.json'
import HU from './locales/hu.json'

const messages = { ES: ES, EN: EN, RU: RU, FR: FR, DE: DE, PT: PT, PL: PL, IT: IT, NL: NL, SV: SV, UK: UK, RO: RO, SR: SR, CS: CS, EL: EL, HU: HU }

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('language') as LanguageType || 'ES',
  fallbackLocale: 'ES',
  messages
})

const vuetify = createVuetify({
    components,
    directives
  })

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)
app.use(i18n)

app.mount('#app')

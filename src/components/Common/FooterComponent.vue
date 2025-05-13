<script setup lang="ts">
import { computed } from 'vue'
import { useUserPreferencesStore } from '@/stores/userPreferences'
import { useI18n } from 'vue-i18n'

const backgroundColor = computed(() => storeUserPreferences.getTheme().background)
const textColor = computed(() => storeUserPreferences.getTheme().text)

const storeUserPreferences = useUserPreferencesStore()

const { t } = useI18n()
</script>

<template>
	<div class="main-container">
		<div class="footer-info-content">
			<div class="info-logo-content">
				<img src="@/assets/logo.jpg" alt="Logo" class="info-logo-image" />
				<span class="info-logo-title">Crypto Trade</span>
			</div>
			<p class="footer-info-text">{{ t('FooterComponent_Description') }}</p>			
			<div class="footer-info-copyright">
				&copy; {{ new Date().getFullYear() }} Crypto Trade. {{ t('FooterComponent_Copyright') }}
			</div>
		</div>
		<div class="footer-links-content">
			<div>
				<div class="footer-links-title">{{ t('FooterComponent_Products_Title') }}</div>
				<div class="footer-links-text">{{ t('FooterComponent_Products_Item_1') }}</div>
				<div class="footer-links-text">{{ t('FooterComponent_Products_Item_2') }}</div>
				<div class="footer-links-text">{{ t('FooterComponent_Products_Item_3') }}</div>
				<div class="footer-links-text">{{ t('FooterComponent_Products_Item_4') }}</div>
				<div class="footer-links-text">{{ t('FooterComponent_Products_Item_5') }}</div>
				<div class="footer-links-text">{{ t('FooterComponent_Products_Item_6') }}</div>
				<div class="footer-links-text">{{ t('FooterComponent_Products_Item_7') }}</div>
				<div class="footer-links-text">{{ t('FooterComponent_Products_Item_8') }}</div>
			</div>
			<div>
				<div class="footer-links-title">{{ t('FooterComponent_Assistance_Title') }}</div>
				<div class="footer-links-text">{{ t('FooterComponent_Assistance_Item_1') }}</div>
				<div class="footer-links-text">{{ t('FooterComponent_Assistance_Item_2') }}</div>
				<div class="footer-links-text">{{ t('FooterComponent_Assistance_Item_3') }}</div>
				<div class="footer-links-text">{{ t('FooterComponent_Assistance_Item_4') }}</div>
				<div class="footer-links-text">{{ t('FooterComponent_Assistance_Item_5') }}</div>
			</div>
			<div>
				<div class="footer-links-title">{{ t('FooterComponent_Company_Title') }}</div>
				<div class="footer-links-text">{{ t('FooterComponent_Company_Item_1') }}</div>
				<div class="footer-links-text">{{ t('FooterComponent_Company_Item_2') }}</div>
				<div class="footer-links-text">{{ t('FooterComponent_Company_Item_3') }}</div>
				<div class="footer-links-text">{{ t('FooterComponent_Company_Item_4') }}</div>
				<div class="footer-links-text">{{ t('FooterComponent_Company_Item_5') }}</div>
				<div class="footer-links-text">{{ t('FooterComponent_Company_Item_6') }}</div>
				<div class="footer-links-text">{{ t('FooterComponent_Company_Item_7') }}</div>
				<div class="footer-links-text">{{ t('FooterComponent_Company_Item_8') }}</div>
				<div class="footer-links-text">{{ t('FooterComponent_Company_Item_9') }}</div>
			</div>
			<div>
				<div class="footer-links-title">{{ t('FooterComponent_Community_Title') }}</div>
				<div class="footer-links-text">{{ t('FooterComponent_Community_Item_1') }}</div>
				<div class="footer-links-text">{{ t('FooterComponent_Community_Item_2') }}</div>
				<div class="footer-links-text">{{ t('FooterComponent_Community_Item_3') }}</div>
				<div class="footer-links-text">{{ t('FooterComponent_Community_Item_4') }}</div>
				<div class="footer-links-text">{{ t('FooterComponent_Community_Item_5') }}</div>
				<div class="footer-links-text">{{ t('FooterComponent_Community_Item_6') }}</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.main-container {
	background-color: v-bind(backgroundColor);
	padding: 50px 150px;
	border-top: solid 1px var(--dark-gray-color);
	display: flex;
	justify-content: space-between;
	color: v-bind(textColor);
	gap: 100px;
}

.footer-info-content {
	width: 45%;
}

.info-logo-content {
	display: flex;
	align-items: center;
	margin-bottom: 30px;
}

.info-logo-image {
  width: 50px;
  height: 50px;
	margin-right: 10px;
}

.info-logo-title {
  font-size: 1.6rem;
	font-family: 'Montserrat', sans-serif;
}

.footer-info-text {
  font-size: 0.95rem;
	color: var(--gray-color);
	margin-bottom: 200px;
	text-align: justify;
}

.footer-info-copyright {
	font-size: 0.95rem;
	font-weight: bold;
	color: var(--gray-color);
}

.footer-links-content {
	width: 55%;
	display: flex;
	gap: 50px;
	font-weight: bold;
	justify-content: end;
}

.footer-links-title {
	font-size: 1.2rem;
	margin-bottom: 40px;
}

.footer-links-text {
	cursor: pointer;
	font-size: 0.9rem;
	color: var(--gray-color);
	margin-bottom: 20px;
}

/* Responsive */
@media (max-width: 1200px) {
	.main-container {
		display: flex;
		flex-direction: column;
	}

	.footer-info-content {
		width: 100%;
	}

	.footer-info-text {
		margin-bottom: 50px;
	}

	.footer-links-content {
		width: 100%;
		display: flex;
		justify-content: center;
	}
}

@media (max-width: 700px) {
	.main-container {
		padding: 50px 100px;
	}

	.footer-links-content {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 30px;
	}

	.footer-links-content > div {
		width: 40%;
	}
}

@media (max-width: 600px) {
	.main-container {
		padding: 50px;
	}
}
</style>
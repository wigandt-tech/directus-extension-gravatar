<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { gravatarProxyUrlForEmail, normalizeEmail, type GravatarDefaultImage, type GravatarRating } from '../shared/gravatar';

const props = withDefaults(
	defineProps<{
		value: unknown;
		size?: number;
		shape?: 'circle' | 'rounded' | 'square';
		defaultImage?: GravatarDefaultImage;
		rating?: GravatarRating;
		forceDefault?: boolean;
		showEmail?: boolean;
	}>(),
	{
		size: 24,
		shape: 'circle',
		defaultImage: 'mp',
		rating: 'g',
		forceDefault: false,
		showEmail: false,
	},
);

const src = ref<string | null>(null);
const hasImageError = ref(false);
const email = computed(() => normalizeEmail(props.value));
const renderedSize = computed(() => Math.min(Math.max(Math.round(Number(props.size) || 24), 1), 2048));

const style = computed(() => ({
	width: `${renderedSize.value}px`,
	height: `${renderedSize.value}px`,
	borderRadius: props.shape === 'circle' ? '50%' : props.shape === 'rounded' ? '6px' : '0',
}));

watch(
	() => [props.value, props.size, props.defaultImage, props.rating, props.forceDefault],
	async () => {
		hasImageError.value = false;
		src.value = await gravatarProxyUrlForEmail(props.value, {
			size: props.size,
			defaultImage: props.defaultImage,
			rating: props.rating,
			forceDefault: props.forceDefault,
		});
	},
	{ immediate: true },
);
</script>

<template>
	<div class="gravatar-display">
		<span class="gravatar-display__avatar" :style="style">
			<img
				v-if="src && !hasImageError"
				class="gravatar-display__image"
				:src="src"
				alt=""
				loading="lazy"
				@error="hasImageError = true"
			/>
			<v-icon v-else name="account_circle" class="gravatar-display__fallback" />
		</span>
		<span v-if="showEmail && email" class="gravatar-display__email">{{ email }}</span>
	</div>
</template>

<style scoped>
.gravatar-display {
	display: inline-flex;
	align-items: center;
	gap: 8px;
	width: 100%;
	max-width: 100%;
	min-width: 0;
	line-height: 1;
	vertical-align: middle;
}

.gravatar-display__avatar {
	display: inline-flex;
	flex: 0 0 auto;
	align-items: center;
	justify-content: center;
	overflow: hidden;
	line-height: 0;
	background: var(--theme--background-subdued);
}

.gravatar-display__image {
	display: block;
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.gravatar-display__fallback {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
	color: var(--theme--foreground-subdued);
}

.gravatar-display__email {
	min-width: 0;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
</style>

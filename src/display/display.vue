<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { gravatarUrlForEmail, normalizeEmail, type GravatarDefaultImage, type GravatarRating } from '../shared/gravatar';

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
		size: 40,
		shape: 'circle',
		defaultImage: 'mp',
		rating: 'g',
		forceDefault: false,
		showEmail: false,
	},
);

const src = ref<string | null>(null);
const email = computed(() => normalizeEmail(props.value));

const style = computed(() => ({
	width: `${props.size}px`,
	height: `${props.size}px`,
	borderRadius: props.shape === 'circle' ? '50%' : props.shape === 'rounded' ? '6px' : '0',
}));

watch(
	() => [props.value, props.size, props.defaultImage, props.rating, props.forceDefault],
	async () => {
		src.value = await gravatarUrlForEmail(props.value, {
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
		<img v-if="src" class="gravatar-display__image" :src="src" :alt="email ?? ''" :style="style" loading="lazy" />
		<v-icon v-else name="account_circle" class="gravatar-display__fallback" :style="style" />
		<span v-if="showEmail && email" class="gravatar-display__email">{{ email }}</span>
	</div>
</template>

<style scoped>
.gravatar-display {
	display: inline-flex;
	align-items: center;
	gap: 8px;
	max-width: 100%;
}

.gravatar-display__image {
	display: block;
	flex: 0 0 auto;
	object-fit: cover;
	background: var(--theme--background-subdued);
}

.gravatar-display__fallback {
	display: inline-flex;
	flex: 0 0 auto;
	align-items: center;
	justify-content: center;
	color: var(--theme--foreground-subdued);
}

.gravatar-display__email {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
</style>

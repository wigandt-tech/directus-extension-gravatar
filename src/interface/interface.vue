<script setup lang="ts">
import { ref, watch } from 'vue';
import { gravatarProxyUrlForEmail, type GravatarDefaultImage, type GravatarRating } from '../shared/gravatar';

const props = withDefaults(
	defineProps<{
		value: string | null;
		placeholder?: string;
		size?: number;
		defaultImage?: GravatarDefaultImage;
		rating?: GravatarRating;
		disabled?: boolean;
	}>(),
	{
		placeholder: '',
		size: 64,
		defaultImage: 'mp',
		rating: 'g',
		disabled: false,
	},
);

const emit = defineEmits<{
	(event: 'input', value: string | null): void;
}>();

const src = ref<string | null>(null);
const hasImageError = ref(false);

watch(
	() => [props.value, props.size, props.defaultImage, props.rating],
	async () => {
		hasImageError.value = false;
		src.value = await gravatarProxyUrlForEmail(props.value, {
			size: props.size,
			defaultImage: props.defaultImage,
			rating: props.rating,
		});
	},
	{ immediate: true },
);

function update(value: string | null) {
	emit('input', value === '' ? null : value);
}
</script>

<template>
	<div class="gravatar-interface">
		<img
			v-if="src && !hasImageError"
			class="gravatar-interface__image"
			:src="src"
			alt=""
			@error="hasImageError = true"
		/>
		<v-icon v-else class="gravatar-interface__fallback" name="account_circle" />

		<v-input
			class="gravatar-interface__input"
			:model-value="value"
			:placeholder="placeholder"
			:disabled="disabled"
			type="email"
			@update:model-value="update"
		/>
	</div>
</template>

<style scoped>
.gravatar-interface {
	display: flex;
	align-items: center;
	gap: 12px;
}

.gravatar-interface__image,
.gravatar-interface__fallback {
	flex: 0 0 auto;
	width: v-bind("`${size}px`");
	height: v-bind("`${size}px`");
	border-radius: 50%;
}

.gravatar-interface__image {
	display: block;
	object-fit: cover;
	background: var(--theme--background-subdued);
}

.gravatar-interface__fallback {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	color: var(--theme--foreground-subdued);
	background: var(--theme--background-subdued);
}

.gravatar-interface__input {
	min-width: 0;
	flex: 1 1 auto;
}
</style>

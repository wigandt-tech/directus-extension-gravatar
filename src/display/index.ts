import { defineDisplay } from '@directus/extensions-sdk';
import DisplayComponent from './display.vue';

const defaultImageChoices = [
	{ text: 'Mystery Person', value: 'mp' },
	{ text: 'Identicon', value: 'identicon' },
	{ text: 'Monster ID', value: 'monsterid' },
	{ text: 'Wavatar', value: 'wavatar' },
	{ text: 'Retro', value: 'retro' },
	{ text: 'Robohash', value: 'robohash' },
	{ text: 'Blank', value: 'blank' },
	{ text: '404', value: '404' },
];

export default defineDisplay({
	id: 'gravatar-display',
	name: 'Gravatar',
	icon: 'account_circle',
	description: 'Render a Gravatar image from an email address.',
	component: DisplayComponent,
	types: ['string'],
	options: [
		{
			field: 'size',
			name: '$t:size',
			type: 'integer',
			meta: {
				width: 'half',
				interface: 'input',
				options: {
					min: 1,
					max: 2048,
				},
			},
			schema: {
				default_value: 24,
			},
		},
		{
			field: 'shape',
			name: 'Shape',
			type: 'string',
			meta: {
				width: 'half',
				interface: 'select-dropdown',
				options: {
					choices: [
						{ text: '$t:circle', value: 'circle' },
						{ text: 'Rounded', value: 'rounded' },
						{ text: '$t:square', value: 'square' },
					],
				},
			},
			schema: {
				default_value: 'circle',
			},
		},
		{
			field: 'defaultImage',
			name: 'Default image',
			type: 'string',
			meta: {
				width: 'half',
				interface: 'select-dropdown',
				options: {
					choices: defaultImageChoices,
				},
			},
			schema: {
				default_value: 'mp',
			},
		},
		{
			field: 'rating',
			name: '$t:displays.rating.rating',
			type: 'string',
			meta: {
				width: 'half',
				interface: 'select-dropdown',
				options: {
					choices: [
						{ text: 'G', value: 'g' },
						{ text: 'PG', value: 'pg' },
						{ text: 'R', value: 'r' },
						{ text: 'X', value: 'x' },
					],
				},
			},
			schema: {
				default_value: 'g',
			},
		},
		{
			field: 'showEmail',
			name: '$t:email',
			type: 'boolean',
			meta: {
				width: 'half',
				interface: 'boolean',
			},
			schema: {
				default_value: false,
			},
		},
		{
			field: 'forceDefault',
			name: '$t:default_label',
			type: 'boolean',
			meta: {
				width: 'half',
				interface: 'boolean',
			},
			schema: {
				default_value: false,
			},
		},
	],
});

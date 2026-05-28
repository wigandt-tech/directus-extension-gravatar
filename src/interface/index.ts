import { defineInterface } from '@directus/extensions-sdk';
import InterfaceComponent from './interface.vue';

export default defineInterface({
	id: 'gravatar-interface',
	name: 'Gravatar Email',
	icon: 'alternate_email',
	description: 'Edit an email field with a live Gravatar preview.',
	component: InterfaceComponent,
	types: ['string'],
	group: 'standard',
	options: [
		{
			field: 'placeholder',
			name: '$t:placeholder',
			type: 'string',
			meta: {
				width: 'half',
				interface: 'input',
			},
		},
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
				default_value: 64,
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
					choices: [
						{ text: 'Mystery Person', value: 'mp' },
						{ text: 'Identicon', value: 'identicon' },
						{ text: 'Monster ID', value: 'monsterid' },
						{ text: 'Wavatar', value: 'wavatar' },
						{ text: 'Retro', value: 'retro' },
						{ text: 'Robohash', value: 'robohash' },
						{ text: 'Blank', value: 'blank' },
					],
				},
			},
			schema: {
				default_value: 'mp',
			},
		},
		{
			field: 'rating',
			name: 'Rating',
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
	],
});

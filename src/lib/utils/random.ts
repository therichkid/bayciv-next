import { generateHash } from './crypt';

export const getRandomTailwindColor = (slug?: string): string => {
	const colors = [
		'red',
		'orange',
		'amber',
		'yellow',
		'lime',
		'green',
		'emerald',
		'teal',
		'cyan',
		'sky',
		'blue',
		'indigo',
		'violet',
		'purple',
		'fuchsia',
		'pink',
		'rose',
	];

	if (slug) {
		const hash = generateHash(slug);
		const index = Math.abs(hash) % colors.length;
		return colors[index];
	}

	const randomIndex = Math.floor(Math.random() * colors.length);
	return colors[randomIndex];
};

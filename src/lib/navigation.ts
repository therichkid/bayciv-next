import EarIcon from '@lucide/svelte/icons/ear';
import InfoIcon from '@lucide/svelte/icons/info';
import NewspaperIcon from '@lucide/svelte/icons/newspaper';
import UserPlusIcon from '@lucide/svelte/icons/user-plus';
import UsersIcon from '@lucide/svelte/icons/users';
import type { Component } from 'svelte';

export interface NavigationItem {
	title: string;
	href?: string;
	description?: string;
	icon?: Component;
	children?: NavigationItem[];
}

export type Navigation = NavigationItem[];

export const navigation: Navigation = [
	{
		title: 'Selbsthilfegruppen',
		icon: UsersIcon,
		href: '/shgs',
	},
	{
		title: 'Informationen',
		icon: EarIcon,
		children: [
			{
				title: 'Was ist ein CI?',
				href: '/was-ist-ein-ci',
				description: 'Grundlagen und Funktionsweise eines Cochlea-Implantats.',
			},
			{
				title: 'CI-Systeme',
				href: '/ci-systeme',
				description: 'Überblick über verschiedene Cochlea-Implantat-Systeme und Hersteller.',
			},
			{
				title: 'Kliniken, Rehas, Beratungsstellen',
				href: '/einrichtungen',
				description: 'Übersichtskarte mit Adressen zu Kliniken, Reha-Einrichtungen und Beratungsstellen.',
			},
		],
	},
	{
		title: 'Aktuelles',
		icon: NewspaperIcon,
		children: [
			{
				title: 'Veranstaltungen',
				href: '/events',
				description: 'Kommende Veranstaltungen und Termine.',
			},
			{
				title: 'Neuigkeiten',
				href: '/news',
				description: 'Neuigkeiten und Nachrichten rund um das Thema Cochlea-Implantat.',
			},
			{
				title: 'Erfahrungen',
				href: '/erfahrungen',
				description: 'Erfahrungsberichte von Betroffenen.',
			},
			{
				title: 'Zahlen und Fakten',
				href: '/zahlen-fakten',
				description: 'Statistiken und wissenswerte Fakten.',
			},
			{
				title: 'HörGut',
				href: '/magazin',
				description: 'Unser Magazin rund um das Thema CI.',
			},
		],
	},
	{
		title: 'Über uns',
		icon: InfoIcon,
		children: [
			{
				title: 'Verband',
				href: '/verband',
				description: 'Informationen über unseren Verband.',
			},
			{
				title: 'Unser Team',
				href: '/unser-team',
				description: 'Lerne unser Team kennen.',
			},
			{
				title: 'Beratung',
				href: '/beratung',
				description: 'Unsere Beratungsangebote für dich.',
			},
			{
				title: 'Förderer',
				href: '/foerderer',
				description: 'Unsere Förderer und Unterstützer.',
			},
			{
				title: 'Satzung',
				href: '/satzung',
				description: 'Die Satzung unseres Verbandes.',
			},
			{
				title: 'Infos & Dokumente',
				href: '/infos-dokumente',
				description: 'Wichtige Informationen und Dokumente zum Download.',
			},
		],
	},
	{
		title: 'Kontakt & Mitgliedschaft',
		icon: UserPlusIcon,
		children: [
			{
				title: 'Kontakt',
				href: '/kontakt',
				description: 'So erreichst du uns.',
			},
			{
				title: 'Mitglied werden',
				href: '/mitglied-werden',
				description: 'Werde Mitglied im Verband.',
			},
		],
	},
];

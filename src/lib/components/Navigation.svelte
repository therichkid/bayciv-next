<script lang="ts">
	import { resolve } from '$app/paths';
	import * as NavigationMenu from '$lib/components/ui/navigation-menu/index.js';
	import { navigationMenuTriggerStyle } from '$lib/components/ui/navigation-menu/navigation-menu-trigger.svelte';
	import { navigation, type NavigationItem } from '$lib/navigation.js';
	import BayCivIcon from './BayCivIcon.svelte';
</script>

{#snippet MainNavigationItem({ title, icon }: NavigationItem)}
	<span class="flex items-center gap-2">
		{#if icon}
			<svelte:component this={icon} size={18} />
		{/if}
		{title}
	</span>
{/snippet}

{#snippet ListItem({ title, href, description }: NavigationItem)}
	<li>
		<NavigationMenu.Link>
			{#snippet child()}
				<a
					href={resolve(href)}
					class="block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
				>
					<div class="text-sm leading-none font-medium">{title}</div>
					<p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
						{description}
					</p>
				</a>
			{/snippet}
		</NavigationMenu.Link>
	</li>
{/snippet}

<NavigationMenu.Root viewport={false} class="w-full px-6 py-4">
	<NavigationMenu.List>
		<NavigationMenu.Item>
			<NavigationMenu.Link>
				{#snippet child()}
					<a href={resolve('/')} class={navigationMenuTriggerStyle()}>
						<span class="flex items-center gap-2">
							<BayCivIcon size={24} />
						</span>
					</a>
				{/snippet}
			</NavigationMenu.Link>
		</NavigationMenu.Item>

		{#each navigation as item, i (i)}
			<NavigationMenu.Item>
				{#if item.children}
					<NavigationMenu.Trigger>
						{@render MainNavigationItem({
							title: item.title,
							icon: item.icon,
						})}
					</NavigationMenu.Trigger>
					<NavigationMenu.Content>
						<ul
							class="grid w-[400px] gap-2 p-2 {item.children.length > 3 && 'md:w-[500px] md:grid-cols-2 lg:w-[600px]'}"
						>
							{#each item.children as child, j (j)}
								<li>
									{@render ListItem({
										title: child.title,
										href: child.href,
										description: child.description,
									})}
								</li>
							{/each}
						</ul>
					</NavigationMenu.Content>
				{:else if item.href}
					<NavigationMenu.Link>
						{#snippet child()}
							<a href={resolve(item.href)} class={navigationMenuTriggerStyle()}>
								{@render MainNavigationItem({
									title: item.title,
									icon: item.icon,
								})}
							</a>
						{/snippet}
					</NavigationMenu.Link>
				{/if}
			</NavigationMenu.Item>
		{/each}
	</NavigationMenu.List>
</NavigationMenu.Root>

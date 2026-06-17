// Type declaration for .svx files (Svelte with markdown/mdsvex)
// This tells TypeScript that .svx files are valid modules

declare module '*.svx' {
	import type { ComponentType } from 'svelte';
	const component: ComponentType;
	export default component;
	export * from 'svelte';
}
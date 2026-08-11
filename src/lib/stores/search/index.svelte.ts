// Shared open-state for the docs ⌘K search modal: the modal is rendered
// once per docs page, but trigger buttons live in both sidebar instances.
const searchState = $state({ open: false });

// Single facade over the search open-state, mirroring deviceStore.
export const searchStore = {
	get open() {
		return searchState.open;
	},
	set open(value: boolean) {
		searchState.open = value;
	}
};

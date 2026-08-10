// Shared open-state for the docs ⌘K search modal: the modal is rendered
// once per docs page, but trigger buttons live in both sidebar instances.
export const searchState = $state({ open: false });

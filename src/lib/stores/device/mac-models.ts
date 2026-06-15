import type { MacDeviceType } from './index.svelte';

export const MAC_MODEL_MAP: Record<string, { type: MacDeviceType; chip: string }> = {
	// MacBook Pro
	'MacBookPro16,1': { type: 'macbook', chip: 'M1 Pro' },
	'MacBookPro16,2': { type: 'macbook', chip: 'M1 Pro' },
	'MacBookPro17,1': { type: 'macbook', chip: 'M1 Max' },
	'MacBookPro18,1': { type: 'macbook', chip: 'M1 Max' },
	'MacBookPro18,2': { type: 'macbook', chip: 'M1 Pro' },
	'MacBookPro18,3': { type: 'macbook', chip: 'M1 Max' },
	'MacBookPro18,4': { type: 'macbook', chip: 'M1 Ultra' },
	'MacBookPro19,1': { type: 'macbook', chip: 'M2 Pro' },
	'MacBookPro19,2': { type: 'macbook', chip: 'M2 Max' },
	'MacBookPro19,3': { type: 'macbook', chip: 'M2 Max' },
	'MacBookPro19,4': { type: 'macbook', chip: 'M2 Pro' },
	'MacBookPro20,1': { type: 'macbook', chip: 'M3 Pro' },
	'MacBookPro20,2': { type: 'macbook', chip: 'M3 Max' },
	'MacBookPro20,3': { type: 'macbook', chip: 'M3 Max' },
	'MacBookPro20,4': { type: 'macbook', chip: 'M3 Pro' },
	'MacBookPro21,1': { type: 'macbook', chip: 'M4 Pro' },
	'MacBookPro21,2': { type: 'macbook', chip: 'M4 Max' },
	'MacBookPro21,3': { type: 'macbook', chip: 'M4 Max' },
	'MacBookPro21,4': { type: 'macbook', chip: 'M4 Pro' },

	// MacBook Air
	'MacBookAir10,1': { type: 'macbook', chip: 'M2' },
	'MacBookAir11,1': { type: 'macbook', chip: 'M3' },
	'MacBookAir12,1': { type: 'macbook', chip: 'M4' },

	// MacBook
	'MacBook10,1': { type: 'macbook', chip: 'M3' },
	'MacBook11,1': { type: 'macbook', chip: 'M4' },

	// Mac Mini
	'MacMini9,1': { type: 'desktop', chip: 'M1' },
	'MacMini10,1': { type: 'desktop', chip: 'M2' },
	'MacMini10,2': { type: 'desktop', chip: 'M2' },
	'MacMini11,1': { type: 'desktop', chip: 'M3' },
	'MacMini11,2': { type: 'desktop', chip: 'M4' },
	'MacMini11,3': { type: 'desktop', chip: 'M4' },

	// iMac
	'iMac21,1': { type: 'desktop', chip: 'M1' },
	'iMac21,2': { type: 'desktop', chip: 'M1' },
	'iMac22,1': { type: 'desktop', chip: 'M3' },
	'iMac22,2': { type: 'desktop', chip: 'M3' },
	'iMac23,1': { type: 'desktop', chip: 'M4' },
	'iMac23,2': { type: 'desktop', chip: 'M4' },

	// Mac Studio
	'MacStudio1,1': { type: 'desktop', chip: 'M1 Max' },
	'MacStudio1,2': { type: 'desktop', chip: 'M1 Ultra' },
	'MacStudio2,1': { type: 'desktop', chip: 'M2 Max' },
	'MacStudio2,2': { type: 'desktop', chip: 'M2 Ultra' },
	'MacStudio3,1': { type: 'desktop', chip: 'M3 Max' },
	'MacStudio3,2': { type: 'desktop', chip: 'M3 Ultra' },
	'MacStudio4,1': { type: 'desktop', chip: 'M4 Max' },
	'MacStudio4,2': { type: 'desktop', chip: 'M4 Ultra' },

	// Mac Pro
	'MacPro7,1': { type: 'desktop', chip: 'Intel' },
};

export function parseMacModelFromRenderer(renderer: string): { type: MacDeviceType; chip: string } | null {
	if (renderer.toLowerCase().includes('or similar')) {
		return null;
	}
	if (/^Apple\s*GPU$/i.test(renderer)) {
		return null;
	}

	const m = renderer.match(/Apple\s+(M\d+(?:\s+(?:Max|Ultra|Pro))?)/i);
	if (!m) {
		return null;
	}

	const chip = m[1].trim();
	const isMaxOrUltra = chip.includes('Max') || chip.includes('Ultra');
	return { type: isMaxOrUltra ? 'desktop' : 'macbook', chip: `Apple ${chip}` };
}

export function getMacModelFromHeuristics(
	deviceMemory: number | undefined,
	hardwareConcurrency: number | undefined,
): MacDeviceType | null {
	if (!deviceMemory || !hardwareConcurrency) return null;
	if (hardwareConcurrency >= 24 && deviceMemory >= 100) return 'desktop';
	if (hardwareConcurrency >= 32 && deviceMemory >= 150) return 'desktop';
	if (hardwareConcurrency <= 16 && deviceMemory >= 8) return 'macbook';
	if (hardwareConcurrency <= 10 && deviceMemory >= 4) return 'macbook';
	return null;
}

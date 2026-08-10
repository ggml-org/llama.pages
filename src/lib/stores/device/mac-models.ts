import { MacDeviceType } from '$lib/enums';

export const MAC_MODEL_MAP: Record<string, { type: MacDeviceType; chip: string }> = {
	// iMac
	'iMac21,1': { chip: 'M1', type: MacDeviceType.DESKTOP },
	'iMac21,2': { chip: 'M1', type: MacDeviceType.DESKTOP },
	'iMac22,1': { chip: 'M3', type: MacDeviceType.DESKTOP },
	'iMac22,2': { chip: 'M3', type: MacDeviceType.DESKTOP },
	'iMac23,1': { chip: 'M4', type: MacDeviceType.DESKTOP },
	'iMac23,2': { chip: 'M4', type: MacDeviceType.DESKTOP },
	// MacBook
	'MacBook10,1': { chip: 'M3', type: MacDeviceType.MACBOOK },
	'MacBook11,1': { chip: 'M4', type: MacDeviceType.MACBOOK },
	// MacBook Air
	'MacBookAir10,1': { chip: 'M2', type: MacDeviceType.MACBOOK },
	'MacBookAir11,1': { chip: 'M3', type: MacDeviceType.MACBOOK },
	'MacBookAir12,1': { chip: 'M4', type: MacDeviceType.MACBOOK },
	// MacBook Pro
	'MacBookPro16,1': { chip: 'M1 Pro', type: MacDeviceType.MACBOOK },
	'MacBookPro16,2': { chip: 'M1 Pro', type: MacDeviceType.MACBOOK },
	'MacBookPro17,1': { chip: 'M1 Max', type: MacDeviceType.MACBOOK },
	'MacBookPro18,1': { chip: 'M1 Max', type: MacDeviceType.MACBOOK },
	'MacBookPro18,2': { chip: 'M1 Pro', type: MacDeviceType.MACBOOK },
	'MacBookPro18,3': { chip: 'M1 Max', type: MacDeviceType.MACBOOK },
	'MacBookPro18,4': { chip: 'M1 Ultra', type: MacDeviceType.MACBOOK },
	'MacBookPro19,1': { chip: 'M2 Pro', type: MacDeviceType.MACBOOK },

	'MacBookPro19,2': { chip: 'M2 Max', type: MacDeviceType.MACBOOK },
	'MacBookPro19,3': { chip: 'M2 Max', type: MacDeviceType.MACBOOK },
	'MacBookPro19,4': { chip: 'M2 Pro', type: MacDeviceType.MACBOOK },

	'MacBookPro20,1': { chip: 'M3 Pro', type: MacDeviceType.MACBOOK },
	'MacBookPro20,2': { chip: 'M3 Max', type: MacDeviceType.MACBOOK },

	'MacBookPro20,3': { chip: 'M3 Max', type: MacDeviceType.MACBOOK },
	'MacBookPro20,4': { chip: 'M3 Pro', type: MacDeviceType.MACBOOK },
	'MacBookPro21,1': { chip: 'M4 Pro', type: MacDeviceType.MACBOOK },
	'MacBookPro21,2': { chip: 'M4 Max', type: MacDeviceType.MACBOOK },
	'MacBookPro21,3': { chip: 'M4 Max', type: MacDeviceType.MACBOOK },
	'MacBookPro21,4': { chip: 'M4 Pro', type: MacDeviceType.MACBOOK },

	// Mac Mini
	'MacMini9,1': { chip: 'M1', type: MacDeviceType.DESKTOP },
	'MacMini10,1': { chip: 'M2', type: MacDeviceType.DESKTOP },
	'MacMini10,2': { chip: 'M2', type: MacDeviceType.DESKTOP },
	'MacMini11,1': { chip: 'M3', type: MacDeviceType.DESKTOP },
	'MacMini11,2': { chip: 'M4', type: MacDeviceType.DESKTOP },
	'MacMini11,3': { chip: 'M4', type: MacDeviceType.DESKTOP },

	// Mac Pro
	'MacPro7,1': { chip: 'Intel', type: MacDeviceType.DESKTOP },
	// Mac Studio
	'MacStudio1,1': { chip: 'M1 Max', type: MacDeviceType.DESKTOP },
	'MacStudio1,2': { chip: 'M1 Ultra', type: MacDeviceType.DESKTOP },
	'MacStudio2,1': { chip: 'M2 Max', type: MacDeviceType.DESKTOP },
	'MacStudio2,2': { chip: 'M2 Ultra', type: MacDeviceType.DESKTOP },
	'MacStudio3,1': { chip: 'M3 Max', type: MacDeviceType.DESKTOP },
	'MacStudio3,2': { chip: 'M3 Ultra', type: MacDeviceType.DESKTOP },
	'MacStudio4,1': { chip: 'M4 Max', type: MacDeviceType.DESKTOP },

	'MacStudio4,2': { chip: 'M4 Ultra', type: MacDeviceType.DESKTOP }
};

export function parseMacModelFromRenderer(
	renderer: string
): { type: MacDeviceType; chip: string } | null {
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

	return {
		chip: `Apple ${chip}`,
		type: isMaxOrUltra ? MacDeviceType.DESKTOP : MacDeviceType.MACBOOK
	};
}

export function getMacModelFromHeuristics(
	deviceMemory: number | undefined,
	hardwareConcurrency: number | undefined
): MacDeviceType | null {
	if (!deviceMemory || !hardwareConcurrency) return null;

	if (hardwareConcurrency >= 24 && deviceMemory >= 100) return MacDeviceType.DESKTOP;

	if (hardwareConcurrency >= 32 && deviceMemory >= 150) return MacDeviceType.DESKTOP;

	if (hardwareConcurrency <= 16 && deviceMemory >= 8) return MacDeviceType.MACBOOK;

	if (hardwareConcurrency <= 10 && deviceMemory >= 4) return MacDeviceType.MACBOOK;

	return null;
}

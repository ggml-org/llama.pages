import {
	detectBrowser,
	detectFormFactor,
	getAppleSiliconRenderer,
	getChromeDeviceModel
} from './detection';
import { getMacModelFromHeuristics, parseMacModelFromRenderer } from './mac-models';
import { DeviceFormFactor, MacDeviceType, OsKind } from '$lib/enums';
import type { DeviceInfo } from '$lib/types';

const deviceInfo = $state<DeviceInfo>({
	appleChip: null,
	browser: 'Unknown',
	isLinux: false,
	isMac: false,
	isMobile: false,
	isWindows: false,
	macDeviceType: MacDeviceType.UNKNOWN,
	os: OsKind.UNKNOWN,
	osName: 'your device'
});

let _initialized = false;

async function detectAndSet() {
	if (_initialized) return;

	_initialized = true;

	if (typeof window === 'undefined' || typeof navigator === 'undefined') {
		return;
	}

	const ua = navigator.userAgent;
	const nav = navigator as Navigator & { userAgentData?: { platform: string } };
	const uaData = nav.userAgentData;
	const platformFromData = uaData?.platform || ua;
	const isIOS = /(iPhone|iPad|iPod)/i.test(ua);
	const isAndroid = /Android/i.test(ua);
	const isMacDesktop = !isIOS && /Macintosh|Mac OS X|macOS/i.test(platformFromData);
	const isWindows = /Windows/i.test(platformFromData);
	const isLinuxDesktop = !isAndroid && !isIOS && /Linux/i.test(platformFromData);

	deviceInfo.os = isIOS
		? OsKind.IOS
		: isMacDesktop
			? OsKind.MAC
			: isWindows
				? OsKind.WINDOWS
				: isLinuxDesktop
					? OsKind.LINUX
					: OsKind.UNKNOWN;
	deviceInfo.osName = isIOS
		? 'your computer'
		: isMacDesktop
			? 'your Mac'
			: isWindows
				? 'your PC'
				: isLinuxDesktop
					? 'your Linux machine'
					: 'your device';

	deviceInfo.isMac = isMacDesktop;
	deviceInfo.isWindows = isWindows;
	deviceInfo.isLinux = isLinuxDesktop;
	deviceInfo.isMobile = detectFormFactor() === DeviceFormFactor.MOBILE;
	deviceInfo.browser = detectBrowser();

	if (isMacDesktop) {
		// Step 1: Chrome high-entropy values
		await getChromeDeviceModel();

		// Step 2: Battery Status API
		const batteryNav = navigator as Navigator & {
			getBattery?: () => Promise<{
				charging: boolean;
				chargingTime: number;
				dischargingTime: number;
				level: number;
			}>;
		};

		if ('getBattery' in batteryNav && batteryNav.getBattery) {
			try {
				const battery = await batteryNav.getBattery();
				const isDesktop = battery.chargingTime === 0 && battery.dischargingTime === Infinity;

				deviceInfo.macDeviceType = isDesktop ? MacDeviceType.DESKTOP : MacDeviceType.MACBOOK;
			} catch (e) {
				throw e instanceof Error ? e : new Error('Battery API failed');
			}
		}

		// Step 3: WebGL renderer
		const renderer = getAppleSiliconRenderer();

		if (renderer) {
			const parsed = parseMacModelFromRenderer(renderer);

			if (parsed) {
				if (deviceInfo.macDeviceType === MacDeviceType.UNKNOWN) {
					deviceInfo.macDeviceType = parsed.type;
				}

				deviceInfo.appleChip = parsed.chip;
			}
		}

		// Step 4: Heuristics
		if (deviceInfo.macDeviceType === MacDeviceType.UNKNOWN) {
			const memNav = navigator as Navigator & {
				deviceMemory?: number;
				hardwareConcurrency?: number;
			};
			const heuristicType = getMacModelFromHeuristics(
				memNav.deviceMemory,
				memNav.hardwareConcurrency
			);

			if (heuristicType) {
				deviceInfo.macDeviceType = heuristicType;
			}
		}

		// Step 5: Determine friendly name
		if (deviceInfo.macDeviceType === MacDeviceType.MACBOOK) {
			deviceInfo.osName = 'your MacBook';
		} else if (deviceInfo.macDeviceType === MacDeviceType.DESKTOP && deviceInfo.appleChip) {
			deviceInfo.osName = deviceInfo.appleChip;
		} else if (deviceInfo.macDeviceType === MacDeviceType.DESKTOP) {
			deviceInfo.osName = 'your Mac';
		} else {
			deviceInfo.osName = 'your Mac';
		}
	}
}

// Public API — explicitly trigger detection (e.g., from +layout.svelte)
export function init() {
	detectAndSet();
}

export { deviceInfo };

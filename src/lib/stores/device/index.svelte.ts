import type { MacDeviceType } from './mac-models';

export type { MacDeviceType };
import { parseMacModelFromRenderer, getMacModelFromHeuristics } from './mac-models';
import { getAppleSiliconRenderer, getChromeDeviceModel, detectBrowser, detectFormFactor } from './detection';

export type OsKind = 'mac' | 'windows' | 'linux' | 'ios' | 'android' | 'unknown';
export type DeviceFormFactor = 'desktop' | 'mobile' | 'tablet';

export interface DeviceInfo {
	os: OsKind;
	osName: string;
	macDeviceType: MacDeviceType;
	appleChip: string | null;
	isMac: boolean;
	isWindows: boolean;
	isLinux: boolean;
	isMobile: boolean;
	browser: string;
}

const deviceInfo = $state<DeviceInfo>({
	os: 'unknown',
	osName: 'your device',
	macDeviceType: 'unknown',
	appleChip: null,
	isMac: false,
	isWindows: false,
	isLinux: false,
	isMobile: false,
	browser: 'Unknown',
});

let _initialized = false;

async function detectAndSet() {
	if (_initialized) return;
	_initialized = true;

	if (typeof window === 'undefined' || typeof navigator === 'undefined') {
		console.log('[device] SSR — skipping detection');
		return;
	}

	console.log('[device] === INIT START ===');

	const ua = navigator.userAgent;
	console.log('[device] UA:', ua);

	const nav = navigator as Navigator & { userAgentData?: { platform: string } };
	const uaData = nav.userAgentData;
	console.log('[device] userAgentData:', uaData);
	const platformFromData = uaData?.platform || ua;
	console.log('[device] platform:', platformFromData);

	const isIOS = /(iPhone|iPad|iPod)/i.test(ua);
	const isAndroid = /Android/i.test(ua);
	const isMacDesktop = !isIOS && /Macintosh|Mac OS X/i.test(platformFromData);
	const isWindows = /Windows/i.test(platformFromData);
	const isLinuxDesktop = !isAndroid && !isIOS && /Linux/i.test(platformFromData);

	console.log('[device] OS detection:', { isIOS, isAndroid, isMacDesktop, isWindows, isLinuxDesktop });

	deviceInfo.os = isIOS ? 'ios' : isMacDesktop ? 'mac' : isWindows ? 'windows' : isLinuxDesktop ? 'linux' : 'unknown';
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
	deviceInfo.isMobile = detectFormFactor() === 'mobile';
	deviceInfo.browser = detectBrowser();

	console.log('[device] Initial info:', JSON.stringify({
		os: deviceInfo.os,
		osName: deviceInfo.osName,
		isMac: deviceInfo.isMac,
		isMobile: deviceInfo.isMobile,
		browser: deviceInfo.browser,
	}, null, 2));

	if (isMacDesktop) {
		console.log('[device] >>> Mac detected, starting Mac-specific detection');

		// Step 1: Chrome high-entropy values
		const chromeModel = await getChromeDeviceModel();

		// Step 2: Battery Status API
		const batteryNav = navigator as Navigator & { getBattery?: () => Promise<any> };
		if ('getBattery' in batteryNav && batteryNav.getBattery) {
			try {
				const battery = await batteryNav.getBattery();
				console.log('[device] Battery:', {
					charging: battery.charging,
					chargingTime: battery.chargingTime,
					dischargingTime: battery.dischargingTime,
					level: battery.level,
				});
				const isDesktop = battery.chargingTime === 0 && battery.dischargingTime === Infinity;
				deviceInfo.macDeviceType = isDesktop ? 'desktop' : 'macbook';
				console.log('[device] Battery-based macDeviceType:', deviceInfo.macDeviceType);
			} catch (e: any) {
				console.log('[device] Battery API error:', e?.message || e);
			}
		} else {
			console.log('[device] Battery API not available');
		}

		// Step 3: WebGL renderer
		const renderer = getAppleSiliconRenderer();
		if (renderer) {
			const parsed = parseMacModelFromRenderer(renderer);
			if (parsed) {
				console.log('[device] WebGL parsed:', parsed);
				if (deviceInfo.macDeviceType === 'unknown') {
					deviceInfo.macDeviceType = parsed.type;
				}
				deviceInfo.appleChip = parsed.chip;
			}
		}

		// Step 4: Heuristics
		if (deviceInfo.macDeviceType === 'unknown') {
			const memNav = navigator as Navigator & { deviceMemory?: number; hardwareConcurrency?: number };
			const heuristicType = getMacModelFromHeuristics(memNav.deviceMemory, memNav.hardwareConcurrency);
			if (heuristicType) {
				console.log('[device] Heuristic-based:', heuristicType);
				deviceInfo.macDeviceType = heuristicType;
			}
		}

		// Step 5: Determine friendly name
		if (deviceInfo.macDeviceType === 'macbook') {
			deviceInfo.osName = 'your MacBook';
		} else if (deviceInfo.macDeviceType === 'desktop' && deviceInfo.appleChip) {
			deviceInfo.osName = deviceInfo.appleChip;
		} else if (deviceInfo.macDeviceType === 'desktop') {
			deviceInfo.osName = 'your Mac';
		} else {
			deviceInfo.osName = 'your Mac';
		}

		console.log('[device] Final osName:', deviceInfo.osName);
	}

	console.log('[device] === FINAL info ===');
	console.log(JSON.stringify({
		os: deviceInfo.os,
		osName: deviceInfo.osName,
		macDeviceType: deviceInfo.macDeviceType,
		appleChip: deviceInfo.appleChip,
		isMac: deviceInfo.isMac,
		isWindows: deviceInfo.isWindows,
		isLinux: deviceInfo.isLinux,
		isMobile: deviceInfo.isMobile,
		browser: deviceInfo.browser,
	}, null, 2));
	console.log('[device] === INIT END ===');
}

// Public API — explicitly trigger detection (e.g., from +layout.svelte)
export function init() {
	detectAndSet();
}

export { deviceInfo };

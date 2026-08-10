import type { MacDeviceType, OsKind } from '../enums';

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

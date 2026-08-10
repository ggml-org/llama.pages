/**
 * URL scheme prefixes, mirroring llama.cpp's UrlProtocol. Values carry the
 * trailing colon so they compare directly against `URL.protocol`; a base URL
 * is built as `${UrlProtocol.HTTP}//host`.
 */
export enum UrlProtocol {
	HTTP = 'http:',
	HTTPS = 'https:'
}

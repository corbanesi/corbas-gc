export function getImageUrl(file: string) {
	return new URL(`../assets/images/${file}`, import.meta.url).href;
}

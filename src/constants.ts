export const USER_AGENT =
	"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36";

export const NOT_FOUND_STR = "Sorry, but we either:";

const hdrs = new Headers();
hdrs.append("User-Agent", USER_AGENT);

export { hdrs as headers };

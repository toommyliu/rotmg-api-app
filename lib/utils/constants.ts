const USER_AGENT =
	"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36";

export const NOT_FOUND_STR = "Sorry, but we either:";

export async function fetcher(
	input: string | URL | Request,
	init?: RequestInit | undefined
) {
	return fetch(
		input,
		Object.assign({}, init, {
			headers: {
				"User-Agent": USER_AGENT,
			},
		})
	);
}

export const statusMessages: Record<string, string> = {
	FAIL_FETCH: "Failed to fetch data from RealmEye!",

	// RealmEye returns HTTP 200 even if a player is not found
	PLAYER_NOT_FOUND: "Player does not exist, or has a private profile.",
};

export const statusCodes: Record<string, number> = {
	FAIL_FETCH: 500,

	PLAYER_FOUND: 200,
	PLAYER_NOT_FOUND: 404,
};
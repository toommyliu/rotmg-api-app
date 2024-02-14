import { parse } from "node-html-parser";
import {
	fetcher,
	statusMessages,
	statusCodes,
	NOT_FOUND_STR,
} from "@/utils/constants";
import type { NextRequest } from "next/server";
import type { RealmEyePlayer } from "@/lib/types";

function populate(obj: Partial<RealmEyePlayer>): RealmEyePlayer {
	const player: RealmEyePlayer = {
		name: obj.name!,
		characters: -1,
		skins: -1,
		exaltations: -1,
		fame: -1,
		rank: -1,
		account_fame: -1,
		guild_rank: "",
		last_seen: "",
		first_seen: "",
		created: "",
	};

	Object.assign(player, obj);

	return player;
}

function convertKey(key: string): keyof RealmEyePlayer {
	switch (key) {
		case "Account fame":
			return "account_fame";
		case "Guild Rank":
			return "guild_rank";
		case "First seen":
			return "first_seen";
		case "Last seen":
			return "last_seen";
		default:
			return key.toLowerCase() as keyof RealmEyePlayer;
	}
}

function parseValue(key: string, value: string): string | number {
	switch (key) {
		case "characters":
		case "rank":
			return Number.parseInt(value, 10);
		case "skins":
		case "exaltations":
		case "fame":
		case "account_fame": {
			const val = value.split(" ")[0];
			return Number.parseInt(val, 10);
		}
		default:
			return value;
	}
}

export const runtime = "edge";

export async function GET(req: NextRequest) {
	// name provided in query
	const ogName = req.nextUrl.searchParams.get("player");

	const url = `https://www.realmeye.com/player/${ogName}`;
	const resp = await fetcher(url);

	if (!resp.ok) {
		return Response.json(
			{ error: statusMessages.FAIL_FETCH },
			{ status: statusCodes.FAIL_FETCH }
		);
	}

	const html = await resp.text();
	const document = parse(html);

	const container = document.querySelector("body > div.container");
	const h2 = container?.querySelector("div > div > h2");
	if (!container || h2?.rawText === NOT_FOUND_STR) {
		return Response.json(
			{ error: statusMessages.PLAYER_NOT_FOUND },
			{ status: statusCodes.PLAYER_NOT_FOUND }
		);
	}

	const tbl = container.querySelector(
		"div > div > div.row > div.col-md-5 > table"
	);
	if (!tbl) {
		return Response.json(
			{ error: statusMessages.PLAYER_NOT_FOUND },
			{ status: statusCodes.PLAYER_NOT_FOUND }
		);
	}

	// correct formatting of the name
	const name = container.querySelector("div > div > h1 > span")!;

	const rows = tbl.querySelectorAll("tr");
	const ret: Partial<RealmEyePlayer> = { name: name.rawText };

	for (const row of rows) {
		const [td_1, td_2] = row.querySelectorAll("td");

		const lbl = td_1;
		const val = td_2;

		const key = convertKey(lbl.rawText);
		// @ts-expect-error
		ret[key] = parseValue(key, val.rawText);
	}

	populate(ret);

	return Response.json(ret, { status: 200 });
}

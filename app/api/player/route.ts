import { parse } from "node-html-parser";
import { headers, NOT_FOUND_STR } from "../../../lib/utils/constants";
import { parseDate } from "chrono-node";

// add missing key-values to indicate "hidden"
function populate() {}

export const runtime = "edge";

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const name = searchParams.get("name") || null;

	if (!name) {
		return Response.json({
			error: "Bad Request",
			message: "No player name provided",
		});
	}

	const url = `https://www.realmeye.com/player/${name}`;
	const resp = await fetch(url, {
		headers,
	});

	if (!resp.ok) {
		return Response.json({
			error: "Bad Request",
			message: "Error fetching data from RealmEye",
		});
	}

	console.log(url);

	const html = await resp.text();
	const document = parse(html);

	const title = document.querySelector("title")?.rawText;

	const container = document.querySelector("body > div.container");
	if (!container) {
		return Response.json({
			error: "Not Found",
			message: "Player not found",
		});
	}

	const h2 = container.querySelector("div > div > h2");
	if (h2?.rawText === NOT_FOUND_STR) {
		return Response.json({
			error: "Not Found",
			message: "Player not found",
		});
	}

	// summary table
	const tbl = container.querySelector("div > div > div.row > div.col-md-5 > table");
	if (!tbl) {
		return Response.json({
			error: "Internal Server Error",
			message: "Error parsing data",
		});
	}

	// TODO: generate proper types
	const obj: Record<string, string | number> = {};

	const rows = tbl.querySelectorAll("tr");
	rows?.forEach((row) => {
		const cells = row.querySelectorAll("td");
		if (cells.length == 2) {
			const og_cell = cells[0].rawText;
			const og_value = cells[1].rawText;

			let key;
			let value: string | number | undefined = og_value;

			// TODO: add leaderboard positions
			switch (og_cell) {
				case "Characters":
					key = "characters";
					value = Number.parseInt(og_value) ?? -1;
					break;
				case "Skins":
					key = "skins";
					value = Number.parseInt(og_value) ?? -1;
					break;
				case "Exaltations":
					key = "exaltations";
					value = Number.parseInt(og_value.split(" ")[0]) ?? -1;
					break;
				case "Fame":
					key = "fame";
					value = Number.parseInt(og_value.split(" ")[0]) ?? -1;
					break;
				case "Rank":
					key = "rank";
					value = Number.parseInt(og_value) ?? -1;
					break;
				case "Account fame":
					key = "account_fame";
					value = Number.parseInt(og_value.split(" ")[0]) ?? -1;
					break;
				case "Guild":
					key = "guild";
					break;
				case "Guild Rank":
					key = "guild_rank";
					break;
				// TODO: decide if dates should be returned as a unix timestamp
				case "Created":
					key = "created_at";
					value = parseDate(og_value)?.getTime() ?? -1;
					break;
				case "First seen":
					key = "first_seen_at";
					value = parseDate(og_value)?.getTime() ?? -1;
				case "Last seen":
					key = "last_seen_at";
					value = parseDate(og_value)?.getTime() ?? -1;
					break;
				default:
					key = og_cell;
					break;
			}

			obj[key] = value!;
		}
	});

	// TODO: populate missing keys
	console.log(obj);

	return Response.json(obj);
}

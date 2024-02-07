import { parse } from "node-html-parser";
import { headers, NOT_FOUND_STR } from "@/constants";

// add missing key-values to indicate "hidden"
function populate() {

}

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

	const found =
		document.querySelector("body > div.container > div > div > h2")
			?.rawText !== NOT_FOUND_STR;
	if (!found) {
		return Response.json({
			error: "Not Found",
			message: "Player not found",
		});
	}

	const summary = document.querySelector(
		"body > div.container > div > div > div.row > div.col-md-5 > table"
	);

	// TODO: generate proper types
	const obj: Record<string, string | number> = {};

	const rows = summary?.querySelectorAll("tr");
	rows?.forEach((row) => {
		const cells = row.querySelectorAll("td");
		if (cells.length == 2) {
			const og_cell = cells[0].rawText;
			const og_value = cells[1].rawText;

			let key;
			let value: string | number | undefined;

			switch (og_cell) {
				case "Characters":
					key = "characters";
					value = parseInt(og_value) ?? -1;
					break;
				case "Skins":
					key = "skins";
					break;
				case "Exaltations":
					key = "exaltations";
					break;
				case "Fame":
					key = "fame";
					break;
				case "Rank":
					key = "rank";
					break;
				case "Account fame":
					key = "account_fame";
					break;
				case "Guild":
					key = "guild";
					break;
				case "Guild Rank":
					key = "guild_rank";
					break;
				case "Created":
					key = "created_at";
					break;
				case "First seen":
					key = "first_seen_at";
				case "Last seen":
					key = "last_seen_at";
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

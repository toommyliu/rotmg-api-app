import { parse } from "node-html-parser";
export async function GET(request: Request) {
	const headers = new Headers();
	headers.append("User-Agent", "Mozilla/5.0");

	const req = await fetch("https://www.realmeye.com/player/Adrizomble", {
		headers: headers,
	});

	if (!req.ok) {
		return Response.json("bad request");
	}

	const html = await req.text();
	const root = parse(html);

	// <title>Characters of the RotMG Player: Adrizomble | RealmEye.com</title>
	const title = root.querySelector("title")?.text;

	return Response.json(title);
}

"use server";
import "server-only";

export default async function joinGuild(userId: string, accessToken: string) {
	return fetch(
		`https://discord.com/api/v10/guilds/${process.env.DISCORD_GUILD_ID}/members/${userId}`,
		{
			method: "PUT",
			headers: {
				Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				access_token: accessToken,
			}),
		}
	).then(res => {
		if (!res.ok) {
			console.log(res);
		}
		return res.status;
	}).catch((err) => {
		const error = err as Error;
		return 500;
	})
}

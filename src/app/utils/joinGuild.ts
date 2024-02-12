import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";

export default async function joinGuild(userId: string, accessToken: string) {
	const rest = new REST({ version: "10" }).setToken(
		process.env.DISCORD_BOT_TOKEN!
	);

	try {
		await rest
			.put(Routes.guildMember(process.env.DISCORD_GUILD_ID!, userId), {
				auth: true,
				headers: {
					Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
					"Content-Type": "application/json",
				},
				body: {
					access_token: accessToken,
				},
			})
			.then(console.log)
			.catch(console.log);
		return true;
	} catch {
		return false;
	}
}

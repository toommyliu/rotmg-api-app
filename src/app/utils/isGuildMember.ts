import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";

export default async function isGuildMember(userId: string) {
	const rest = new REST({ version: "10" }).setToken(
		process.env.DISCORD_BOT_TOKEN!
	);

	try {
		await rest.get(
			Routes.guildMember(process.env.DISCORD_GUILD_ID!, userId),
			{
				auth: true,
				headers: {
					Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
				},
			}
		);
		return true;
	} catch {
		return false;
	}
}

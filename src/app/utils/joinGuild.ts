export async function joinGuild(userId: string, accessToken: string) {
	const url = `https://api.clerk.com/v1/users/${userId}/oauth_access_tokens/oauth_discord`;
	return fetch(url, {
		method: "PUT",
		headers: {
			Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			access_token: accessToken,
		}),
	})
		.then((res) => {
			switch (res.status) {
				case 201:
					console.log(`${userId} is joined the guild!`);
					return "joined";
				case 204:
					console.log(`${userId} is already in the guild!`);
					return "already_in_guild";
				default:
					console.log(`Unhandled status code: ${res.status}!`);
					console.log(res);
					return null;
			}
		})
		.catch((err) => {
			const error = err as Error;
			console.log(
				`Something failed while trying to join the guild!`,
				error
			);
			return null;
		});
}

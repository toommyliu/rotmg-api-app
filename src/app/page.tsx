import {
	SignInButton,
	SignOutButton,
	SignedIn,
	SignedOut,
} from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs";
import type { OauthAccessToken } from "@clerk/nextjs/server";

const getOAuthToken = async (
	user_id: string
): Promise<OauthAccessToken[] | null> => {
	return fetch(
		`https://api.clerk.com/v1/users/${user_id}/oauth_access_tokens/oauth_discord`,
		{
			headers: {
				Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
			},
		}
	).then((res) => {
		if (!res.ok) {
			return null;
		}
		return res.json() as Promise<OauthAccessToken[]>;
	});
};

export default async function Home() {
	const session = auth();
	const user = await currentUser();

	if (!user) {
		return (
			<SignedOut>
				sign in before doing anything
				<SignInButton />
			</SignedOut>
		);
	}

	const token = await getOAuthToken(user!.id);

	if (token) {
		const userId = user?.externalAccounts[0].externalId;

		await fetch(
			`https://discord.com/api/v10/guilds/${process.env.DISCORD_GUILD_ID}/members/${userId}`,
			{
				method: "PUT",
				headers: {
					Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					access_token: token[0].token,
				}),
			}
		)
			.then((res) => {
				if (res.status === 201) {
					console.log("joined the guild!");
				} else if (res.status === 204) {
					console.log("already in the guild!");
				}
			})
			.catch((error) => console.log(error));
	}

	return (
		<>
			<SignedIn>
				hello! {user?.externalAccounts[0].username}
				<SignOutButton />
			</SignedIn>
		</>
	);
}

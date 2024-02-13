"use server";
import "server-only";
import type { OauthAccessToken } from "@clerk/nextjs/server";

export default async function getOauthToken(userId: string) {
	const url = `https://api.clerk.com/v1/users/${userId}/oauth_access_tokens/oauth_discord`;
	const headers = {
		Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
	};

	return fetch(url, { headers })
		.then((res) => {
			if (!res.ok) {
				return null;
			}
			return res.json() as Promise<OauthAccessToken[]>;
		})
		.catch((err) => {
			const error = err as Error;
			console.log(error);
			return null;
		});
}

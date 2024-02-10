import {
	SignInButton,
	SignOutButton,
	SignedIn,
	SignedOut,
} from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs";
import { getOAuthToken } from "@/app/utils/getOAuthToken";
import { joinGuild } from "@/app/utils/joinGuild";

export default async function Home() {
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
		await joinGuild(userId, token[0].token);
	}

	return (
		<SignedIn>
			hello! {user?.externalAccounts[0].username}
			<SignOutButton />
		</SignedIn>
	);
}

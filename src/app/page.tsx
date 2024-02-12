// TODO: convert to client component for interactivity?
import {
	ClerkLoaded,
	ClerkLoading,
	SignInButton,
	SignOutButton,
	SignedIn,
	SignedOut,
	currentUser,
} from "@clerk/nextjs";
import { Button, Center, Group, Loader, Stack, Text } from "@mantine/core";
import { getOAuthToken } from "./utils/getOAuthToken";
import isGuildMember from "./utils/isGuildMember";
import joinGuild from "./utils/joinGuild";

export default async function Page() {
	const user = await currentUser();

	if (user) {
		// check if they are in the guild
		const accessToken = await getOAuthToken(user.id);
		if (accessToken) {
			const discordAccount = user.externalAccounts[0];
			const { token } = accessToken[0];
			const discordId = discordAccount.externalId;
			const discordUsername = discordAccount.username;
			const isMember = await isGuildMember(discordId);
			if (!isMember) {
				await joinGuild(discordId, token);
				console.log(
					`${discordUsername} (${discordId}) has joined the guild`
				);
			}
		}
	}

	return (
		<Center mt="xl">
			<ClerkLoading>
				<Loader />
			</ClerkLoading>

			<ClerkLoaded>
				<SignedOut>
					<SignInButton mode="modal">
						<Button>Sign in</Button>
					</SignInButton>
				</SignedOut>

				<SignedIn>
					<Stack>
						<Group>
							<div
								style={{
									display: "flex",
									flexWrap: "nowrap",
									gap: "3px",
								}}
							>
								Hello,
								<Text fw={700}>
									{user?.username ?? user?.firstName ?? "no"}
								</Text>
							</div>
						</Group>

						<SignOutButton>
							<Button>Sign out</Button>
						</SignOutButton>
					</Stack>
				</SignedIn>
			</ClerkLoaded>
		</Center>
	);
}

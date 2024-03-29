"use client";
import {
	ClerkLoaded,
	ClerkLoading,
	SignInButton,
	SignOutButton,
	SignedIn,
	SignedOut,
	useUser,
} from "@clerk/nextjs";
import { Button, Center, Group, Loader, Stack, Text } from "@mantine/core";
import joinGuild from "./utils/joinGuild";
import getOauthToken from "./utils/getOauthToken";
import { notifications } from "@mantine/notifications";

export default function Page() {
	const { user } = useUser();

	const handleClick = async () => {
		const status = await joinGuild(
			user?.externalAccounts[0]?.providerUserId!,
			(await getOauthToken(user!.id))![0].token
		);

		switch (status) {
			case 201:
				notifications.show({
					color: "green",
					title: "Success",
					message: "Joined the guild!",
				});
				break;
			case 204:
				notifications.show({
					color: "yellow",
					title: "Error",
					message: "It seems you are already a member of the guild.",
				});
				break;
			default:
				notifications.show({
					color: "red",
					title: "Error",
					message: "Something bad happened trying to add you to the guild.",
				});
		}
	};

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
									{user?.username ??
										user?.firstName ??
										"something went wrong here..."}
								</Text>
							</div>
						</Group>

						<SignOutButton>
							<Button>Sign out</Button>
						</SignOutButton>
						<Button onClick={handleClick}>Join Guild</Button>
					</Stack>
				</SignedIn>
			</ClerkLoaded>
		</Center>
	);
}

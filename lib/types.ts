export type RealmEyePlayer = {
	name: string;
	// can be hidden
	characters?: number;
	skins?: number;
	exaltations?: number;
	fame?: number; // total fame across all characters
	rank?: number;
	account_fame?: number; // the accumulated fame
	guild_rank?: string;
	created?: string;
	first_seen?: string; // first seen and created are mutually exclusive? 
	last_seen?: string;
}
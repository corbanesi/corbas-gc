type Id = string | number;

type Tier = {
	id: Id;
	title: string;
	color: string;
};

type Character = {
	id: Id;
	name: string;
	image: string;
	tierId: Id;
	type: CharType;
	tier: CharTier;
	attr: CharAttr;
};

type CharType = "assault" | "tank" | "mage" | "support" | "ranged";

type CharTier = "SR" | "T";

type CharAttr = "hellfire" | "judgment" | "life" | "destruction" | "cycles";

type TypeData = {
	id: number;
	name: CharType;
	desc: string;
	img: string;
};

type TierData = {
	id: number;
	name: CharTier;
	desc: string;
	img: string;
};

type AttrData = {
	id: number;
	name: CharAttr;
	desc: string;
	img: string;
};

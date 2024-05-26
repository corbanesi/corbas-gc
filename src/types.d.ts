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
};

import { tierData, typeData } from "@/utils/data";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
	character: Character;
}

export function Character(props: Props) {
	const { character } = props;

	const { setNodeRef, attributes, listeners, transform, transition } = useSortable({
		id: character.id,
		data: {
			type: "Character",
			character,
		},
	});

	const style = {
		transition,
		transform: CSS.Transform.toString(transform),
	};

	return (
		<div className="relative">
			<img
				{...attributes}
				{...listeners}
				key={character.id}
				ref={setNodeRef}
				style={style}
				src={character.image}
				alt={character.name}
				title={character.name}
				className="h-14 w-14 md:h-24 md:w-24 touch-none border border-slate-400 bg-slate-50"
			/>
			<div className="absolute top-0 right-0 mt-1 mr-1 rounded-lg bg-slate-50 flex gap-1">
				<img src={tierData.find((tier) => tier.name === character.tier)?.img} className="h-6 w-6" alt="char tier" />
				<img src={typeData.find((type) => type.name === character.type)?.img} className="h-6 w-6" alt="char type" />
			</div>
		</div>
	);
}

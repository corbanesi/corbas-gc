import { attrData, tierData, typeData } from "@/utils/data";
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
		<div className="touch-none">
			<img
				{...attributes}
				{...listeners}
				key={character.id}
				ref={setNodeRef}
				style={style}
				src={character.image}
				alt={character.name}
				title={character.name}
				className="h-16 w-16 md:h-24 md:w-24 print:w-16 print:h-16 touch-none border border-slate-400 bg-slate-50"
			/>
			<div className="flex gap-1 justify-center pt-1">
				<img src={attrData.find((attr) => attr.name === character.attr)?.img} className="h-4 w-4 md:h-6 md:w-6 print:h-4 print:w-4" alt="char attr" />
				<img src={tierData.find((tier) => tier.name === character.tier)?.img} className="h-4 w-4 md:h-6 md:w-6 print:h-4 print:w-4" alt="char tier" />
				<img src={typeData.find((type) => type.name === character.type)?.img} className="h-4 w-4 md:h-6 md:w-6 print:h-4 print:w-4" alt="char type" />
			</div>
		</div>
	);
}

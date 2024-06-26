import { useMemo } from "react";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { Character } from "@/components/character";

interface Props {
	tier: Tier;
	characters: Character[];
}

export function DefaultTier(props: Props) {
	const { tier, characters } = props;

	const characterIdList = useMemo(() => characters.map((character) => character.id), [characters]);

	const { setNodeRef, listeners } = useSortable({
		id: tier.id,
		data: {
			type: "Tier",
			tier,
		},
	});

	return (
		<div className="min-h-28 border rounded-lg border-slate-200 bg-slate-50" ref={setNodeRef} {...listeners}>
			<div className="flex h-full flex-row flex-wrap justify-center items-center gap-2 p-2">
				<SortableContext items={characterIdList}>
					{characters.map((character) => (
						<Character key={character.id} character={character} />
					))}
				</SortableContext>
			</div>
		</div>
	);
}

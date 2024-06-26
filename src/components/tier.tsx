import { useMemo, useState } from "react";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TrashIcon } from "@/components/icons/trash-icon";
import { BarIcon } from "@/components/icons/bar-icon";
import { Character } from "@/components/character";

interface Props {
	tier: Tier;
	deleteTier: (id: Id) => void;
	updateTierTitle: (id: Id, title: string) => void;
	characters: Character[];
}

export function Tier(props: Props) {
	const { tier, characters, deleteTier, updateTierTitle } = props;

	const characterIdList = useMemo(() => characters.map((character) => character.id), [characters]);

	const [editMode, setEditMode] = useState(false);

	const { setNodeRef, attributes, listeners, transform, transition } = useSortable({
		id: tier.id,
		data: {
			type: "Tier",
			tier,
		},
		disabled: editMode,
	});

	const style = {
		transition,
		transform: CSS.Transform.toString(transform),
	};

	return (
		<div className="flex h-full min-h-32 gap-1" ref={setNodeRef} style={style} id={`tier-${tier.id}`}>
			<div
				className="flex w-28 flex-none flex-col items-center justify-center gap-2 rounded-lg p-2 border"
				style={{ backgroundColor: tier.color }}
			>
				<button
					className="flex-none cursor-grab active:cursor-grabbing touch-none stroke-slate-900"
					{...attributes}
					{...listeners}
				>
					<BarIcon />
				</button>
				{/* biome-ignore lint/a11y/useKeyWithClickEvents: div is not editable at this point*/}
				<div className="flex-1" onClick={() => setEditMode(true)}>
					<div className="flex h-full items-center break-all">
						{!editMode && tier.title}
						{editMode && (
							<input
								type="text"
								className="w-full"
								// biome-ignore lint/a11y/noAutofocus: i like this way
								autoFocus
								value={tier.title}
								onBlur={() => setEditMode(false)}
								onChange={(e) => updateTierTitle(tier.id, e.target.value)}
							/>
						)}
					</div>
				</div>
				<button type="button" onClick={() => deleteTier(tier.id)}>
					<TrashIcon />
				</button>
			</div>
			<div className="flex-1 flex-wrap border bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors p-2">
				<SortableContext items={characterIdList}>
					<div className="flex h-full flex-row items-center gap-2 flex-wrap">
						{characters.map((character) => (
							<Character key={character.id} character={character} />
						))}
					</div>
				</SortableContext>
			</div>
		</div>
	);
}

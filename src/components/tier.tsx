import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { TrashIcon } from "./icons/trash-icon";
import { CSS } from "@dnd-kit/utilities";
import { BarIcon } from "./icons/bar-icon";
import { Character } from "./character";
import { useMemo, useState } from "react";

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
		<div className="flex h-full min-h-32 gap-1" ref={setNodeRef} style={style}>
			<div
				className="flex w-28 flex-none flex-col items-center justify-center gap-2 border border-zinc-400 p-2"
				style={{ backgroundColor: tier.color }}
			>
				<button className="flex-none cursor-grab active:cursor-grabbing touch-none" {...attributes} {...listeners}>
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
			<div className="flex-1 flex-wrap border border-zinc-400 bg-slate-50 p-2">
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

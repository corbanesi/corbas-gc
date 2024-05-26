import { DndContext, type DragEndEvent, type DragOverEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { useEffect, useMemo, useRef, useState } from "react";
import { PlusIcon } from "@/components/icons/plus-icon";
import { DefaultTier } from "@/components/default-tier";
import { Tier } from "@/components/tier";
import { StorageIcon } from "@/components/icons/storage-icon";
import { characterData } from "@/utils/character-data";
import { generateColor, generateId } from "@/utils/generators";

const defaultTier: Tier = {
	id: 12_000,
	title: "Not a Tier",
	color: generateColor(),
};

interface Props {
	setToastOpen: (value: boolean) => void;
}

export function TierList(props: Props) {
	const { setToastOpen } = props;

	const timerRef = useRef(0);

	const [tierList, setTierList] = useState<Tier[]>([]);
	const tierIdList = useMemo(() => tierList.map((tier) => tier.id), [tierList]);

	const [characterList, setCharacterList] = useState<Character[]>(characterData);

	useEffect(() => {
		const localAppVersion = localStorage.getItem("appVersion");
		const localTierList = localStorage.getItem("tierList");
		const localCharacterList = localStorage.getItem("characterList");

		if (!localAppVersion) {
			localStorage.setItem("appVersion", APP_VERSION);
		} else {
			if (localTierList && localCharacterList) {
				if (localAppVersion.localeCompare(APP_VERSION, undefined, { numeric: true }) === -1) {
					const previousCharacterList = JSON.parse(localCharacterList) as Character[];

					const charactersMissing = characterData.filter(
						(data) => !previousCharacterList.some((oldCharacter) => data.id === oldCharacter.id),
					);

					setTierList(JSON.parse(localTierList));
					setCharacterList([...JSON.parse(localCharacterList), ...charactersMissing]);

					localStorage.setItem("appVersion", APP_VERSION);
				} else {
					setTierList(JSON.parse(localTierList));
					setCharacterList(JSON.parse(localCharacterList));
				}
			}
		}

		return () => clearTimeout(timerRef.current);
	}, []);

	function createNewTier() {
		const newTier: Tier = {
			id: generateId(),
			title: `Tier ${tierList.length + 1}`,
			color: generateColor(),
		};
		setTierList([...tierList, newTier]);
	}

	function handleSaveLocal() {
		localStorage.setItem("tierList", JSON.stringify(tierList));
		localStorage.setItem("characterList", JSON.stringify(characterList));
		setToastOpen(false);

		window.clearTimeout(timerRef.current);
		timerRef.current = window.setTimeout(() => {
			setToastOpen(true);
		}, 100);
	}

	function handleDeleteTier(id: Id): void {
		const filteredTierList = tierList.filter((tier) => tier.id !== id);

		setCharacterList((characters) => {
			return characters.map((character) => {
				if (character.tierId === id) {
					character.tierId = 12_000;
				}
				return character;
			});
		});

		setTierList(filteredTierList);
	}

	function handleUpdateTierTitle(id: Id, title: string) {
		const newTierList = tierList.map((tier) => {
			if (tier.id !== id) return tier;
			return { ...tier, title };
		});

		setTierList(newTierList);
	}

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		if (!over) return;

		const activeId = active.id;
		const overId = over.id;

		if (activeId === overId) return;

		const isActiveTier = active.data.current?.type === "Tier";
		if (!isActiveTier) return;

		setTierList((tiers) => {
			const activeTierIndex = tiers.findIndex((col) => col.id === activeId);
			const overTierIndex = tiers.findIndex((col) => col.id === overId);

			return arrayMove(tiers, activeTierIndex, overTierIndex);
		});
	}

	function handleDragOver(event: DragOverEvent) {
		const { active, over } = event;
		if (!over) return;

		const activeId = active.id;
		const overId = over.id;

		if (activeId === overId) return;

		const isActiveCharacter = active.data.current?.type === "Character";
		const isOverCharacter = over.data.current?.type === "Character";

		if (!isActiveCharacter) return;

		if (isActiveCharacter && isOverCharacter) {
			setCharacterList((characters) => {
				const activeCharacterIndex = characters.findIndex((t) => t.id === activeId);
				const overCharacterIndex = characters.findIndex((t) => t.id === overId);

				if (characters[activeCharacterIndex].tierId !== characters[overCharacterIndex].tierId) {
					characters[activeCharacterIndex].tierId = characters[overCharacterIndex].tierId;
					return arrayMove(characters, activeCharacterIndex, overCharacterIndex - 1);
				}

				return arrayMove(characters, activeCharacterIndex, overCharacterIndex);
			});
		}

		const isOverAColumn = over.data.current?.type === "Tier";

		if (isActiveCharacter && isOverAColumn) {
			setCharacterList((tasks) => {
				const activeIndex = tasks.findIndex((t) => t.id === activeId);

				tasks[activeIndex].tierId = overId;
				return arrayMove(tasks, activeIndex, activeIndex);
			});
		}
	}

	return (
		<div className="space-y-2">
			<div className="flex justify-between">
				<button
					type="button"
					className="flex min-w-24 gap-2 border p-2 transition-colors rounded-lg stroke-slate-600 hover:bg-slate-50 hover:border-slate-400"
					onClick={() => createNewTier()}
				>
					<PlusIcon />
					Add tier
				</button>
				<div className="flex gap-2">
					<button
						type="button"
						className="flex min-w-24 gap-2 border p-2 transition-colors rounded-lg stroke-slate-600 hover:bg-slate-50 hover:border-slate-400"
						onClick={() => handleSaveLocal()}
					>
						<StorageIcon />
						Save
					</button>
				</div>
			</div>
			<DndContext onDragEnd={handleDragEnd} onDragOver={handleDragOver}>
				<div className="flex flex-col gap-2">
					<SortableContext items={tierIdList}>
						{tierList.map((tier) => (
							<Tier
								key={tier.id}
								tier={tier}
								deleteTier={handleDeleteTier}
								updateTierTitle={handleUpdateTierTitle}
								characters={characterList.filter((character) => character.tierId === tier.id)}
							/>
						))}
					</SortableContext>
				</div>
				<DefaultTier tier={defaultTier} characters={characterList.filter((character) => character.tierId === 12_000)} />
			</DndContext>
		</div>
	);
}

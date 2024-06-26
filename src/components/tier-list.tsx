import { DndContext, type DragEndEvent, type DragOverEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { useEffect, useMemo, useRef, useState } from "react";
import { PlusIcon } from "@/components/icons/plus-icon";
import { DefaultTier } from "@/components/default-tier";
import { Tier } from "@/components/tier";
import { StorageIcon } from "@/components/icons/storage-icon";
import { characterData } from "@/utils/character-data";
import { typeData, tierData } from "@/utils/data";
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

	const [typeFilter, setTypeFilter] = useState<CharType[]>(["assault", "mage", "ranged", "support", "tank"]);

	const [tierFilter, setTierFilter] = useState<CharTier[]>(["SR", "T"]);

	const [attrFilter, setAttrFilter] = useState<CharAttr[]>(["cycles", "destruction", "hellfire", "judgment", "life"]);

	useEffect(() => {
		loadLocalTierList();
		loadLocalCharacterList();
	}, []);

	function loadLocalTierList() {
		const localTierList = localStorage.getItem("tierList");

		if (localTierList) {
			setTierList(JSON.parse(localTierList));
		}
	}

	function loadLocalCharacterList() {
		const strLocalCharacterList = localStorage.getItem("characterList");

		if (strLocalCharacterList) {
			const localhostCharacterList = JSON.parse(strLocalCharacterList) as Character[];
			const charactersList = characterData.map((character) => {
				const char = localhostCharacterList.find((from) => from.id === character.id);
				if (char) {
					return { ...character, tierId: char.tierId };
				}
				return character;
			});
			setCharacterList(charactersList);
		}
	}

	function createNewTier() {
		const newTier: Tier = {
			id: generateId(),
			title: `Tier ${tierList.length + 1}`,
			color: generateColor(),
		};
		setTierList([...tierList, newTier]);
	}

	function saveLocalstorage() {
		localStorage.setItem("tierList", JSON.stringify(tierList));
		const strCharacterList = JSON.stringify(
			characterList
				.filter((data) => data.tierId !== 12_000)
				.map((data) => {
					return {
						id: data.id,
						tierId: data.tierId,
					};
				}),
		);

		localStorage.setItem("characterList", strCharacterList);
		setToastOpen(false);

		window.clearTimeout(timerRef.current);
		timerRef.current = window.setTimeout(() => {
			setToastOpen(true);
		}, 100);
	}

	/**
	 *
	 * Deletes tier
	 *
	 * */
	function deleteTier(id: Id): void {
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

	/**
	 *
	 * Updates tier title
	 *
	 * */
	function updateTierTitle(id: Id, title: string) {
		const newTierList = tierList.map((tier) => {
			if (tier.id !== id) return tier;
			return { ...tier, title };
		});

		setTierList(newTierList);
	}

	/**
	 *
	 * Handle drag end event
	 *
	 * */
	function onDragEnd(event: DragEndEvent) {
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

	/**
	 *
	 * Handle drag over event
	 *
	 * */
	function onDragOver(event: DragOverEvent) {
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

	function updateCharTypeFilter(type: CharType) {
		if (typeFilter.includes(type)) {
			setTypeFilter(typeFilter.filter((item) => item !== type));
		} else {
			setTypeFilter([...typeFilter, type]);
		}
	}

	function updateTierFilter(tier: CharTier) {
		if (tierFilter.includes(tier)) {
			setTierFilter(tierFilter.filter((item) => item !== tier));
		} else {
			setTierFilter([...tierFilter, tier]);
		}
	}

	function updateAttrFilter(attr: CharAttr) {
		if (attrFilter.includes(attr)) {
			setAttrFilter(attrFilter.filter((item) => item !== attr));
		} else {
			setAttrFilter([...attrFilter, attr]);
		}
	}

	return (
		<div className="space-y-4">
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
						onClick={() => saveLocalstorage()}
					>
						<StorageIcon />
						Save
					</button>
				</div>
			</div>
			<div className="grid md:grid-cols-10 gap-2 align-middle">
				<div className="col-span-2 flex gap-2 align-middle">
					{typeData.map((type) => (
						<div key={type.id} className="flex align-middle">
							<button type="button" className="group" onClick={() => updateCharTypeFilter(type.name)}>
								<img
									className={`w-9 p-1 group-hover:bg-slate-200 transition-colors rounded-lg [&.active]:border [&.active]:bg-slate-100 ${
										typeFilter.includes(type.name) ? "active" : ""
									}`}
									src={type.img}
									alt={type.desc}
								/>
							</button>
						</div>
					))}
				</div>
				<div className="col-span-1 flex gap-2 align-middle">
					{tierData.map((tier) => (
						<div key={tier.id} className="flex align-middle">
							<button type="button" className="group" onClick={() => updateTierFilter(tier.name)}>
								<img
									className={`w-9 p-1 group-hover:bg-slate-200 transition-colors rounded-lg [&.active]:border [&.active]:bg-slate-100 ${
										tierFilter.includes(tier.name) ? "active" : ""
									}`}
									src={tier.img}
									alt={tier.desc}
								/>
							</button>
						</div>
					))}
				</div>
				{/* 
				<div className="col-span-2 flex gap-2 align-middle">
					{
						attrData.map(attr =>
							<div key={attr.id} className="flex align-middle">
								<button type="button" className="group" onClick={() => updateAttrFilter(attr.name)}>
									<img
										className={`w-9 p-1 group-hover:bg-slate-200 transition-colors rounded-lg [&.active]:border [&.active]:bg-slate-100 ${attrFilter.includes(attr.name) ? "active" : ""}`}
										src={attr.img}
										alt={attr.desc}
									/>
								</button>
							</div>
						)
					}
				</div>
				*/}
			</div>
			<DndContext onDragEnd={onDragEnd} onDragOver={onDragOver}>
				<div className="flex flex-col gap-2">
					<SortableContext items={tierIdList}>
						{tierList.map((tier) => (
							<Tier
								key={tier.id}
								tier={tier}
								deleteTier={deleteTier}
								updateTierTitle={updateTierTitle}
								characters={characterList.filter(
									(character) =>
										character.tierId === tier.id && typeFilter.includes(character.type) && tierFilter.includes(character.tier),
								)}
							/>
						))}
					</SortableContext>
				</div>
				<DefaultTier
					tier={defaultTier}
					characters={characterList.filter(
						(character) =>
							character.tierId === 12_000 && typeFilter.includes(character.type) && tierFilter.includes(character.tier),
					)}
				/>
			</DndContext>
		</div>
	);
}

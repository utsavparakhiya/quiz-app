import { atom } from "jotai";
import data from "./data/kotasMeatMarket.json";
import { Draggable, Editable, Target } from "./components/DragPlayground4";
import { ResearchItem } from "./components/ResearchJournal";
import { Navigation } from "./components/NavigationButton";
import { Dropdown } from "./components/DropDown";

interface Tab {
  tabId: number;
  title: string;
  screens: number[];
}

export const tabs: Tab[] = data.tabs;
export const screens = data.screens;
export const tabAtom = atom(1);
export const screenAtom = atom(1);
export const draggableAtom = atom<Draggable[]>(data.draggables);
export const targetAtom = atom<Target[]>(data.targets);
export const editableAtom = atom<Editable[]>(data.editables);
export const dropdownAtom = atom<Dropdown[]>(data.dropdowns);
export const newTargetCountAtom = atom(9000);
export const newDraggableCountAtom = atom(9000);

//1 pie
//2 line
//3 bar
export const graphAtom = atom(1);
export const tableAtom = atom<any>(data.dynamicTable);

// 9000 series is for dynamic targets (used in calculator)
// 8000 series is for table data
// 7000 series is for pie charts
// 6000 series if for dynamic Draggables from text (used in cases)

export const researchJournalAtom = atom<ResearchItem[]>([]);

export const navigationAtom = atom<Navigation>(data.navigation);
export const lockedTabsAtom = atom<number[]>([2, 3]);
export const hideNavigationAtom = atom<number[]>([]);
export const lockedScreensAtom = atom<number[]>(
  data.navigation.steps[0].lockScreen
);

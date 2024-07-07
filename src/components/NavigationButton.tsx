import { useAtom } from "jotai";
import {
  draggableAtom,
  dropdownAtom,
  editableAtom,
  hideNavigationAtom,
  lockedScreensAtom,
  lockedTabsAtom,
  navigationAtom,
  screenAtom,
  tabAtom,
  targetAtom,
} from "../atoms";
import { tabs } from "../atoms";
import { useEffect, useState } from "react";
import data from "./../data/kotasMeatMarket.json";
import { getEditableById, getTargetById } from "./DragPlayground4";
import { getDropDownById } from "./DropDown";

export interface Step {
  current: number | null;
  prev: number | null;
  next: number | null;
  dependency: string[];
  lockScreen: number[];
  unlockScreen: number[];
  lockTab: number[];
  unlockTab: number[];
  hideNavigation: number[];
}
export interface Navigation {
  currentStep: number;
  steps: Step[];
  casesStartScreen: number;
}

const getTabFromScreenId = (screenId: number): number | null => {
  for (const tab of tabs) {
    if (tab.screens.includes(screenId)) {
      return tab.tabId;
    }
  }
  return null;
};

export const getStepFromScreen = (
  currentScreen: number,
  steps: Step[]
): Step | undefined => {
  return steps.find((step) => step.current === currentScreen);
};

export const getStepIndexFromScreen = (
  currentScreen: number,
  steps: Step[]
): number => {
  return steps.findIndex((step) => step.current === currentScreen);
};

interface Disabled {
  next: boolean;
  prev: boolean;
}

export const NavigationButton = () => {
  const [targets] = useAtom(targetAtom);
  const [dropdowns] = useAtom(dropdownAtom);
  const [editables] = useAtom(editableAtom);
  const [screen, setScreens] = useAtom(screenAtom);
  const [tab, setTab] = useAtom(tabAtom);
  const [navigation, setNavigation] = useAtom(navigationAtom);
  const [dependencyCompleted, setDependencyCompleted] = useState(false);

  const [lockedScreens, setLockedScreen] = useAtom(lockedScreensAtom);
  const [lockedTabs, setLockedTabs] = useAtom(lockedTabsAtom);
  const [hideNavigation, setHideNavigation] = useAtom(hideNavigationAtom);

  useEffect(() => {}, [screen, tab, navigation]);

  const checkDependency = (dependency: string) => {
    const [type, last] = dependency.split("_");

    if (type === "t") {
      const targetId = parseInt(last);
      const t = getTargetById(targetId, targets);

      if (!t) return false;
      if (t.draggableId === null) return false;

      return true;
    }

    if (type === "dd") {
      const dropdownId = parseInt(last);
      const d = getDropDownById(dropdownId, dropdowns);

      if (!d) return true;
      if (d.selectedOption === null) return false;
      if (isNaN(d.selectedOption)) return false;

      return true;
    }

    if (type === "e") {
      const editableId = parseInt(last);
      const e = getEditableById(editableId, editables);

      if (!e) return true;
      if (e.value === null) return false;

      return true;
    }

    return false;
  };

  const next = () => {
    const currrentStep = navigation.steps[navigation.currentStep];

    // check if all dependencies are completed

    for (var dependency of currrentStep.dependency) {
      if (!checkDependency(dependency)) {
        alert("Please complete all questions before moving forward.");
        return;
      }
    }

    if (currrentStep.next) {
      setScreens(currrentStep.next);

      const nextTab = getTabFromScreenId(currrentStep.next);
      if (nextTab) {
        setTab(nextTab);
      }

      if (navigation.currentStep < navigation.steps.length - 1)
        setNavigation({
          ...navigation,
          currentStep: navigation.currentStep + 1,
        });
    }

    var newScreens = lockedScreens;
    newScreens = [...newScreens, ...currrentStep.lockScreen];
    newScreens = newScreens.filter(
      (screen) => !currrentStep.unlockScreen.includes(screen)
    );
    setLockedScreen(newScreens);

    var newTabs = lockedTabs;
    newTabs = [...newTabs, ...currrentStep.lockTab];
    newTabs = newTabs.filter((tab) => !currrentStep.unlockTab.includes(tab));
    setLockedTabs(newTabs);

    setHideNavigation([...hideNavigation, ...currrentStep.hideNavigation]);
  };

  const back = () => {
    const currrentStep = navigation.steps[navigation.currentStep];
    if (currrentStep.prev) {
      setScreens(currrentStep.prev);

      const prevTab = getTabFromScreenId(currrentStep.prev);
      if (prevTab) {
        setTab(prevTab);
      }

      if (navigation.currentStep > 0)
        setNavigation({
          ...navigation,
          currentStep: navigation.currentStep - 1,
        });
    }
  };
  return (
    <div className="flex flex-row">
      <button
        onClick={back}
        className={`px-3 py-2 rounded-full m-1 ${
          navigation.steps[navigation.currentStep].prev !== null
            ? "bg-yellow-300"
            : "bg-gray-300 cursor-not-allowed"
        }`}
      >
        Back
      </button>
      <button
        onClick={next}
        disabled={dependencyCompleted}
        className={`px-3 py-2 rounded-full m-1 ${
          !navigation.steps[navigation.currentStep].next !== null
            ? "bg-yellow-300"
            : "bg-gray-300 cursor-not-allowed"
        }`}
      >
        Next
      </button>
    </div>
  );
};

import { useAtom } from "jotai";
import { PanelNav, panelAtom } from "./PanelNav";
import { Study } from "./Study";
import { Cases } from "./Cases";
import { useEffect } from "react";
import { screenAtom, tabAtom } from "../atoms";
import data from "./../data/kotasMeatMarket.json";
import { NavigationButton } from "./NavigationButton";

const PanelContent = () => {
  const [currentPanel, setCurrentPanel] = useAtom(panelAtom);
  const [currentTab, setCurrentTab] = useAtom(tabAtom);
  const [currentScreen, setCurrentScreen] = useAtom(screenAtom);

  useEffect(() => {
    if (currentPanel === 1) {
      setCurrentScreen(1);
      setCurrentTab(1);
    }

    if (currentPanel === 2) {
      setCurrentScreen(data.navigation.casesStartScreen);
    }
  }, [currentPanel]);

  useEffect(() => {
    if (currentScreen < data.navigation.casesStartScreen) {
      setCurrentPanel(1);
    } else {
      setCurrentPanel(2);
    }
  }, [currentScreen]);

  return (
    <div className="w-full h-full ">
      {currentPanel === 1 && <Study />}
      {currentPanel === 2 && <Cases />}
    </div>
  );
};

export const Panel = () => {
  return (
    <div className="flex-col bg-[#F7F9FF] w-[95vw] h-[90vh] rounded-lg flex p-3 ">
      <PanelNav />
      <PanelContent />
    </div>
  );
};

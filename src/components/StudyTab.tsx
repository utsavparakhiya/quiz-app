import { useAtom } from "jotai";
import { Tab, Screen, filterScreensByIds, getScreenById } from "./Study";
import {
  tabAtom,
  screenAtom,
  tabs,
  lockedTabsAtom,
  lockedScreensAtom,
  navigationAtom,
} from "../atoms";

export const StudyTab = () => {
  const [currentTab, setCurrentTab] = useAtom(tabAtom);
  const [currentScreen, setCurrentScreen] = useAtom(screenAtom);
  const [lockedTabs] = useAtom(lockedTabsAtom);
  const [lockedScreens] = useAtom(lockedScreensAtom);
  const [navigation] = useAtom(navigationAtom);

  return (
    <div className="w-[100%] h-[100%]  flex flex-col">
      {tabs.map((tab: Tab, index: number) => {
        return (
          <div
            key={index}
            className={`mr-4 mb-2 p-2  rounded-lg  ${
              currentTab === tab.tabId ? "bg-qblack text-white" : "bg-qgray"
            }`}
          >
            <button
              disabled={lockedTabs.includes(tab.tabId)}
              className={`text-xl w-full flex  ${
                currentTab === tab.tabId
                  ? "font-extrabold text-white"
                  : "font-bold text-qblack"
              } 
              ${lockedTabs.includes(tab.tabId) ? "cursor-not-allowed" : ""}
              
              `}
              onClick={() => {
                setCurrentTab(tab.tabId);
                const currentStep = navigation.steps[navigation.currentStep];

                if (
                  currentStep.current &&
                  tab.screens.includes(currentStep.current)
                ) {
                  setCurrentScreen(currentStep.current);
                } else {
                  setCurrentScreen(
                    getScreenById(tab.screens[0])?.screenId ?? 0
                  );
                }
              }}
            >
              {tab.title}
            </button>

            {currentTab === tab.tabId && (
              <div className="p-2 flex flex-col items-start justify-start text-left">
                {filterScreensByIds(tab.screens).map(
                  (screen: Screen, index: number) => {
                    return (
                      <button
                        disabled={lockedScreens.includes(screen.screenId)}
                        className={`
                        ${
                          lockedScreens.includes(screen.screenId)
                            ? " cursor-not-allowed "
                            : " cursor-pointer "
                        }
                        
                        font-bold ${
                          currentScreen === screen.screenId
                            ? "text-qpurple"
                            : ""
                        }    
                        `}
                        onClick={() => {
                          setCurrentScreen(screen.screenId);
                          // TODO: Set current Step according to current screen id
                        }}
                        key={index}
                      >
                        {screen.title}
                      </button>
                    );
                  }
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

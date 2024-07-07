import { StudyTab } from "./StudyTab";
import { atom, useAtom } from "jotai";
import data from "./../data/kotasMeatMarket.json";
import {
  Draggable,
  DynamicDraggable,
  Target,
  createEditable,
} from "./DragPlayground4";
import { createTarget } from "./DragPlayground4";
import reactStringReplace from "react-string-replace";
import { Investigation } from "./Investigation";
import {
  screens,
  draggableAtom,
  targetAtom,
  tabAtom,
  screenAtom,
  hideNavigationAtom,
} from "../atoms";
import { ResearchJournal } from "./ResearchJournal";
import { Calculator } from "./Calculator";
import { Table, createTable } from "./Table";
import { Qpie, createPieChart } from "./PieChart";
import { Dropdown, createDropdown } from "./DropDown";
import { NavigationButton } from "./NavigationButton";
import { createDynamicTable } from "./DynamicTable";

export interface Tab {
  tabId: number;
  title: string;
  screens: number[];
}

export interface Content {
  heading: string;
  paragraphs: string[];
}

export interface Screen {
  screenId: number;
  title: string;
  content: Content[];
}

export function filterScreensByIds(screenIds: number[]): Screen[] {
  return screens.filter((screen) => screenIds.includes(screen.screenId));
}

export function getScreenById(screenId: number): Screen | undefined {
  return screens.find((screen) => screen.screenId === screenId);
}

export const parseContent = (text: string) => {
  let replacedText = reactStringReplace(text, /([etdp]d?_\d+)/g, (match, i) => {
    const [type, last] = match.split("_");
    if (last) {
      if (type === "t") {
        const targetId = parseInt(last);
        return createTarget(targetId);
      }

      if (type === "e") {
        const editableId = parseInt(last);
        return createEditable(editableId);
      }

      if (type === "d") {
        const tableId = parseInt(last);
        return createTable(tableId);
      }

      if (type === "p") {
        const piechartId = parseInt(last);
        return createPieChart(piechartId);
      }

      if (type === "dd") {
        const dropdownId = parseInt(last);
        return createDropdown(dropdownId);
      }

      if (type === "td") {
        return createDynamicTable();
      }
    }
  });

  replacedText = reactStringReplace(
    replacedText,
    /([c]_\d+_\d+)/g,
    (match, i) => {
      const [type, middle, last] = match.split("_");

      if (type === "c") {
        const id = parseInt(middle);
        const parsedValue = parseInt(last);
        const value = isNaN(parsedValue) ? last : parsedValue;

        return (
          <div className="inline-block">
            <DynamicDraggable id={id} value={value} />
          </div>
        );
      }
    }
  );

  return <div className="inline-block leading-7">{replacedText}</div>;
};

export const Study = () => {
  const [currentTab, setCurrentTab] = useAtom(tabAtom);
  const [currentScreen, setCurrentScreen] = useAtom(screenAtom);
  const [draggables] = useAtom(draggableAtom);
  const [targets] = useAtom(targetAtom);
  const [hideNavigation] = useAtom(hideNavigationAtom);

  return (
    <div className="flex flex-row w-[100%] h-[90%] relative ">
      {/* Tab Navigator */}
      <div className="w-[15%] h-[95%]">
        <StudyTab />
      </div>

      {/* Main Area */}
      <div className="flex w-[65%] h-[100%] bg-qgray p-4 text-qblack ">
        <div className="flex flex-col w-full">
          {currentTab === 1 && (
            <div className="overflow-auto">
              <Investigation screenIds={data.tabs[0].screens} />
            </div>
          )}
          {/* TODO: Create seperate components for ananlysis and report */}
          {currentTab !== 1 && (
            <div className="h-[100vh] overflow-auto">
              {getScreenById(currentScreen)?.content.map((item, index) => {
                return (
                  <div className="">
                    <div className="flex flex-col m-2 " key={index}>
                      <div className="text-xl font-bold mb-2">
                        {item.heading}
                      </div>
                      <div>
                        {item.paragraphs.map((para, index) => {
                          if (para === "<br>") return <br />;
                          return (
                            <div className="my-1" key={index}>
                              {parseContent(para)}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {currentTab === 2 && (
          <div>
            <Calculator />
          </div>
        )}
      </div>

      {/* Research Journal */}
      <div className="w-[20%] h-[90%] bg-[#F7F9FF] rounded-r-xl px-4">
        <ResearchJournal />
      </div>

      {!hideNavigation.includes(currentScreen) && (
        <div className="flex justify-end px-2 py-1 absolute bottom-0 left-[15%] w-[65%] bg-slate-300 bg-opacity-80">
          <NavigationButton />
        </div>
      )}
    </div>
  );
};

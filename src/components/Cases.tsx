import { useAtom } from "jotai";
import data from "./../data/kotasMeatMarket.json";
import {
  filterScreensByIds,
  getScreenById,
  parseContent,
  Screen,
} from "./Study";
import { Calculator } from "./Calculator";
import { NavigationButton } from "./NavigationButton";
import { screenAtom, tabAtom } from "../atoms";
import reactStringReplace from "react-string-replace";

const CaseTab = () => {
  const [currentScreen, setCurrentScreen] = useAtom(screenAtom);

  return (
    <div className="mr-4 text-white bg-qblack flex flex-col p-2 rounded-lg">
      <button className={`self-start text-xl text-white font-extrabold`}>
        Questions
      </button>
      <div className="p-2 flex flex-col items-start">
        {filterScreensByIds(data.cases).map((screen: Screen, index: number) => {
          return (
            <button
              className={`font-bold ${
                currentScreen === screen.screenId ? "text-qpurple" : ""
              }`}
              onClick={() => {
                setCurrentScreen(screen.screenId);
              }}
              key={index}
            >
              {screen.title}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const Cases = () => {
  const [currentScreen, setCurrentScreen] = useAtom(screenAtom);

  return (
    <div className="flex flex-row w-[100%] h-[100%] relative">
      {/* Tab Navigator */}
      <div className="w-[15%] h-[95%]">
        <CaseTab />
      </div>

      <div className="flex w-[85%] h-[90%] bg-qgray p-4 text-qblack  relative">
        <div className="flex flex-col w-full h-full mb-3 overflow-auto">
          {getScreenById(currentScreen)?.content.map((item, index) => {
            return (
              <div className="m-2" key={index}>
                <div className="text-xl font-bold mb-2">{item.heading}</div>
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
            );
          })}
        </div>
        <div className="sticky p-2">
          <Calculator />
        </div>
      </div>
      <div className="flex justify-end px-2 py-1 absolute bottom-[10%] left-[15%] w-[65%] bg-slate-300 bg-opacity-80">
        <NavigationButton />
      </div>
    </div>
  );
};

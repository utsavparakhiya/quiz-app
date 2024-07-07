import { atom, useAtom } from "jotai";
import { Timer } from "./Timer";

export const panelAtom = atom(1);

const NavBar = () => {
  const [currentPanel, setCurrentPanel] = useAtom(panelAtom);

  return (
    <div className="flex">
      <button
        onClick={() => {
          setCurrentPanel(1);
        }}
        className={`${
          currentPanel === 1 ? "text-qblue border-qblue" : ""
        } text-xl font-bold border-0 border-b-4 mx-4 pb-1`}
      >
        Study
      </button>
      <button
        onClick={() => {
          setCurrentPanel(2);
        }}
        className={`${
          currentPanel === 2 ? "text-qblue border-qblue" : ""
        } text-xl font-bold border-0 border-b-4 mx-4 pb-1`}
      >
        Case
      </button>
    </div>
  );
};

export const PanelNav = () => {
  return (
    <div className="flex justify-between items-center w-[100%] h-[40px] m-2">
      <NavBar />
      <Timer milliseconds={1000 * 60 * 35} />
    </div>
  );
};

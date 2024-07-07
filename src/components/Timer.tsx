import Countdown from "react-countdown";
import { Tooltip } from "react-tooltip";
import { BiTime } from "react-icons/bi";
import { useAtom } from "jotai";
import {
  draggableAtom,
  targetAtom,
  researchJournalAtom,
  editableAtom,
  dropdownAtom,
} from "../atoms";

interface TimerProps {
  milliseconds: number;
}

interface RendererProps {
  hours: number;
  minutes: number;
  seconds: number;
  props: any;
  completed: number;
}

const renderer = ({
  hours,
  minutes,
  seconds,
  completed,
  props,
}: RendererProps) => {
  if (completed) {
    return <div>Timer Ended</div>;
  } else {
    // Render a countdown
    return (
      <span>
        {hours}:{minutes}:{seconds}
      </span>
    );
  }
};

const ProgressBar = ({ total, current }: any) => {
  const [draggables] = useAtom(draggableAtom);
  const [targets] = useAtom(targetAtom);
  const [editables] = useAtom(editableAtom);
  const [research] = useAtom(researchJournalAtom);
  const [dropdown] = useAtom(dropdownAtom);

  const progress = (current / total) * 100;

  const calculateMinutesRemaining = (milliseconds: number) => {
    const minutes = Math.ceil(milliseconds / (1000 * 60));
    return minutes;
  };

  const calculateMinutesAndSecondsRemaining = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
  };

  const debug = () => {
    console.log("draggables", draggables);
    console.log("targets", targets);
    console.log("research", research);
    console.log("editables", editables);
    console.log("dropdown", dropdown);
  };

  return (
    <div
      className="flex flex-row items-center"
      data-tooltip-id="my-tooltip"
      data-tooltip-content={`Time Remaining for both parts ${calculateMinutesAndSecondsRemaining(
        current
      )}`}
      data-tooltip-place="top"
    >
      <Tooltip id="my-tooltip" />
      <div>
        {/* <button
          onClick={debug}
          className="px-3 py-1 bg-red-500 rounded-md text-white"
        >
          debug
        </button> */}
      </div>
      <div className="mx-2 text-xl font-bold">
        <BiTime />
      </div>
      <div className="w-[500px] h-4 bg-gray-200 rounded">
        <div
          className="h-full bg-qred rounded transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mx-2 font-bold">
        {calculateMinutesRemaining(current)} m left
      </div>
    </div>
  );
};

export const Timer = ({ milliseconds }: TimerProps) => {
  return (
    <div>
      <Countdown
        date={Date.now() + milliseconds}
        renderer={(props) => (
          <div>
            <ProgressBar total={milliseconds} current={props.total} />
          </div>
        )}
      />
    </div>
  );
};

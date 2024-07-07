import { DropTargetMonitor, useDrop } from "react-dnd";
import { Tooltip } from "react-tooltip";
import {
  Target,
  DropResult,
  DragResult,
  getDraggableById,
  createTarget,
  Nullable,
  updateDraggable,
  updateTargets,
  getTargetById,
  removeDraggableFromTarget,
  removeDraggale,
} from "./DragPlayground4";
import { useAtom } from "jotai";
import {
  draggableAtom,
  newDraggableCountAtom,
  newTargetCountAtom,
  researchJournalAtom,
  targetAtom,
} from "../atoms";
import { BsFillJournalBookmarkFill } from "react-icons/bs";
import { BiDownArrow, BiUpArrow } from "react-icons/bi";
import { CgNotes } from "react-icons/cg";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { FaEdit, FaTrash, FaTrashAlt } from "react-icons/fa";
import { AiOutlineStop } from "react-icons/ai";
import { ImCancelCircle } from "react-icons/im";
import { BiCheckCircle } from "react-icons/bi";
import { useEffect, useState } from "react";

export interface ResearchItem {
  title: string;
  targetId: number;
}

const ResearchEntry = ({ targetId, title }: ResearchItem) => {
  const [visible, setVisible] = useState(false);
  const [important, setImportant] = useState(false);
  const [small, setSmall] = useState(true);
  const [notes, setNotes] = useState("");

  return (
    <div
      className={`flex flex-col my-1  py-2 rounded-lg ${
        important ? "bg-yellow-100 border border-orange-400" : ""
      }`}
      key={targetId}
    >
      <div className="flex flex-row items-center ">
        {/* <div className="text-12xl cursor-pointer px-2">
          <AiOutlineInfoCircle onClick={() => setImportant(!important)} />
        </div> */}
        <div className="ml-1 w-[100%]">
          <EditableText title="# Click to edit title" />{" "}
        </div>
      </div>
      <div className="flex flex-row items-center">
        <div
          onClick={() => setSmall(!small)}
          className="w-[90%] cursor-pointer"
        >
          {createTarget(targetId, small)}
        </div>
        <div
          className="text-12xl cursor-pointer pr-2"
          onClick={() => setVisible(!visible)}
        >
          {visible ? <CgNotes className="text-qpurple" /> : <CgNotes />}
        </div>
      </div>

      <div className={`${visible ? "block" : "hidden"} leading-tight mt-2`}>
        <textarea
          id="message"
          rows={4}
          className=" px-2 py-1 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300"
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Enter some notes..."
        >
          {notes}
        </textarea>
      </div>
    </div>
  );
};

export const ResearchJournal = () => {
  const [targets, setTargets] = useAtom(targetAtom);
  const [draggables, setDraggables] = useAtom(draggableAtom);
  const [researchEntries, setResearchEntries] = useAtom(researchJournalAtom);
  const [newTargetCount, setNewTargetCount] = useAtom(newTargetCountAtom);

  useEffect(() => {
    const allTargetIds = targets.map((target) => target.targetId);

    const filteredResearchEntires = researchEntries.filter((entry) => {
      const t = getTargetById(entry.targetId, targets);

      if (!t) return false;

      return allTargetIds.includes(entry.targetId) && t.draggableId !== null;
    });

    setResearchEntries(filteredResearchEntires);
  }, [targets, setResearchEntries]);

  const createResearchTarget = (draggableId: number): Nullable<DragResult> => {
    const d = getDraggableById(draggableId, draggables);
    if (!d) return null;

    const sourceTargetId = d.targetId;
    const newTargetId = newTargetCount;

    const sourceTarget = getTargetById(sourceTargetId, targets);
    if (sourceTarget && sourceTarget.type === "journal") {
      return null;
    }

    const newTarget: Target = {
      targetId: newTargetId,
      draggableId: draggableId,
      title: `${d.value}`,
      constant: null, //draggableId
      type: "journal",
    };

    const newTargetList = [...targets, newTarget];

    setTargets(
      updateTargets(sourceTargetId, newTargetId, draggableId, newTargetList)
    );

    setDraggables(updateDraggable(draggableId, newTargetId, draggables));

    setResearchEntries([
      ...researchEntries,
      { title: `${d.value}`, targetId: newTargetId },
    ]);

    setNewTargetCount(newTargetCount + 1);

    return {
      endTargetId: newTargetId,
      draggableId: draggableId,
    };
  };

  const [collector, drop] = useDrop(
    () => ({
      accept: "draggable",
      drop: (item: DropResult, monitor): Nullable<DragResult> => {
        const dragResult = createResearchTarget(item.draggableId);
        return dragResult;
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [targets, draggables, researchEntries, newTargetCount]
  );

  const trashActive = (monitor: DropTargetMonitor) => {
    const item: DropResult = monitor.getItem();
    if (!item) return false;
    if (Math.floor(item.draggableId / 1000) !== 9) return false;

    return true;
  };

  const isTrashDisabled = (monitor: DropTargetMonitor) => {
    const item: DropResult = monitor.getItem();

    if (!item) return false;

    if (Math.floor(item.draggableId / 1000) === 9) return false;

    return true;
  };

  const [trashCollector, trash] = useDrop(
    () => ({
      accept: "draggable",
      drop: (item: DropResult, monitor): Nullable<DragResult> => {
        if (Math.floor(item.draggableId / 1000) !== 9) {
          // if it is not of 9000 series, it is not a research journal or calc draggable
          return null;
        }

        const d = getDraggableById(item.draggableId, draggables);

        if (!d) return null;

        const targetId = d.targetId;

        // update this targetId's draggableId to null
        // delete the draggable with draggableId from draggables

        setTargets(removeDraggableFromTarget(targetId, targets));
        setDraggables(removeDraggale(item.draggableId, draggables));

        return null;
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        isDisabled: isTrashDisabled(monitor),
        canDrop: trashActive(monitor),
      }),
    }),
    [targets, draggables, researchEntries, newTargetCount]
  );
  return (
    <div className="relative flex flex-col items-center h-[100%] w-[100%] bg-qgray rounded-xl text-qblack p-4 ">
      <div className="text-lg font-bold text-pblack flex flex-row items-center text-qblack">
        Research Journal
      </div>
      {/* <div className="text-sm text-pblack font-light mb-5">
        Mark ⓘ for important items
      </div> */}

      <div ref={drop} className="flex flex-col h-full w-full overflow-scroll">
        {researchEntries.map((entry, index) => {
          return (
            <ResearchEntry targetId={entry.targetId} title={entry.title} />
          );
        })}
      </div>
      <div
        ref={trash}
        className={`
        flex flex-row w-full justify-end items-center p-4 bg-white rounded-lg mt-2
        ${
          trashCollector.canDrop
            ? "outline outline-offset-4 outline-2 outline-qred"
            : ""
        }
        `}
      >
        {trashCollector.isDisabled && <AiOutlineStop />}
        {!trashCollector.isDisabled && (
          <FaTrashAlt
            className={`${trashCollector.canDrop ? "text-qred text-xl" : ""}`}
          />
        )}
      </div>
    </div>
  );
};

interface EditableText {
  title: string;
}

function EditableText({ title }: EditableText) {
  const [text, setText] = useState("Initial text");
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    setText(title);
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setEditText(text);
  };

  const handleSave = () => {
    setText(editText);
    setIsEditing(false);
  };

  const handleClose = () => {
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(e.target.value);
  };

  return (
    <div
      data-tooltip-id="my-tooltip"
      data-tooltip-content={`${text}`}
      data-tooltip-place="top"
    >
      <Tooltip id="my-tooltip" />
      {!isEditing ? (
        <div className="flex flex-row justify-between items-center">
          <p
            onClick={handleEdit}
            className="h-[30px] overflow-hidden cursor-pointer"
          >
            {text}
          </p>
          {/* <button className="mr-2" onClick={handleEdit}>
            <FaEdit />
          </button> */}
        </div>
      ) : (
        <div className="flex flex-row justify-between items-center w-full">
          <input
            className="w-[70%] px-2 rounded-md"
            type="text"
            value={editText}
            onChange={handleChange}
          />
          <div className="flex items-center">
            <button className=" text-xl" onClick={handleSave}>
              <BiCheckCircle />
            </button>
            <button className="ml-1 mr-2" onClick={handleClose}>
              <ImCancelCircle />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

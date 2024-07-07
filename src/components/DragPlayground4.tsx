import { useAtom } from "jotai";
import { ChangeEvent, useEffect, useState } from "react";
import {
  useDrag,
  useDrop,
  DropTargetMonitor,
  DragSourceMonitor,
} from "react-dnd";
import { RiDraggable } from "react-icons/ri";
import { draggableAtom, editableAtom, targetAtom } from "../atoms";

export type Nullable<T> = T | null;

export interface Editable {
  editableId: number;
  value: null | number;
}

interface EditableFC {
  editableId: number;
}

export const createEditable = (editableId: number) => {
  return <Editable editableId={editableId} />;
};

export const getEditableById = (editableId: number, list: Editable[]) => {
  return list.find((item) => item.editableId === editableId);
};

const Editable = ({ editableId }: EditableFC) => {
  const [editables, setEditables] = useAtom(editableAtom);
  const [currentEditable, setCurrentEditable] = useState<Editable | null>(null);

  useEffect(() => {
    const e = getEditableById(editableId, editables);
    if (e) {
      setCurrentEditable(e);
    }
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const parsedValue = parseInt(e.target.value);
    const value = isNaN(parsedValue) ? null : parsedValue;
    setEditables((prev) => {
      return prev.map((editable) => {
        if (editable.editableId === editableId) {
          return { ...editable, value: value };
        } else {
          return editable;
        }
      });
    });
  };
  return (
    <input
      onChange={(e) => handleChange(e)}
      className="rounded-md text-qblack px-2 outline-none m-1 w-[100px]"
      type="number"
      value={currentEditable?.value ?? ""}
    />
  );
};

export interface Draggable {
  draggableId: number;
  targetId: number;
  value: number | string;
  exhaustible: boolean;
}

interface DraggableFC {
  draggableId: number;
  small: boolean;
}

export interface Target {
  targetId: number;
  draggableId: Nullable<number>;
  title: string;
  constant: Nullable<number>; //draggableId
  type: string;
}

export interface DynamicDraggableFC {
  id: number;
  value: number | string;
}

export const createTarget = (targetId: number, small: boolean = false) => {
  return <Target targetId={targetId} small={small} />;
};

export const DynamicDraggable = ({ id, value }: DynamicDraggableFC) => {
  const [draggables, setDraggables] = useAtom(draggableAtom);
  const [targets, setTargets] = useAtom(targetAtom);

  useEffect(() => {
    // check if target and draggable with same ID exist or not
    const d = getDraggableById(id, draggables);
    const t = getTargetById(id, targets);

    if (d !== undefined && t !== undefined) {
      return;
    }

    if (t === undefined) {
      const newTarget: Target = {
        targetId: id,
        draggableId: id,
        title: "dynamic cell",
        constant: id, //draggableId
        type: typeof value,
      };

      setTargets([...targets, newTarget]);
    }

    if (d === undefined) {
      const newDraggable: Draggable = {
        draggableId: id,
        targetId: id,
        value: value,
        exhaustible: false,
      };

      setDraggables([...draggables, newDraggable]);
    }
  });

  return <Target targetId={id} small={false} />;
};

interface TargetFC {
  targetId: number;
  small: boolean;
}

export interface DragResult {
  endTargetId: number;
  draggableId: number;
}

function formatValue(input: string | number | null): string {
  if (input === null || input === undefined) return "";

  if (typeof input === "string") {
    return input;
  } else if (typeof input === "number") {
    return input.toLocaleString();
  } else {
    throw new Error(
      "Unsupported input type. Please provide a string or number."
    );
  }
}

export interface DropResult {
  draggableId: number;
}

export const getDraggableById = (draggableId: number, list: Draggable[]) => {
  return list.find((item) => item.draggableId === draggableId);
};

export const getTargetById = (targetId: number, list: Target[]) => {
  return list.find((item) => item.targetId === targetId);
};

const matchDraggableToTarget = (
  draggableId: number,
  targetId: number,
  draggables: Draggable[],
  targets: Target[]
): boolean => {
  // Implement logic that checks if a draggable can be added to that target
  const t = getTargetById(targetId, targets);
  if (!t) return false;

  if (t.type === "journal") return false;

  const d = getDraggableById(draggableId, draggables);
  if (!d) return false;

  if (t.draggableId) return false;

  if (!t.constant) {
    if (t.type === "any") return true;
    if (t.type === typeof d.value) return true;
    return false;
  }

  const targetDraggable = getDraggableById(t.constant, draggables);
  if (!targetDraggable) return false;
  if (d.value !== targetDraggable.value) return false;

  return true;
};

export const updateTargets = (
  sourceTargetId: number,
  endTargetId: number,
  draggableId: number,
  list: Target[]
): Target[] => {
  let _list = list.map((target) =>
    target.targetId === endTargetId
      ? { ...target, draggableId: draggableId }
      : target
  );

  return _list.map((target) =>
    target.targetId === sourceTargetId
      ? { ...target, draggableId: null }
      : target
  );
};

export const removeDraggableFromTarget = (
  targetId: number,
  list: Target[]
): Target[] => {
  return list.map((target) =>
    target.targetId === targetId ? { ...target, draggableId: null } : target
  );
};

export const removeDraggale = (
  draggableId: number,
  list: Draggable[]
): Draggable[] => {
  return list.filter((target) => target.draggableId !== draggableId);
};

export const updateDraggable = (
  draggableId: number,
  endTargetId: number,
  list: Draggable[]
): Draggable[] => {
  return list.map((draggable) =>
    draggable.draggableId === draggableId
      ? { ...draggable, targetId: endTargetId }
      : draggable
  );
};

export const Draggable = ({ draggableId, small }: DraggableFC) => {
  const [draggables, setDraggables] = useAtom(draggableAtom);
  const [targets, setTargets] = useAtom(targetAtom);

  const [currentDraggable, setCurrentDraggable] = useState<Nullable<Draggable>>(
    null
  );

  const updateData = (item: DropResult, monitor: DragSourceMonitor) => {
    const result: Nullable<DragResult> = monitor.getDropResult();
    const d = draggables.find((item) => item.draggableId === draggableId);

    if (!d) return;
    const sourceTargetId = d.targetId;

    if (!result) return;

    if (sourceTargetId === result.endTargetId) return;

    // prevent updation if moving not allowed
    if (
      !matchDraggableToTarget(
        result.draggableId,
        result.endTargetId,
        draggables,
        targets
      )
    ) {
      return;
    }

    let updatedTargets = updateTargets(
      sourceTargetId,
      result.endTargetId,
      result.draggableId,
      targets
    );

    const updatedDraggabled = updateDraggable(
      result.draggableId,
      result.endTargetId,
      draggables
    );

    // check if sourceTarget was a journal
    const sourceTarget = getTargetById(sourceTargetId, targets);

    if (sourceTarget) {
      if (sourceTarget.type === "journal") {
        updatedTargets = updatedTargets.filter(
          (target) => target.targetId !== sourceTargetId
        );
      }
    }

    // update targetIds
    setTargets(updatedTargets);
    // update targetid in draggables
    setDraggables(updatedDraggabled);
  };

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "draggable",
      item: { draggableId },
      end: updateData,
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
        didDrop: !!monitor.didDrop(),
      }),
    }),
    [draggables, targets]
  );

  useEffect(() => {
    const d = draggables.find((item) => item.draggableId === draggableId);
    if (!d) return;
    setCurrentDraggable(d);
  }, [draggables, draggableId]);

  return (
    <div
      ref={drag}
      className={`${
        isDragging ? "hidden" : "block "
      } h-full w-full  bg-white rounded-md flex items-center justify-between`}
    >
      {currentDraggable && (
        <>
          <span className="w-[20px]">
            <RiDraggable />
          </span>
          <div className={`py-1 leading-tight ${small ? "truncate" : ""}`}>
            {formatValue(currentDraggable.value)}
          </div>
          <span className="w-[20px]"></span>
        </>
      )}
      {!currentDraggable && <span>draggableId {draggableId} not found</span>}
    </div>
  );
};

export const Target = ({ targetId, small }: TargetFC) => {
  const [targets] = useAtom(targetAtom);
  const [draggables] = useAtom(draggableAtom);
  const [currentTarget, setCurrentTarget] = useState<Nullable<Target>>(null);
  const [constantValue, setConstantValue] = useState<any>(null);

  useEffect(() => {
    const t = getTargetById(targetId, targets);
    if (!t) {
      setConstantValue(`targetId ${targetId} not found`);
      return;
    }
    setCurrentTarget(t);

    if (!t.constant) return;

    const constantDraggable = getDraggableById(t.constant, draggables);
    if (!constantDraggable) return;
    setConstantValue(constantDraggable.value);
  }, [targets, draggables, targetId]);

  const canDropHere = (monitor: DropTargetMonitor) => {
    // TODO: implement this function to highlight possible targets on Drag event
    const item: DropResult = monitor.getItem();

    if (!item) return null;

    const draggableId = item.draggableId;

    return matchDraggableToTarget(draggableId, targetId, draggables, targets);
  };

  const [collector, drop] = useDrop(
    () => ({
      accept: "draggable",
      drop: (item: DropResult, monitor): Nullable<DragResult> => {
        // This return value is avaiable in monitor draggable
        return {
          endTargetId: targetId,
          draggableId: item.draggableId,
        };
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: canDropHere(monitor),
      }),
    }),
    [targets, draggables]
  );

  return (
    <div
      className={`inline-block align-middle cursor-pointer m-1 ${
        small ? "w-[90%]" : ""
      }`}
    >
      <div
        ref={drop}
        className={`${
          collector.canDrop
            ? "outline outline-offset-4 outline-2 outline-qpurple"
            : ""
        } 
         grid grid-cols-1 min-h-[30px]  max-w-[500px] rounded-md bg-gray-200
        ${small ? "min-w-0 w-full" : "min-w-[150px]"}
        ${small && typeof constantValue === "number" ? "min-w-0" : ""}
        `}
      >
        <div className="flex justify-center items-center row-start-1 col-start-1">
          <span className="w-[20px]"></span>
          <div className={`py-1 leading-tight ${small ? "truncate" : ""}`}>
            {formatValue(constantValue)}
          </div>
          <span className="w-[20px]"></span>
        </div>
        {currentTarget?.draggableId && (
          <div className="row-start-1 col-start-1">
            <Draggable draggableId={currentTarget.draggableId} small={small} />
          </div>
        )}
      </div>
    </div>
  );
};

Target.defaultProps = {
  small: false,
};

Draggable.defaultProps = {
  small: false,
};

export const DragPlayground4 = () => {
  const [targets] = useAtom(targetAtom);
  const [draggables] = useAtom(draggableAtom);
  return (
    <div className="flex flex-col items-start h-full  m-1 p-2">
      <div>Drag Playground 4</div>

      {/* <Target targetId={3} />
      <Target targetId={99991} />
      <Target targetId={99992} /> */}

      <button onClick={() => console.log({ draggables, targets })}>
        Press
      </button>
    </div>
  );
};

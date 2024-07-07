import { atom, useAtom } from "jotai";
import { useEffect, useState } from "react";
import { useDrag, useDrop } from "react-dnd";

type Nullable<T> = T | null;

interface Draggable {
  draggableId: number;
  targetId: number;
  value: number | string;
}

interface DraggableFC {
  draggable: Draggable;
}

interface Target {
  targetId: number;
  title: string;
}

const draggableAtom = atom<Draggable[]>([
  {
    draggableId: 1,
    targetId: 1,
    value: "A",
  },
  {
    draggableId: 2,
    targetId: 2,
    value: "B",
  },
]);

const Draggable = ({ draggable }: DraggableFC) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "draggable",
    item: draggable,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
      didDrop: !!monitor.didDrop(),
    }),
  }));
  return (
    <div
      ref={drag}
      onClick={() => console.log(draggable)}
      className={`${
        isDragging ? "hidden" : "block "
      } h-[50px] w-[50px] border flex items-center justify-center border-black font-extrabold`}
    >
      {draggable.value}
    </div>
  );
};

const Target = ({ targetId, title }: Target) => {
  const [draggable, setDraggable] = useAtom(draggableAtom);
  const [targetDraggable, setTargetDraggable] =
    useState<Nullable<Draggable>>(null);

  useEffect(() => {
    const d = draggable.find((item) => item.targetId === targetId);
    if (d) {
      setTargetDraggable(d);
    } else {
      setTargetDraggable(null);
    }
  }, [draggable]);

  const updateTargetId = (
    draggableId: number,
    newTargetId: number
  ): Draggable[] => {
    return draggable.map((item) =>
      item.draggableId === draggableId
        ? { ...item, targetId: newTargetId }
        : item
    );
  };

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "draggable",
    drop: (draggable: Draggable) => {
      setDraggable(updateTargetId(draggable.draggableId, targetId));
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div ref={drop} className="m-4">
      {title}
      <div className="flex flex-col items-center justify-center h-[100px] w-[100px] border border-black">
        {targetDraggable && <Draggable draggable={targetDraggable} />}
      </div>
    </div>
  );
};

export const DragPlayground3 = () => {
  return (
    <div className="flex flex-col items-start h-full bg-white m-1 p-2">
      <Target targetId={1} title="Target 1" />
      <Target targetId={2} title="Target 2" />
      <Target targetId={3} title="Target 3" />
    </div>
  );
};

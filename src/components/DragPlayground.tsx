import { FC, useState } from "react";
import { useDrag, useDrop } from "react-dnd";

type Nullable<T> = T | null;

const Draggable = ({ title }: any) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "item",
    item: { title },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`${
        isDragging ? "hidden" : "block"
      } h-[50px] w-[50px] border flex items-center justify-center border-black font-extrabold`}
    >
      {title}
    </div>
  );
};

const Target = () => {
  const [item, setItem] = useState<Nullable<string>>(null);

  const [Draggable, setDraggable] = useState<Nullable<FC>>(null);

  const addDraggableToTarget = (item: string) => {
    setItem(item);
  };

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "item",
    drop: (item: any) => addDraggableToTarget(item.title),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div ref={drop} className="h-[100px] w-[100px] border border-black">
      {item}
    </div>
  );
};

export const DragPlayground = () => {
  return (
    <div className="flex flex-col items-start h-full bg-white m-1 p-2">
      <div>Draggable Tests</div>
      <div className="flex flex-col w-full">
        <Target />

        <Draggable title={"A"} />
      </div>
    </div>
  );
};

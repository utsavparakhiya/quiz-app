import { useAtom } from "jotai";
import {
  draggableAtom,
  newDraggableCountAtom,
  newTargetCountAtom,
  targetAtom,
} from "../atoms";
import { useEffect, useState } from "react";
import { evaluate } from "mathjs";
import {
  Target,
  Draggable,
  createTarget,
  DropResult,
  getDraggableById,
  getTargetById,
} from "./DragPlayground4";
import { DropTargetMonitor, useDrop } from "react-dnd";

interface History {
  expression: string;
  draggableId: number;
  targetId: number;
}

export const Calculator = () => {
  const [targets, setTargets] = useAtom(targetAtom);
  const [draggables, setDraggables] = useAtom(draggableAtom);
  const [newTargetCount, setNewTargetCount] = useAtom(newTargetCountAtom);
  const [newDraggableCount, setNewDraggableCount] = useAtom(
    newDraggableCountAtom
  );
  const [expression, setExpression] = useState("");
  const [history, setHistory] = useState<History[]>([]);
  const [clear, setClear] = useState(false);

  const calculatorLayout = [
    ["(", ")", "⌫", "AC"],
    ["7", "8", "9", "÷"],
    ["4", "5", "6", "x"],
    ["1", "2", "3", "-"],
    ["0", ".", "=", "+"],
  ];

  const specialButtons = ["(", ")", "⌫", "AC", "÷", "x", "-", "+"];

  const createDraggableAndTarget = (expression: string, result: number) => {
    const newTargetId = newTargetCount;
    const newDraggableId = newDraggableCount;

    const newTarget: Target = {
      targetId: newTargetId,
      draggableId: newDraggableId,
      title: expression,
      constant: newDraggableId, //draggableId
      type: "number",
    };

    const newDraggable: Draggable = {
      draggableId: newDraggableId,
      targetId: newTargetId,
      value: result,
      exhaustible: true,
    };

    const newHistory: History = {
      expression: expression,
      targetId: newTargetId,
      draggableId: newDraggableId,
    };

    setDraggables([...draggables, newDraggable]);
    setTargets([...targets, newTarget]);
    setHistory([...history, newHistory]);

    setNewTargetCount(newTargetCount + 1);
    setNewDraggableCount(newDraggableCount + 1);
  };

  const performCalculation = (expression: string) => {
    if (expression === "" || expression.split(" ").join("") === "") return;
    const formattedExpression = expression
      .replace(/÷/g, "/")
      .replace(/x/g, "*");

    const result = evaluate(formattedExpression);
    setExpression(`${result}`);
    createDraggableAndTarget(expression, result);
  };

  const writeExpression = (button: string) => {
    if (button === "AC") {
      setExpression("");
      return;
    }

    if (button === "⌫") {
      setExpression(expression.slice(0, -1));
      return;
    }

    if (button === "=") {
      // perform calculation on expression
      try {
        performCalculation(expression);
      } catch {
        setExpression("Error in expression");
      }

      // setExpression("");
      return;
    }

    setExpression(expression + button);
  };

  const canDropHere = (monitor: DropTargetMonitor) => {
    const item: DropResult = monitor.getItem();
    if (!item) return false;

    const d = getDraggableById(item.draggableId, draggables);

    if (!d) return false;

    if (typeof d.value === "number") return true;

    return false;
  };

  useEffect(() => {
    const filteredHistory = history.filter((entry) => {
      const d = getDraggableById(entry.draggableId, draggables);
      if (!d) return false;
      return true;
    });

    setHistory(filteredHistory);
  }, [draggables, targets]);

  const [collector, drop] = useDrop(
    () => ({
      accept: "draggable",
      drop: (item: DropResult, monitor) => {
        if (!item) return;

        const d = getDraggableById(item.draggableId, draggables);

        if (!d) return false;

        if (typeof d.value !== "number") return false;

        setExpression(`${d.value}`);
      },
      collect: (monitor) => ({
        canDrop: canDropHere(monitor),
      }),
    }),
    [targets, draggables]
  );

  return (
    <div className="flex flex-col w-[300px] h-[500px] p-2 bg-[#9EA2AE] rounded-lg overflow-clip">
      <div className="h-[40%] p-1">
        <div className="flex flex-col bg-slate-z00 rounded-lg h-full overflow-auto">
          {history.map((item, index) => {
            return (
              <div
                className="flex flex-row justify-between items-center ml-2"
                key={index}
              >
                <div className="truncate text-white">{item.expression}</div>

                <div className="w-[150px]">
                  {createTarget(item.targetId, true)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="h-[20%] p-1 ">
        <div
          ref={drop}
          className={`bg-white rounded-lg h-full flex justify-end items-end p-2 text-lg overflow-x-scroll
            ${collector.canDrop ? "outline  outline-2 outline-qpurple" : ""} 
          `}
        >
          {expression}
        </div>
      </div>
      <div className="flex-grow   p-1">
        <div className="flex flex-col h-full">
          {calculatorLayout.map((buttonRow, index) => {
            return (
              <div className="flex flex-row w-full h-[25%]" key={index}>
                {buttonRow.map((button, index) => {
                  return (
                    <div
                      key={index}
                      className="flex w-[25%] items-center justify-center p-[0.15rem]"
                    >
                      <button
                        key={index}
                        onClick={() => writeExpression(button)}
                        className={`
                        ${
                          specialButtons.includes(button)
                            ? "bg-[#f1f1f1]"
                            : button === "="
                            ? "bg-qblack text-white active:bg-white"
                            : "bg-white"
                        }

                        
                        active:bg-qblack active:text-white
                       w-full h-full rounded-md`}
                      >
                        {button}
                      </button>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

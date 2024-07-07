import { useEffect } from "react";
import data from "./../data/kotasMeatMarket.json";
import { parseContent } from "./Study";
import { useAtom } from "jotai";
import { draggableAtom, targetAtom } from "../atoms";
import {
  Draggable,
  Target,
  createTarget,
  getTargetById,
} from "./DragPlayground4";

export interface Table {
  tableId: number;
  data: string[][];
}

interface TableFC {
  table: Table;
}

export const createTable = (tableId: number) => {
  const table = data.tables.find((item) => item.tableId === tableId);
  if (!table) {
    return `Table with id ${tableId} not found`;
  }
  return <Table table={table} />;
};

export const Table = ({ table }: TableFC) => {
  const [targets, setTargets] = useAtom(targetAtom);
  const [draggables, setDraggables] = useAtom(draggableAtom);

  useEffect(() => {
    console.log({ table });
  }, []);

  const parseTableCell = (cell: string) => {
    const cellRegex = /([c]_\d+_\d+)/;

    if (!cellRegex.test(cell)) return cell;

    const [type, id, val] = cell.split("_");

    const targetId = parseInt(id);
    const value = parseInt(val);

    const t = getTargetById(targetId, targets);

    if (!t) {
      // table target not created
      // create target and draggable and add to atom
      const newTarget: Target = {
        targetId: targetId,
        draggableId: targetId,
        title: "table cell",
        constant: targetId, //draggableId
        type: "number",
      };

      const newDraggable: Draggable = {
        draggableId: targetId,
        targetId: targetId,
        value: value,
        exhaustible: true,
      };

      setDraggables([...draggables, newDraggable]);
      setTargets([...targets, newTarget]);

      return createTarget(targetId, true);
    } else {
      return createTarget(targetId, true);
    }
  };

  return (
    <div className="min-w-[500px] m-2">
      <table className="min-w-[400px] ">
        <thead>
          <tr className="border-0 border-b-2">
            {table.data[0].map((header, index) => (
              <th className="p-2 text-qblack " key={index}>
                <div className="bg-gray-300 rounded-md">{header}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.data.slice(1).map((row, rowIndex) => (
            <tr className="border-0 " key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td
                  className={`text-center min-w-[150px] ${
                    cellIndex == 0 ? "border-b-2" : ""
                  }`}
                  key={cellIndex}
                >
                  {parseTableCell(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

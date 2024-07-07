import { useAtom } from "jotai";
import {
  PieChart,
  Pie,
  Sector,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { draggableAtom, targetAtom } from "../atoms";
import data from "./../data/kotasMeatMarket.json";
import {
  Draggable,
  Target,
  createTarget,
  getTargetById,
} from "./DragPlayground4";

interface Slice {
  name: string;
  value: number;
}

export interface Qpie {
  qpieId: number;
  data: Slice[];
}

interface QpieFC {
  qpie: Qpie;
}
const COLORS = [
  "#92D050",
  "#4E84B5",
  "#9BBB59",
  "#C0504D",
  "#FFC000",
  "#D86FA3",
  "#4F81BD",
  "#F79646",
  "#009E73",
  "#8063A0",
];

// const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "red", "purple"];
export const createPieChart = (piechartId: number) => {
  const piechart = data.piecharts.find((item) => item.qpieId === piechartId);
  if (!piechart) {
    return `PieChart with id ${piechart} not found`;
  }
  return <Qpie qpie={piechart} />;
};

export const Qpie = ({ qpie }: QpieFC) => {
  const [targets, setTargets] = useAtom(targetAtom);
  const [draggables, setDraggables] = useAtom(draggableAtom);

  const parsePieLabel = (label: string) => {
    const labelRegex = /([s]_\d+_\d+)/;

    if (!labelRegex.test(label)) return label;

    const [type, id, val] = label.split("_");

    const targetId = parseInt(id);
    const value = parseInt(val);

    const t = getTargetById(targetId, targets);

    if (!t) {
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

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 1.1;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <g>
        <foreignObject x={x - 45} y={y - 20} width={75} height={55}>
          <div className="m-1">{parsePieLabel(qpie.data[index].name)}</div>
        </foreignObject>
      </g>
    );
  };
  return (
    <div className="h-[400px] w-[500px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart width={650} height={650}>
          <Pie
            data={qpie.data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={150}
            fill="#8884d8"
            dataKey="value"
          >
            {qpie.data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

import { useAtom, useSetAtom } from "jotai";
import { graphAtom, tableAtom } from "../atoms";
import { useEffect, useState } from "react";
import { FaChartPie, FaChartLine, FaChartBar } from "react-icons/fa";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  LineChart,
  Line,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export const createDynamicTable = () => {
  return <DynamicTable />;
};
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

const DynamicLineChart = ({ data, vars }: any) => {
  return (
    <div className="h-[300px] w-[500px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />

          {vars.map((varName: string, index: number) => {
            return (
              <Line
                type="monotone"
                dataKey={varName}
                stroke={COLORS[index]}
                strokeWidth={2}
                fill={COLORS[index]}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const DynamicBarChart = ({ data, vars }: any) => {
  return (
    <div className="h-[300px] w-[500px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          {vars.map((varName: string, index: number) => {
            return <Bar dataKey={varName} fill={COLORS[index]} />;
          })}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const MyPieChart = ({ data }: any) => {
  return (
    <div className="h-[300px] w-[300px]">
      <ResponsiveContainer>
        <PieChart width={400} height={400}>
          <Pie dataKey="value" data={data} outerRadius={80} fill="#8884d8">
            {data.map((item: any, index: number) => {
              return (
                <Cell
                  key={`dcell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              );
            })}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

const DynamicPieChart = ({ data }: any) => {
  return (
    <div className="flex flex-row">
      {data.map((item: any, index: number) => {
        return (
          <div className="flex flex-col items-center justify-center">
            <div>{item.title}</div>
            <MyPieChart data={item.data} />
          </div>
        );
      })}
    </div>
  );
};

export const DynamicTable = () => {
  const [table, setTable] = useAtom(tableAtom);
  const [dataTable, setDatatable] = useState<string[][]>([[]]);
  const [refresh, setRefresh] = useState(false);
  const [bar, setBar] = useState<any[]>([]);
  const [pie, setPie] = useState<any[]>([]);
  const [graph, setGraph] = useAtom(graphAtom);

  useEffect(() => {
    console.log("table updated");
    let t: string[][] = [["", ...table.vars]];

    for (var dataset of table.datasets) {
      let row: string[] = [dataset];

      for (var varName of table.vars) {
        row.push(table.data[dataset][varName]);
      }

      t.push(row);
    }
    setDatatable(t);
  }, [table, refresh]);

  useEffect(() => {
    // create datasets for bar, pie and line charts

    // Bar & Line data
    let barData = [];
    for (var dataset of table.datasets) {
      let dict: any = { name: dataset };
      for (var varName of table.vars) {
        dict[varName] = table.data[dataset][varName];
      }
      barData.push(dict);
    }
    setBar(barData);

    // Pie data
    let pieData: any = [];
    for (var d of table.datasets) {
      let dict: any = [];
      for (var v of table.vars) {
        dict.push({ name: v, value: table.data[d][v] });
      }
      pieData.push({ title: d, data: dict });
    }

    setPie(pieData);
  }, [dataTable]);

  const updateCell = (i: number, j: number, value: number) => {
    let _table = table;

    const dataset = _table.datasets[i - 1];
    const varName = _table.vars[j - 1];

    _table.data[dataset][varName] = value;

    setTable(_table);
    setRefresh(!refresh);
  };

  return (
    <div className="flex-col h-full w-full flex justify-center">
      <div className="flex flex-row my-4 p-2 justify-center">
        <FaChartPie
          onClick={() => setGraph(1)}
          className={`${
            graph === 1 ? "text-qpurple" : "text-qblack"
          } text-6xl mx-4 hover:text-gray-500 cursor-pointer`}
        />
        <FaChartLine
          onClick={() => setGraph(2)}
          className={`${
            graph === 2 ? "text-qpurple" : ""
          } text-6xl mx-4 hover:text-gray-500 cursor-pointer`}
        />
        <FaChartBar
          onClick={() => setGraph(3)}
          className={`${
            graph === 3 ? "text-qpurple" : ""
          } text-6xl mx-4 hover:text-gray-500 cursor-pointer`}
        />
      </div>
      <div className="flex mb-12 w-[600px] h-[400px]">
        {graph === 3 && <DynamicBarChart data={bar} vars={table.vars} />}
        {graph === 2 && <DynamicLineChart data={bar} vars={table.vars} />}
        {graph === 1 && <DynamicPieChart data={pie} />}
      </div>
      <table className="min-w-[400px] mx-auto">
        {dataTable.map((row, i) => {
          if (i === 0) {
            return (
              <thead>
                {row.map((cell, j) => {
                  return (
                    <th className="p-2 text-qblack " key={`${i}_${j}`}>
                      <div className="bg-gray-300 rounded-md">{cell}</div>
                    </th>
                  );
                })}
              </thead>
            );
          } else {
            return (
              <tbody>
                {row.map((cell, j) => {
                  return (
                    <td
                      className={`text-center min-w-[150px] ${
                        j === 0 ? "border-b-2" : ""
                      }`}
                      key={`${i}_${j}`}
                    >
                      {j !== 0 ? (
                        <input
                          type="number"
                          onChange={(e) => {
                            updateCell(i, j, parseInt(e.target.value));
                          }}
                          defaultValue={parseInt(cell)}
                          className="rounded-md text-qblack px-2 outline-none m-1 w-[100px]"
                        />
                      ) : (
                        cell
                      )}
                    </td>
                  );
                })}
              </tbody>
            );
          }
        })}
      </table>
      {/* Padding */}
      <div className="mb-32"></div>
    </div>
  );
};

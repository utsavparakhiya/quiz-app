import { Panel } from "./components/Panel";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex w-[100vw] bg-slate-800 h-[100vh] overflow-clip items-center justify-center">
        <Panel />
      </div>
    </DndProvider>
  );
}

export default App;

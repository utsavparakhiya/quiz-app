import { useAtom } from "jotai";
import { draggableAtom, screenAtom, targetAtom } from "../atoms";
import { getScreenById, parseContent } from "./Study";
import { useEffect, useRef } from "react";
import reactStringReplace from "react-string-replace";
import { createTarget } from "./DragPlayground4";

interface InvestigationFC {
  screenIds: number[];
}
export const Investigation = ({ screenIds }: InvestigationFC) => {
  const [currentScreen, setCurrentScreen] = useAtom(screenAtom);
  const [draggables] = useAtom(draggableAtom);
  const [targets] = useAtom(targetAtom);
  const myRefs = useRef<any[]>([]);

  useEffect(() => {
    const _ref = myRefs.current[currentScreen - 1];

    if (_ref) {
      _ref.scrollIntoView({
        behavior: "smooth",
        top: 0,
      });
    }
  }, [currentScreen]);

  return (
    <div className="flex flex-col">
      {screenIds.map((screenId: number, i) => {
        return (
          <div className="" ref={(el) => (myRefs.current[i] = el)}>
            {getScreenById(screenId)?.content.map((item, index) => {
              return (
                <div className="m-2" key={index}>
                  <div className="text-xl font-bold mb-2">{item.heading}</div>
                  <div>
                    {item.paragraphs.map((para, index) => {
                      if (para === "<br>") return <br />;
                      return (
                        <div className="my-1" key={index}>
                          {parseContent(para)}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

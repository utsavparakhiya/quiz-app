import { useEffect, useState } from "react";
import data from "./../data/kotasMeatMarket.json";
import { useAtom } from "jotai";
import { dropdownAtom } from "../atoms";

export interface Dropdown {
  dropdownId: number;
  options: string[];
  correctOption: number;
  selectedOption: number | null;
}

export const getDropDownById = (dropdownId: number, list: Dropdown[]) => {
  return list.find((item) => item.dropdownId === dropdownId);
};

export const createDropdown = (dropdownId: number) => {
  return <Dropdown dropdownId={dropdownId} />;
};

export const Dropdown = ({ dropdownId }: { dropdownId: number }) => {
  const [dropdowns, setDropdown] = useAtom(dropdownAtom);
  const [currentDropdown, setCurrentDropdown] = useState<Dropdown | null>(null);

  useEffect(() => {
    const d = getDropDownById(dropdownId, dropdowns);
    if (d) {
      setCurrentDropdown(d);
    }
  });

  useEffect(() => {
    console.log({ dropdowns });
  }, [dropdowns]);

  return (
    <div className="m-3 inline-block">
      <select
        onChange={(e) => {
          const index = dropdowns.findIndex(
            (dropdown) => dropdown.dropdownId === dropdownId
          );
          if (index !== -1) {
            let _dropdowns = dropdowns;
            _dropdowns[index].selectedOption = parseInt(e.target.value);
            setDropdown(_dropdowns);
          }
        }}
        className="px-2 py-1 rounded-md"
      >
        <option>Select an Option</option>
        {currentDropdown &&
          currentDropdown.options.map((item, index) => {
            return (
              <option key={index} value={index}>
                {item}
              </option>
            );
          })}
      </select>
    </div>
  );
};

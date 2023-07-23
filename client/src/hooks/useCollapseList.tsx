import { useState } from "react";

const useCollapseList = (listLength: number, defaultValue = false) => {
  const [listState, setListState] = useState(
    Array<boolean>(listLength).fill(defaultValue)
  );

  const toggleCollapse = (index: number) => {
    const listCopy = [...listState];
    listCopy[index] = !listCopy[index];
    setListState(listCopy);
  };

  return { listState, toggleCollapse };
};
export default useCollapseList;

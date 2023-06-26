import { MouseEvent, useState } from "react";

const useMenu = () => {
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const open = Boolean(menuAnchor);
  const handleClick = (e: MouseEvent<HTMLElement>) => {
    setMenuAnchor(e.currentTarget);
  };
  const handleClose = () => setMenuAnchor(null);

  return { menuAnchor, open, handleClick, handleClose };
};

export default useMenu;

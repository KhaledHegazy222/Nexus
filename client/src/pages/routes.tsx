import { Routes, Route } from "react-router-dom";
import { pageType, pagesData } from "./pagesData";

const routes = (
  <Routes>
    {pagesData.map(
      (page: pageType): JSX.Element => (
        <Route key={page.name} path={page.path} element={page.component} />
      )
    )}
  </Routes>
);

export default routes;

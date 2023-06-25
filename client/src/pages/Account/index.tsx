import { Route, Routes } from "react-router-dom";
import AccountPage from "./AccountPage";

const Account = () => {
  return (
    <>
      <Routes>
        <Route path="/login" element={<AccountPage login />} />
        <Route path="/sign-up" element={<AccountPage />} />
      </Routes>
    </>
  );
};

export default Account;

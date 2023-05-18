import { Route, Routes } from "react-router-dom";
import NewFurnitureType from "../NewFurnitureType";
import AdminLinkList from "./Links";

export default function Admin() {
  return (
    <>
      <Routes>
        <Route path="/new-furniture-type" element={<NewFurnitureType />} />
        <Route path="/users" element={<AdminLinkList />} />
      </Routes>
    </>
  );
}

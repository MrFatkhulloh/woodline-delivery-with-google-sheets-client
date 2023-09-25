import { Route, Routes } from "react-router-dom";
import NewFurnitureType from "../NewFurnitureType";
import AdminLinkList from "./Links";
import Category from "../../category/category";

export default function Admin() {
  return (
    <>
      <Routes>
         <Route path="/new-furniture-type" element={<NewFurnitureType />} />
        <Route path="/category" element={<Category />} />
        <Route path="/users" element={<AdminLinkList />} />
      </Routes>
    </>
  );
}

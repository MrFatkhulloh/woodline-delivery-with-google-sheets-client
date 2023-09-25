import { Button } from "@chakra-ui/react";
import ModalForm from "../components/applyForm/applyForm";
import Layout from "../components/layout/layout";
import OrderTable from "../components/order/order";
import SearchModal from "../components/search/search";
import UserInfo from "../components/userInfo/userInfo";

export default function Order() {
  return (
    <>
      <Layout>
        <OrderTable />
        <UserInfo />
        <SearchModal />
        <ModalForm />
      </Layout>
    </>
  );
}
import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/layout";
import { Flex, Heading, Input, Select } from "@chakra-ui/react";
import Chart, {
  LineElement,
  LinearScale,
  PointElement,
  Title,
} from "chart.js/auto";
import { Line } from "react-chartjs-2";
import { instance } from "../../config/axios.instance.config";

Chart.register(LinearScale, PointElement, LineElement, Title);

const options = {
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

const Analytics = () => {
  const [data, setData] = useState({
    labels: [],
    datasets: [],
  });

  const [datasetss, setDatasetss] = useState([]);
  const [models, setModels] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [companys, setCompanys] = useState([]);
  const [model, setModel] = useState("");
  const [seller, setSeller] = useState("");
  const [company, setCompany] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    setStartDate(new Date(startDate).getTime());
    setEndDate(new Date(endDate).getTime());
  }, [startDate, endDate]);

  useEffect(() => {
    instance
      .get(
        startDate !== NaN
          ? `/order-statistics?model=${model}&seller=${seller}&company=${company}&start_date=${startDate}`
          : startDate !== NaN && endDate !== NaN
          ? `/order-statistics?model=${model}&seller=${seller}&company=${company}&start_date=${startDate}&end_date=${endDate}`
          : `/order-statistics?model=${model}&seller=${seller}&company=${company}`
      )
      .then((res) => {
        setDatasetss(res.data.costs);
        setData({
          ...data,
          labels: res.data.dates,
          datasets: [
            {
              label: "My First dataset",
              data: datasetss,
              fill: false,
              backgroundColor: "rgb(255, 99, 132)",
              borderColor: "rgba(255, 99, 132, 0.2)",
            },
          ],
        });
      });

    instance.get("/company").then((res) => setCompanys(res.data));
    instance.get("/sellers").then((res) => setSellers(res.data));
    instance.get("/models").then((res) => setModels(res.data));
  }, [model, seller, company, startDate, endDate]);

  return (
    <>
      <Layout>
        <Flex justifyContent="space-between" alignItems="center" my={5}>
          <Heading fontSize={{ base: "18px", md: "26px", lg: "32px" }} my={5}>
            Аналитика
          </Heading>

          <Flex alignItems={"center"} gap={"60px"}>
            <Select
              onChange={(e) => setCompany(e.target.value)}
              placeholder="choose a company"
            >
              {companys?.map((c) => {
                return <option value={c.company_id}>{c.name}</option>;
              })}
            </Select>

            <Select
              onChange={(e) => setModel(e.target.value)}
              placeholder="choose a model"
            >
              {models?.map((m) => {
                return <option value={m.id}>{m.name}</option>;
              })}
            </Select>

            <Select
              onChange={(e) => setSeller(e.target.value)}
              placeholder="choose a seller"
            >
              {sellers?.map((s) => {
                return <option value={s.id}>{s.name}</option>;
              })}
            </Select>

            <Input
              onChange={(e) => setStartDate(e.target.value)}
              type="date"
              placeholder="start date"
            />
            <Input
              onChange={(e) => setEndDate(e.target.value)}
              type="date"
              placeholder="end date"
            />
          </Flex>
        </Flex>

        <Line data={data} options={options} />
      </Layout>
    </>
  );
};

export default Analytics;

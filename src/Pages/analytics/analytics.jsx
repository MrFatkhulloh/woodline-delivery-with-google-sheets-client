import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/layout";
import {
  Flex,
  Grid as ChakraGrid,
  Input,
  Select,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Alert,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  List,
  ListItem,
  ListIcon,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import Chart, {
  LineElement,
  LinearScale,
  PointElement,
  Title,
} from "chart.js/auto";
import { Line } from "react-chartjs-2";
import { instance } from "../../config/axios.instance.config";
import accounting from "accounting";
import { CheckCircleIcon } from "@chakra-ui/icons";
import MultipleAutocomplete from "../../components/autocomplete/autocomplete";
import DateRangePicker from "../../components/customdatepicker/customdatepicker";

Chart.register(LinearScale, PointElement, LineElement, Title);

const options = {
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

const Analytics = () => {
  const [analyt, setAnalyt] = useState({
    labels: [],
    datasets: [],
  });
  const [analyt2, setAnalyt2] = useState({
    labels: [],
    datasets: [],
  });
  const [analyt3, setAnalyt3] = useState({
    labels: [],
    datasets: [],
  });
  const [models, setModels] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [companys, setCompanys] = useState([]);
  const [furnTypes, setFurnTypes] = useState([]);
  const [wallets, setWallets] = useState([]);

  const [reqType, setReqType] = useState("costs");

  const [paramData, setParamData] = useState({
    model: "",
    showroom: "",
    start_date: "",
    end_date: "",
    furniture_type: "",
  });

  const [paramData2, setParamData2] = useState({
    seller: "",
    showroom: "",
    start_date: "",
    end_date: "",
    furniture_type: "",
  });

  const [paramData3, setParamData3] = useState({
    company: "",
    wallet: "",
    startDate: "",
    endDate: "",
  });

  const [selectSellers, setSelectSellers] = useState([]);
  const [selectModels, setSelectModels] = useState([]);
  const [selectSellers3, setSelectSellers3] = useState([]);

  function removeEmptyValues(obj) {
    for (let key in obj) {
      if (obj[key] === "" || obj[key] === []) {
        delete obj[key];
      }
    }

    return obj;
  }

  const [pickerItems, setPickerItems] = useState([]);
  const [pickerItems2, setPickerItems2] = useState([]);

  useEffect(() => {
    setPickerItems(
      sellers?.map((s, i) => {
        return {
          label: s?.name ? s?.name : `user ${i + 1}`,
          value: s?.id,
        };
      })
    );

    setPickerItems2(
      models?.map((m, i) => {
        return {
          label: m?.name ? m?.name : `user ${i + 1}`,
          value: m?.id,
        };
      })
    );
  }, [sellers, models]);

  useEffect(() => {
    instance
      .patch(`/order-statistics?type=${reqType}`, {
        ...removeEmptyValues(paramData),
        sellers: selectSellers,
      })
      .then((res) => {
        setAnalyt({
          labels: res.data.labels,
          datasets: res.data.datasets,
        });
      });

    instance
      .patch(`/order-statistics-by-model?type=${reqType}`, {
        ...removeEmptyValues(paramData2),
        models: selectModels,
      })
      .then((res) => {
        setAnalyt2({
          labels: res.data.labels,
          datasets: res.data.datasets,
        });
      });

    instance.get("/furniture-type").then((res) => {
      setFurnTypes(res.data);
    });
    instance.get("/company").then((res) => setCompanys(res.data));
    instance.get("/sellers").then((res) => setSellers(res.data));
  }, [paramData, paramData2, selectSellers, selectModels, reqType]);

  useEffect(() => {
    instance
      .patch("/payment-statistics", {
        ...removeEmptyValues(paramData3),
        sellers: selectSellers3,
      })
      .then((res) => {
        setAnalyt3({
          labels: res.data.labels,
          datasets: res.data.datasets,
        });
      })
      .catch((err) => {
        console.log(err);
      });

    instance.get("wallet").then((res) => setWallets(res.data));
  }, [selectSellers3, paramData3]);

  useEffect(() => {
    instance.patch("/average-profit-client").then((res) => {
      console.log("my res", res);
    });
  }, []);

  const sumMoney2 = analyt2.datasets
    .map((d) => d.data.reduce((a, b) => a + b, 0))
    .reduce((m, n) => m + n, 0);

  const sumMoney3 = analyt3?.datasets
    .map((d) => d.data.reduce((a, b) => a + b, 0))
    .reduce((m, n) => m + n, 0);

  const sumMoney = analyt.datasets
    .map((d) => d.data.reduce((a, b) => a + b, 0))
    .reduce((m, n) => m + n, 0);

  return (
    <>
      <Layout>
        <Tabs isFitted>
          <TabList>
            <Tab fontSize={{ "2xl": "2xl", xl: "xl", md: "", sm: "" }}>
              Аналитика для продавцов
            </Tab>
            <Tab fontSize={{ "2xl": "2xl", xl: "xl", md: "", sm: "" }}>
              Аналитика для моделей
            </Tab>
            <Tab fontSize={{ "2xl": "2xl", xl: "xl", md: "", sm: "" }}>
              Аналитика для кассы
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Alert status="success" variant="left-accent">
                <Stat>
                  <StatLabel>
                    {reqType === "counts" ? "Общее количество" : "Общая сумма"}
                  </StatLabel>
                  <StatNumber>
                    {accounting.formatNumber(sumMoney, 0, " ")}{" "}
                    {reqType === "counts" ? "Шт" : "Сум"}
                  </StatNumber>
                  <StatHelpText>
                    {analyt.labels[0]} -{" "}
                    {analyt.labels[analyt.labels.length - 1]}
                  </StatHelpText>

                  <List spacing={3}>
                    {analyt.datasets.map((a) => {
                      return (
                        <ListItem>
                          <ListIcon as={CheckCircleIcon} color="green.500" />
                          {a.label}:{" "}
                          {accounting.formatNumber(
                            a.data.reduce((n1, n2) => n1 + n2, 0),
                            0,
                            " "
                          )}{" "}
                          {reqType === "counts" ? "Шт" : "Сум"}
                        </ListItem>
                      );
                    })}
                  </List>
                </Stat>
              </Alert>

              <Flex justifyContent="space-between" alignItems="center" my={5}>
                <ChakraGrid
                  templateColumns={{
                    base: "repeat(2, 1fr)",
                    md: "repeat(3, 1fr)",
                    lg: "repeat(4, 1fr)",
                  }}
                  gap={{ sm: "10px", md: "10px" }}
                >
                  <Select
                    onChange={(e) =>
                      setParamData({ ...paramData, showroom: e.target.value })
                    }
                    placeholder="Все компании"
                  >
                    {companys?.map((c) => {
                      return <option value={c.company_id}>{c.name}</option>;
                    })}
                  </Select>

                  <Select
                    onChange={(e) => {
                      setModels(
                        furnTypes?.find((fft) => fft.id === e.target.value)
                          ?.models
                      );
                      setParamData({
                        ...paramData,
                        furniture_type: e.target.value,
                        model: "",
                      });
                    }}
                    placeholder="выбрать тип мебели"
                  >
                    {furnTypes?.map((ft) => {
                      return (
                        <option key={ft.id} value={ft.id}>
                          {ft.name}
                        </option>
                      );
                    })}
                  </Select>

                  <Select
                    isDisabled={models.length === 0 ? true : false}
                    onChange={(e) =>
                      setParamData({ ...paramData, model: e.target.value })
                    }
                    placeholder="Все модели"
                  >
                    {models?.map((s) => {
                      return (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      );
                    })}
                  </Select>

                  <Select
                    onChange={(e) => setReqType(e.target.value)}
                    placeholder="По ценам или Кол-во"
                  >
                    <option value="costs">По ценам</option>
                    <option value="counts">Кол-во</option>
                  </Select>

                  <DateRangePicker
                    onChange={(dates) => {
                      setParamData({
                        ...paramData,
                        start_date: dates[0] ?? "",
                        end_date: dates[1] ?? "",
                      });
                    }}
                    value={[paramData.start_date, paramData.end_date]}
                  />

                  <MultipleAutocomplete
                    placeholder={"продавцы"}
                    value={selectSellers}
                    onChange={(selected) => {
                      setSelectSellers(selected);
                    }}
                    options={pickerItems}
                  />
                </ChakraGrid>
              </Flex>

              <Line data={analyt} options={options} />
            </TabPanel>
            <TabPanel>
              <Alert status="success" variant="left-accent">
                <Stat>
                  <StatLabel>
                    {reqType === "counts" ? "Общее количество" : "Общая сумма"}
                  </StatLabel>
                  <StatNumber>
                    {accounting.formatNumber(sumMoney2, 0, " ")}{" "}
                    {reqType === "counts" ? "Шт" : "Сум"}
                  </StatNumber>
                  <StatHelpText>
                    {analyt2.labels[0]} -{" "}
                    {analyt2.labels[analyt2.labels.length - 1]}
                  </StatHelpText>

                  <List spacing={3}>
                    {analyt2.datasets.map((a) => {
                      return (
                        <ListItem>
                          <ListIcon as={CheckCircleIcon} color="green.500" />
                          {a.label}:{" "}
                          {accounting.formatNumber(
                            a.data.reduce((n1, n2) => n1 + n2, 0),
                            0,
                            " "
                          )}{" "}
                          {reqType === "counts" ? "Шт" : "Сум"}
                        </ListItem>
                      );
                    })}
                  </List>
                </Stat>
              </Alert>

              <Flex justifyContent="space-between" alignItems="center" my={5}>
                <ChakraGrid
                  templateColumns={{
                    base: "repeat(2, 1fr)",
                    md: "repeat(3, 1fr)",
                    lg: "repeat(4, 1fr)",
                  }}
                  gap={{ sm: "10px", md: "10px" }}
                >
                  <Select
                    onChange={(e) =>
                      setParamData2({ ...paramData2, showroom: e.target.value })
                    }
                    placeholder="Все компании"
                  >
                    {companys?.map((c) => {
                      return <option value={c.company_id}>{c.name}</option>;
                    })}
                  </Select>

                  <Select
                    onChange={(e) => {
                      setModels(
                        furnTypes?.find((fft) => fft.id === e.target.value)
                          ?.models
                      );
                      setParamData2({
                        ...paramData2,
                        furniture_type: e.target.value,
                      });
                    }}
                    placeholder="выбрать тип мебели"
                  >
                    {furnTypes?.map((ft) => {
                      return (
                        <option key={ft.id} value={ft.id}>
                          {ft.name}
                        </option>
                      );
                    })}
                  </Select>

                  <MultipleAutocomplete
                    placeholder={"модели"}
                    value={selectModels}
                    options={pickerItems2}
                    onChange={(selected) => {
                      setSelectModels(selected);
                    }}
                  />

                  <Select
                    onChange={(e) => setReqType(e.target.value)}
                    placeholder="По ценам или Кол-во"
                  >
                    <option value="costs">По ценам</option>
                    <option value="counts">Кол-во</option>
                  </Select>

                  <DateRangePicker
                    onChange={(dates) => {
                      setParamData2({
                        ...paramData2,
                        start_date: dates[0] ?? "",
                        end_date: dates[1] ?? "",
                      });
                    }}
                    value={[paramData2.start_date, paramData2.end_date]}
                  />

                  <Select
                    onChange={(e) =>
                      setParamData2({ ...paramData2, seller: e.target.value })
                    }
                    placeholder="Все продавцы"
                  >
                    {sellers?.map((s) => {
                      return (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      );
                    })}
                  </Select>
                </ChakraGrid>
              </Flex>

              <Line data={analyt2} options={options} />
            </TabPanel>
            <TabPanel>
              <Alert status="success" variant="left-accent">
                <Stat>
                  <StatLabel>
                    {reqType === "counts" ? "Общее количество" : "Общая сумма"}
                  </StatLabel>
                  <StatNumber>
                    {accounting.formatNumber(sumMoney3, 0, " ")}{" "}
                    {reqType === "counts" ? "Шт" : "Сум"}
                  </StatNumber>
                  <StatHelpText>
                    {analyt3.labels[0]} -{" "}
                    {analyt3.labels[analyt3.labels.length - 1]}
                  </StatHelpText>

                  <List spacing={3}>
                    {analyt3.datasets.map((a) => {
                      return (
                        <ListItem>
                          <ListIcon as={CheckCircleIcon} color="green.500" />
                          {a.label}:{" "}
                          {accounting.formatNumber(
                            a.data.reduce((n1, n2) => n1 + n2, 0),
                            0,
                            " "
                          )}{" "}
                          {reqType === "counts" ? "Шт" : "Сум"}
                        </ListItem>
                      );
                    })}
                  </List>
                </Stat>
              </Alert>

              <Flex
                justifyContent={"space-between"}
                alignItems={"center"}
                my={5}
              >
                <ChakraGrid
                  templateColumns={{
                    base: "repeat(2, 1fr)",
                    md: "repeat(3, 1fr)",
                    lg: "repeat(4, 1fr)",
                  }}
                  gap={{ sm: "10px", md: "10px" }}
                >
                  <Select
                    onChange={(e) =>
                      setParamData3({ ...paramData3, company: e.target.value })
                    }
                    placeholder="Все компании"
                  >
                    {companys?.map((c) => {
                      return <option value={c.id}>{c.name}</option>;
                    })}
                  </Select>

                  <Select
                    onChange={(e) => {
                      setParamData3({ ...paramData3, wallet: e.target.value });
                    }}
                    placeholder="кошельки"
                  >
                    {wallets?.map((w) => (
                      <option value={w.id}>{w.name}</option>
                    ))}
                  </Select>

                  <MultipleAutocomplete
                    placeholder={"продавцы"}
                    value={selectSellers3}
                    options={pickerItems}
                    onChange={(selected) => {
                      setSelectSellers3(selected);
                    }}
                  />

                  <DateRangePicker
                    onChange={(dates) => {
                      setParamData3({
                        ...paramData3,
                        startDate: dates[0] ?? "",
                        endDate: dates[1] ?? "",
                      });
                    }}
                    value={[paramData3.startDate, paramData3.endDate]}
                  />
                </ChakraGrid>
              </Flex>

              <Line data={analyt3} options={options} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Layout>
    </>
  );
};

export default Analytics;

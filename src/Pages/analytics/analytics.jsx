import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/layout";
import {
  Flex,
  Grid as ChakraGrid,
  Heading,
  Input,
  Select,
  useColorMode,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Alert,
  FormControl,
  FormLabel,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  List,
  ListItem,
  ListIcon,
} from "@chakra-ui/react";
import Chart, {
  LineElement,
  LinearScale,
  PointElement,
  Title,
} from "chart.js/auto";
import { Line } from "react-chartjs-2";
import { instance } from "../../config/axios.instance.config";
import { CUIAutoComplete } from "chakra-ui-autocomplete";
import accounting from "accounting";
import { CheckCircleIcon } from "@chakra-ui/icons";

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
  const [models, setModels] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [companys, setCompanys] = useState([]);
  const [furnTypes, setFurnTypes] = useState([]);

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
  });

  const [selectSellers, setSelectSellers] = useState([]);
  const [selectModels, setSelectModels] = useState([]);

  function removeEmptyValues(obj) {
    for (let key in obj) {
      if (obj[key] === "" || obj[key] === []) {
        delete obj[key];
      }
    }

    return obj;
  }

  const { colorMode } = useColorMode();
  const [pickerItems, setPickerItems] = useState([]);
  const [pickerItems2, setPickerItems2] = useState([]);

  const handleSelectedItemsChange = (selectedItems) => {
    if (selectedItems) {
      setSelectSellers(selectedItems);
    }
  };

  const handleSelectedItemsChange2 = (selectedItems) => {
    if (selectedItems) {
      setSelectModels(selectedItems);
    }
  };

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
        console.log(res, "res");
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
        console.log(res, "res2");
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

  const sumMoney = analyt.datasets
    .map((d) => d.data.reduce((a, b) => a + b, 0))
    .reduce((m, n) => m + n, 0);

  const sumMoney2 = analyt2.datasets
    .map((d) => d.data.reduce((a, b) => a + b, 0))
    .reduce((m, n) => m + n, 0);
  console.log(models);

  console.log(analyt2.datasets, "my data");
  console.log(paramData2, "ppp");

  return (
    <>
      <Layout>
        <Tabs>
          <TabList>
            <Tab>Аналитика для продавцов</Tab>
            <Tab>Аналитика для моделей</Tab>
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
                    {sellers?.map((s) => {
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

                  <Input
                    onBlur={(e) => e.type === "date"}
                    onChange={(e) =>
                      setParamData({
                        ...paramData,
                        start_date: new Date(e.target.value).getTime(),
                      })
                    }
                    type="date"
                    placeholder="start date"
                  />

                  <Input
                    onChange={(e) =>
                      setParamData({
                        ...paramData,
                        end_date: new Date(e.target.value).getTime(),
                      })
                    }
                    type="date"
                    placeholder="end date"
                  />

                  <CUIAutoComplete
                    toggleButtonStyleProps={{
                      bg: colorMode === "dark" ? "gray" : "",
                    }}
                    listStyleProps={{
                      bg: colorMode === "dark" ? "#2D3748" : "",
                      color: colorMode === "dark" ? "white" : "black",
                      _focus: {
                        overflow: "auto",
                      },
                    }}
                    listItemStyleProps={{
                      _hover: {
                        color: colorMode === "dark" ? "black" : "",
                      },
                    }}
                    placeholder="seller"
                    items={pickerItems}
                    onSelectedItemsChange={(changes) =>
                      handleSelectedItemsChange(changes.selectedItems)
                    }
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

                  <CUIAutoComplete
                    toggleButtonStyleProps={{
                      bg: colorMode === "dark" ? "gray" : "",
                    }}
                    listStyleProps={{
                      bg: colorMode === "dark" ? "#2D3748" : "",
                      color: colorMode === "dark" ? "white" : "black",
                      _focus: {
                        overflow: "auto",
                      },
                    }}
                    listItemStyleProps={{
                      _hover: {
                        color: colorMode === "dark" ? "black" : "",
                      },
                    }}
                    placeholder="Модели"
                    items={pickerItems2}
                    onSelectedItemsChange={(changes) =>
                      handleSelectedItemsChange2(changes.selectedItems)
                    }
                  />

                  <Select
                    onChange={(e) => setReqType(e.target.value)}
                    placeholder="По ценам или Кол-во"
                  >
                    <option value="costs">По ценам</option>
                    <option value="counts">Кол-во</option>
                  </Select>

                  <Input
                    onChange={(e) =>
                      setParamData2({
                        ...paramData2,
                        start_date: new Date(e.target.value).getTime(),
                      })
                    }
                    type="date"
                    placeholder="start date"
                  />

                  <Input
                    onChange={(e) =>
                      setParamData2({
                        ...paramData2,
                        end_date: new Date(e.target.value).getTime(),
                      })
                    }
                    type="date"
                    placeholder="end date"
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
          </TabPanels>
        </Tabs>
      </Layout>
    </>
  );
};

export default Analytics;

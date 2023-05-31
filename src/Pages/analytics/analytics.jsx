import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/layout";
import {
  Flex,
  Grid,
  Heading,
  Input,
  Select,
  useColorMode,
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
  const [models, setModels] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [companys, setCompanys] = useState([]);
  const [furnTypes, setFurnTypes] = useState([]);

  const [reqType, setReqType] = useState("costs");

  const [paramData, setParamData] = useState({
    model: "",
    company: "",
    start_date: "",
    end_date: "",
    furniture_type: "",
  });

  const [selectSellers, setSelectSellers] = useState([]);

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

  const handleSelectedItemsChange = (selectedItems) => {
    if (selectedItems) {
      setSelectSellers(selectedItems);
    }
  };

  useEffect(() => {
    setPickerItems(
      sellers?.map((s, i) => {
        return {
          label: s?.name ? s?.name : `user ${i + 1}`,
          value: s.id,
        };
      })
    );
  }, [sellers]);

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

    instance.get("/furniture-type").then((res) => {
      console.log(res);
      setFurnTypes(res.data);
    });
    instance.get("/company").then((res) => setCompanys(res.data));
    instance.get("/sellers").then((res) => setSellers(res.data));
  }, [paramData, selectSellers, reqType]);

  return (
    <>
      <Layout>
        <Flex justifyContent="space-between" alignItems="center" my={5}>
          <Flex alignItems={"center"} gap={"20px"} flexWrap={"wrap"}>
            <Select
              maxWidth={"270px"}
              onChange={(e) =>
                setParamData({ ...paramData, company: e.target.value })
              }
              placeholder="Все компании"
            >
              {companys?.map((c) => {
                return <option value={c.company_id}>{c.name}</option>;
              })}
            </Select>

            <Select
              maxWidth={"270px"}
              onChange={(e) => {
                setModels(
                  furnTypes?.find((fft) => fft.id === e.target.value)?.models
                );
                setParamData({
                  ...paramData,
                  furniture_type: e.target.value,
                  model: "",
                });
              }}
              placeholder="choose a furn type"
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
              // defaultValue={models[0]?.id}
              isDisabled={models.length === 0 ? true : false}
              maxWidth={"270px"}
              onChange={(e) =>
                setParamData({ ...paramData, model: e.target.value })
              }
              placeholder="Все модели"
            >
              {models?.map((m) => {
                return (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                );
              })}
            </Select>

            <Input
              maxWidth={"270px"}
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
              maxWidth={"270px"}
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
                  minHeight: "100px",
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

            <Select
              maxWidth={"270px"}
              onChange={(e) => setReqType(e.target.value)}
              placeholder="Summa or count"
            >
              <option value="costs">Costs</option>
              <option value="counts">Counts</option>
            </Select>

            {/* <Select
              onChange={(e) => setSeller(e.target.value)}
              placeholder="choose a seller"
            >
              {sellers?.map((s) => {
                return <option value={s.id}>{s.name}</option>;
              })}
            </Select> */}
          </Flex>
        </Flex>

        <Line data={analyt} options={options} />
      </Layout>
    </>
  );
};

export default Analytics;

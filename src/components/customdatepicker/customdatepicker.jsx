import { useEffect, useState } from "react";
import { RangeDatepicker } from "chakra-dayzed-datepicker";
import { Box } from "@chakra-ui/react";
import { CalendarIcon } from "@chakra-ui/icons";

const DateRangePicker = ({ value, onChange }) => {
  const [selectedDates, setSelectedDates] = useState(value);

  const dateFormatter = (dates) => {
    let result = [];
    for (let i = 0; i < dates.length; i++) {
      let formattedDate = new Date(dates[i]).getTime();

      result.push(formattedDate);
    }
    return result;
  };

  useEffect(() => {
    onChange(dateFormatter(selectedDates));
  }, [selectedDates]);

  return (
    <Box position="relative">
      <CalendarIcon
        position="absolute"
        top="50%"
        right="20px"
        transform="translateY(-50%)"
        color="gray.500"
        pointerEvents="none"
        zIndex="1"
      />
      <RangeDatepicker
        propsConfigs={{
          inputProps: {
            placeholder: "дата начала  ->  дата окончания",
            width: "300px",
          },
        }}
        name="date-input"
        selectedDates={selectedDates}
        onDateChange={setSelectedDates}
        configs={{
          dateFormat: "yyyy-MM-dd",
        }}
      />
    </Box>
  );
};

export default DateRangePicker;

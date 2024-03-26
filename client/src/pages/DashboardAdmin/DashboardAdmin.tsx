import {
  Box,
  HStack,
  Spacer,
  Text,
  Heading,
  FormLabel,
  Flex,
} from "@chakra-ui/react";
import { IconGraphFilled} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { SidebarWithHeader } from "../../components/SideBar/SideBar";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Sales Data",
    },
  },
};

interface Category {
  id: number;
  category: string;
}

interface Sale {
  saleDate: string;
  totalSales: number;
  totalQuantity: number;
  totalTransactions: number;
}

function formatPriceToIDR(price: any) {
  // Use Intl.NumberFormat to format the number as IDR currency
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(price);
}

function calculatePercentageChange(currentValue: any, previousValue: any) {
  return ((currentValue - previousValue) / Math.abs(previousValue)) * 100;
}

const DashboardAdmin = () => {
  const [salesData, setSalesData] = useState<Sale[]>([]);
  const [dataCategory, setDataCategory] = useState([]);
  const [selectedCategory ] = useState<Category | null>(null);

  // Get today's date
  const today = new Date();

  // Get yesterday's date
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  // Format the dates to a string in "YYYY-MM-DD" format
  const formattedToday = formatDate(today);
  const formattedYesterday = formatDate(yesterday);

  function formatDate(date: any) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  console.log("Today:", formattedToday);
  console.log("Yesterday:", formattedYesterday);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_APP_API_BASE_URL
        }/report/sales-by-date?startDate=${formattedYesterday}&endDate=${formattedToday}`
      );
      setSalesData(response?.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  let percentageTotalSales;
  let percentageTotalQuantity;
  let percentageTotalTransactions;

  if (salesData && salesData.length > 0) {
    salesData?.sort((a, b) => new Date(a.saleDate).getTime() - new Date(b.saleDate).getTime());

    // Calculate percentage change for each metric
    const percentageChanges = {
      totalSales: calculatePercentageChange(salesData[1]?.totalSales, salesData[0]?.totalSales),
      totalQuantity: calculatePercentageChange(
        salesData[1]?.totalQuantity,
        salesData[0]?.totalQuantity
      ),
      totalTransactions: calculatePercentageChange(
        salesData[1]?.totalTransactions,
        salesData[0]?.totalTransactions
      ),
    };

    

    console.log("Percentage Change in Total Sales:", percentageChanges.totalSales.toFixed(2) + "%");
    percentageTotalSales = percentageChanges.totalSales.toFixed(2) + "%";
    console.log(
      "Percentage Change in Total Quantity:",
      percentageChanges.totalQuantity.toFixed(2) + "%"
    );
    percentageTotalQuantity = percentageChanges.totalQuantity.toFixed(2) + "%";
    console.log(
      "Percentage Change in Total Transactions:",
      percentageChanges.totalTransactions.toFixed(2) + "%"
    );
    percentageTotalTransactions = percentageChanges.totalTransactions.toFixed(2) + "%";
  }
  console.log(salesData);


  console.log(selectedCategory);


  const fetchCategory = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_BASE_URL}/products/category-lists`
      );

      setDataCategory(response?.data);
    } catch (err) {
      console.log(err);
    }
  };

  console.log(dataCategory);

  useEffect(() => {
    fetchCategory();
  }, []);

  const labels = salesData.map((item) => item.saleDate);
  const data = {
    labels,
    datasets: [
      {
        fill: true,
        label: "Total Sales",
        data: salesData.map((item) => item.totalSales),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
      {
        fill: true,
        label: "Total Products",
        data: salesData.map((item) => item.totalQuantity),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        fill: true,
        label: "Total Transactions",
        data: salesData.map((item) => item.totalTransactions),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
    ],
  };

  return (
    <>
      <SidebarWithHeader />
      <Box width="98.7vw" height="fit-content" backgroundColor="#fbfaf9" p="50px">
        <Box pl="150px">
          <HStack mb="10px">
            <Text>Sale Today ({salesData[1]?.saleDate})</Text>
            <Spacer />
            {/* <Button
              onClick={exportToPDF}
              borderRadius="full"
              border="solid 1px black"
              leftIcon={<IconArrowNarrowDown />}
            >
              Download
            </Button> */}
          </HStack>

          <Flex flexDirection="row" mt="10px" columnGap="10px">
            <Box width="40%" p="20px" boxShadow="0px 1px 5px gray" borderRadius="10px">
              <FormLabel>Revenue</FormLabel>
              <Heading mb="5px">{formatPriceToIDR(salesData[1]?.totalSales)}</Heading>
              {percentageTotalSales !== undefined && (
              <HStack
                width="fit-content"
                borderRadius="full"
                p="10px"
                border={percentageTotalSales > "0%" ? "solid #06b300 3px" : "solid #ff7c00 3px"}
                backgroundColor={
                  percentageTotalSales > "0%" ? "rgba(9, 255, 0, 0.75)" : "rgba(255, 150, 0, 0.75)"
                }
              >
                <Box textColor={percentageTotalSales > "0%" ? "#059900" : "#ff7200"}>
                  <IconGraphFilled />
                </Box>
                <Text>{percentageTotalSales}</Text>
              </HStack>
              )}
            </Box>
            <Box width="30%" p="20px" boxShadow="0px 1px 5px gray" borderRadius="10px">
              <FormLabel>Products Sold</FormLabel>
              <Heading mb="5px">{salesData[1]?.totalQuantity}</Heading>
              {percentageTotalQuantity !== undefined && (
              <HStack
                width="fit-content"
                borderRadius="full"
                p="10px"
                border={percentageTotalQuantity > "0%" ? "solid #06b300 3px" : "solid #ff7c00 3px"}
                backgroundColor={
                  percentageTotalQuantity > "0%"
                    ? "rgba(9, 255, 0, 0.75)"
                    : "rgba(255, 150, 0, 0.75)"
                }
                textColor="black"
              >
                <Box textColor={percentageTotalQuantity > "0%" ? "#059900" : "#ff7200"}>
                  <IconGraphFilled />
                </Box>
                <Text>{percentageTotalQuantity}</Text>
              </HStack>
              )}
            </Box>
            <Box width="30%" p="20px" boxShadow="0px 1px 5px gray" borderRadius="10px">
              <FormLabel>Transactions</FormLabel>
              <Heading mb="5px">{salesData[1]?.totalTransactions}</Heading>
              {percentageTotalTransactions !== undefined && (
              <HStack
                width="fit-content"
                borderRadius="full"
                p="10px"
                border={
                  percentageTotalTransactions > "0%" ? "solid #06b300 3px" : "solid #ff7c00 3px"
                }
                backgroundColor={
                  percentageTotalTransactions > "0%"
                    ? "rgba(9, 255, 0, 0.75)"
                    : "rgba(255, 150, 0, 0.75)"
                }
                textColor="black"
              >
                <Box textColor={percentageTotalTransactions > "0%" ? "#059900" : "#ff7200"}>
                  <IconGraphFilled />
                </Box>
                <Text>{percentageTotalTransactions}</Text>
              </HStack>
              )}
            </Box>
          </Flex>
          <Box width="50vw">
            <Line options={options} data={{ labels, datasets: [data.datasets[0]] }} />
            <Line options={options} data={{ labels, datasets: [data.datasets[1]] }} />
            <Line options={options} data={{ labels, datasets: [data.datasets[2]] }} />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export { DashboardAdmin };

import {
	Box,
	Button,
	HStack,
	Input,
	Spacer,
	Text,
	IconButton,
	Heading,
	FormLabel,
	Flex,
} from "@chakra-ui/react";
import {
	IconInfoCircleFilled,
} from "@tabler/icons-react";
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

interface Sale {
	saleDate: string;
	totalSales: number;
	totalQuantity: number;
	totalTransactions: number;
  }

interface Report{
	id: string;
	total_quantity: number;
	total_price: number;
	date: string;
}


function formatPriceToIDR(price: any) {
	// Use Intl.NumberFormat to format the number as IDR currency
	return new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
	}).format(price);
}

function formatISODate(isoDateString: any) {
	const date = new Date(isoDateString);

	// Format date and time in a readable way
	const formattedDateTime = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

	return formattedDateTime;
}

const Report = () => {
	const [salesData, setSalesData] = useState<Sale[]>([]);
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [reportData, setReportData] = useState<Report[]>([]);
	const [totalRevenue, setTotalRevenue] = useState(0);
	const [totalProductsSold, setTotalProductsSold] = useState(0);
	const [totalTransactions, setTotalTransactions] = useState(0);

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

	console.log("ini start date", startDate);

	const fetchReport = async () => {
		try {
			const response = await axios.get(
				`${import.meta.env.VITE_APP_API_BASE_URL}/report/sales-report?startDate=${startDate}&endDate=${endDate}`
			);

			setReportData(response?.data);
		} catch (err) {
			console.log(err);
		}
	};

	const fetchData = async () => {
		try {
			const response = await axios.get(
				`${import.meta.env.VITE_APP_API_BASE_URL}/report/sales-by-date?startDate=${startDate}&endDate=${endDate}`
			);
			setSalesData(response?.data);

			const totalRevenue1 = salesData?.reduce(
				(acc, item) => acc + item?.totalSales,
				0
			);
			const totalProductsSold1 = salesData?.reduce(
				(acc, item) => acc + item?.totalQuantity,
				0
			);
			const totalTransactions1 = salesData?.reduce(
				(acc, item) => acc + item?.totalTransactions,
				0
			);

			// Update state
			setTotalRevenue(totalRevenue1);
			setTotalProductsSold(totalProductsSold1);
			setTotalTransactions(totalTransactions1);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		fetchData();
		fetchReport();
	}, [startDate, endDate]);

	console.log(salesData);


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

	console.log("ini report data", reportData);

	return (
		<>
			<SidebarWithHeader />
			<Box
				width="98.7vw"
				height="fit-content"
				backgroundColor="#fbfaf9"
				p="50px"
			>
				<Box pl={{ md: "150px", sm: "0px" }}>
					<HStack mb="10px">
						<Spacer />

						<Input
							value={startDate}
							onChange={(e) => setStartDate(e.target.value)}
							width="fit-content"
							type="date"
						/>
						<Text>-</Text>
						<Input
							value={endDate}
							onChange={(e) => setEndDate(e.target.value)}
							width="fit-content"
							type="date"
						/>
						<Button
							onClick={() => {
								Promise.all([fetchData(), fetchReport()]);
							}}
						>
							Start
						</Button>
					</HStack>
					<Box p="20px" boxShadow="0px 1px 5px gray">
						{salesData && salesData.length > 0 ? (
							<>
								<HStack mb="5px" textAlign="center">
									<Text fontWeight="bold" width="20%">
										Sales Date
									</Text>
									<Spacer />
									<Text fontWeight="bold" width="20%">
										Revenue
									</Text>
									<Spacer />
									<Text fontWeight="bold" width="20%">
										Products Sold
									</Text>
									<Spacer />
									<Text fontWeight="bold" width="20%">
										Transactions
									</Text>
								</HStack>
								<Box
									as="hr"
									borderTopWidth="5px"
									borderTopColor="black.200"
								></Box>
								{salesData &&
									salesData?.map((item) => (
										<>
											<HStack m="10px" textAlign="center">
												<Text
													width="20%"
													isTruncated
													textOverflow="ellipsis"
													whiteSpace="nowrap"
												>
													{item?.saleDate}
												</Text>
												<Spacer />
												<Text
													width="20%"
													isTruncated
													textOverflow="ellipsis"
													whiteSpace="nowrap"
												>
													{formatPriceToIDR(item?.totalSales)}
												</Text>
												<Spacer />
												<Text
													width="20%"
													isTruncated
													textOverflow="ellipsis"
													whiteSpace="nowrap"
												>
													{item?.totalQuantity}
												</Text>
												<Spacer />
												<Text
													width="20%"
													isTruncated
													textOverflow="ellipsis"
													whiteSpace="nowrap"
												>
													{item?.totalTransactions}
												</Text>
											</HStack>
											<Box
												as="hr"
												borderTopWidth="2px"
												borderTopColor="black.200"
											/>
										</>
									))}{" "}
							</>
						) : (
							<>
								<Text>No Data Available</Text>
							</>
						)}
					</Box>

					<Box mt="20px" p="20px" boxShadow="0px 1px 5px gray">
						{reportData && reportData.length > 0 ? (
							<>
								<HStack mb="5px" textAlign="center">
									<Text fontWeight="bold" width="10%">
										ID
									</Text>
									<Spacer />
									<Text fontWeight="bold" width="10%">
										Quantity
									</Text>
									<Spacer />
									<Text fontWeight="bold" width="30%">
										Payment
									</Text>
									<Spacer />
									<Text fontWeight="bold" width="30%">
										Date
									</Text>
									<Text width="5%"></Text>
								</HStack>
								<Box
									as="hr"
									borderTopWidth="5px"
									borderTopColor="black.200"
								></Box>
								<Box overflowY="auto" maxH="70vh">
									{reportData &&
										reportData?.map((item) => (
											<>
												<HStack m="10px" textAlign="center">
													<Text
														width="10%"
														isTruncated
														textOverflow="ellipsis"
														whiteSpace="nowrap"
													>
														{item?.id}
													</Text>
													<Spacer />
													<Text
														width="10%"
														isTruncated
														textOverflow="ellipsis"
														whiteSpace="nowrap"
													>
														{item?.total_quantity}
													</Text>
													<Spacer />
													<Text
														width="30%"
														isTruncated
														textOverflow="ellipsis"
														whiteSpace="nowrap"
													>
														{formatPriceToIDR(item?.total_price)}
													</Text>
													<Spacer />
													<Text
														width="30%"
														isTruncated
														textOverflow="ellipsis"
														whiteSpace="nowrap"
													>
														{formatISODate(item?.date)}
													</Text>
													<IconButton
														width="5%"
														icon={<IconInfoCircleFilled />}
														aria-label=""
														onClick={() =>
															window.open(
																`/transaction-detail/${item.id}`,
																"_blank"
															)
														}
													/>
												</HStack>
												<Box
													as="hr"
													borderTopWidth="2px"
													borderTopColor="black.200"
												/>
											</>
										))}
								</Box>{" "}
							</>
						) : (
							<>
								<Text>No Data Available</Text>
							</>
						)}
					</Box>

					<Flex
						flexDir={{ md: "row", sm: "column" }}
						mt="10px"
						columnGap="10px"
					>
						<Box
							width={{ md: "40%", sm: "100%" }}
							mb="10px"
							p="20px"
							boxShadow="0px 1px 5px gray"
							borderRadius="10px"
						>
							<FormLabel>Revenue</FormLabel>
							<Heading mb="5px">
								{formatPriceToIDR(totalRevenue)}
							</Heading>
						</Box>
						<Box
							width={{ md: "30%", sm: "100%" }}
							mb="10px"
							p="20px"
							boxShadow="0px 1px 5px gray"
							borderRadius="10px"
						>
							<FormLabel>Products Sold</FormLabel>
							<Heading mb="5px">{totalProductsSold}</Heading>
						</Box>
						<Box
							width={{ md: "30%", sm: "100%" }}
							mb="10px"
							p="20px"
							boxShadow="0px 1px 5px gray"
							borderRadius="10px"
						>
							<FormLabel>Transactions</FormLabel>
							<Heading mb="5px">{totalTransactions}</Heading>
						</Box>
					</Flex>
					<Box width="70vw">
						<Line
							id={"chartSales"}
							options={options}
							data={{ labels, datasets: [data.datasets[0]] }}
						/>
						<Line
							id={"chartProducts"}
							options={options}
							data={{ labels, datasets: [data.datasets[1]] }}
						/>
						<Line
							id={"chartTransactions"}
							options={options}
							data={{ labels, datasets: [data.datasets[2]] }}
						/>
					</Box>
				</Box>
			</Box>
		</>
	);
};

export { Report };

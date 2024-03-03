import {
	Box,
	Flex,
	Icon,
	Text,
	Divider,
	Button,
	Avatar,
} from "@chakra-ui/react";
import { SidebarWithHeader } from "../../components/SideBar/SideBar";
import { FaStar } from "react-icons/fa6";
import axios from "axios";
import { useState, useEffect } from "react";
import AddCashier from "../../components/AddCashier/AddCashier";
import UpdateCashier from "../../components/UpdateCashier/UpdateCashier";
import DeleteCashier from "../../components/DeleteCashier/DeleteCashier";

function Cashier() {
	const token = localStorage.getItem("token");

	interface Cashier {
		id: number;
		email: string;
		username: string;
		type: string;
		status: string;
		avatar: string;
	}

	const [cashier, setCashier] = useState<Cashier[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage] = useState(8);
	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentCashiers = cashier?.slice(
		indexOfFirstItem,
		indexOfLastItem
	);

	const [inactiveCashier, setInactiveCashier] = useState<Cashier[]>(
		[]
	);
	const [currentInactivePage, setCurrentInactivePage] = useState(1);
	const [itemsPerInactivePage] = useState(4);
	const indexOfLastInactiveItem =
		currentInactivePage * itemsPerInactivePage;
	const indexOfFirstInactiveItem =
		indexOfLastInactiveItem - itemsPerInactivePage;
	const currentInactiveCashiers = inactiveCashier?.slice(
		indexOfFirstInactiveItem,
		indexOfLastInactiveItem
	);

	const fetchCashier = async () => {
		try {
			const response = await axios.get(
				`${import.meta.env.VITE_APP_API_BASE_URL}/user/cashier`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			setCashier(response.data?.data);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		fetchCashier();
	}, []);

	const fetchInactiveCashier = async () => {
		try {
			const response = await axios.get(
				`${import.meta.env.VITE_APP_API_BASE_URL}/user/inactive-cashier`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			setInactiveCashier(response.data?.data);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		fetchInactiveCashier();
	}, []);

	return (
		<Box>
			<SidebarWithHeader />
			<Box
				position={"relative"}
				marginLeft={{ base: "0", md: "160px" }}
				marginTop={"20px"}
			>
				<Flex
					justifyContent={"space-between"}
					alignItems={"center"}
					margin={"0 60px"}
				>
					<Flex gap={"10px"}>
						<Text
							color={"#949494"}
							display={{ base: "none", md: "block" }}
						>
							Last Updated
						</Text>
						<Text display={{ base: "none", md: "block" }}>
							17 November 2023 01:37 PM
						</Text>
					</Flex>

					<Box>
						<AddCashier onCashierAdded={fetchCashier} />
					</Box>
				</Flex>
				<Flex
					direction={"column"}
					margin={{ base: "20px", md: "46px 60px 60px" }}
				>
					<Flex
						alignItems={"flex-start"}
						gap={"24px"}
						flexWrap={"wrap"}
						h={"50vh"}
					>
						{currentCashiers?.map((item, index) => (
							<Flex
								className="cashier-container"
								alignItems={"center"}
								gap={"24px"}
								flex={"1 0 calc(25% - 24px)"}
								borderRadius={"16px"}
								background={"#FFFFFF"}
								boxShadow={"base"}
								minWidth={{ base: "155px", md: "225px" }}
								maxWidth={"286px"}
								key={index}
							>
								<Box
									width={"10px"}
									height={"80px"}
									backgroundColor={"#9ED6A3"}
									borderRadius={"0px 14px 14px 0px"}
								></Box>

								<Flex
									padding={"24px 0px"}
									flexDirection={"column"}
									justifyContent={"center"}
									alignItems={"flex-start"}
									gap={"24px"}
								>
									<Flex
										justifyContent={"center"}
										alignItems={"center"}
										gap={"16px"}
										flexDirection={{ base: "column", md: "row" }}
									>
										{item.avatar ? (
											<Avatar
												boxSize={"64px"}
												borderRadius={"full"}
												src={`${
													import.meta.env.VITE_APP_IMAGE_URL
												}/avatar/${item.avatar}`}
											/>
										) : (
											<Avatar
												name={item.username}
												bg="rgba(40, 96, 67, 1)"
												src={"https://bit.ly/broken-link"}
												w={"56px"}
												h={"56px"}
												color={"white"}
											/>
										)}

										<Flex
											flexDirection={"column"}
											justifyContent={"center"}
											alignItems={"flex-start"}
											gap={"8px"}
										>
											<Flex alignItems={"center"} gap={"8px"}>
												<Icon
													as={FaStar}
													color={"#F2C139"}
													fontSize={"24px"}
												/>
												<Text fontSize={"14px"} fontWeight={"400"}>
													{item.username}
												</Text>
											</Flex>
											<Flex alignItems={"center"} gap={"8px"}>
												<Text
													fontSize={"14px"}
													fontWeight={"400"}
													color={"#949494"}
												>
													{" "}
													{item.type} |
												</Text>
												<Text
													fontSize={"14px"}
													fontWeight={"400"}
													color={"#9ED6A3"}
												>
													{item.status}
												</Text>
											</Flex>
											<Flex alignItems={"center"} gap={"8px"}>
												<UpdateCashier
													id={item.id}
													email={item.email}
													username={item.username}
													type={item.type}
													status={item.status}
													onCashierUpdated={fetchCashier}
												/>
												<DeleteCashier
													id={item.id}
													username={item.username}
													onCashierDeleted={fetchCashier}
												/>
											</Flex>
										</Flex>
									</Flex>
								</Flex>
							</Flex>
						))}
					</Flex>
					<Flex gap={"10px"} justifyContent={"right"} width={"100%"}>
						<Button
							cursor="pointer"
							isDisabled={currentPage > 1 ? false : true}
							onClick={() =>
								setCurrentPage((prev) => Math.max(1, prev - 1))
							}
						>
							Previous
						</Button>
						<Button
							cursor="pointer"
							onClick={() => setCurrentPage((prev) => prev + 1)}
							isDisabled={
								currentPage ===
								Math.ceil(cashier?.length / itemsPerPage)
									? true
									: false
							}
						>
							Next
						</Button>
					</Flex>
				</Flex>

				{/* <UpdateCashier userId={userId} isOpen={isOpen} onClose={onClose} /> */}
				<Box>
					<Divider />
				</Box>

				<Flex
					alignItems={"flex-start"}
					gap={"24px"}
					flexWrap={"wrap"}
					margin={{ base: "20px", md: "46px 60px 60px" }}
				>
					{currentInactiveCashiers?.map((item, index) => (
						<Flex
							className="cashier-container"
							alignItems={"center"}
							gap={"24px"}
							flex={"1 0 calc(25% - 24px)"}
							borderRadius={"16px"}
							background={"#FFFFFF"}
							boxShadow={"base"}
							minWidth={{ base: "155px", md: "225px" }}
							maxWidth={"286px"}
							key={index}
						>
							<Box
								width={"10px"}
								height={"80px"}
								backgroundColor={"#D9D9D9"}
								borderRadius={"0px 14px 14px 0px"}
							></Box>

							<Flex
								padding={"24px 0px"}
								flexDirection={"column"}
								justifyContent={"center"}
								alignItems={"flex-start"}
								gap={"24px"}
							>
								<Flex
									justifyContent={"center"}
									alignItems={"center"}
									gap={"16px"}
									flexDirection={{ base: "column", md: "row" }}
								>
									{item.avatar ? (
										<Avatar
											boxSize={"64px"}
											borderRadius={"full"}
											src={`${
												import.meta.env.VITE_APP_IMAGE_URL
											}/avatar/${item.avatar}`}
										/>
									) : (
										<Avatar
											name={item.username}
											bg="rgba(40, 96, 67, 1)"
											src={"https://bit.ly/broken-link"}
											w={"56px"}
											h={"56px"}
											color={"white"}
										/>
									)}
									<Flex
										flexDirection={"column"}
										justifyContent={"center"}
										alignItems={"flex-start"}
										gap={"8px"}
									>
										<Flex alignItems={"center"} gap={"8px"}>
											<Icon
												as={FaStar}
												color={"#D9D9D9"}
												fontSize={"24px"}
											/>
											<Text
												fontSize={"14px"}
												fontWeight={"400"}
												color={"#949494"}
											>
												{item.username}
											</Text>
										</Flex>
										<Flex alignItems={"center"} gap={"8px"}>
											<Text
												fontSize={"14px"}
												fontWeight={"400"}
												color={"#949494"}
											>
												{item.type} |
											</Text>
											<Text
												fontSize={"14px"}
												fontWeight={"400"}
												color={"#949494"}
											>
												{item.status}
											</Text>
										</Flex>
										<Flex alignItems={"center"} gap={"8px"}>
											<UpdateCashier
												id={item.id}
												email={item.email}
												username={item.username}
												type={item.type}
												status={item.status}
												onCashierUpdated={fetchInactiveCashier}
											/>
											<DeleteCashier
												id={item.id}
												username={item.username}
												onCashierDeleted={fetchInactiveCashier}
											/>
										</Flex>
									</Flex>
								</Flex>
							</Flex>
						</Flex>
					))}
					<Flex gap={"10px"} justifyContent={"right"} width={"100%"}>
						<Button
							cursor="pointer"
							isDisabled={currentInactivePage > 1 ? false : true}
							onClick={() =>
								setCurrentInactivePage((prev) =>
									Math.max(1, prev - 1)
								)
							}
						>
							Previous
						</Button>
						<Button
							cursor="pointer"
							onClick={() =>
								setCurrentInactivePage((prev) => prev + 1)
							}
							isDisabled={
								currentInactivePage ===
								Math.ceil(
									inactiveCashier?.length / itemsPerInactivePage
								)
									? true
									: false
							}
						>
							Next
						</Button>
					</Flex>
				</Flex>
			</Box>
		</Box>
	);
}

export default Cashier;

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import toRupiah from "@develoka/angka-rupiah-js";
import { useNavigate } from "react-router";
import { useLocation } from "react-router";
import { CashPayment } from "./cashPayment";
import { Payment } from "./payment";
import { useEffect, useState } from "react";
import { PaymentSuccess } from "./paymentSuccess";
import { QrisPayment } from "./qrisPayment";
import {
	Box,
	Flex,
	Image,
	Text,
	Divider,
	Button,
} from "@chakra-ui/react";
import {
	IconCalendar,
	IconUser,
	IconNumber,
	IconX,
} from "@tabler/icons-react";
// import CoffeImg from "../../assets/8485f2f23233df3900caffbd968659b3.png";

export const Transaction = () => {
	const [activePage, setIsActivePage] = useState<string>("Payment");
	const [payment, setPayment] = useState<number>(0);
	const [transactionSuccess, setTransactionSuccess] =
		useState<boolean>(false);
	const [cash, setCash] = useState<boolean>(false);
	const navigate = useNavigate();
	const { state } = useLocation();
	const now = new Date();
	const day = now.getDate();
	const month = now.getMonth();
	const year = now.getFullYear();
	const time = new Intl.DateTimeFormat("default", {
		hour12: true,
		hour: "numeric",
		minute: "numeric",
	}).format(now);

	const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];
	const cart = useSelector(
		(state: RootState) => state.CartReducer.products
	);
	const transactionPrice = useSelector(
		(state: RootState) => state.CartReducer.totalPrice
	);
	const totalQuantity = useSelector(
		(state: RootState) => state.CartReducer.countCart
	);
	const user = useSelector(
		(state: RootState) => state.authReducer.user.id
	);

	const [total, setTotal] = useState<number>(
		transactionPrice + transactionPrice * (10 / 100)
	);

	const bayar = async (
		totalQuantity: number,
		transactionPrice: number,
		cart: any
	) => {
		try {
			if (total >= transactionPrice) {
				await axios.post(
					`${import.meta.env.VITE_APP_API_BASE_URL}/transaction`,
					{
						total_quantity: totalQuantity,
						total_price: transactionPrice,
						cashier_id: user,
						cart,
					}
				);
				setTransactionSuccess(true);
			} else {
				setTransactionSuccess(false);
			}
		} catch (err) {
			console.log(err);
		}
	};
	console.log(transactionSuccess);
	useEffect(() => {
		if (transactionSuccess) {
			bayar(totalQuantity, total, cart);
			setIsActivePage("PaymentSuccess");
			console.log("test");
		}
	}, [transactionSuccess]);

	return (
		<Flex
			bgColor={"var(--black-b-10, #FAFAFA)"}
			p={"40px 32px 9px 32px"}
			gap={"44px"}
			fontSize={"14px"}
			direction={{ base: "column", lg: "row" }}
			mb={{ base: "50px", lg: 0 }}
		>
			{activePage == "Payment" || activePage == "Cash" ? (
				<Button
					display={"flex"}
					position={"absolute"}
					top={2}
					left={5}
					fontSize={"12px"}
					size={"xm"}
					p={"6px 12px"}
					borderRadius={"100px"}
					fontWeight={400}
					// border={"1px solid"}
					bgColor={"transparent"}
					gap={1.5}
					onClick={() => navigate("/cashier")}
				>
					<IconX size={"14px"} stroke={1} /> Cancel Order
				</Button>
			) : null}

			{/* Left section */}
			<Flex
				direction={"column"}
				w={{ sm: "100%", lg: "50%" }}
				bgColor={"white"}
				p={{base: "10px 15px",sm: "32px 52px"}}
				gap={"34px"}
			>
				<Flex w={"full"} justify={"space-between"}>
					<Flex direction={"column"} gap={"24px"} fontSize={"16px"}>
						<Text display={"flex"} gap={"8px"} alignItems={"center"} fontSize={{ base: "12px", xl: "16px" }}>
							<IconNumber /> SBX{state?.transactionCode}
						</Text>
						<Flex alignItems={"center"} gap={"8px"} fontSize={{ base: "12px", xl: "16px" }}>
							<IconUser width={"24px"} height={"24px"} />
							{state?.name}
						</Flex>
					</Flex>

					<Flex direction={"column"} gap={"24px"}>
						<Flex gap={2} alignItems={"center"} fontSize={{ base: "12px", xl: "16px" }}>
							<IconCalendar />
							<Text>
								{day} {months[month]} {year}
							</Text>
						</Flex>
						<Flex gap={2} alignItems={"center"} fontSize={{ base: "12px", xl: "16px" }}>
							<IconCalendar />
							<Text>{time}</Text>
						</Flex>
					</Flex>
				</Flex>

				{/* Product */}
				<Flex
					h={"280px"}
					overflowX={"auto"}
					sx={{
						"::-webkit-scrollbar": {
							display: "none",
						},
					}}
					direction={"column"}
					gap={5}
				>
					{cart?.map((items: any, index) => {
						return (
							<Box
								key={index}
								display={"flex"}
								h={"fit-content"}
								justifyContent={"space-between"}
								flexDirection={"column"}
								justifyItems={"center"}
								alignItems={"flex-start"}
								onClick={() => navigate("/")}
							>
								<Flex align={"center"} h={"fit-content"} w={"full"} gap={5}>
									<Flex
										align={"center"}
										w={"fit-content"}
										h={"fit-content"}
									>
										<Image
											src={`${
												import.meta.env.VITE_APP_IMAGE_URL
											}/products/${
												items?.image ||
												"product_ChocolateCreamColdBrew.jpg"
											}`}
											minW={{ base: "60px", xl: "80px" }}
											h={{ base: "60px", xl: "80px" }}
											borderRadius={"16px"}
										/>
									</Flex>
									<Flex direction={"column"} w={"full"} gap={5}>
										<Flex w={"full"} justify={"space-between"}>
											<Text fontSize={{ base: "12px", xl: "16px" }}>
												{items.name} ({items.total}x)
											</Text>
											<Text fontSize={{ base: "12px", xl: "16px" }}>
												{toRupiah(items.initialPrice || items.price)}
											</Text>
										</Flex>
									</Flex>
								</Flex>
							</Box>
						);
					})}
				</Flex>
				<Flex
					w={"full"}
					direction={"column"}
					gap={"16px"}
					fontSize={"14px"}
				>
					<Flex w={"full"} justify={"space-between"}>
						<Text>Subtotal</Text>
						<Text>{toRupiah(transactionPrice)}</Text>
					</Flex>
					<Flex w={"full"} justify={"space-between"}>
						<Text>Discount</Text>
						<Text>-Rp 0,00</Text>
					</Flex>
					<Flex w={"full"} justify={"space-between"}>
						<Text>Total Tax</Text>
						<Text>{toRupiah(transactionPrice * (2 / 100))}</Text>
					</Flex>
					<Divider />
					<Flex w={"full"} justify={"space-between"}>
						<Text fontSize={"20px"} fontWeight={600}>
							Total
						</Text>
						<Text fontSize={"20px"} fontWeight={600}>
							{toRupiah(
								transactionPrice + transactionPrice * (10 / 100)
							)}
						</Text>
					</Flex>
				</Flex>
			</Flex>

			{/* Right Section */}
			<Flex
				w={{ sm: "100%", lg: "50%" }}
				bgColor={"white"}
				direction={"column"}
				p={{base: "10px 15px",sm: "32px 52px"}}
				gap={"34px"}
			>
				<Flex direction={"column"} gap={"30px"} h={"full"}>
					<Text>Payment Methode</Text>
					{activePage == "Payment" && (
						<Payment
							setActive={setIsActivePage}
							setIsPayment={setPayment}
							total={total}
							setTransactionSuccess={setTransactionSuccess}
							setCash={setCash}
						/>
					)}
					{activePage == "Cash" && (
						<CashPayment
							total={total}
							setActive={setIsActivePage}
							setIsPayment={setPayment}
							setTransactionSuccess={setTransactionSuccess}
						/>
					)}
					{activePage == "PaymentSuccess" && (
						<PaymentSuccess
							name={state?.name}
							total={total}
							payment={payment}
							codeTransaction={state?.transactionCode}
							transactionSuccess={transactionSuccess}
							cash={cash}
						/>
					)}
					{activePage == "Qris" && (
						<QrisPayment
							setTransactionSuccess={setTransactionSuccess}
							setActive={setIsActivePage}
							name={state?.name}
							codeTransaction={state?.transactionCode}
						/>
					)}
				</Flex>
			</Flex>
		</Flex>
	);
};

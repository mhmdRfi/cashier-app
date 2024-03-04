/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Flex, Text } from "@chakra-ui/react";
import toRupiah from "@develoka/angka-rupiah-js";
import { IconCheck } from "@tabler/icons-react";
import { IconX } from "@tabler/icons-react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { removeAllFromCart } from "../../redux/reducer/transactionReducer";
import { useState, CSSProperties } from "react";
import { IconNumber } from "@tabler/icons-react";

import BounceLoader from "react-spinners/BounceLoader";

const override: CSSProperties = {
	display: "block",
	margin: "0 auto",
	borderColor: "green",
};

export const PaymentSuccess = ({
	name,
	payment,
	codeTransaction,
	transactionSuccess,
	total,
	cash,
}: any) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [paymentSuccess, setPaymentSuccess] =
		useState<boolean>(false);
	const [loading, setLoading] = useState(true);

	if (cash) {
		setTimeout(() => {
			setPaymentSuccess(true), setLoading(false);
		}, 500);
	} else {
		setTimeout(() => {
			setPaymentSuccess(true), setLoading(false);
		}, 5000);
	}

	return (
		<Flex
			justify={"space-between"}
			align={"center"}
			h={"full"}
			w={"full"}
			direction={"column"}
			gap={{base: 10, lg: 0}}
		>
			<Flex
				direction={"column"}
				justify={"center"}
				align={"center"}
				h={"full"}
				w={"full"}
				gap={"56px"}
			>
				{paymentSuccess ? (
					transactionSuccess == true ? (
						<Flex
							direction={"column"}
							justify={"center"}
							align={"center"}
							gap={"32px"}
						>
							<Flex
								w={"104px"}
								h={"104px"}
								borderRadius={"50%"}
								background={
									"var(--semantic-success-success-50, #EAF6EB)"
								}
								align={"center"}
								justify={"center"}
							>
								<IconCheck
									width={"56px"}
									height={"56px"}
									color={"#2CA538"}
								/>
							</Flex>
							<Text
								fontSize={"24px"}
								color={"var(--semantic-success-success-500, #2CA538)"}
							>
								Payment Successful
							</Text>
						</Flex>
					) : (
						<Flex
							direction={"column"}
							justify={"center"}
							align={"center"}
							gap={"32px"}
						>
							<Flex
								w={"104px"}
								h={"104px"}
								borderRadius={"50%"}
								bgColor={"red"}
								align={"center"}
								justify={"center"}
							>
								<IconX
									width={"56px"}
									height={"56px"}
									color={"white"}
								/>
							</Flex>
							<Text fontSize={"24px"} color={"red"}>
								Payment Failed
							</Text>
						</Flex>
					)
				) : (
					<Flex
						direction={"column"}
						justify={"center"}
						align={"center"}
						gap={"32px"}
					>
						<Flex
							w={"104px"}
							h={"104px"}
							borderRadius={"50%"}
							background={
								"var(--semantic-success-success-50, #EAF6EB)"
							}
							align={"center"}
							justify={"center"}
						>
							<div className="sweet-loading">
								<BounceLoader
									color={"#185b1f"}
									loading={loading}
									cssOverride={override}
									size={100}
									aria-label="spiner"
									data-testid="loader"
								/>
							</div>
						</Flex>
						<Text
							fontSize={"24px"}
							color={"var(--semantic-success-success-500, #2CA538)"}
						>
							Payment Pending
						</Text>
					</Flex>
				)}

				<Flex direction={"column"} gap={"24px"} w={"full"}>
					<Flex justify={"space-between"}>
						<Text>Order ID</Text>
						<Text display={"flex"} gap={"8px"} alignItems={"center"}>
							<IconNumber />
							SBX{codeTransaction}
						</Text>
					</Flex>
					<Flex justify={"space-between"}>
						<Text>Customer</Text>
						<Text>{name}</Text>
					</Flex>
					<Flex justify={"space-between"}>
						<Text>Payment</Text>
						<Text>{toRupiah(payment)}</Text>
					</Flex>
					<Flex justify={"space-between"}>
						<Text>Total</Text>
						<Text>{toRupiah(total)}</Text>
					</Flex>
					<Flex justify={"space-between"}>
						<Text>Exchange</Text>
						<Text>{toRupiah(payment - total)}</Text>
					</Flex>
				</Flex>
			</Flex>

			<Button
				w={"full"}
				h={"44px"}
				borderRadius={"100px"}
				background={"var(--brand-brand-500, #286043)"}
				color={"var(--black-b-0, #FFF)"}
				isDisabled={!paymentSuccess}
				p={"0px 24px"}
				onClick={() => {
					navigate("/cashier");
					dispatch(removeAllFromCart());
				}}
			>
				Back to Menu
			</Button>
		</Flex>
	);
};

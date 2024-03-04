/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Flex, Input, Text } from "@chakra-ui/react";
import toRupiah from "@develoka/angka-rupiah-js";
import { useState } from "react";
// import axios from "axios";

export const CashPayment = ({
	total,
	setActive,
	setIsPayment,
	setTransactionSuccess,
}: any) => {
	const [payment, setPayment] = useState<any>(0 || "");

	return (
		<Flex
			w={"full"}
			h={"full"}
			direction={"column"}
			justify={"space-between"}
			gap={{ base: 10, lg: 0 }}
			// display={"none"}
		>
			<Flex w={"full"} gap={"20px"} direction={"column"}>
				<Button
					display="flex"
					padding="24px 0px"
					flexDirection="column"
					justifyContent="center"
					alignItems={"center"}
					gap="16px"
					alignSelf="stretch"
					borderRadius={"16px"}
					background="var(--black-b-20, #F5F5F5)"
					w={"full"}
					cursor={"pointer"}
					border={"1px solid transparent"}
					_focus={{
						border: "1px solid",
						borderColor: "var(--brand-brand-500, #286043)",
						background: "var(--semantic-success-success-50, #EAF6EB)",
					}}
					onClick={() => setPayment(total)}
				>
					Exact Amount
				</Button>
				<Button
					display="flex"
					padding="24px 0px"
					flexDirection="column"
					justifyContent="center"
					isDisabled={total > 100000 ? true : false}
					alignItems={"center"}
					gap="16px"
					alignSelf="stretch"
					borderRadius={"16px"}
					background="var(--black-b-20, #F5F5F5)"
					w={"full"}
					cursor={"pointer"}
					border={"1px solid transparent"}
					_focus={{
						border: "1px solid",
						borderColor: "var(--brand-brand-500, #286043)",
						background: "var(--semantic-success-success-50, #EAF6EB)",
					}}
					onClick={() => setPayment(100000)}
				>
					100.000
				</Button>
				<Button
					display="flex"
					padding="24px 0px"
					flexDirection="column"
					justifyContent="center"
					alignItems={"center"}
					gap="16px"
					isDisabled={total > 150000 ? true : false}
					alignSelf="stretch"
					borderRadius={"16px"}
					background="var(--black-b-20, #F5F5F5)"
					w={"full"}
					cursor={"pointer"}
					border={"1px solid transparent"}
					_focus={{
						border: "1px solid",
						borderColor: "var(--brand-brand-500, #286043)",
						background: "var(--semantic-success-success-50, #EAF6EB)",
					}}
					onClick={() => setPayment(150000)}
				>
					150.000
				</Button>
				<Button
					display="flex"
					padding="24px 0px"
					flexDirection="column"
					justifyContent="center"
					alignItems={"center"}
					gap="16px"
					isDisabled={total > 200000 ? true : false}
					alignSelf="stretch"
					borderRadius={"16px"}
					background="var(--black-b-20, #F5F5F5)"
					w={"full"}
					cursor={"pointer"}
					border={"1px solid transparent"}
					_focus={{
						border: "1px solid",
						borderColor: "var(--brand-brand-500, #286043)",
						background: "var(--semantic-success-success-50, #EAF6EB)",
					}}
					onClick={() => setPayment(200000)}
				>
					200.00
				</Button>
				<Button
					display="flex"
					padding="24px 0px"
					flexDirection="column"
					justifyContent="center"
					alignItems={"center"}
					gap="16px"
					alignSelf="stretch"
					borderRadius={"16px"}
					background="var(--black-b-20, #F5F5F5)"
					w={"full"}
					cursor={"pointer"}
					border={"1px solid transparent"}
					_focus={{
						border: "1px solid",
						borderColor: "var(--brand-brand-500, #286043)",
						background: "var(--semantic-success-success-50, #EAF6EB)",
					}}
				>
					<Input
						variant={"unstyled"}
						placeholder="Custom"
						_placeholder={{
							color: "black",
							fontSize: "16px",
							fontWeight: "600",
						}}
						textAlign={"center"}
						value={payment}
						onChange={(e) => setPayment(e.target.value)}
					/>
				</Button>
			</Flex>

			<Flex
				w={"full"}
				direction={"column"}
				gap={{ base: "28px", lg: "20px" }}
			>
				<Flex justify={"space-between"} w={"full"}>
					<Text>Payment</Text>
					<Text>{toRupiah(payment)}</Text>
				</Flex>
				<Flex justify={"space-between"} w={"full"}>
					<Text>Total</Text>
					<Text>{toRupiah(total)}</Text>
				</Flex>
				<Flex justify={"space-between"} w={"full"}>
					<Text>Total</Text>
					<Text>{payment > 0 ? toRupiah(payment - total) : 0}</Text>
				</Flex>
			</Flex>

			<Flex w={"full"} justify={"center"} gap={5}>
				<Flex w={"50%"}>
					<Button
						w={"full"}
						borderRadius={"100px"}
						border={"1px solid"}
						borderColor={"var(--black-b-200, #666"}
						background={"white"}
						onClick={() => setActive("Payment")}
					>
						Change Payment
					</Button>
				</Flex>

				<Flex w={"50%"}>
					<Button
						onClick={() => {
							setIsPayment(payment);
							setTransactionSuccess(true);
							setActive("PaymentSuccess");
						}}
						isDisabled={total > payment ? true : false}
						borderRadius={"100px"}
						background={"var(--brand-brand-500, #286043)"}
						color={"var(--black-b-0, #FFF)"}
						w={"full"}
					>
						Pay
					</Button>
				</Flex>
			</Flex>
		</Flex>
	);
};

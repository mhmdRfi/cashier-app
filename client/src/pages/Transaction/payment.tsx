/* eslint-disable @typescript-eslint/no-explicit-any */
import { Flex, Button } from "@chakra-ui/react";
import { IconChevronRight } from "@tabler/icons-react";
import { useState } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import { RootState } from "../../redux/store";
// import toRupiah from "@develoka/angka-rupiah-js";

export const Payment = ({
	setActive,
	total,
	setIsPayment,
	setTransactionSuccess,
	setCash,
}: any) => {
	const [isDisableButton, setIsDisableButton] = useState<any>(true);

	return (
		<Flex
			direction={"column"}
			justify={"space-between"}
			h={"100%"}
			gap={{ base: 10, lg: 0 }}
		>
			<Flex w={"full"} gap={"30px"} direction={"column"}>
				<Button
					display="flex"
					padding="32px"
					justifyContent="space-between"
					alignItems="center"
					alignSelf="stretch"
					borderRadius="16px"
					border="1px solid var(--black-b-30, #EBEBEB)"
					background="var(--black-b-0, #FFF)"
					w={"full"}
					cursor={"pointer"}
					onClick={() => {
						setActive("Cash"), setCash(true);
					}}
				>
					Cash
					<IconChevronRight />
				</Button>
				<Button
					display="flex"
					padding="32px"
					justifyContent="space-between"
					alignItems="center"
					alignSelf="stretch"
					borderRadius="16px"
					border="1px solid var(--black-b-30, #EBEBEB)"
					background="var(--black-b-0, #FFF)"
					w={"full"}
					cursor={"pointer"}
					_focus={{
						border: "1px solid",
						borderColor: "var(--brand-brand-500, #286043)",
						background: "var(--semantic-success-success-50, #EAF6EB)",
					}}
					onClick={() => {
						setIsDisableButton(false),
							setIsPayment(total),
							setCash(false);
					}}
				>
					EDC
					<IconChevronRight />
				</Button>
				<Button
					display="flex"
					padding="32px"
					justifyContent="space-between"
					alignItems="center"
					alignSelf="stretch"
					borderRadius="16px"
					border="1px solid var(--black-b-30, #EBEBEB)"
					background="var(--black-b-0, #FFF)"
					w={"full"}
					cursor={"pointer"}
					_focus={{
						border: "1px solid",
						borderColor: "var(--brand-brand-500, #286043)",
						background: "var(--semantic-success-success-50, #EAF6EB)",
					}}
					onClick={() => {
						setIsDisableButton(false),
							setIsPayment(total),
							setCash(false);
					}}
				>
					E-wallet
					<IconChevronRight />
				</Button>
				<Button
					display="flex"
					padding="32px"
					justifyContent="space-between"
					alignItems="center"
					alignSelf="stretch"
					borderRadius="16px"
					border="1px solid var(--black-b-30, #EBEBEB)"
					background="var(--black-b-0, #FFF)"
					w={"full"}
					cursor={"pointer"}
					_focus={{
						border: "1px solid",
						borderColor: "var(--brand-brand-500, #286043)",
						background: "var(--semantic-success-success-50, #EAF6EB)",
					}}
					onClick={() => {
						setIsDisableButton(false),
							setIsPayment(total),
							setCash(false);
					}}
				>
					Starbucks
					<IconChevronRight />
				</Button>
				<Button
					display="flex"
					padding="32px"
					justifyContent="space-between"
					alignItems="center"
					alignSelf="stretch"
					borderRadius="16px"
					border="1px solid var(--black-b-30, #EBEBEB)"
					background="var(--black-b-0, #FFF)"
					w={"full"}
					cursor={"pointer"}
					_focus={{
						border: "1px solid",
						borderColor: "var(--brand-brand-500, #286043)",
						background: "var(--semantic-success-success-50, #EAF6EB)",
					}}
					onClick={() => {
							setActive("Qris"),
							setCash(true);
					}}
				>
					Qris
					<IconChevronRight />
				</Button>
			</Flex>

			<Button
				isDisabled={isDisableButton}
				onClick={() => {
					setTransactionSuccess(true);
				}}
				borderRadius={"100px"}
				background={"var(--black-b-30, #EBEBEB)"}
			>
				Pay
			</Button>
		</Flex>
	);
};

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Flex, Button } from "@chakra-ui/react";
import { QRCodeSVG } from "qrcode.react";

export const QrisPayment = ({
	name,
	codeTransaction,
	setTransactionSuccess,
  setActive
}: any) => {
	return (
		<Flex direction={"column"} justify={"space-between"} h={"full"} >
			<Flex w={"full"} justify={"center"} align={"center"} mt={"50px"}>
				<QRCodeSVG
					size={300}
					value={`${name}-SBX${codeTransaction}-${Date.now()}`}
          fgColor={"rgba(40, 96, 67, 1)"}
				/>
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
							setTransactionSuccess(true)
						}}
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

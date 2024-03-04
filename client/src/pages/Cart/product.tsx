/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Text, Flex, Image, Button } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import toRupiah from "@develoka/angka-rupiah-js";
import {
	decrement,
	increment,
	removeAllFromCart,
	removeFromCart,
} from "../../redux/reducer/transactionReducer";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
	IconTrash,
	IconSquareRoundedPlus,
	IconSquareRoundedMinus,
} from "@tabler/icons-react";

export const Product = ({ name, codeTransaction }: any) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const products = useSelector(
		(state: RootState) => state.CartReducer.products
	);
	const totalPrice = useSelector(
		(state: RootState) => state.CartReducer.totalPrice
	);

	const handleIncrement = (productId: number) => {
		dispatch(increment(productId));
	};
	const handleDecrement = (productId: number) => {
		dispatch(decrement(productId));
	};
	const handleRemove = (productId: number) => {
		dispatch(removeFromCart(productId));
	};

	return (
		<Box
			display={"flex"}
			flexDirection={"column"}
			h={"full"}
			w={"full"}
		>
			{/* Product */}
			<Flex
				h={{ base: "320px", sm: "full", lg: "260px" }}
				overflowX={"auto"}
				sx={{
					"::-webkit-scrollbar": {
						width: "2px",
					},
				}}
				direction={"column"}
				gap={{ base: 5, lg: 0 }}
			>
				{products?.map((items, index) => {
					return (
						<Box
							key={index}
							display={"flex"}
							h={"fit-content"}
							justifyContent={"space-between"}
							flexDirection={"column"}
							justifyItems={"center"}
						>
							<Flex align={"center"} h={"fit-content"} w={"full"}>
								{/* Image */}
								<Flex
									align={"center"}
									w={"130px"}
									h={{ sm: "fit-content", lg: "110px" }}
								>
									<Image
										src={`${
											import.meta.env.VITE_APP_IMAGE_URL
										}/products/${
											items?.image ||
											"product_ChocolateCreamColdBrew.jpg"
										}`}
										minW={{ base: "60px", sm: "70px", xl: "80px" }}
										h={{ base: "60px", sm: "70px", xl: "80px" }}
										borderRadius={"16px"}
									/>
								</Flex>

								{/* Text */}
								<Flex
									direction={"column"}
									w={"full"}
									gap={{ base: 2, lg: 5 }}
								>
									<Flex
										w={"full"}
										justify={"space-between"}
										gap={{ sm: 1, lg: "15px" }}
										direction={{ sm: "column", lg: "row" }}
									>
										<Flex
											justify={"space-between"}
											gap={2}
											align={"center"}
											w={"full"}
										>
											<Text
												fontWeight={600}
												fontSize={{ base: "12px", xl: "16px" }}
												lineHeight={{ base: "12px", xl: "18px" }}
												m={0}
												maxH={{ sm: "24px", xl: "36px" }}
												maxW={"130px"}
												display={"flex"}
												alignItems={"flex-start"}
												overflow={"hidden"}
											>
												{items.name}
											</Text>
											<Text
												fontWeight={600}
												fontSize={{ base: "12px", xl: "16px" }}
												m={0}
												display={"flex"}
												alignItems={"flex-start"}
											>
												({items.total}x)
											</Text>
										</Flex>
										<Flex align={"center"}>
											<Text fontSize={{ base: "10px", xl: "14px" }}>
												{toRupiah(items.initialPrice || items.price)}
											</Text>
										</Flex>
									</Flex>
									<Flex gap={3} h={"fit-content"} justify={"end"}>
										<Button
											size={"xm"}
											w={{ base: "20px", lg: "30px" }}
											h={{ base: "20px", lg: "30px" }}
											borderRadius={"50%"}
											bgColor={"transparent"}
											_hover={{ bgColor: "transparetn" }}
											onClick={() => handleDecrement(items.id)}
										>
											<IconSquareRoundedMinus
												size={"32px"}
												stroke={1}
											/>
										</Button>
										<Text fontSize={{ base: "12px", xl: "16px" }}>
											{items.total}
										</Text>
										<Button
											size={"xm"}
											w={{ base: "20px", lg: "30px" }}
											h={{ base: "20px", lg: "30px" }}
											borderRadius={"50%"}
											bgColor={"transparent"}
											_hover={{ bgColor: "transparetn" }}
											onClick={() => handleIncrement(items.id)}
										>
											<IconSquareRoundedPlus
												size={"32px"}
												stroke={1}
											/>
										</Button>
										<Button
											size={"xm"}
											w={{ base: "20px", lg: "30px" }}
											h={{ base: "20px", lg: "30px" }}
											borderRadius={"50%"}
											bgColor={"transparent"}
											_hover={{ bgColor: "transparetn" }}
											onClick={() => handleRemove(items.id)}
										>
											<IconTrash color="red" />
										</Button>
									</Flex>
								</Flex>
							</Flex>
						</Box>
					);
				})}
			</Flex>

			{/* Button */}
			<Flex direction={"column"} gap={"10px"}>
				<Flex justify={"end"} alignItems={"end"}>
					{toRupiah(totalPrice)}
				</Flex>
				<Flex gap={5}>
					<Button
						w={"full"}
						h={"full"}
						p={"14px 30px 12px 28px"}
						borderRadius={"100px"}
						border={"1px solid"}
						bgColor={"transparent"}
						borderColor={" var(--black-b-200, #666)"}
						isDisabled={products.length == 0 ? true : false}
						onClick={() => dispatch(removeAllFromCart())}
					>
						Cancel
					</Button>
					<Button
						w={"full"}
						h={"full"}
						p={"14px 30px 12px 28px"}
						borderRadius={"100px"}
						background={"var(--brand-brand-500, #286043)"}
						color={"var(--black-b-0, #FFF)"}
						isDisabled={products.length == 0 ? true : false}
						onClick={() =>
							navigate("/transaction", {
								state: {
									name: name,
									transactionCode: codeTransaction,
								},
							})
						}
					>
						Order
					</Button>
				</Flex>
			</Flex>
		</Box>
	);
};

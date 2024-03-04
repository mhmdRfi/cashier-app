import {
	Flex,
	Box,
	Button,
	Drawer,
	DrawerContent,
	DrawerBody,
	useDisclosure,
} from "@chakra-ui/react";

import { Navbar } from "../../components/navbar";
import { Cart } from "../Cart";
import { Promo } from "./promo";
import { Category } from "./category";
import { useState } from "react";
import { IconShoppingCart } from "@tabler/icons-react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

export const Home: React.FC = () => {
	const [productName, setProductName] = useState<string>();
	const { isOpen, onOpen, onClose } = useDisclosure();

	const countCart = useSelector(
		(state: RootState) => state.CartReducer.countCart
	);
	console.log(countCart);

	return (
		<Flex
			maxW={"100vw"}
			minH={"100vh"}
			bgColor={"var(--black-b-10, #FAFAFA)"}
			overflowY={"hidden"}
		>
			<Flex
				w={{ base: "100%", md: "65%", lg: "68%" }}
				direction={"column"}
				py={{ base: "10px", sm: "32px" }}
			>
				<Navbar setProductName={setProductName} />
				<Flex
					direction={"column"}
					w={"full"}
					align={"center"}
					justify={"center"}
					gap={"40px"}
					px={"10px"}
				>
					<Promo />
					<Category productName={productName} />
				</Flex>
			</Flex>

			<Flex
				w={{ md: "35%", lg: "32%" }}
				position={"fixed"}
				right={0}
				display={{ base: "none", md: "block" }}
				h={"100%"}
			>
				<Cart />
			</Flex>

			<Box
				position={"fixed"}
				right={5}
				bottom={5}
				display={{ base: "flex", sm: "none" }}
			>
				<Button
					colorScheme="teal"
					onClick={onOpen}
					size={"xm"}
					w={"50px"}
					h={"50px"}
				>
					<IconShoppingCart />
					<Flex
						position={"absolute"}
						w={"25px"}
						h={"25px"}
						borderRadius={"50%"}
						align={"center"}
						justify={"center"}
						bgColor={"red"}
						right={"-2"}
						top={"-2"}
					>
						{countCart}
					</Flex>
				</Button>

				<Drawer isOpen={isOpen} onClose={onClose}>
					<DrawerContent>
						<DrawerBody>
							<Cart />
						</DrawerBody>
					</DrawerContent>
				</Drawer>
			</Box>
		</Flex>
	);
};

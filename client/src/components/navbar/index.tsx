
import {
	Flex,
	Image,
	InputGroup,
	InputLeftElement,
	Input,
} from "@chakra-ui/react";
import Logo from "../../assets/ee8e2ef267a626690ecec7c84a48cfd4.png";
import { IconSearch } from "@tabler/icons-react";
import { Profile } from "./profile";

export const Navbar = ({ setProductName }: any) => {
	return (
		<Flex
			justify={"space-around"}
			align={"center"}
			pl={{ sm: "20px", lg: "40px" }}
			pr={{ sm: "20px", lg: "80px" }}
		>
			<Flex
				gap={"16px"}
				align={"center"}
				justify={"space-between"}
				h={"100%"}
				mx={{ base: 5, lg: 42 }}
				w={"full"}
			>
				<Flex align={"center"} w={"72px"} h={"72.9px"}>
					<Image src={Logo} />
				</Flex>

				<InputGroup w={"full"}>
					<InputLeftElement
						pointerEvents="none"
						alignItems={"center"}
						display={"flex"}
						h={"100%"}
						pl={"20px"}
					>
						<IconSearch
							color="#858585"
							stroke={1.5}
							width={24}
							height={24}
						/>
					</InputLeftElement>
					<Input
						type="search"
						placeholder="Search"
						display={"flex"}
						alignItems={"center"}
						h={{ base: "40px", lg: "56px" }}
						maxW={"581px"}
						borderRadius={" 200px"}
						border="1px solid var(--black-b-200, #666)"
						// font-family="SoDo Sans"
						pl={"50px"}
						onChange={(e) => setProductName(e.target.value)}
					/>
				</InputGroup>
			</Flex>
			<Flex>
				<Profile />
			</Flex>
		</Flex>
	);
};

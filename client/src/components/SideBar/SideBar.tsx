import React from "react";
import {
	IconButton,
	Avatar,
	Box,
	CloseButton,
	Flex,
	HStack,
	VStack,
	Icon,
	useColorModeValue,
	Text,
	Drawer,
	DrawerContent,
	useDisclosure,
	BoxProps,
	FlexProps,
	Menu,
	MenuButton,
	MenuDivider,
	MenuItem,
	MenuList,
	Image,
} from "@chakra-ui/react";
import {

	FiMenu,
	FiBell,
	FiChevronDown,

} from "react-icons/fi";
import { IconType } from "react-icons";
import {
	IconLayoutDashboard,
	IconPasswordUser,
	IconCup,
	IconReportMoney,
	IconUsers,
	IconHierarchy2,
} from "@tabler/icons-react";
import LogoIcon from "../../assets/ee8e2ef267a626690ecec7c84a48cfd4.png";
import { useAppSelector } from "../../redux/hook";
import { useAppDispatch } from "../../redux/hook";
import { useNavigate } from "react-router-dom";
import { logoutSuccess } from "../../redux/reducer/authReducer";
import { useLocation, Link } from "react-router-dom";

interface LinkItemProps {
	name: string;
	icon: IconType;
	to: string;
}
interface NavItemProps {
	children: React.ReactNode;
	key: string;
	icon: IconType;
	to: string; // Ensure 'to' property is present
  }

interface MobileProps extends FlexProps {
	onOpen: () => void;
}

interface SidebarProps extends BoxProps {
	onClose: () => void;
}

const LinkItems: Array<LinkItemProps> = [
	{
		name: "Dashboard",
		icon: IconLayoutDashboard,
		to: "/dashboard-admin",
	},
	{ name: "Product", icon: IconCup, to: "/product-lists" },
	{ name: "Report", icon: IconReportMoney, to: "/report" },
	{ name: "Category", icon: IconHierarchy2, to: "/category-lists" },
	{ name: "Cashier", icon: IconUsers, to: "/cashier" },
	{ name: "Admin", icon: IconPasswordUser, to: "/cashier-data" },
];

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
	return (
		<Box
			transition="3s ease"
			bg={useColorModeValue("white", "gray.900")}
			borderRight="1px"
			borderRightColor={useColorModeValue("gray.200", "gray.700")}
			w={{ base: "full", md: 40 }}
			pos="fixed"
			h="full"
			{...rest}
		>
			<Flex justifyContent={"flex-end"}>
				<CloseButton
					display={{ base: "flex", md: "none" }}
					onClick={onClose}
					margin={"20px 20px"}
				/>
			</Flex>

			<Flex h="20" alignItems="center" justifyContent="space-between">
				<Image src={LogoIcon} margin={"auto"} boxSize={"72px"} />
			</Flex>

			{LinkItems.map((link) => (
				<NavItem key={link.name} icon={link.icon} to={link.to}>
					{link.name}
				</NavItem>
			))}
		</Box>
	);
};

const NavItem = ({ icon, children, to, ...rest }: NavItemProps) => {
	const location = useLocation();
	const isActive = location.pathname === to;
	return (
		<Link to={to} style={{ textDecoration: "none" }}>
			<Box
				// as="a"
				// href="#"
				style={{ textDecoration: "none" }}
				_focus={{ boxShadow: "none" }}
				padding={"16px"}
			>
				<Flex
					className="nav-item-container"
					align="center"
					p="2"
					margin={isActive ? "0 16px": "0 auto"}
					flexDirection={"column"}
					borderRadius="lg"
					role="group"
					cursor="pointer"
					_hover={{
						bg: "#EAEFEC",
						color: "#286043",
						margin: "0 16px",
					}}
					{...rest}
					bg={isActive ? "#EAEFEC" : ""}
					color={isActive ? "#286043" : ""}
				>
					{icon && (
						<Icon
							mb="3"
							fontSize="24px"
							stroke={"1px"}
							_groupHover={{
								color: "#286043",
							}}
							as={icon}
						/>
					)}
					<Box className="name-container" fontSize={"14px"}>
						{children}
					</Box>
				</Flex>
			</Box>
		</Link>
	);
};

const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { user } = useAppSelector((state) => state.authReducer);
	return (
		<Flex
			className="mobile-nav-container"
			ml={{ base: 0, md: 0 }}
			px={{ base: 4, md: 4 }}
			height="20"
			alignItems="center"
			bg={useColorModeValue("white", "gray.900")}
			borderBottomWidth="1px"
			borderBottomColor={useColorModeValue("gray.200", "gray.700")}
			justifyContent={{ base: "space-between", md: "flex-end" }}
			{...rest}
		>
			<IconButton
				display={{ base: "flex", md: "none" }}
				onClick={onOpen}
				variant="outline"
				aria-label="open menu"
				icon={<FiMenu />}
			/>
			<Flex
				alignItems={"center"}
				gap={"10px"}
				display={{ base: "flex", md: "none" }}
				flexDirection={"row"}
			>
				<Image src={LogoIcon} boxSize={"29px"} />
				<Text fontSize={"22px"} fontWeight={"800"} color={"#286043"}>
					Starbucks
				</Text>
			</Flex>

			<HStack
				className="navTop"
				spacing={{ base: "0", md: "6" }}
				marginRight={{ base: "0", md: "60px" }}
			>
				<IconButton
					size="lg"
					variant="ghost"
					aria-label="open menu"
					icon={<FiBell />}
				/>
				<Flex alignItems={"center"}>
					<Menu>
						<MenuButton
							py={2}
							transition="all 0.3s"
							_focus={{ boxShadow: "none", borderColor: "transparent", outlineColor: "transparent" }}
              _hover={{borderColor: "transparent"}}
						>
							<HStack>
								{user?.avatar ? (
									<Avatar
										name={user.username}
										src={`${
											import.meta.env.VITE_APP_IMAGE_URL
										}/avatar/${user?.avatar}`}
										w={"56px"}
										h={"56px"}
									/>
								) : (
									<Avatar
										name={user.username}
										bg="rgba(40, 96, 67, 1)"
										src={"https://bit.ly/broken-link"}
										w={"56px"}
										h={"56px"}
										color={"white"}
									/>
								)}
								<VStack
									display={{ base: "none", md: "flex" }}
									alignItems="flex-start"
									spacing="1px"
									ml="2"
								>
									<Text fontSize="sm">{user.username}</Text>
									<Text fontSize="xs" color="gray.600">
										{user.roleId == 1? "Admin": "Cashier"}
									</Text>
								</VStack>
								<Box display={{ base: "none", md: "flex" }}>
									<FiChevronDown />
								</Box>
							</HStack>
						</MenuButton>
						<MenuList
							bg={useColorModeValue("white", "gray.900")}
							borderColor={useColorModeValue("gray.200", "gray.700")}
						>
							<MenuItem>Profile</MenuItem>
							<MenuItem>Settings</MenuItem>
							<MenuItem>Billing</MenuItem>
							<MenuDivider />
							<MenuItem onClick={() => {dispatch(logoutSuccess()); navigate("/")}}>Sign out</MenuItem>
						</MenuList>
					</Menu>
				</Flex>
			</HStack>
		</Flex>
	);
};

const SidebarWithHeader = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();

	return (
		<>
			<SidebarContent
				onClose={onClose}
				display={{ base: "none", md: "block" }}
			/>
			<Drawer
				isOpen={isOpen}
				placement="left"
				onClose={onClose}
				returnFocusOnClose={false}
				onOverlayClick={onClose}
				size="xs"
			>
				<DrawerContent>
					<SidebarContent onClose={onClose} />
				</DrawerContent>
			</Drawer>
			{/* mobilenav */}
			<MobileNav onOpen={onOpen} />
		</>
	);
};

export { SidebarWithHeader };

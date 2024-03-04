/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalBody,
	useDisclosure,
	Button,
	Text,
	Avatar,
	Box,
	Flex,
	Card,
	Input,
	useToast,
} from "@chakra-ui/react";

import { RootState } from "../../redux/store";
import { useAppDispatch } from "../../redux/hook";
import {
	keepLogin,
	logoutSuccess,
} from "../../redux/reducer/authReducer";
import { removeAllFromCart } from "../../redux/reducer/transactionReducer";
import { useNavigate } from "react-router";
import { useState } from "react";
import {
	IconLogout2,
	IconHome,
	IconSettings,
	IconEditCircle,
} from "@tabler/icons-react";
import axios from "axios";
import ChangePassword from "../../pages/ForgotPassword/UpdatePassword";
import { useSelector } from "react-redux";

export const Profile = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const user = useSelector(
		(state: RootState) => state.authReducer.user
	);
	const [selectedImage, setSelectedImage] = useState<any>("");

	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const toast = useToast();

	const updateAvatar = async (selectedImage: string) => {
		try {
			const formData = new FormData();
			formData.append("avatar", selectedImage);
			await axios.patch(
				`${
					import.meta.env.VITE_APP_API_BASE_URL
				}/user/upload-avatar/${user.id}`,
				formData
			);
			dispatch(keepLogin());

			toast({
				title: "Change image success",
				status: "success",
			});
		} catch (err: any) {
			toast({
				title: err.response?.data,
				status: "error",
			});
			console.log(err);
		}
	};

	return (
		<>
			{/* Buton for Open Mondal Profile */}
			<Button
				w={"fit-content"}
				h={"fit-content"}
				display={"flex"}
				justifyContent={"center"}
				alignItems={"center"}
				onClick={onOpen}
				gap={"16px"}
				bgColor={"transparent"}
				_hover={{
					bgColor: "transparent",
					borderColor: "transparent",
				}}
				_focus={{
					boxShadow: "none",
					borderColor: "transparent",
					outlineColor: "transparent",
				}}
			>
				<Flex
					w={"56px"}
					h={"56px"}
					borderRadius={"100%"}
					overflow={"hidden"}
				>
					{user?.avatar ? (
						<Avatar
							name="Dan Abrahmov"
							src={`${import.meta.env.VITE_APP_IMAGE_URL}/avatar/${
								user?.avatar
							}`}
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
				</Flex>
				<Box
					display={{ base: "none", sm: "flex" }}
					flexDirection={"column"}
					gap={"8px"}
				>
					<Text
						m={0}
						fontSize={{ sm: "12px", lg: "14px", xl: "16px" }}
					>
						{user.username}
					</Text>
					<Text
						m={0}
						fontSize={{ sm: "10px", lg: "12px", xl: "14px" }}
						color="var(--black-b-70, #A3A3A3)"
						display={"flex"}
						justifyContent={"start"}
					>
						{user.roleId == 2 ? "Cashier" : "Admin"}
					</Text>
				</Box>
			</Button>

			{/* Modal for Profile */}
			<Modal isOpen={isOpen} onClose={onClose} isCentered>
				<ModalOverlay />
				<ModalContent
					p={"40px 20px"}
					w={"350px"}
					background={"var(--black-b-10, #FAFAFA)"}
					borderRadius={"16px"}
				>
					<ModalBody>
						<Flex
							justify={"center"}
							align={"center"}
							direction={"column"}
							gap={"20px"}
						>
							{/* Avatar */}
							<Flex
								w={"86px"}
								h={"86px"}
								borderRadius={"100%"}
								overflow={"hidden"}
							>
								{/* Icon Editable */}
								<Flex
									position={"absolute"}
									zIndex={10}
									top={100}
									right={130}
									bgColor={"white"}
									borderRadius={"100%"}
									p={"2px"}
									align={"center"}
									justify={"center"}
									cursor={"pointer"}
								>
									<IconEditCircle
										color="rgba(40, 96, 67, 1)"
										size={"22px"}
									/>
								</Flex>

								{/* Selected Image */}
								{selectedImage ? (
									<Avatar
										name="Dan Abrahmov"
										src={URL.createObjectURL(selectedImage)}
										w={"full"}
										h={"full"}
									/>
								) : user?.avatar ? (
									<Avatar
										name="Dan Abrahmov"
										src={`${
											import.meta.env.VITE_APP_IMAGE_URL
										}/avatar/${user?.avatar}`}
										w={"full"}
										h={"full"}
									/>
								) : (
									<Avatar
										name="Dan Abrahmov"
										bg="rgba(40, 96, 67, 1)"
										src={"https://bit.ly/broken-link"}
										w={"full"}
										h={"full"}
										color={"white"}
									/>
								)}

								{/* Input for Image */}
								<Input
									type="file"
									w={"86px"}
									h={"86px"}
									position="absolute"
									opacity="0"
									zIndex={10}
									borderRadius={"100%"}
									aria-hidden="true"
									accept="image/*"
									cursor={"pointer"}
									onChange={(event) => {
										event.currentTarget.files
											? setSelectedImage(
													event?.currentTarget?.files[0]
											  )
											: null;
									}}
								/>
							</Flex>

							{/* Button Save or Cancel for upload image */}
							{selectedImage ? (
								<Flex position={"absolute"} top={130}>
									<Button
										variant={"ghost"}
										fontSize={"12px"}
										size={"sm"}
										_hover={{ bgColor: "transparent" }}
										onClick={() => setSelectedImage("")}
									>
										Cancel
									</Button>
									<Button
										variant={"ghost"}
										fontSize={"12px"}
										size={"sm"}
										_hover={{ bgColor: "transparent" }}
										onClick={() => {
											updateAvatar(selectedImage),
												setSelectedImage("");
										}}
									>
										Save
									</Button>
								</Flex>
							) : (
								<></>
							)}

							<Flex direction={"column"} w={"full"} gap={8}>
								{/* Username and Email */}
								<Flex
									direction={"column"}
									justify={"center"}
									align={"center"}
									gap={"10px"}
								>
									<Text>{user.username}</Text>
									<Flex
										bgColor={
											"var(--semantic-success-success-50, #EAF6EB)"
										}
										p={"4px 15px"}
										borderRadius={"100px"}
										align={"center"}
										justify={"center"}
									>
										<Text
											fontSize={"12px"}
											color={"rgba(40, 96, 67, 1)"}
										>
											{user.email}
										</Text>
									</Flex>
								</Flex>

								{/* Card For Setting, Change Password and Login */}
								<Card w={"full"}>
									<Flex direction={"column"} align={"start"}>
										<Button
											variant={"ghost"}
											justifyContent={"start"}
											fontWeight={400}
											w={"full"}
											display={user.roleId == 1 ? "flex" : "none"}
											alignItems={"center"}
											gap={3}
											borderRadius={0}
											_hover={{borderColor: "transparent"}}
											borderBottom={
												"2px solid rgba(245, 245, 245, 1)"
											}
											onClick={() => navigate("/dashboard-admin")}
										>
											<IconHome
												stroke={1.5}
												size={"20px"}
												color="rgba(40, 96, 67, 1)"
											/>
											Dashboard
										</Button>
										<Button
											variant={"ghost"}
											justifyContent={"start"}
											fontWeight={400}
											w={"full"}
											display={"flex"}
											alignItems={"center"}
											gap={3}
											borderRadius={0}
											borderBottom={
												"2px solid rgba(245, 245, 245, 1)"
											}
											_hover={{borderColor: "transparent"}}
										>
											<IconSettings
												stroke={1.5}
												size={"20px"}
												color="rgba(40, 96, 67, 1)"
											/>
											Settings
										</Button>
										<ChangePassword />

										<Button
											variant={"ghost"}
											justifyContent={"start"}
											w={"full"}
											display={"flex"}
											gap={3}
											alignItems={"center"}
											color={"#FF0000"}
											borderRadius={0}
											borderBottom={
												"2px solid rgba(245, 245, 245, 1)"
											}
											_hover={{borderColor: "transparent"}}
											onClick={() => {
												dispatch(logoutSuccess()),
													navigate("/"),
													dispatch(removeAllFromCart());
											}}
										>
											<IconLogout2 size={"20px"} color="#FF0000" />
											LogOut
										</Button>
									</Flex>
								</Card>
							</Flex>
						</Flex>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};

import {
	Button,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
	InputGroup,
	InputRightElement,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
} from "@chakra-ui/react";
import axios from "axios";
import { useFormik } from "formik";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useState } from "react";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { RootState } from "../../redux/store";
import { IconPassword } from "@tabler/icons-react";
import { useDisclosure } from "@chakra-ui/react";
import { useSelector } from "react-redux";

const PasswordSchema = Yup.object().shape({
	password: Yup.string()
		.required("Please Enter your password")
		.test(
			"regex",
			"Password must be min 8 characters, and have 1 Special Character, 1 Uppercase, 1 Number and 1 Lowercase",
			(val) => {
				const regExp = new RegExp(
					"^(?=.*\\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$"
				);
				console.log(regExp.test(val), regExp, val);
				return regExp.test(val);
			}
		),
	confirmationPassword: Yup.string().test(
		"passwords-match",
		"Passwords must match",
		function (value) {
			return this.parent.password === value;
		}
	),
});

function ChangePassword() {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [showPassword, setShowPassword] = useState(false);
	const user = useSelector(
		(state: RootState) => state.authReducer.user
	);
	const forgotPassword = async (password: string) => {
		try {
			await axios.patch(
				`${import.meta.env.VITE_APP_API_BASE_URL}/auth/update-password/${user.id}`,
				{
					password,
				}
			);
			toast.success("Password is reset successfully");
			onClose();
		} catch (err) {
			console.log(err);
			toast.error("password reset has failed");
		}
	};

	const formik = useFormik({
		initialValues: {
			password: "",
			confirmationPassword: "",
		},

		validationSchema: PasswordSchema,
		onSubmit: (values, { resetForm }) => {
			forgotPassword(values.password);
			resetForm({
				values: { password: "", confirmationPassword: "" },
			});
		},
	});

	return (
		<Button
			variant={"ghost"}
			justifyContent={"start"}
			fontWeight={400}
			w={"full"}
			display={"flex"}
			alignItems={"center"}
			gap={3}
			borderRadius={0}
			borderBottom={"2px solid rgba(245, 245, 245, 1)"}
			onClick={onOpen}
      _hover={{borderColor: "transparent"}}
		>
			<IconPassword
				stroke={1.5}
				size={"20px"}
				color="rgba(40, 96, 67, 1)"
			/>
			Change Password
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<form onSubmit={formik.handleSubmit}>
					<ModalContent>
						<ModalCloseButton />
						<ModalBody pb={6}>
							<FormControl
								isInvalid={
									!!formik.touched.password &&
									!!formik.errors.password
								}
								marginBottom={"20px"}
								marginTop={"30px"}
							>
								<FormLabel
									fontSize={"14px"}
									color={"gray"}
									marginBottom={"10px"}
								>
									Password
								</FormLabel>
								<InputGroup>
									<Input
										type={showPassword ? "text" : "password"}
										name="password"
										value={formik.values.password}
										onChange={formik.handleChange}
										required
										placeholder="enter password"
										width={"100%"}
										padding={"12px 20px"}
										border={"1px solid #6666"}
										borderRadius={"100px"}
										fontSize={"16px"}
									/>
									<InputRightElement>
										<Button
											variant={"ghost"}
											onClick={() =>
												setShowPassword(
													(showPassword) => !showPassword
												)
											}
											backgroundColor={"transparent"}
										>
											{showPassword ? <ViewIcon /> : <ViewOffIcon />}
										</Button>
									</InputRightElement>
								</InputGroup>
								{formik.touched.password &&
									formik.errors.password && (
										<FormErrorMessage>
											{formik.errors.password}
										</FormErrorMessage>
									)}
							</FormControl>
							<FormControl
								isInvalid={
									!!formik.touched.confirmationPassword &&
									!!formik.errors.confirmationPassword
								}
								marginBottom={"30px"}
							>
								<FormLabel
									fontSize={"14px"}
									color={"gray"}
									marginBottom={"10px"}
								>
									Confirmation Password
								</FormLabel>
								<InputGroup>
									<Input
										type={showPassword ? "text" : "password"}
										onChange={formik.handleChange}
										name="confirmationPassword"
										placeholder="confirm your password"
										width={"100%"}
										padding={"12px 20px"}
										border={"1px solid #6666"}
										borderRadius={"100px"}
										fontSize={"16px"}
									/>
									<InputRightElement h={"full"}>
										<Button
											variant={"ghost"}
											onClick={() =>
												setShowPassword(
													(showPassword) => !showPassword
												)
											}
										>
											{showPassword ? <ViewIcon /> : <ViewOffIcon />}
										</Button>
									</InputRightElement>
								</InputGroup>
								{formik.touched.confirmationPassword &&
									formik.errors.confirmationPassword && (
										<FormErrorMessage>
											{formik.errors.confirmationPassword}
										</FormErrorMessage>
									)}
							</FormControl>
						</ModalBody>
						<ModalFooter
							display={"flex"}
							gap={"10px"}
							alignContent={"center"}
						>
							<Button
								bg={"#286043"}
								color={"white"}
								_hover={{
									bg: "white",
									color: "#286043",
									border: "1px solid #286043",
								}}
								borderRadius={"100px"}
								type="submit"
							>
								Change Password
							</Button>
							<Button
								onClick={onClose}
								borderRadius={"100px"}
								color={"#286043"}
							>
								Cancel
							</Button>
						</ModalFooter>
					</ModalContent>
				</form>
			</Modal>
		</Button>
	);
}

export default ChangePassword;

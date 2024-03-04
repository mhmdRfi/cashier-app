import { AbsoluteCenter, Box, Button, FormControl, 
    FormErrorMessage, 
    FormLabel, Input, Image, Text, InputGroup, InputRightElement} from "@chakra-ui/react";
import axios from "axios";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import background from "../../assets/coffee.jpg"
import logo from "../../assets/ee8e2ef267a626690ecec7c84a48cfd4.png"
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useState } from "react";
import * as Yup from "yup";
import toast from "react-hot-toast";


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

function SetNewPassword() {
    const [showPassword, setShowPassword] = useState(false);
    function getQueryParam(param: string) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    const resetToken = getQueryParam('resetToken')

    const navigate = useNavigate();

    const forgotPassword = async (password: string,) => {
        if (resetToken === null) {
            toast.error("Invalid or missing reset token");
            return;
        }
        try{ 
          await axios.patch(`${import.meta.env.VITE_APP_API_BASE_URL}/auth/reset-password?resetToken=${encodeURIComponent(resetToken)}`, {
          password,
        });
        toast.success("Password is reset successfully")
        } catch (err){
          console.log(err)
          toast.error("password reset has failed")
        }
      };
    
      const formik = useFormik({
        initialValues:{
        password: "", 
        confirmationPassword: ""
        },
    
        validationSchema: PasswordSchema,
        onSubmit: (values, {resetForm}) => {
        forgotPassword(
          values.password, 
          )
          resetForm({values:{ password: "", confirmationPassword: ""} })
          navigate('/');
        }
      });


  return (
    <>
      <Box>
      <Box width={'100vw'}
      height={'100vh'}
      backgroundColor={'black'}
      position={'relative'}>
        <Box width={'100vw'}
        opacity={'0.5'}
        padding={'0'}
        backgroundImage={background}
        height={'100vh'}
        backgroundSize={"cover"}></Box>

        <AbsoluteCenter>
            <Box
            maxWidth={'500'}
            overflow={'hidden'}
            marginBottom={'30px'}>
                <Image src={logo} margin={'auto'} boxSize={'100px'}/>
            </Box>

            <Box boxShadow={'0px 1px 5px gray'}
            padding={'30px'}
            borderRadius={'10px'}
            alignItems={'center'}
            backgroundColor={'white'}
            width={{base: '300px', md:'400px'}}
            >
              <Text fontWeight={'bold'} fontSize={'24px'} textAlign={'center'}>Set New Password</Text>
        <form onSubmit={formik.handleSubmit}>
        <FormControl 
        isInvalid={
            !!formik.touched.password &&
            !!formik.errors.password}
            marginBottom={'20px'}
            marginTop={'30px'}>
                <FormLabel fontSize={'14px'} color={'gray'} marginBottom={'10px'}>Password</FormLabel>
                <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  required
                  placeholder='enter password'
                  width={'100%'}
                  padding={'12px 20px'}
                  border={'1px solid #6666'}
                  borderRadius={'100px'}
                  fontSize={'16px'}
                />
                <InputRightElement>
                    <Button
                      variant={"ghost"}
                      onClick={() =>
                        setShowPassword((showPassword) => !showPassword)
                      }
                      backgroundColor={'transparent'}
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
                  marginBottom={'30px'}>
                  <FormLabel fontSize={'14px'} color={'gray'} marginBottom={'10px'}>Confirmation Password</FormLabel>
                  <InputGroup>
                    <Input
                      type={showPassword ? "text" : "password"}
                      onChange={formik.handleChange}
                      name="confirmationPassword"
                      placeholder='confirm your password'
                    width={'100%'}
                    padding={'12px 20px'}
                    border={'1px solid #6666'}
                    borderRadius={'100px'}
                    fontSize={'16px'}
                    />
                    <InputRightElement h={"full"}>
                      <Button
                        variant={"ghost"}
                        onClick={() =>
                          setShowPassword((showPassword) => !showPassword)
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
            <Button
                  bg={"#286043"}
                  color={"white"}
                  _hover={{
                    bg: "white",
                    color: "#286043",
                  }}
                  borderRadius={'100px'}
                  type="submit"
                  width={'100%'}
                  marginBottom={'10px'}
                >
                  Reset Password
                </Button>
                <Link to="/" >
                <Text fontSize={'12px'} color={'blue.500'} marginBottom={'10px'} textAlign={'center'}>
                Back to login
                </Text>
                </Link>
        </form>
        </Box>
        </AbsoluteCenter>
      </Box>
    </Box>
    </>
  )
}

export default SetNewPassword


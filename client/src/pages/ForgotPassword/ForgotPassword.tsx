import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { Box, Button, FormControl, FormLabel, Input, InputGroup, Stack, Text, Image, AbsoluteCenter } from '@chakra-ui/react';
import background from "../../assets/coffee.jpg"
import logo from "../../assets/ee8e2ef267a626690ecec7c84a48cfd4.png"
import axios from "axios";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { BeatLoader } from "react-spinners";
import { useState, CSSProperties } from "react";

const EmailScheme = Yup.object().shape({
    email: Yup.string().email("email is invalid").required("email is required"),
  })

  const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "white",
  };

function ForgotPassword() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const forgotPassword = async (
        email: string,
      ) => {
        try{ 
          setLoading(true);
          const loadingToastId = toast.loading("Sending reset password link to your email")
          await axios.patch(`${import.meta.env.VITE_APP_API_BASE_URL}/auth/forgot-password`, {
          email,
        });
        setLoading(false);
        toast.success("Link to reset password has been sent to your email", {
          id: loadingToastId
        })
        navigate('/');
        } catch (err){
          console.log(err)
          toast.error("Email doesn't exist")
        }
      };


    
      const formik = useFormik({
        initialValues:{
        email: "", 
        },
    
        validationSchema: EmailScheme,
        onSubmit: (values, {resetForm}) => {
        forgotPassword(
          values.email, 
          )
          resetForm({values:{ email: ""} })
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
              <Text fontWeight={'bold'} fontSize={'24px'} textAlign={'center'}>Forgot Password</Text>
              <Text textAlign={'center'} fontSize={'12px'} color={'gray'} paddingTop={'0px'}>Input your email to reset your password.</Text>

        
        <form onSubmit={formik.handleSubmit}>
        <Stack spacing={4} marginTop={'20px'}>
              <FormControl id="email" marginBottom={'20px'}>
                <FormLabel fontSize={'14px'} color={'gray'} marginBottom={'10px'}>Email</FormLabel>
                <InputGroup>
                  <Input
                    name="email"
                    placeholder='enter email'
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    required
                    width={'100%'}
                    padding={'12px 20px'}
                    border={'1px solid #6666'}
                    borderRadius={'100px'}
                    fontSize={'16px'}/>
                </InputGroup>
              </FormControl>
              <Stack >
                {loading ?(
                <Button
                bg={"#286043"}
                color={"white"}
                borderRadius={'100px'}
                // isDisabled
              >
                <div className="sweet-loading">
              <BeatLoader
                color={"#ffffff"}
                loading={loading}
                cssOverride={override}
                size={20}
                aria-label="spiner"
                data-testid="loader"
              />
            </div>
              </Button>
              
                ):(
                  <Button
                  bg={"#286043"}
                  color={"white"}
                  _hover={{
                    bg: "white",
                    color: "#286043",
                    border: "1px solid #286043"
                  }}
                  borderRadius={'100px'}
                  type="submit"
                >
                  Send reset link
                </Button>
              
                
                )}
                <Link to="/" >
                <Text fontSize={'12px'} color={'blue.500'} marginBottom={'10px'} textAlign={'center'}>
                Back to login
                </Text>
                </Link>
                
              </Stack>
            </Stack>
        </form>
      </Box>

        </AbsoluteCenter>

          

        
      
      </Box>
    </Box>
    </>
  )
}

export default ForgotPassword
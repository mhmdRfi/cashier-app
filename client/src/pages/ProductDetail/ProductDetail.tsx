import { Box, Button, HStack, Spacer, Text, Image, VStack, Flex, FormLabel } from "@chakra-ui/react"
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react'
import {  useEffect, useState } from "react"
import axios from 'axios'
import { useNavigate, useParams } from "react-router-dom"
import { SidebarWithHeader } from '../../components/SideBar/SideBar'

function formatPriceToIDR(price: number) {
  // Use Intl.NumberFormat to format the number as IDR currency
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(price);
}

function capitalizeFirstLetter(str) {
  if (str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  return str; // return the unchanged string if it's undefined
}

const ProductDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const fetchData = async () => {
      try {
          const response = await axios.get(
              `${import.meta.env.VITE_APP_API_BASE_URL}/products/details-product/${id}`
          );

          setData(response?.data)
      } catch (err) {
          console.log(err);
      }
  }

  useEffect(() => {
      fetchData();
  }, [])

  return (
      <>
        <SidebarWithHeader />
    <Box width='98.7vw' height='fit-content' backgroundColor='#fbfaf9' p='50px'>
        <HStack ml={{md: '150px', sm: '0px'}} mb='10px'>
    <Button leftIcon={<IconArrowLeft />} borderRadius='full' backgroundColor='white' textColor='black' border='solid 1px black' onClick={() => navigate('/product-lists')}>Back</Button>
    <Spacer />
    <Button rightIcon={<IconArrowRight />} borderRadius='full' backgroundColor='#286043' textColor='white' border='solid 1px #286043' onClick={() => navigate(`/edit-product/${id}`)}>Edit Item</Button>
        </HStack>
        <Box ml={{md: '150px', sm: '0px'}} borderRadius='10px' p='20px' backgroundColor='white' boxShadow='0px 1px 5px gray'>
        <FormLabel>Product Information</FormLabel>

            <Box height='max-content' mb='100px'>
            <VStack>
           <Image
            src={`${import.meta.env.VITE_APP_API_BASE_URL}/uploads/products/${data.image}`}
            alt={`${data.name}`}
            boxSize="150px"
            objectFit="cover"
            borderRadius="10px"/> 
            <Box mt='-50px' mr='-90px'></Box>
    </VStack>
            </Box>

        <Flex columnGap='10px' mb='20px '>
            <Box width='50%'>
            <Text fontSize='large' fontWeight='bold'>Name</Text>
            <FormLabel>Product Name</FormLabel>
            <Text>{data.name}</Text>
            </Box>
            <Box pt='27px' width='50%'>
            <FormLabel>Product SKU</FormLabel>
            <Text>{data.sku}</Text>
            </Box>
            <Box pt='27px' width='50%'>
            <FormLabel>Status Product</FormLabel>
            <Text>{capitalizeFirstLetter(data?.status)}</Text>
            </Box>
        </Flex>
        <Flex columnGap='10px' mb='20px '>
            <Box width='50%'>
            <Text fontSize='large' fontWeight='bold'>Main Price</Text>
            <FormLabel>Price (after markup)</FormLabel>
            <Text>{formatPriceToIDR(data.price)}</Text>
            </Box>
            <Box pt='27px' width='50%'>
            <FormLabel>MarkUp Percentage</FormLabel>
            <Text>{data.markup}%</Text>
            </Box>
            <Box pt='27px' width='50%'>
            <FormLabel>Stock</FormLabel>
            <Text>{data.quantity}</Text>
            </Box>
        </Flex>
        <FormLabel>Description</FormLabel>
        <Text mb='20px'>{data.description}</Text>
        <Text fontSize='large' fontWeight='bold'>Category</Text>
        <Flex columnGap="10px" mb="20px ">
        {data?.categories?.map((item) => (
          <Box key={item.category.id} borderRadius="full" pl="10px" pr='10px' pt='5px' pb='5px' border="solid blue 1px" bgColor='blue.100'>
            <HStack>
              <Text color='blue'>{item.category.category}</Text>
            </HStack>
          </Box>
        ))}
      </Flex>
  
        </Box>
    </Box>
    </>
  )
}

export {ProductDetail}
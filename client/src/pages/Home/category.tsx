/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Flex,
  Text,
  Card,
  Image,
  Grid,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuOptionGroup,
  MenuDivider,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import toRupiah from '@develoka/angka-rupiah-js';
import axios from "axios";
import { addToCart } from "../../redux/reducer/transactionReducer";
import {
  IconSelector,
  IconSquareRoundedChevronRight,
  IconSquareRoundedChevronLeft,
} from "@tabler/icons-react";
import { useDispatch } from "react-redux";

interface Product {
  id: number;
  name: string;
  price: number;
  descriptrion: string;
  quantity: number;
}

export const Category = ({ productName }: any) => {
  const [product, setProduct] = useState<Product[] | null>(null);
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const [sortName, setSortName] = useState<string>("name");
  const [activeButton, setActiveButton] = useState<string>("All");
  const dispatch = useDispatch();
  const [page, setPage] = useState<number>(1);
  const [size] = useState<number>(window.innerWidth < 900 ? 12 : 9);
  const [category, setCatogory] = useState<number>();
  const [totalPage, setTotalPage] = useState<number>();

  const productPage = async (page: number, size: number, productName: string) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_APP_API_BASE_URL
        }/product/${page}/${size}?categoryId=${category}&sortName=${sortName}&sortOrder=${sortOrder}&productName=${
          productName || ""
        }`
      );
      setProduct(response.data.data.result);
      setTotalPage(response.data.data.totalPage);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    productPage(page, size, productName);
  }, [page, size, category, productName, sortName, sortOrder]);

  const buttonValue = ["All", "Beverages", "Food", "Bean", "Merchandise"];

  return (
    <Flex direction={"column"} gap={"24px"} w={"85%"}>
      <Text fontSize={"18px"} fontWeight={600}>
        Category
      </Text>
      <Flex gap={"16px"} justify={"space-between"} w={"full"}>
        <Grid
          display={{ base: "grid", sm: "flex" }}
          templateColumns={`repeat(3, 1fr)`}
          gap={{ base: "10px", lg: "16px" }}
          w={"full"}
        >
          {buttonValue?.map((Items, index) => {
            return (
              <Button
                key={index}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                fontSize={{ base: "10px", lg: "14px" }}
                fontWeight={400}
                p={{ sm: "8px 15px", lg: "14px 24px" }}
                cursor={"pointer"}
                borderRadius={{ base: "10px", lg: "100px" }}
                border={"1px solid var(--black-b-80, #949494)"}
                sx={
                  activeButton == Items
                    ? {
                        background: "var(--brand-brand-500, #286043)",
                        color: "var(--black-b-0, #FFF)",
                      }
                    : {
                        color: "var(--black-b-80, #949494)",
                        bgColor: "transparent",
                      }
                }
                onClick={() => {
                  setActiveButton(Items), setCatogory(index), setPage(1);
                }}
              >
                {Items}
              </Button>
            );
          })}
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<IconSelector stroke={1} width={"15px"} height={"15px"} />}
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              fontSize={{ base: "10px", lg: "14px" }}
              fontWeight={400}
              p={{ sm: "10px 20px", lg: "14px 24px" }}
              cursor={"pointer"}
              borderRadius={"100px"}
              border={"1px solid var(--black-b-80, #949494)"}
              sx={
                activeButton == "sort"
                  ? {
                      background: "var(--brand-brand-500, #286043)",
                      color: "var(--black-b-0, #FFF)",
                    }
                  : {
                      color: "var(--black-b-80, #949494)",
                      bgColor: "transparent",
                    }
              }
              _active={{
                background: "var(--brand-brand-500, #286043)",
                color: "var(--black-b-0, #FFF)",
              }}
              onClick={() => setActiveButton("sort")}
            >
              Sort
            </MenuButton>
            <MenuList minWidth="200px">
              <MenuOptionGroup title="Name">
                <MenuItem
                  value="asc"
                  onClick={() => {
                    setSortName("name"), setSortOrder("asc");
                  }}
                >
                  A-Z
                </MenuItem>
                <MenuItem
                  value="desc"
                  onClick={() => {
                    setSortName("name"), setSortOrder("desc");
                  }}
                >
                  Z-A
                </MenuItem>
              </MenuOptionGroup>
              <MenuDivider />
              <MenuOptionGroup title="Price">
                <MenuItem
                  value="Highest - Lowest"
                  onClick={() => {
                    setSortName("price"), setSortOrder("desc");
                  }}
                >
                  Highest - Lowest
                </MenuItem>
                <MenuItem
                  value="Lowest - Highest"
                  onClick={() => {
                    setSortName("price"), setSortOrder("asc");
                  }}
                >
                  Lowest - Highest
                </MenuItem>
              </MenuOptionGroup>
            </MenuList>
          </Menu>
        </Grid>
      </Flex>

      <Flex gap={5} justifyContent={"end"} align={"center"}>
        <Card
          bgColor={"white"}
          p={"5px 15px"}
          display={"flex"}
          flexDirection={"row"}
          borderRadius={"100px"}
          fontSize={{ base: "12px", lg: "14px" }}
          gap={1.5}
        >
          <Text>0{page}</Text>
          <Text position={"relative"} top={"-1px"}>
            /
          </Text>
          <Text>0{totalPage}</Text>
        </Card>
        <Flex gap={2}>
          <Button
            size={"xm"}
            cursor={"pointer"}
            isDisabled={page > 1 ? false : true}
            onClick={() => {
              setPage(page - 1);
            }}
            color={"rgba(40, 96, 67, 1)"}
            borderRadius={"10px"}
            bgColor={"transparent"}
          >
            <IconSquareRoundedChevronLeft size={"32px"} stroke={1} />
          </Button>
          <Button
            size={"xm"}
            cursor={"pointer"}
            isDisabled={page < Number(totalPage) ? false : true}
            onClick={() => {
              setPage(page + 1);
            }}
            color={"rgba(40, 96, 67, 1)"}
            borderRadius={"10px"}
            bgColor={"transparent"}
          >
            <IconSquareRoundedChevronRight stroke={1} size={"32px"} />
          </Button>
        </Flex>
      </Flex>

      <Flex>
        <Flex color={"black"} w={"fit-content"}>
          <Grid
            // mx={"20px"}
            templateColumns={{
              base: "repeat(2, 1fr)",
              sm: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            }}
            alignItems={"flex-start"}
            alignSelf={"stretch"}
            gap={"24px"}
            h={"fit-content"}
          >
            {product?.map((items: any, index) => {
              return (
                <Card
                  key={index}
                  bgColor={"white"}
                  display={"flex"}
                  gap={{ base: 0, sm: "20px" }}
                  p={{ sm: "14px", lg: "24px" }}
                  flexDirection={{ base: "column", sm: "row" }}
                  borderRadius={"16px"}
                  onClick={() => {
                    items.quantity > 0 ? dispatch(addToCart(items)) : null;
                  }}
                  sx={items.quantity <= 0 ? { filter: "grayscale(100%)" } : { filter: "none" }}
                  cursor={"pointer"}
                >
                  <Flex align={"center"}>
                    <Image
                      src={`${import.meta.env.VITE_APP_IMAGE_URL}/products/${
                        items?.image || "product_ChocolateCreamColdBrew.jpg"
                      }`}
                      minW={{ sm: "60px", xl: "80px" }}
                      h={{ sm: "60px", xl: "80px" }}
                      borderRadius={"16px"}
                    />
                  </Flex>
                  <Flex
                    direction={"column"}
                    justify={"space-around"}
                    p={{ base: "10px 20px", sm: 0 }}
                  >
                    <Text
                      fontWeight={600}
                      fontSize={{ base: "12px", xl: "16px" }}
                      lineHeight={{ base: "15px", xl: "18px" }}
                      m={0}
                      maxH={{ base: "30px", xl: "36px" }}
                      maxW={"130px"}
                      display={"flex"}
                      alignItems={"flex-start"}
                      overflow={"hidden"}
                    >
                      {items.name}
                    </Text>
                    <Text fontWeight={400} fontSize={{ base: "12px", xl: "16px" }} m={0}>
                      {toRupiah(items.price)}
                    </Text>
                  </Flex>
                </Card>
              );
            })}
          </Grid>
        </Flex>
      </Flex>
    </Flex>
  );
};

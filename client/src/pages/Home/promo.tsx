/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Flex, Text, Card, Image, Grid, Box } from "@chakra-ui/react";
import promo1 from "../../assets/promo1.jpg";
import promo2 from "../../assets/promo2.jpg";
import promo3 from "../../assets/promo3.jpg";
import { useState } from "react";

export const Promo: React.FC = () => {
	const [size, setSize] = useState<number>(
		window.innerWidth < 900 ? 2 : 3
	);

	const promo: any = [
		{
			name: "Buy 1 get 1",
			date: "Every Tuesdy",
			image: promo1,
		},
		{
			name: "Christmas Special Beverages",
			date: "17-31 Desember",
			image: promo2,
		},
		{
			name: "Tumbler Day",
			date: "14-21 November",
			image: promo3,
		},
	];

	return (
		<Flex direction={"column"} mt={"30px"} gap={"24px"} w={"85%"}>
			<Text fontSize={"18px"} fontWeight={600}>
				Promo
			</Text>
			<Flex color={"black"} w={"full"}>
				<Grid
					templateColumns={`repeat(${size}, 1fr)`}
					h={"fit-content"}
					w={"full"}
					gap={"24px"}
				>
					{promo?.slice(0, size).map((item: any, index: number) => {
						return (
							<Card
								key={index}
								bgColor={"white"}
								display={"flex"}
								p={{ sm: "14px", xl: "24px" }}
								gap={"20px"}
								flexDirection={"row"}
								borderRadius={"16px"}
							>
								{/* Image */}
								<Flex align={"center"}>
									<Image
										src={item.image}
										minW={{ sm: "60px", xl: "80px" }}
										h={{ sm: "60px", xl: "80px" }}
										borderRadius={"16px"}
									/>
								</Flex>

								{/* Text */}
								<Flex
									direction={"column"}
									gap={"10px"}
									justify={"center"}
									display={{base: "none", sm: "flex"}}
									maxW={{
										base: "50px",
										sm: "50px",
										md: "80px",
										xl: "120px",
									}}
								>
									<Text
										fontWeight={600}
										fontSize={{ sm: "12px", xl: "16px" }}
										lineHeight={{ sm: "14px", xl: "24px" }}
										m={0}
										maxH={{ sm: "30px", xl: "36px" }}
										alignItems={"flex-start"}
										overflow={"hidden"}
										textOverflow={"ellipsis"}
										isTruncated
									>
										{item?.name}
									</Text>
									<Text
										fontWeight={400}
										fontSize={{ sm: "12px", xl: "16px" }}
										lineHeight={"150%"}
										m={0}
									>
										{item.date}
									</Text>
								</Flex>
							</Card>
						);
					})}
				</Grid>
			</Flex>
		</Flex>
	);
};

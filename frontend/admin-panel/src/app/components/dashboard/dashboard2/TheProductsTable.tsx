import React, { useState } from "react";
import Image from "next/image";
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableRow,
  TableCell,
  LinearProgress,
  IconButton,
  Avatar,
  Tooltip,
} from "@mui/material";

import DashboardCard from "../../shared/DashboardCard";
import { IconTrash } from "@tabler/icons-react";

const items = [
  {
    id: 1,
    imgsrc: "/images/products/1.jpg",
    name: "Is it good butterscotch ice-cream?",
    tags: "Ice-Cream, Milk, Powder",
    review: "good",
    percent: 65,
    earnings: "546,000",
  },
  {
    id: 2,
    imgsrc: "/images/products/2.jpg",
    name: "Supreme fresh tomato available",
    tags: "Market, Mall",
    review: "excellent",
    percent: 98,
    earnings: "780,000",
  },
  {
    id: 3,
    imgsrc: "/images/products/3.jpg",
    name: "Red color candy from Gucci",
    tags: "Chocolate, Yummy",
    review: "average",
    percent: 46,
    earnings: "457,000",
  },
  {
    id: 4,
    imgsrc: "/images/products/4.jpg",
    name: "Stylish night lamp for night",
    tags: "Elecric, Wire, Current",
    review: "poor",
    percent: 23,
    earnings: "125,000",
  },
];

const PerformanceTable = () => {
  const [products, setProducts] = useState(items);

  const Capitalize = (str: any) => str.charAt(0).toUpperCase() + str.slice(1);
  const deleteHandler = (id: any) => {
    const updateProducts = products.filter((ind) => ind.id !== id);
    setProducts(updateProducts);
  };
  return (
    <DashboardCard title="Products Performance">
      <Box
        sx={{
          overflow: {
            xs: "auto",
            sm: "unset",
          },
          mt: -1,
        }}
      >
        <Table
          sx={{
            whiteSpace: {
              xs: "nowrap",
              sm: "unset",
            },
          }}
        >
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell
                  sx={{
                    pl: 0,
                  }}
                >
                  <Box display="flex" alignItems="center">
                    <Avatar
                      src={product.imgsrc}
                      alt="product"
                      sx={{
                        height: 70,
                        width: 70,
                        borderRadius: "8px",
                      }}
                    />

                    <Box
                      sx={{
                        ml: 2,
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight="500">
                        {product.name}
                      </Typography>
                      <Typography
                        color="textSecondary"
                        variant="subtitle2"
                        fontSize="12px"
                        fontWeight="400"
                      >
                        {product.tags}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell
                  sx={{
                    pl: 0,
                  }}
                >
                  <Typography variant="subtitle2" fontWeight="500">
                    {Capitalize(product.review)}
                  </Typography>
                  <LinearProgress
                    value={product.percent}
                    variant="determinate"
                    sx={{
                      "& span": {
                        backgroundColor:
                          product.review === "good"
                            ? "primary.main"
                            : product.review === "average"
                            ? "warning.main"
                            : product.review === "excellent"
                            ? "success.main"
                            : "secondary.main",
                      },
                    }}
                  />
                  <Typography
                    color="textSecondary"
                    variant="subtitle2"
                    fontSize="12px"
                    fontWeight="400"
                    sx={{
                      mt: 1,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {product.percent}% sold
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    color="textSecondary"
                    variant="subtitle2"
                    fontWeight="400"
                    fontSize="12px"
                  >
                    Earnings
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={500}>
                    ${product.earnings}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Tooltip title="Delete" placement="top">
                    <IconButton onClick={() => deleteHandler(product.id)}>
                      <IconTrash width={20} />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </DashboardCard>
  );
};

export default PerformanceTable;

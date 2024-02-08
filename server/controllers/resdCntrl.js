import asyncHandler from "express-async-handler";
import { prisma } from "../config/prismaConfig.js";


export const createResidency = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    price,
    address,
    country,
    city,
    facilities,
    image,
  } = req.body.data;
  const { email } = req

  console.log(req.body.data);

  try {
    const residency = await prisma.residency.create({
      data: {
        city,
        title,
        image,
        price,
        address,
        country,
        facilities,
        descirption: description,
        owner: { connect: { email } },
      },
    });

    res.send({ message: "Residency created successfully", residency });
  } catch (err) {
    if (err.code === "P2002") {
      throw new Error("A residency with address already there");
    }
    throw new Error(err.message);
  }
});


// function to get all the documents/residencies
export const getAllResidencies = asyncHandler(async (req, res) => {
  const residencies = await prisma.residency.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  res.send(residencies.map((r) => {
    const output = r

    const description = output.descirption

    delete output.descirption

    output.description = description

    return output
  }));
});


// function to get a specific document/residency
export const getResidency = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const residency = await prisma.residency.findUnique({
      where: { id }
    })

    residency.description = residency.descirption

    delete residency.descirption

    res.send(residency);
  } catch (err) {
    throw new Error(err.message);
  }
});
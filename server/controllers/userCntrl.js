import asyncHandler from "express-async-handler";
import { createToken } from '../middleware/jwt.js'
import { prisma } from "../config/prismaConfig.js";


export const whoAmI = asyncHandler(async (req, res) => {
  let { name, email, image } = req.body

  let user = await prisma.user.findUnique({ where: { email } })

  if (!user) {
    user = await prisma.user.create({
      data: {
        name, email, image, bookedVisits: [], favResidenciesID: []
      }
    })
  }

  const token = await createToken({ email })

  return res.status(201).json({
    token, bookings: user.bookedVisits,
    favourites: user.favResidenciesID
  })
})


// function to book a visit to resd
export const bookVisit = asyncHandler(async (req, res) => {
  const { email, date } = req.body;
  const { id } = req.params;

  try {
    const alreadyBooked = await prisma.user.findUnique({
      where: { email },
      select: { bookedVisits: true },
    });

    if (alreadyBooked.bookedVisits.some((visit) => visit.id === id)) {
      res
        .status(400)
        .json({ message: "This residency is already booked by you" });
    } else {
      await prisma.user.update({
        where: { email: email },
        data: {
          bookedVisits: { push: { id, date } },
        },
      });
      res.send("your visit is booked successfully");
    }
  } catch (err) {
    throw new Error(err.message);
  }
})


// funtion to get all bookings of a user
export const getAllBookings = asyncHandler(async (req, res) => {
  const { email } = req

  try {
    const bookings = await prisma.user.findUnique({
      where: { email },
      select: { bookedVisits: true },
    })

    res.status(200).send(bookings)
  } catch (err) {
    throw new Error(err.message)
  }
})

// function to cancel the booking
export const cancelBooking = asyncHandler(async (req, res) => {
  const { email } = req
  const { id } = req.params

  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
      select: { bookedVisits: true },
    });

    const index = user.bookedVisits.findIndex((visit) => visit.id === id);

    if (index === -1) {
      res.status(404).json({ message: "Booking not found" });
    } else {
      user.bookedVisits.splice(index, 1);
      await prisma.user.update({
        where: { email },
        data: {
          bookedVisits: user.bookedVisits,
        },
      });

      res.send("Booking cancelled successfully");
    }
  } catch (err) {
    throw new Error(err.message);
  }
})

// function to add a resd in favourite list of a user
export const toFav = asyncHandler(async (req, res) => {
  const { email } = req
  const { rid } = req.params

  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (user.favResidenciesID.includes(rid)) {
      const updateUser = await prisma.user.update({
        where: { email },
        data: {
          favResidenciesID: {
            set: user.favResidenciesID.filter((id) => id !== rid),
          }
        }
      })

      res.send({ message: "Removed from favorites", user: updateUser });
    } else {
      const updateUser = await prisma.user.update({
        where: { email },
        data: { favResidenciesID: { push: rid } }
      })

      res.send({ message: "Updated favorites", user: updateUser });
    }
  } catch (err) {
    throw new Error(err.message);
  }
})

// function to get all favorites
export const getAllFavorites = asyncHandler(async (req, res) => {
  const { email } = req

  try {
    const favResd = await prisma.user.findUnique({
      where: { email },
      select: { favResidenciesID: true }
    })

    res.status(200).send(favResd)
  } catch (err) {
    throw new Error(err.message)
  }
})
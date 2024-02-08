import { css, StyleSheet } from 'aphrodite'
import React, { useContext, useState } from "react"
import UserDetailContext from "../../context/UserDetailContext.js"
import { bookVisit } from "../../utils/api.js"
import { Modal, Button } from "@mantine/core"
import { DatePicker } from "@mantine/dates"
import { useMutation } from "react-query"
import { toast } from "react-toastify"
import Payment from './Payment.jsx'
import dayjs from "dayjs"


const VisitBooking = ({ opened, setOpened, email, propertyId, price }) => {
  const [value, setValue] = useState(null);
  const [completed, setCompleted] = useState(false)

  const { userDetails: { token }, setUserDetails } = useContext(UserDetailContext)

  const handleBookingSuccess = () => {
    toast.success("You have booked your visit", {
      position: "bottom-right",
    })

    setUserDetails((prev) => ({
      ...prev,
      bookings: [
        ...prev.bookings,
        {
          id: propertyId,
          date: dayjs(value).format("DD/MM/YYYY"),
        },
      ],
    }))
  }

  const { mutate, isLoading } = useMutation({
    mutationFn: () => bookVisit(value, propertyId, email, token),
    onSuccess: () => handleBookingSuccess(),
    onError: ({ response }) => toast.error(response.data.message),
    onSettled: () => setOpened(false),
  })

  const stylesheet = StyleSheet.create({
    price: {
      fontSize: 16,
      marginTop: 8,
      fontWeight: 600,
      marginBottom: 4,
      textAlign: 'left',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  })

  return (
    <Modal
      centered
      opened={opened}
      title="Confirm booking"
      onClose={() => setOpened(false)}
    >
      <div className="flexColCenter" style={{ gap: "1rem" }}>
        <DatePicker value={value} onChange={setValue} minDate={new Date()} />
        <div className={css(stylesheet.price)}>
          <span>Subtotal</span>
          <span>$ {price}</span>
        </div>
        <Payment {...{ setCompleted }} />
        <Button
          disabled={!value || isLoading || !completed}
          onClick={() => mutate()}
        >
          Book visit
        </Button>
      </div>
    </Modal>
  )
}


export default VisitBooking;
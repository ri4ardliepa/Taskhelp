import { css, StyleSheet } from 'aphrodite'
import React, { useState, useRef, useEffect } from "react"


const Payment = ({ setCompleted }) => {
  const [expiration, setExpiration] = useState('')
  const [card, setCard] = useState('')
  const [cvc, setCvc] = useState('')

  const stylesheet = StyleSheet.create({
    payment: {
      width: '100%',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingBottom: 12,
      paddingTop: 12
    },
    card: {
      width: '100%',
      flexShrink: 0
    },
    side: {
      width: 'calc(50% - 6px)',
      flexShrink: 0
    },
    label: {
      marginBottom: 6,
      fontSize: 12,
      fontWeight: 700,
      color: '#000'
    },
    input: {
      padding: 8,
      width: '100%',
      borderWidth: 2,
      borderRadius: 8,
      marginBottom: 6,
      display: 'block',
      position: 'relative',
      borderStyle: 'solid',
      borderColor: '#ddd',
      ':focus': {
        borderColor: '#000',
      }
    }
  })

  useEffect(() => {
    const validExpiration = expiration.length === 5 && parseInt(expiration.split('/')[1]) >= (new Date().getFullYear() - 2000)
    const validCard = card.length === 19
    const validCode = cvc.length === 3

    setCompleted(validExpiration && validCard && validCode)
  }, [expiration, card, cvc])

  const prevCardLen = useRef(card.length)
  const expirationLen = useRef(card.length)

  const cardOnChange = (val) => {
    if (val.length < 20) {
      const space = [3, 7, 11]

      const vals = val.split('').filter((v) => v !== ' ')

      let output = ''

      vals.forEach((v, i) => {
        output += space.includes(i) ? `${v} ` : v
      })

      if (prevCardLen.current > val.length) output = output.trim()

      setCard(output)

      prevCardLen.current = output.length
    }
  }

  const expirationOnChange = (val) => {
    if (val.length < 6) {
      const vals = val.split('').filter((v) => v !== '/')

      let output = ''

      vals.forEach((v, i) => {
        output += (i == 1) ? `${v}/` : v
      })

      if (expirationLen.current > val.length && val.length === 3) output = output.replace('/', '')

      if (val.length === 2 && parseInt(val) > 12) return

      setExpiration(output)
      expirationLen.current = output.length
    }
  }

  return (
    <div className={css(stylesheet.payment)}>
      <div className={css(stylesheet.card)}>
        <div className={css(stylesheet.label)}>Card Number</div>
        <input
          id="card"
          value={card}
          placeholder='4242 4242 4242 4242'
          className={css(stylesheet.input)}
          onChange={(e) => cardOnChange(e.target.value)}
        />
      </div>
      <div className={css(stylesheet.side)}>
        <div className={css(stylesheet.label)}>Expiration Date</div>
        <input
          value={expiration}
          placeholder='04/24'
          className={css(stylesheet.input)}
          onChange={(e) => expirationOnChange(e.target.value)}
        />
      </div>
      <div className={css(stylesheet.side)}>
        <div className={css(stylesheet.label)}>CVC</div>
        <input
          value={cvc}
          placeholder='123'
          className={css(stylesheet.input)}
          onChange={(e) => e.target.value.length < 4 && setCvc(e.target.value)}
        />
      </div>
    </div>
  )
}


export default Payment
import React, { useState } from 'react'
import styled from 'styled-components'
import { useSpring, animated } from 'react-spring'

const Container = styled.div`
   display: flex;
   justify-content: flex-start;
   align-items: center;
   width: 100%;
   height: 100%;
`

const Button = styled(animated.button)``

const FastFadeInOut: React.FC = () => {
   const [show, setShow] = useState(false)
   const handleClick = () => setShow((prev) => !prev)
   const style = useSpring({
      backgroundColor: show ? '#333' : 'transparent',
      color: show ? 'white' : '#333',
   })
   return (
      <Container>
         <Button style={style} onClick={handleClick}>
            Fast Fade In Out
         </Button>
      </Container>
   )
}

export default FastFadeInOut

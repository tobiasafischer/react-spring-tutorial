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

const BlinkFadeInOut: React.FC = () => {
   const [show, setShow] = useState(false)
   const handleClick = () => setShow((prev) => !prev)
   const style = useSpring({
      loop: show,
      to: show
         ? [
              {
                 backgroundColor: 'transparent',
                 color: '#333',
              },
              { backgroundColor: '#333', color: 'white' },
           ]
         : [],
   })
   return (
      <Container>
         <Button style={style} onClick={handleClick}>
            Blink Fade In Out
         </Button>
      </Container>
   )
}

export default BlinkFadeInOut

import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useSpring, animated } from 'react-spring'

const Bar = styled(animated.div)`
   background-color: #333;
   height: 100%;
   position: absolute;
   left: 0;
   z-index: 1;
`

const P = styled.p`
   mix-blend-mode: difference;
   color: white;
   z-index: 3;
`

const Button = styled(animated.button)`
   display: flex;
   align-items: center;
   justify-content: center;
   z-index: 1;
   background-color: white;
   mix-blend-mode: screen;
   position: relative;
`

const WhiteBox = styled.div`
   width: 100%;
   height: 100%;
   position: absolute;
`

const ProgressButton: React.FC = () => {
   const [show, setShow] = useState(false)
   const [progress, setProgress] = useState(0)
   const style = useSpring({
      width: `${progress}%`,
   })

   const clear = (id: number) => {
      clearInterval(id)
      setTimeout(() => {
         setShow(false)
         setProgress(0)
      }, 1000)
   }

   useEffect(() => {
      // only run the interval if the state is active
      if (show) {
         // store our interval into an id so we can demount it later
         const refreshID = setInterval(() => {
            setProgress((prev) => {
               // grab our current % and add a random number between
               const val = prev + Math.floor(Math.random() * 20) + 1
               if (val >= 100) clear(refreshID)
               return val >= 100 ? 100 : val
            })
         }, 500)
      }
   }, [show])

   const handleClick = () => setShow(true)

   return (
      <Button onClick={handleClick}>
         <P>{show ? 'Loading...' : 'Click me!'}</P>
         <Bar style={{ ...style, opacity: show ? 1 : 0 }} />
         <WhiteBox />
      </Button>
   )
}

export default ProgressButton

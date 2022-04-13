import React from 'react'
import { useSpring, animated } from 'react-spring'

type Props = {
   show: boolean
}

const Burger: React.FC<Props> = ({ show }) => {
   // top line -> move and rotate
   const top = useSpring({
      transform: show ? 'translate(5px, 32px) rotate(-45deg)' : 'translate(2px, 7px) rotate(0deg)',
   })
   // middle line -> move and rotate
   const middle = useSpring({
      right: 0,
      transform: show ? 'translate(10px, 4px) rotate(45deg)' : 'translate(10px, 19px) rotate(0deg)',
      width: show ? 40 : 30,
   })
   // bottom line -> move and rotate
   const bottom = useSpring({
      transform: show ? 'translate(5px, 32px) rotate(-45deg)' : 'translate(2px, 31px) rotate(0deg)',
   })

   return (
      <svg
         width="40"
         height="auto"
         viewBox="0 0 44 44"
         fill="#c3c9ce"
         xmlns="http://www.w3.org/2000/svg"
      >
         <animated.rect width="40" height="2" rx="2" style={top} />
         <animated.rect width="40" height="2" rx="2" style={middle} />
         <animated.rect width="40" height="2" rx="2" style={bottom} />
      </svg>
   )
}

export default Burger

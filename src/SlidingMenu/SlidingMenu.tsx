import React, { useRef, useState } from 'react'
import { useSpring } from 'react-spring'
import { useClickInside } from './hooks'
import { Hamburger } from './components'
import { Container, Header, Button, Body, Overlay, Drawer, Sidebar } from './SlidingMenu.styled'

const SlidingMenu: React.FC = () => {
   const [show, setShow] = useState(false)
   const handleShow = () => setShow((prev) => !prev)
   const drawerStyle = useSpring({
      right: show ? 0 : -200,
      opacity: show ? 1 : 0,
   })

   const style = useSpring({
      opacity: show ? 0.5 : 0,
   })

   const ref = useRef(null)

   useClickInside(ref, handleShow)

   return (
      <Container>
         <Header>
            <Button onClick={handleShow}>
               <Hamburger show={show} />
            </Button>
         </Header>
         <Body>
            {show && (
               <Drawer style={drawerStyle}>
                  <Sidebar />
               </Drawer>
            )}
            <Overlay ref={ref} style={style} />
         </Body>
      </Container>
   )
}

export default SlidingMenu

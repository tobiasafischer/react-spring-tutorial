import styled from 'styled-components'
import { animated } from 'react-spring'

export const Drawer = styled(animated.div)`
   position: absolute;
   height: 100%;
   top: 0;
   width: 250px;
   background-color: #ffffff;
   z-index: 9999;
   transition: transform 0.65s ease-in-out;
`

export const Overlay = styled(animated.div)`
   height: 100%;
   width: 100%;
   position: absolute;
   top: 0;
   left: 0;
   z-index: 999;
   background-color: #333;
   opacity: 0.4;
`

export const Sidebar = styled.div`
   width: 100%;
   height: 100%;
   border-left: 1px solid #333;
`

export const Container = styled.div`
   display: flex;
   justify-content: flex-start;
   align-items: center;
   width: 100%;
   height: 100%;
`
export const Header = styled.div`
   width: auto;
   height: auto;
   position: absolute;
   top: 0;
   right: 0;
`
export const Body = styled.div`
   width: 100%;
   height: 100%;
   position: relative;
`

export const Button = styled.button`
   height: auto;
   padding: 0;
   position: absolute;
   right: 15px;
   width: 24px;
   top: 10px;
   background-color: transparent;
   border: none;
   &:hover {
      background-color: transparent;
   }
   svg {
      width: 24px;
   }
`

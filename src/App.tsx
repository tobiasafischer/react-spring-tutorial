import './styles.css'
import { FastFadeInOut, BlinkFadeInOut, ProgressButton } from './components'
import styled from 'styled-components'
import { useState } from 'react'
import { SlidingMenu } from './SlidingMenu'

const Container = styled.div`
   display: flex;
   justify-content: flex-start;
   align-items: flex-start;
   flex-direction: column;
   width: 100%;
   height: 100vh;
`

const Row = styled.div`
   display: flex;
   justify-content: flex-start;
   align-items: center;
   flex-direction: column;
   width: auto;
   height: 100px;
   box-sizing: border-box;
   margin-bottom: 50px;
   padding-left: 20px;
`

const Header = styled.div`
   display: flex;
   justify-content: center;
   align-items: center;
   width: 100%;
   height: auto;
`

const ButtonGroup = styled.div`
   display: flex;
   justify-content: flex-start;
   align-items: center;
   width: auto;
   height: auto;
`

const Tab = styled.button<{ show: boolean }>`
   margin: 0px 5px;
   width: 75px;
   background-color: transparent;
   border: none;
   ${({ show }) => show && 'border-bottom: 1px solid #333;'}
   border-radius: 0px;
`

export default function App() {
   const [show, setShow] = useState(true)
   const handleButton = () => setShow(true)
   const handleSlide = () => setShow(false)
   return (
      <div className="App">
         <Container>
            <Header>
               <ButtonGroup>
                  <Tab onClick={handleButton} show={show}>
                     Buttons
                  </Tab>
                  <Tab onClick={handleSlide} show={!show}>
                     Sliding
                  </Tab>
               </ButtonGroup>
            </Header>
            {show ? (
               <>
                  <Row>
                     <h4>Fast Fade In Out</h4>
                     <FastFadeInOut />
                  </Row>
                  <Row>
                     <h4>Blink Fade In Out</h4>
                     <BlinkFadeInOut />
                  </Row>
                  <Row>
                     <h4>Progress Button</h4>
                     <ProgressButton />
                  </Row>
               </>
            ) : (
               <SlidingMenu />
            )}
         </Container>
      </div>
   )
}

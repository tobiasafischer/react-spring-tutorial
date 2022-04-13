THIS IS DOCUMENTATION I WROTE FOR DUBSADO

# React Spring! (pretty stuff)

React spring is an awesome library that builds on the ideas of css animation and makes them a lot smoother and provides the possibility of more complex animations.

# Why React Spring over X?

Although there are other animation libraries such as react-motion, react-spring is a relatively light library that heavily utilizes custom hooks over components which allows for a greater degree of custom animations (and it has a greater compatibility with styled components)

# Let’s get to the basics,

come along with me on this adventure of codesandbox lol

OK LETS START WITH FADING COLORS [https://codesandbox.io/s/loving-ishizaka-gj8ye?file=/src/components/FadeInOut.tsx](https://codesandbox.io/s/loving-ishizaka-gj8ye?file=/src/components/FadeInOut.tsx)

So lets get the css out of the way by making a button

```tsx
button {
   width: 150px;
   border-radius: 4px;
   height: 40px;
   background-color: white;
   border: 1px solid #333;
   cursor: pointer;
   color: #333;
}
```

and a basic setup of

```tsx
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

const Button = styled.button``

const FastFadeInOut: React.FC = () => {
   const [show, setShow] = useState(false)
   const handleClick = () => setShow((prev) => !prev)
   return (
      <Container>
         <Button onClick={handleClick}>
            Fast Fade In Out
         </Button>
      </Container>
   )
}

export default FastFadeInOut
```

Great! Now that we have our outline with a button that performs a boolean swap let me introduce to you the hook [useSpring](https://react-spring.io/hooks/use-spring). useSpring is a super simple way to handle basic animations (no chaining animations together, just a transition for a one time trigger)

So previously in the style guide, inline styling is a big no no, but rules are meant to be broken so, let’s boogie.

useSpring takes in a style object and returns an animated style object that we can place on our component

So I want to make a button that changes background color on click with smooth transitions.

```tsx
const start = {
	backgroundColor: 'transparent',
	color: '#333',
}

const end = {
	backgroundColor: '#333'
	color: 'white',
}
```

so lets bridge these two together so we can go from our desired start style to our end style!

remember our boolean swap ^ so let’s use that to get started

```tsx
const styled = useSpring({
	backgroundColor: show ? '#333' : 'transparent'
	color: show ? 'white' : '#333'
})
```

pretty easy right? boolean swap and that’s all, so we are going to go ahead and plug that into our component like so

```tsx
<Container>
   <Button onClick={handleClick} style={style}>
			{/* legit that easy ^ */}
      Fast Fade In Out
   </Button>
</Container>
```

I KNOW I KNOW, you’re saying, “Tobias! You clearly have no idea what you are doing it broke my code!” shh shh let me take you to the styled components integration to fix the issue.

So, as I mentioned before, we turned a style object to an animated style object, so in the same sense, we cannot put an animated object on a regular element, but we need to put it on an animated element.

So you remember that fun little styled components inheritance functionality for copying attributes of other components and tacks it onto another element? That is exactly what we are going to do, but in this case, we are going to inherit an animated element.

```tsx
// wrong
const Button = styled.button``

//right
const Button = styled(animated.button)``
```


WOW SO COOL LOOK HOW IT IS SO SMOOTH U ARE SO SMART TOBIAS THANK YOU

I know, I know, but let’s say maybe we want it to run with the following logic

1. onClick, I want it to transition between the two in a loop
2. onClick again, I want it to stop blinking

useSpring can be very basic, but can also get into much more depth, so I lied a bit before with the variables passed into useSpring, lets try it with an example of a different way...

useSpring can actually take in a few props inside of the object and let’s look at ***loop*** and ***to*** 

so this is what our object is going to look like and I will let ya know what is going on 

```tsx
const style = useSpring({
  loop: show,
  to: [
     {
        backgroundColor: 'transparent',
        color: '#333',
     },
     { backgroundColor: '#333', color: 'white' },
  ],
})
```

ok wow what is even going on here?! (it’s actually so simple omg chill 🙄 )

| loop | boolean | boolean to declare if it should be looping |
| --- | --- | --- |
| to | array of style objects | array of style objects that will be looped through |

Cool ! now we have an animation that on toggle will loop through our style objects

But now, you see that weird little bug where it wants to complete the loop? this is bc we are mid transition so it wants to finish the array loop before stopping. There is honestly probably a better way to do it, but this is a little work around to fix it.

So remember that what these style objects do is override the existing style by something like this behind the scenes

```tsx
const style = useSpring({
  loop: show,
  to: [
     {
        backgroundColor: 'transparent',
        color: '#333',
     },
     { backgroundColor: '#333', color: 'white' },
  ],
})

const newStyle = {
	backgroundColor: '#333',
	color: 'white',
	...style // this is our const style = useSpring
	// ^ ...style spread operator will override the previous styles
}
```

So, if it wants to run through the loop one last time, if we empty the loop, there is no additional cycles to go through so it just chills out on whatever the current style is. So let’s try something like this

```tsx
const style = useSpring({
  loop: show,
  to: show
     ? [
          { backgroundColor: '#333', color: 'white' },
          {
             backgroundColor: 'transparent',
             color: '#333',
          },
       ]
     : [],
})
```

cool! so now our event loop went from:

1. default style
2. *click*
3. set the loop to true and start looping through the ‘to’ array infinitely
4. *click*
5. finish out the ‘to’ loop and stop at the last applied style

to: 

1. default style
2. *click*
3. set the loop to true and start looping through the ‘to’ array infinitely
4. *click*
5. clears the array and stops the style on whatever the current style is when the click was triggered

```tsx
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
      to: show ? [
         {
            backgroundColor: 'transparent',
            color: '#333',
         },
         { backgroundColor: '#333', color: 'white' },
      ]: [],
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
```

YO DO YOU WANNA MAKE A PROGRESS BAR ?! I WILL SHOW YOU !!!!

so what is a progress bar really? well if you think about it in a container sense, it is a div whose width grows from 0% to 100% over a period of time. So here is our game plan

1. make a transition that goes from 0% to 100%
2. make the transition last over a specified amount of time determined by progress %
3. let it reset back to normal after it reaches 100%

So, there is definitely a better way to do this, but this solution will take you through some of the ways you can manipulate the library in a way to make a custom component so just take it with a grain of salt

Let’s get the styled components out of the way 

```tsx
// our button that also needs to act as a container
const Button = styled(animated.button)`
   display: flex;
   align-items: center;
   justify-content: center;
   z-index: 1;
   background-color: white;
   mix-blend-mode: screen; // this is so we can change the color of the text
	 position: relative; // as the progress goes ^
`

// our progress bar itself
const Bar = styled(animated.div)`
   background-color: #333;
   height: 100%;
   border-radius: 4px;
	 // so it starts a the beginning of the button
   position: absolute;
   left: 0;
   z-index: 1;
`

// this is so the color of this text changes to be opposite of the background
const P = styled.p`
   mix-blend-mode: difference;
   color: white;
   z-index: 3;
`

// this is so the color of the text changes to be opposite of the background
const WhiteBox = styled.div`
   width: 100%;
   height: 100%;
   position: absolute;
`
```

and our basic layout...

```tsx
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useSpring, animated } from 'react-spring'

const Container = styled.div`
   display: flex;
   justify-content: flex-start;
   align-items: center;
   width: 100%;
   height: 100%;
   position: relative;
`

const Bar = styled(animated.div)`
   background-color: #333;
   height: 100%;
   border-radius: 4px;
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
`

const WhiteBox = styled.div`
   width: 100%;
   height: 100%;
   position: absolute;
`

const ProgressButton: React.FC = () => {
   const [show, setShow] = useState(false)
	 // we dont want it to be a toggle bc we dont  
	 // want to stop the progress until its done
   const handleClick = () => setShow(true)

   return (
      <Container>
         <Button onClick={handleClick}>
            <P>{show ? 'Loading...' : 'Click me!'}</P>
            <Bar style={{opacity: show ? 1 : 0 }} />
            <WhiteBox />
         </Button>
      </Container>
   )
}

export default ProgressButton
```

OK SICK this does nothing ! let’s make it work lmfao

let’s establish our game plan as previously stated where we want it to hold a % based on the progress of the loading.

Idk how you want to get this information from a practical standpoint, maybe the api you use has a progress prop or something / you can take the downloaded size divided by the total size to determine, however we are just going to use some math

```tsx
const [progress, setProgress] = useState(0) // lets hold our % here
// lets apply our progress here
const style = useSpring({
  width: `${progress}%`,
})
// this will update the previous progress % by overriding the width
// so it will have a smooth transition between the two widths
```

ok cool! now let’s actually set our progress!

so we want to trigger this functionality based on a button click, so, let’s run it in a useEffect that is dependent on show

```tsx
useEffect(() => console.log(show), [show])
```

ok sick what we can do is increase the % randomly until it is ≥ 100, then we want to trigger it to stop

so let’s get our game plan set

1. once show is triggered let’s enter a setInterval
2. if our current progress is < 100 let’s increase the progress and continue our interval
3. if our current progress is ≥ 100 let’s clear the interval and setShow back to false so our button becomes intractable again and then return 100 so it won’t overflow the container

```tsx
useEffect(() => {
  // only run the interval if the state is active
  if (show) {
     // store our interval into an id so we can demount it later
     const refreshID = setInterval(() => {
        setProgress((prev) => {
           // grab our current % and add a random number between 1 and 20
           const val = prev + Math.floor(Math.random() * 20) + 1
           // if our total value is above 100, we reached our threshold
           if (val >= 100) clear(refreshID)
           // if its > 100, just return 100 otherwise return the current %
           return val >= 100 ? 100 : val
        })
     }, 500)
  }
}, [show])
```

AWESOME! but how do we keep it from just running infinitely and setting progress at 100 every time? WELL YOU SEE THAT CLEAR FUNCTION ?! YEA THATS WHAT DOES IT

```tsx
const clear = (id: number) => {
  // stop the interval from running w/ id from the setInterval
  clearInterval(id) // https://developer.mozilla.org/en-US/docs/Web/API/clearInterval
  setTimeout(() => {
     // after 1 second turn off the state 
     setShow(false)
     // reset the progress bar
     setProgress(0)
  }, 1000)
}
```

ok sick right, again, this is no means the best way to do this, but I wanted to demonstrate how to customly make a “work-around-y” component to show the flexibility of the library lol

```tsx
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
      // stop the interval from running
      clearInterval(id) // https://developer.mozilla.org/en-US/docs/Web/API/clearInterval
      setTimeout(() => {
         // after 1 second turn off the state 
         setShow(false)
         // reset the progress bar
         setProgress(0)
      }, 1000)
   }

   useEffect(() => {
      // only run the interval if the state is active
      if (show) {
         // store our interval into an id so we can demount it later
         const refreshID = setInterval(() => {
            setProgress((prev) => {
               // grab our current % and add a random number between 1 and 20
               const val = prev + Math.floor(Math.random() * 20) + 1
               // if our total value is above 100, we reached our threshold
               if (val >= 100) clear(refreshID)
               // if its > 100, just return 100 otherwise return the current %
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
```

AWESOME NOW HOW ABOUT A SICK SLIDING MENU that’ll impress your friends, boss, and everyone on stackoverflow (you have my full permission to say this was 100% made by you idc)

OK so the for a sliding menu we need to solve a few problems:

1. make a button to open it that is obvious to users (generally a hamburger)
2. show a sidebar that pops out when the button is pressed
3. find a way to exit the menu preferably by clicking outside of the sliding menu
4. have an overlay to fade the background to put focus on the menu


omg look at that wow let’s look into this sick code

```tsx
import React from 'react'
import { useSpring, animated } from 'react-spring'

// pass in if the button is active
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
   // return animated rectagles which we apply our animated styles to
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
```

pretty easy right? The entire thing is what we have been doing with boolean swaps for animation easing to turn the 3 lines to an X

now let’s make it work with a menu!

```tsx
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { animated, useSpring, useTransition } from 'react-spring'
import useOnClickOutside from './useClickOutside'
import Hamburger from './Hamburger'

// sidebar container
const Drawer = styled(animated.div)`
   position: absolute;
   height: 100%;
   top: 0;
   width: 250px;
   background-color: #ffffff;
   z-index: 9999;
   transition: transform 0.65s ease-in-out;
`

// backdrop
const Overlay = styled(animated.div)`
   position: absolute;
   height: 100%;
   width: 100%;
   top: 0;
   left: 0;
   background-color: #333333;
   z-index: 999;
`
// sidebar content
const Sidebar = styled.div`
   width: 100%;
   height: 100%;
   border-left: 1px solid #333;
`

const Container = styled.div`
   display: flex;
   justify-content: flex-start;
   align-items: center;
   width: 100%;
   height: 100%;
`

const Header = styled.div`
   width: 100%;
   height: auto;
   position: absolute;
   top: 0;
`

const Body = styled.div`
   width: 100%;
   height: 100%;
`

// button to make the hamburger work
const Button = styled.button`
   height: auto;
   margin: 15px;
   padding: 0;
   position: absolute;
   right: 0;
   top: 0;
   background-color: transparent;
   border: none;
   &:hover {
      background-color: transparent;
   }
   svg {
      width: 24px;
   }
`

const SlidingMenu: React.FC = () => {
   const [show, setShow] = useState(false)
   const handleShow = () => setShow((prev) => !prev)
   return (
      <Container>
         <Header>
            <Button onClick={handleShow}>
               <Hamburger show={show} />
            </Button>
         </Header>
         <Body>
            {show && (
               <Drawer>
                  <Sidebar />
               </Drawer>
            )}
         </Body>
      </Container>
   )
}

export default SlidingMenu
```

cool! we now have a sidebar that pops up on click of the hamburger button!

but we can’t get out of it! let’s go make a hook. 

because we want to make an overlay to make the sidebar REALLY POP we need to be able to make a hook so that when we click on the overlay, it will turn show to false.

(Also, usually we will do something like useClickOutside to trigger a function on clicking outside of the element you desire, however, since we are triggering off of a button, if show is active and we click on it, it will trigger the useClickOutside function as well as our button function) ← so in this case we will say once the user clicks on the overlay, run the function (bc realistically we don't want it to close when clicking on the header and stuff lol)

```tsx
import { MutableRefObject, useEffect } from 'react'

// we want to pass in a ref of ur obj
// and a callback function you want to run
// once someone clicks it
const useClickInside = (ref: MutableRefObject<null>, handler: { (): void; (arg0: any): void }) =>
   // u know the deal
   useEffect(
      () => {
         // function to trigger once our event listener fires
         // we pass in that event
         const listener = (event: any) => {
            // if current ref is equal to the element being clicked on
            if (ref.current === event.toElement) {
               // trigger our callback
               handler(event)
               // demount
               ref.current = null
            }
         }
         document.addEventListener('mousedown', listener)
         return () => document.removeEventListener('mousedown', listener)
      },
      [ref, handler],
   )

export default useClickInside
```

for your info here’s the useClickOutside

```tsx
import { MutableRefObject, useEffect } from 'react'

// lets pass in a ref and a callback func to run once
// the user clicks outside of the ref area
const useOnClickOutside = (
   ref: MutableRefObject<null> | any,
   handler: { (): void; (arg0: any): void },
) =>
   useEffect(() => {
      const listener = (event: { target: any }) => {
         // Do nothing if clicking ref's element or descendent elements
         if (ref.current && !ref.current.contains(event.target)) {
            handler(event)
            ref.current = null
         }
      }
      document.addEventListener('mousedown', listener)
      return () => document.removeEventListener('mousedown', listener)
   }, [ref, handler])

export default useOnClickOutside
```

ok sick we have a hook to trigger what we want but where is our overlay ?! shh im getting to that

so, if you think about it, an overlay is a div that covers the entire body with a background color of a dark color with a low opacity to kinda give the impression of focus.. COOL COOL

```tsx
export const Overlay = styled(animated.div)<{show: boolean}>`
   height: 100%; // cover the screen
   width: 100%;
   position: absolute;
   top: 0;
   left: 0;
   z-index: 999; // make it sit on top
   background-color: #333; // make it dark
	 opacity: ${({ show }) => show ? '0.4' : '0')};
`
```

ok sweet, we now have an unanimated mess of a project and i know what you’re thinking: “why am i following this tutorial if what I’m making SUCKS” WELL LET’S FIX THAT HUH

so as always let’s make a game plan:

1. the menu should slide out from the right instead of just popping out of nowhere
2. fade in the menu
3. the opacity should fade in and out

so legit they all sound super hard but its like in total 7 lines of code lmfao so lets absolutely butter this rq

OK the sliding out is as you expected, using useSpring

```tsx
const drawerStyle = useSpring({
  right: show ? 0 : -200,
  opacity: show ? 1 : 0,
})
```

so bc our menu is position: absolute;, we want the menu to pop out from the right so it’s weird, but we want our default state to be -200px (this can be whatever you feel, the larger the distance the faster it zooms in) and we want our shown menu to be displayed at right: 0 when its active. 

 In the same sense, lets just transition the opacity so it has a fade in and out look 

```tsx
{show && (
   <Drawer style={drawerStyle}>
      <Sidebar />
   </Drawer>
)}
```

and for the overlay we are just going to transition the opacity nice and easy

```tsx
const style = useSpring({
  opacity: show ? 0.5 : 0,
})

<Overlay ref={ref} style={style} />
```

and put all together we got this

```tsx
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
```


there is much more this library can do! But for this documentation, I really just wanted to go through the process of using your creativity to utilize this library in an extremely simple manner, so feel free to run through their [docs](https://react-spring.io/basics) and get more in depth!

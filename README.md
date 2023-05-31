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
import React, { useState } from 'react';
import styled from 'styled-components';
import { useSpring, animated } from 'react-spring';

const Container = styled.div`
	display: flex;
	justify-content: flex-start;
	align-items: center;
	width: 100%;
	height: 100%;
`;

const Button = styled.button``;

const FastFadeInOut: React.FC = () => {
	const [show, setShow] = useState(false);
	const handleClick = () => setShow((prev) => !prev);
	return (
		<Container>
			<Button onClick={handleClick}>Fast Fade In Out</Button>
		</Container>
	);
};

export default FastFadeInOut;
```

Great! Now that we have our outline with a button that performs a boolean swap let me introduce to you the hook [useSpring](https://react-spring.io/hooks/use-spring). useSpring is a super simple way to handle basic animations (no chaining animations together, just a transition for a one time trigger)

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

Okay it broke right. Thats because react-spring does not let you put animations on vanilla components, but with styled components, we can extend the `animated` component. let me take you to the styled components integration to fix the issue.

So, as I mentioned before, we turned a style object to an animated style object, so in the same sense, we cannot put an animated object on a regular element, but we need to put it on an animated element.

So you remember that fun little styled components inheritance functionality for copying attributes of other components and tacks it onto another element? That is exactly what we are going to do, but in this case, we are going to inherit an animated element.

```tsx
// wrong
const Button = styled.button``;

//right
const Button = styled(animated.button)``;
```

Now, suppose we would like to implement the following logic:

-Upon clicking, we want the element to transition continuously between two states.
-Upon clicking again, we want the blinking animation to stop.
-The useSpring function can be utilized for basic purposes, as well as for more advanced functionality. Previously, I provided simplified information regarding the variables passed into useSpring. However, let's now explore a different approach.

In addition to the basic props, useSpring accepts a few additional properties within the object. Specifically, let's focus on the 'loop' and 'to' properties.

Here is an example of how our object will look like, along with an explanation of its purpose and functionality.

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
});
```

| loop | boolean                | boolean to declare if it should be looping         |
| ---- | ---------------------- | -------------------------------------------------- |
| to   | array of style objects | array of style objects that will be looped through |

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
});

const newStyle = {
	backgroundColor: '#333',
	color: 'white',
	...style, // this is our const style = useSpring
	// ^ ...style spread operator will override the previous styles
};
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
});
```

cool! so now our event loop went from:

1. default style
2. _click_
3. set the loop to true and start looping through the ‘to’ array infinitely
4. _click_
5. finish out the ‘to’ loop and stop at the last applied style

to:

1. default style
2. _click_
3. set the loop to true and start looping through the ‘to’ array infinitely
4. _click_
5. clears the array and stops the style on whatever the current style is when the click was triggered

```tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { useSpring, animated } from 'react-spring';

const Container = styled.div`
	display: flex;
	justify-content: flex-start;
	align-items: center;
	width: 100%;
	height: 100%;
`;

const Button = styled(animated.button)``;

const BlinkFadeInOut: React.FC = () => {
	const [show, setShow] = useState(false);
	const handleClick = () => setShow((prev) => !prev);
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
	});
	return (
		<Container>
			<Button style={style} onClick={handleClick}>
				Blink Fade In Out
			</Button>
		</Container>
	);
};

export default BlinkFadeInOut;
```

Lets make a progrogress bar (did you know they're mostly fake?)

So, what exactly is a progress bar? In a conceptual sense, it can be viewed as a container element, typically a `<div>`, whose width gradually increases from 0% to 100% over a specific duration. Here is our plan to implement it:

Implement a transition effect that smoothly increases the width of the progress bar from 0% to 100%.
Determine the duration of the transition based on the progress percentage, allowing the progress bar to reflect the estimated time remaining.
Once the progress bar reaches 100%, reset it to its initial state.
While there may be more optimal ways to achieve this, the following solution will demonstrate how to customize a component using the library. Please consider this approach as a learning experience.

Now, let's begin by addressing the styled components aspect of the implementation.

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
`;

// our progress bar itself
const Bar = styled(animated.div)`
	background-color: #333;
	height: 100%;
	border-radius: 4px;
	// so it starts a the beginning of the button
	position: absolute;
	left: 0;
	z-index: 1;
`;

// this is so the color of this text changes to be opposite of the background
const P = styled.p`
	mix-blend-mode: difference;
	color: white;
	z-index: 3;
`;

// this is so the color of the text changes to be opposite of the background
const WhiteBox = styled.div`
	width: 100%;
	height: 100%;
	position: absolute;
`;
```

and our basic layout...

```tsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSpring, animated } from 'react-spring';

const Container = styled.div`
	display: flex;
	justify-content: flex-start;
	align-items: center;
	width: 100%;
	height: 100%;
	position: relative;
`;

const Bar = styled(animated.div)`
	background-color: #333;
	height: 100%;
	border-radius: 4px;
	position: absolute;
	left: 0;
	z-index: 1;
`;

const P = styled.p`
	mix-blend-mode: difference;
	color: white;
	z-index: 3;
`;

const Button = styled(animated.button)`
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1;
	background-color: white;
	mix-blend-mode: screen;
`;

const WhiteBox = styled.div`
	width: 100%;
	height: 100%;
	position: absolute;
`;

const ProgressButton: React.FC = () => {
	const [show, setShow] = useState(false);
	// we dont want it to be a toggle bc we dont
	// want to stop the progress until its done
	const handleClick = () => setShow(true);

	return (
		<Container>
			<Button onClick={handleClick}>
				<P>{show ? 'Loading...' : 'Click me!'}</P>
				<Bar style={{ opacity: show ? 1 : 0 }} />
				<WhiteBox />
			</Button>
		</Container>
	);
};

export default ProgressButton;
```

let’s establish our game plan as previously stated where we want it to hold a % based on the progress of the loading.

Idk how you want to get this information from a practical standpoint, maybe the api you use has a progress prop or something / you can take the downloaded size divided by the total size to determine, however we are just going to use some math. Most people will just fake it though.

```tsx
const [progress, setProgress] = useState(0); // lets hold our % here
// lets apply our progress here
const style = useSpring({
	width: `${progress}%`,
});
// this will update the previous progress % by overriding the width
// so it will have a smooth transition between the two widths
```

ok cool! now let’s actually set our progress!

so we want to trigger this functionality based on a button click, so, let’s run it in a useEffect that is dependent on show

```tsx
useEffect(() => console.log(show), [show]);
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
				const val = prev + Math.floor(Math.random() * 20) + 1;
				// if our total value is above 100, we reached our threshold
				if (val >= 100) clear(refreshID);
				// if its > 100, just return 100 otherwise return the current %
				return val >= 100 ? 100 : val;
			});
		}, 500);
	}
}, [show]);
```

Lets clear it now

```tsx
const clear = (id: number) => {
	// stop the interval from running w/ id from the setInterval
	clearInterval(id); // https://developer.mozilla.org/en-US/docs/Web/API/clearInterval
	setTimeout(() => {
		// after 1 second turn off the state
		setShow(false);
		// reset the progress bar
		setProgress(0);
	}, 1000);
};
```

ok sick right, again, this is no means the best way to do this, but I wanted to demonstrate how to customly make a “work-around-y” component to show the flexibility of the library

```tsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSpring, animated } from 'react-spring';

const Bar = styled(animated.div)`
	background-color: #333;
	height: 100%;
	position: absolute;
	left: 0;
	z-index: 1;
`;

const P = styled.p`
	mix-blend-mode: difference;
	color: white;
	z-index: 3;
`;

const Button = styled(animated.button)`
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1;
	background-color: white;
	mix-blend-mode: screen;
	position: relative;
`;

const WhiteBox = styled.div`
	width: 100%;
	height: 100%;
	position: absolute;
`;

const ProgressButton: React.FC = () => {
	const [show, setShow] = useState(false);
	const [progress, setProgress] = useState(0);
	const style = useSpring({
		width: `${progress}%`,
	});

	const clear = (id: number) => {
		// stop the interval from running
		clearInterval(id); // https://developer.mozilla.org/en-US/docs/Web/API/clearInterval
		setTimeout(() => {
			// after 1 second turn off the state
			setShow(false);
			// reset the progress bar
			setProgress(0);
		}, 1000);
	};

	useEffect(() => {
		// only run the interval if the state is active
		if (show) {
			// store our interval into an id so we can demount it later
			const refreshID = setInterval(() => {
				setProgress((prev) => {
					// grab our current % and add a random number between 1 and 20
					const val = prev + Math.floor(Math.random() * 20) + 1;
					// if our total value is above 100, we reached our threshold
					if (val >= 100) clear(refreshID);
					// if its > 100, just return 100 otherwise return the current %
					return val >= 100 ? 100 : val;
				});
			}, 500);
		}
	}, [show]);

	const handleClick = () => setShow(true);

	return (
		<Button onClick={handleClick}>
			<P>{show ? 'Loading...' : 'Click me!'}</P>
			<Bar style={{ ...style, opacity: show ? 1 : 0 }} />
			<WhiteBox />
		</Button>
	);
};

export default ProgressButton;
```

Fantastic! How about implementing an impressive sliding menu that will leave a lasting impression on your friends, boss, and even the Stack Overflow community? (Please note that you have my complete permission to claim full ownership of this creation, if you want lol)

To develop a sliding menu, we need to address several key requirements:

-Design a prominent button, typically represented by a hamburger icon, that clearly indicates its purpose to users.
-Create a sidebar that seamlessly appears when the button is pressed, providing the desired sliding effect.
-Implement an intuitive method for users to exit the menu, preferably by allowing them to click outside the sliding menu area.
-Enhance the menu's visual impact by incorporating an overlay that fades the background, thereby focusing attention on the menu itself.

These considerations promise an impressive result. Let's delve into the code and explore this exciting implementation.

```tsx
import React from 'react';
import { useSpring, animated } from 'react-spring';

// pass in if the button is active
type Props = {
	show: boolean;
};

const Burger: React.FC<Props> = ({ show }) => {
	// top line -> move and rotate
	const top = useSpring({
		transform: show ? 'translate(5px, 32px) rotate(-45deg)' : 'translate(2px, 7px) rotate(0deg)',
	});
	// middle line -> move and rotate
	const middle = useSpring({
		right: 0,
		transform: show ? 'translate(10px, 4px) rotate(45deg)' : 'translate(10px, 19px) rotate(0deg)',
		width: show ? 40 : 30,
	});
	// bottom line -> move and rotate
	const bottom = useSpring({
		transform: show ? 'translate(5px, 32px) rotate(-45deg)' : 'translate(2px, 31px) rotate(0deg)',
	});
	// return animated rectagles which we apply our animated styles to
	return (
		<svg
			width='40'
			height='auto'
			viewBox='0 0 44 44'
			fill='#c3c9ce'
			xmlns='http://www.w3.org/2000/svg'>
			<animated.rect width='40' height='2' rx='2' style={top} />
			<animated.rect width='40' height='2' rx='2' style={middle} />
			<animated.rect width='40' height='2' rx='2' style={bottom} />
		</svg>
	);
};

export default Burger;
```

pretty easy right? The entire thing is what we have been doing with boolean swaps for animation easing to turn the 3 lines to an X

now let’s make it work with a menu!

```tsx
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { animated, useSpring, useTransition } from 'react-spring';
import useOnClickOutside from './useClickOutside';
import Hamburger from './Hamburger';

// sidebar container
const Drawer = styled(animated.div)`
	position: absolute;
	height: 100%;
	top: 0;
	width: 250px;
	background-color: #ffffff;
	z-index: 9999;
	transition: transform 0.65s ease-in-out;
`;

// backdrop
const Overlay = styled(animated.div)`
	position: absolute;
	height: 100%;
	width: 100%;
	top: 0;
	left: 0;
	background-color: #333333;
	z-index: 999;
`;
// sidebar content
const Sidebar = styled.div`
	width: 100%;
	height: 100%;
	border-left: 1px solid #333;
`;

const Container = styled.div`
	display: flex;
	justify-content: flex-start;
	align-items: center;
	width: 100%;
	height: 100%;
`;

const Header = styled.div`
	width: 100%;
	height: auto;
	position: absolute;
	top: 0;
`;

const Body = styled.div`
	width: 100%;
	height: 100%;
`;

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
`;

const SlidingMenu: React.FC = () => {
	const [show, setShow] = useState(false);
	const handleShow = () => setShow((prev) => !prev);
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
	);
};

export default SlidingMenu;
```

Excellent! We have successfully implemented a sidebar that appears upon clicking the hamburger button. However, we currently lack the functionality to close the sidebar. To address this, let's create a custom hook.

In order to create a visually striking effect with an overlay that truly accentuates the sidebar, we need a hook that allows us to toggle the visibility of the sidebar. When the user clicks on the overlay, it should trigger the hook and set the 'show' state to false.

Typically, we would employ a solution like 'useClickOutside' to detect clicks outside of a specific element and trigger a corresponding function. However, in this case, since our button is the trigger, clicking on it would inadvertently trigger the 'useClickOutside' function along with our button function. Hence, our solution will involve running the function when the user clicks on the overlay. It ensures that the sidebar remains open when clicking on the header or other elements, as desired.

By implementing this approach, we can provide a seamless and intuitive experience for users. Let's proceed with the code to achieve this functionality.

```tsx
import { MutableRefObject, useEffect } from 'react';

// we want to pass in a ref of ur obj
// and a callback function you want to run
// once someone clicks it
const useClickInside = (ref: MutableRefObject<null>, handler: { (): void; (arg0: any): void }) =>
	// u know the deal
	useEffect(() => {
		// function to trigger once our event listener fires
		// we pass in that event
		const listener = (event: any) => {
			// if current ref is equal to the element being clicked on
			if (ref.current === event.toElement) {
				// trigger our callback
				handler(event);
				// demount
				ref.current = null;
			}
		};
		document.addEventListener('mousedown', listener);
		return () => document.removeEventListener('mousedown', listener);
	}, [ref, handler]);

export default useClickInside;
```

for your info here’s the useClickOutside

```tsx
import { MutableRefObject, useEffect } from 'react';

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
				handler(event);
				ref.current = null;
			}
		};
		document.addEventListener('mousedown', listener);
		return () => document.removeEventListener('mousedown', listener);
	}, [ref, handler]);

export default useOnClickOutside;
```

Great! Now, let's address the issue of the missing overlay. But don't worry, I'll explain it in just a moment.

When you think about it, an overlay essentially consists of a <div> element that spans the entire body, featuring a dark background color with low opacity. This design creates a visual impression of focus and attention. Pretty cool, right?

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

Fantastic! We now have a project that, admittedly, lacks animation and may seem less than impressive. I understand your concerns and the thought of following a tutorial that produces unsatisfactory results. However, fear not! We're about to fix that and turn things around.

As always, let's devise a game plan to guide our progress:

-Implement a sliding effect for the menu, allowing it to smoothly slide out from the right instead of abruptly appearing.
-Add a fade-in animation to the menu, providing a smooth transition as it becomes visible.
-Incorporate opacity fading, allowing the menu to gradually fade in and out for a more polished appearance.
-While these objectives may sound challenging, the reality is that achieving them requires just seven lines of code. So, let's get started and make this project truly shine!

To accomplish the sliding effect, as expected, we will utilize the 'useSpring' function.

```tsx
const drawerStyle = useSpring({
	right: show ? 0 : -200,
	opacity: show ? 1 : 0,
});
```

so bc our menu is position: absolute;, we want the menu to pop out from the right so it’s weird, but we want our default state to be -200px (this can be whatever you feel, the larger the distance the faster it zooms in) and we want our shown menu to be displayed at right: 0 when its active.

In the same sense, lets just transition the opacity so it has a fade in and out look

```tsx
{
	show && (
		<Drawer style={drawerStyle}>
			<Sidebar />
		</Drawer>
	);
}
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
import React, { useRef, useState } from 'react';
import { useSpring } from 'react-spring';
import { useClickInside } from './hooks';
import { Hamburger } from './components';
import { Container, Header, Button, Body, Overlay, Drawer, Sidebar } from './SlidingMenu.styled';

const SlidingMenu: React.FC = () => {
	const [show, setShow] = useState(false);
	const handleShow = () => setShow((prev) => !prev);
	const drawerStyle = useSpring({
		right: show ? 0 : -200,
		opacity: show ? 1 : 0,
	});

	const style = useSpring({
		opacity: show ? 0.5 : 0,
	});

	const ref = useRef(null);

	useClickInside(ref, handleShow);

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
	);
};

export default SlidingMenu;
```

there is much more this library can do! But for this documentation, I really just wanted to go through the process of using your creativity to utilize this library in an extremely simple manner, so feel free to run through their [docs](https://react-spring.io/basics) and get more in depth!

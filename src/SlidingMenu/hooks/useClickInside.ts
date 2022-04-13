import { MutableRefObject, useEffect } from 'react'

// we want to pass in a ref of ur obj
// and a callback function you want to run
// once someone clicks outside
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
      // Add ref and handler to effect dependencies
      // It's worth noting that because passed in handler is a new ...
      // ... function on every render that will cause this effect ...
      // ... callback/cleanup to run every render. It's not a big deal ...
      // ... but to optimize you can wrap handler in useCallback before ...
      // ... passing it into this hook.

      // if u think im smart enough to write this ur lying to yourself
      // justin big brained this comment
      // i made the function tho AHWFOIAHSFOAFSHOAISF
      [ref, handler],
   )

export default useClickInside

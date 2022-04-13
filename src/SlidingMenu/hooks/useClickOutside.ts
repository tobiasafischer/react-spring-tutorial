import { MutableRefObject, useEffect } from 'react'

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

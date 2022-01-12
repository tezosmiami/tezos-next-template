import { useEffect } from 'react';
import { PassengerContextProvider } from "../context/passenger-context";
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  
  useEffect(() => {
    const localLightMode = window.localStorage.getItem('lightMode');
    if(localLightMode === 'true') {
        document.body.classList.add('lightMode');
    }
}, []);
  return (
  <PassengerContextProvider>
    <Component {...pageProps} />
  </PassengerContextProvider>
  
  )
}

export default MyApp

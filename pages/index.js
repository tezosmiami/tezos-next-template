
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { usePassengerContext } from "../context/passenger-context";
import { LightButton } from '../components/light-button';

export default function Home() {
 const app = usePassengerContext();

 
  return (
    <>
      <Head>
        <title>Tezos Miami Next Template</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/tezosmiami.ico" />
      </Head>
      
      <header>
      {console.log(app)}
      {app.activeAccount && app.address.substr(0, 5) + ". . ." + app.address.substr(-5)}
      
      <button onClick={() => !app.activeAccount ? app.logIn() : app.logOut()}> 
      {!app.activeAccount ? "sync" : "unsync"}
      </button>

    </header>   
    <footer>
    <LightButton/>
    </footer>
    
  </>
  )
}


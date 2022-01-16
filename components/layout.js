import Head from 'next/head'
import styles from '../styles/Home.module.css'
import {useState, useEffect} from 'react'
import { usePassengerContext } from "../context/passenger-context";
import { LightButton } from './light-button';
import Link from 'next/link'

export const Layout = ({children}) => {
    const app = usePassengerContext();
    
  return (
    <>
      <header>
      {app.activeAccount && app.address.substr(0, 5) + ". . ." + app.address.substr(-5)}
     
      <button onClick={() => !app.activeAccount ? app.logIn() : app.logOut()}> 
      {!app.activeAccount ? "sync" : "unsync"}
      </button>
      
    </header>  
    {/* <Deck cards={tarot}></Deck>  */}
    <Link href='/'>
    <a>Green Valley Tarot</a>
    </Link>
    {children}
    <footer>
    <LightButton/>
    </footer>
    
  </>
  )
}


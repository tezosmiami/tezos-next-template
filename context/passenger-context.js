import React, { useEffect, useState, useCallback} from "react";
import { TezosToolkit } from "@taquito/taquito";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { Web3Provider } from "@ethersproject/providers";
import WalletConnectProvider from "@walletconnect/web3-provider";
const infuraId ='6d383250b281440e938c76c929693c6b'
import Web3Modal from "web3modal";

if (process.browser) { const web3Modal = new Web3Modal({
  network: 'mainnet',
  cacheProvider: true,
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId,
      },
    },
  },
});
};

const PassengerContext = React.createContext();
const options = {
  name: 'Tezos Miami'
 };
  
if (process.browser){
  const wallet = new BeaconWallet(options);
}

export const usePassengerContext = () => {

  const app = React.useContext(PassengerContext);
  if (!app) {
    throw new Error(
      `!app`
    );
  }
  return app;
};

export const PassengerContextProvider = ({ children }) => {
  
  const [app, setApp] = React.useState("");
  const [tezosAddress, setTezosAddress] = useState("");
  const [tezos, setTezos] = useState(new TezosToolkit("https://mainnet.api.tez.ie"));
  const [tezosAccount, setTezosAccount] = useState("")
  const [ethProvider, setEthProvider] = useState();
  const [ethAddress, setEthAddress] = useState();
 
  useEffect( () => {
     const getLoggedIn = async () => {
        if (await wallet.client.getActiveAccount()) { 
          setTezosAccount(await wallet.client.getActiveAccount());
          const address =  await wallet.getPKH();
          setTezosAddress(address);
          tezos.setWalletProvider(wallet);
          setTezos(tezos)
       
        }
      };
      getLoggedIn();
    }, []);
  
  const syncTezos = async() => {
    app.currentUser && await app.currentUser.logOut();
    await wallet.client.clearActiveAccount();
    await wallet.client.requestPermissions({
      network: {
        type: 'mainnet',
      },
    });
    tezos.setWalletProvider(wallet);
    setTezos(tezos)
    setTezosAddress(await wallet.getPKH());
    setTezosAccount(await wallet?.client?.getActiveAccount());
    
  }

  const unsyncTezos = async () => {
    await wallet.client.clearActiveAccount();
    setTezosAccount("")
    setTezosAddress("");
    //  window.location.reload();
  }
  
  
  const syncEth = useCallback(async () => {
    const provider = await web3Modal.connect();
    const nodeProvider =new Web3Provider(provider);
    setEthProvider(nodeProvider);
    const signer=nodeProvider.getSigner();
    setEthAddress(await signer.getAddress());
    provider.on("chainChanged", chainId => {
      console.log(`chain changed to ${chainId}! updating providers`);
      setEthProvider(new Web3Provider(provider));
    });


    provider.on("accountsChanged", () => {
      console.log(`account changed!`);
      setEthProvider(new Web3Provider(provider));
    });

    provider.on("disconnect", (code, reason) => {
      console.log(code, reason);
      unsyncEth();
    });
  
  }, [setEthProvider]);

  const unsyncEth = async () => {
    await web3Modal.clearCachedProvider();
  //  if (ethProvider && ethProvider.provider && typeof ethProvider.provider.disconnect == "function") {
  //     await ethProvider.disconnect();}
    setTimeout(() => {
      window.location.reload();
    }, 1);
  };
  
  useEffect(() => {
    if (web3Modal.cachedProvider) {
     syncEth();
    }
  }, [syncEth]);
 

  const wrapped = { ...app, 
    tezos, 
    syncTezos, 
    syncEth, 
    unsyncTezos, 
    unsyncEth, 
    tezosAccount, 
    tezosAddress,
    ethAddress,
    ethProvider
    
  };

  return (
   
    <PassengerContext.Provider value={wrapped}>
           {children}
    </PassengerContext.Provider>
  
  );
};

export default PassengerContextProvider;
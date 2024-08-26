'use client'
import { BrowserProvider, ethers } from "ethers";
import { Provider } from "ethers";
import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
declare var window: any

interface ProviderContextObject {
  provider: BrowserProvider | null,
  setProvider: Dispatch<SetStateAction<ethers.BrowserProvider | null>> | null,
  setIsConnected: Dispatch<SetStateAction<boolean>> | null,
  isConnected: boolean,
  accountChanged:boolean
}
const ProviderContext = createContext<ProviderContextObject>({
  provider: null,
  setProvider: null,
  isConnected: false,
  setIsConnected: null,
  accountChanged: false
})

const ProviderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [accountChanged, setAccountChanged] = useState<boolean>(false);


  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged)
    }


    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
      } else {

      }
    }
  }, [])


  const handleAccountsChanged = (accounts: any) => {
    setAccountChanged((value)=>{
      return !value;
    })
  }


  return (
    <ProviderContext.Provider value={{ provider, setProvider, isConnected, setIsConnected, accountChanged }}>
      {children}
    </ProviderContext.Provider>
  );
};

export {
  ProviderContext,
  ProviderProvider
}
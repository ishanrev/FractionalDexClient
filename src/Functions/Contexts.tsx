'use client'
import { BrowserProvider, ethers } from "ethers";
import { Provider } from "ethers";
import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";
interface ProviderContextObject {
  provider: BrowserProvider | null,
  setProvider: Dispatch<SetStateAction<ethers.BrowserProvider | null>> |null,
  setIsConnected: Dispatch<SetStateAction<boolean>> |null,
  isConnected:boolean
}
const ProviderContext = createContext<ProviderContextObject>({
  provider: null,
  setProvider: null,
  isConnected:false,
  setIsConnected:null
})

const ProviderProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  return (
    <ProviderContext.Provider value={{ provider, setProvider, isConnected, setIsConnected }}>
      {children}
    </ProviderContext.Provider>
  );
};

export {
  ProviderContext,
  ProviderProvider
}
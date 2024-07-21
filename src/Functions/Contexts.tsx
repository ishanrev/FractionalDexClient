'use client'
import { BrowserProvider, ethers } from "ethers";
import { Provider } from "ethers";
import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";
interface ProviderContextObject {
  provider: BrowserProvider | null,
  setProvider: Dispatch<SetStateAction<ethers.BrowserProvider | null>> |null
}
const ProviderContext = createContext<ProviderContextObject>({
  provider: null,
  setProvider: null
})

const ProviderProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);

  return (
    <ProviderContext.Provider value={{ provider, setProvider }}>
      {children}
    </ProviderContext.Provider>
  );
};

export {
  ProviderContext,
  ProviderProvider
}
'use client'
import { Provider } from "ethers";
import { Signer } from "ethers";
import { JsonRpcSigner } from "ethers";
import { ethers, BrowserProvider, TransactionRequest } from "ethers";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { Database, Json } from "../../types/supabase";
import { getTokenBalance } from "@/Functions/BlockchainFunctions";
import { getListOfNfts } from "@/Functions/SupabaseFuncs";
import Link from "next/link";
import { toIPFS } from "@/Functions/General";
import { ProviderContext } from "@/Functions/Contexts";
declare var window: any

type SharesTableRow = {
  image: string,
  tokens: number,
  ownership: number,
  liquidityValue: number,
  tokenSymbol: string,
  nftCollectionAddress: string,
  tokenId:number
}
interface Metadata {
  name: string;
  description: string;
  image: string;
}

export default function Home() {

  const {provider, setProvider} = useContext(ProviderContext)
  const [account, setAccount] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [myShares, setMyShares] = useState<SharesTableRow[]>()
  const connectToWalet = async () => {
    try {
      if (window.ethereum) {
        const providerTemp: BrowserProvider = new BrowserProvider(window.ethereum)
        await providerTemp.send("eth_requestAccounts", [])
        const signer: Signer = await providerTemp.getSigner()
        const address = await signer.getAddress()
        console.log("MetaMask connected", address)
        console.log(providerTemp)
        
        console.log("going to setProvider")
        setProvider && setProvider(providerTemp)
        
        setIsConnected(true)
        setAccount(address)

      } else {
        alert("No ethereum in the wallet")
        throw ("No ethereum in the wallet")
      }

    } catch (connectError) {
      console.log(connectError)
    }
  }
  useEffect(() => {
    if (account) {
      loadShares()
    }

  }, [account])

  useEffect(() => {
    console.log()
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

  const loadShares = async () => {
    try {
      const signer = await provider?.getSigner()
      if (!signer) {
        throw ("no digner avaailable")
      }
      const nfts = await getListOfNfts(await signer.getAddress())
      console.log(nfts)
      let temp = []

      for (let nft of nfts) {

        const { tokens, ownership } = await getTokenBalance(signer, account ?? "", nft.token_address ?? "")
        console.log(tokens)
        temp.push({
          image: nft.metadata?.image ?? "",
          tokens,
          ownership,
          liquidityValue: 10,
          tokenSymbol: nft.token_symbol ?? "",
          nftCollectionAddress: nft.nft_address??"",
          tokenId: nft.token_id??0
        })
      }
      console.log(temp)
      setMyShares(temp)

    } catch (loadError) {
      console.log(loadError);
    }

  }

  const handleAccountsChanged = (accounts: any) => {
    if (accounts.length > 0 && account !== accounts[0]) {
      console.log("atleast triggering the event")
      setAccount(accounts[0])

      loadShares()

    } else {
      console.log("no account found")
      setIsConnected(false)
      setAccount(null)
    }
  }

  

  return (

    <ProviderContext.Provider value = {{provider, setProvider}}>
        <main className="flex bg-background-coal min-h-screen flex-col items-center justify-between p-24 xl:px-48">
      <div className="mt-8 flow-root w-full">
        <button onClick={() => { connectToWalet() }} className="bg-button-base p-2 rounded-lg text-white">Connect</button>
        <div className=" overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-0">
                    NFT
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                    Tokens
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                    Ownership
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                    Liquidity Value {' (%)'}
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 gap-4">
                {myShares &&  myShares.map((share, index) => (
                  <tr key={index} className="mt-4">
                    <td>
                      {share.image&& share.image!=="" &&<Image src={toIPFS(share.image)} width={80} height={80} className="  rounded-md whitespace-nowrap my-2  text-sm text-gray-300" alt="NFT Image" />}
                    </td>

                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{share.tokens + ' ' + share.tokenSymbol}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{share.ownership}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">2</td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <Link href={`/${share.nftCollectionAddress}/${share.tokenId}`}  className=" p-4 py-2 text-button-primary hover:text-button-secondary rounded-lg bg-button-base">
                        Visit<span className="sr-only"></span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
    </ProviderContext.Provider>
  
  );
}

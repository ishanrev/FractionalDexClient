'use client'
import { Provider } from "ethers";
import { Signer } from "ethers";
import { JsonRpcSigner } from "ethers";
import { ethers, BrowserProvider, TransactionRequest } from "ethers";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { Database, Json } from "../../types/supabase";
import { connectToWalet, getTokenBalance } from "@/Functions/BlockchainFunctions";
import { getListOfNfts } from "@/Functions/SupabaseFuncs";
import Link from "next/link";
import { toIPFS, truncateValue } from "@/Functions/General";
import { ProviderContext } from "@/Functions/Contexts";
import { HeartIcon, PlusCircleIcon, PlusIcon } from "@heroicons/react/24/outline";
declare var window: any
type SharesTableRow = {
  image: string,
  tokens: number,
  ownership: number,
  liquidityValue: number,
  tokenSymbol: string,
  nftCollectionAddress: string,
  tokenId: number
}
interface Metadata {
  name: string;
  description: string;
  image: string;
}

export default function Home() {

  const { provider, setProvider, isConnected, setIsConnected } = useContext(ProviderContext)
  const [account, setAccount] = useState<string>("null")
  const [myShares, setMyShares] = useState<SharesTableRow[]>()

  useEffect(() => {
    if (isConnected) {
      console.log(provider)
      loadShares()
    }

  }, [isConnected])

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
        throw ("no signer avaailable")
      }
      const nfts = await getListOfNfts(await signer.getAddress())
      console.log(nfts)
      let temp = []

      for (let nft of nfts) {

        const { tokens, ownership } = await getTokenBalance(signer, await signer.getAddress() ?? "", nft.token_address ?? "")
        console.log(tokens)
        temp.push({
          image: nft.metadata?.image ?? "",
          tokens,
          ownership,
          liquidityValue: 10,
          tokenSymbol: nft.token_symbol ?? "",
          nftCollectionAddress: nft.nft_address ?? "",
          tokenId: nft.token_id ?? 0
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
      setIsConnected && setIsConnected(false)
      setAccount("")
    }
  }



  return (

    <main className="flex n bg-white min-h-screen flex-col items-center justify-between p-24  py-16 xl:px-48">
      <div className="mt-8 flow-root w-full">
        {/* <button onClick={() => { connectToWalet(window, setProvider, setIsConnected, setAccount) }} className="bg-gray-500 p-2 rounded-lg text-white">Connect</button> */}
        <div className="flex w-full justify-between items-center">
          <span className="text-xl text-bold font-semibold divide-y text-gray-500 "> My NFT shares</span>
          <Link href={'/explore'} className="rounded-lg p-2 opacity-100 active:shadow-gray-500 hover:opacity-75 active:shadow-sm active:opacity-100 5  bg-button-secondary text-white flex gap-2 items-center"> <span>Buy Shares</span> <span className=""> <PlusIcon className="w-6" /> </span></Link>
        </div>
        <div className=" no-scrollbar overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-500 sm:pl-0">
                    NFT
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-500">
                    Tokens
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-500">
                    Ownership
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-500">
                    Liquidity Value {' (%)'}
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300 gap-4">
                {myShares && myShares.map((share, index) => (
                  <tr key={index} className="mt-4">
                    <td>
                      {share.image && share.image !== "" && <Image src={toIPFS(share.image)} width={80} height={80} className="  rounded-md whitespace-nowrap my-2  text-sm text-gray-500" alt="NFT Image" />}
                    </td>

                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{truncateValue(share.tokens.toString()) + ' ' + share.tokenSymbol}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{truncateValue(share.ownership.toString())}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">2</td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <Link href={`/${share.nftCollectionAddress}/${share.tokenId}`}
                        className=" p-4 py-2 text-gray-500 hover:text-button-secondary rounded-lg bg-gray-200">
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

  );
}

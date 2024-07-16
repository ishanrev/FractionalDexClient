'use client'
import { Provider } from "ethers";
import { Signer } from "ethers";
import { ethers, BrowserProvider, TransactionRequest } from "ethers";
import Image from "next/image";
import { useEffect, useState } from "react";
declare var window: any

export default function Home() {

  const [provider, setProvider] = useState<BrowserProvider | null>(null)
  const [account, setAccount] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState<boolean>(false)

  const connectToWalet = async () => {
    try {
      if (window.ethereum) {
        const provider: BrowserProvider = new BrowserProvider(window.ethereum)
        await provider.send("eth_requestAccounts", [])
        const signer: Signer = await provider.getSigner()
        const address = await signer.getAddress()
        console.log("MetaMask connected", address)
        setAccount(address)
        setProvider(provider)
        setIsConnected(true)
        console.log(provider)
      } else {
        alert("No ethereum in the wallet")
        throw ("No ethereum in the wallet")
      }

    } catch (connectError) {
      console.log(connectError)
    }
  }

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged)
    }

    connectToWalet();
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
      } else {

      }
    }
  }, [])
  const handleAccountsChanged = (accounts: any) => {
    if (accounts.length > 0 && account !== accounts[0]) {
      console.log("atleast triggering the event")
      setAccount(accounts[0])
    } else {
      console.log("no account found")
      setIsConnected(false)
      setAccount(null)
    }
  }

  const CODEBASES = [{
    id: '2343248732',
    image: 'https://preview.redd.it/i-got-bored-so-i-decided-to-draw-a-random-image-on-the-v0-4ig97vv85vjb1.png?width=640&crop=smart&auto=webp&s=22ed6cc79cba3013b84967f32726d087e539b699',
    num_exercises: 2
  },{
    id: '2343248732',
    image: 'https://preview.redd.it/i-got-bored-so-i-decided-to-draw-a-random-image-on-the-v0-4ig97vv85vjb1.png?width=640&crop=smart&auto=webp&s=22ed6cc79cba3013b84967f32726d087e539b699',
    num_exercises: 2
  },{
    id: '2343248732',
    image: 'https://preview.redd.it/i-got-bored-so-i-decided-to-draw-a-random-image-on-the-v0-4ig97vv85vjb1.png?width=640&crop=smart&auto=webp&s=22ed6cc79cba3013b84967f32726d087e539b699',
    num_exercises: 2
  },{
    id: '2343248732',
    image: 'https://preview.redd.it/i-got-bored-so-i-decided-to-draw-a-random-image-on-the-v0-4ig97vv85vjb1.png?width=640&crop=smart&auto=webp&s=22ed6cc79cba3013b84967f32726d087e539b699',
    num_exercises: 2
  }]
  return (
    <main className="flex bg-background-coal min-h-screen flex-col items-center justify-between p-24">
      <div className="mt-8 flow-root w-full">
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
                    Liquidity Value
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 gap-4">
                {CODEBASES.map((codebase, index) => (
                  <tr key={index} className="mt-4">
                    <img src={codebase.image} className=" w-24 rounded-md whitespace-nowrap my-2  text-sm text-gray-300" alt = "NFT Image"/>

                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">2</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">2</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{codebase.num_exercises}</td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <button onClick={() => { }} className=" p-4 py-2 text-button-primary hover:text-button-secondary rounded-lg bg-button-base">
                        Visit<span className="sr-only"></span>
                      </button>
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

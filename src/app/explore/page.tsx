'use client'
import React, { useContext, useEffect, useState } from 'react'
import { ExploreCard } from '../../../types/general'
import { ProviderContext } from '@/Functions/Contexts'
import { getExploreNFTs } from '@/Functions/SupabaseFuncs'
import Image from 'next/image'
import { toIPFS } from '@/Functions/General'
import Link from 'next/link'
import { PlusIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'

function Explore() {

  const [nftCards, setNftCards] = useState<ExploreCard[]>([])
  const [search, setSearch] = useState<any>({})
  const { provider } = useContext(ProviderContext)
  const router = useRouter();
  const loadCards = async () => {
    try {
     
      const nfts = await getExploreNFTs(search)
      let temp: ExploreCard[] = []

      for (let nft of nfts) {
        temp.push({
          name: nft.metadata?.name ?? "",
          description: nft.metadata?.description ?? "",
          image: toIPFS(nft.metadata?.image ?? ""),
          imageAlt: nft.metadata?.name ?? "",
          href: "/" + nft.nft_address + "/" + nft.token_id,
        })
      }

      setNftCards(temp)

    } catch (loadError) {
      console.log(loadError);
    }
  }




  useEffect(() => {
    if (search.nftAddress !== "") {
      if (parseInt(search.tokenId) <= 0 || search.tokenId === "") {
        setSearch({ ...search, tokenId: undefined })
      }
      loadCards()
    }
  }, [search])
  useEffect(() => {
    loadCards()
  }, [])

  return (
    <div className="bg-white h-[100vh] overflow-y-scroll no-scrollbar">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ">
        <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:max-w-none lg:py-32 ">
          <div className=" flex flex-col  justify-between  xs:items-center ">

            <h2 className="text-2xl font-semibold text-gray-500">Nfts</h2>
            <div className='flex gap-4 '>
              <div className="rounded-lg p-2 text-gray-500 opacity-100  hover:opacity-75   
                border-2  flex gap-2 items-center"> <input placeholder='NFT Collection Address' className='' value={search.nftAddress} onChange={(e) => { setSearch({ ...search, nftAddress: e.target.value }) }} />
              </div>
              <div className="rounded-lg p-2 opacity-100 text-gray-500  hover:opacity-75   
                border-2  flex gap-2 items-center"> <input type='number' placeholder='Token Id' className='w-20' value={search.tokenId} onChange={(e) => { setSearch({ ...search, tokenId: e.target.value }) }} />
              </div>

            </div>
          </div>
          <div className='w-full  '>

            {/* <div className="mt-6 sm:gap-x-4 grid grid-cols-1 gap-y-8  sm:grid-cols-2  lg:grid-cols-3 justify-between "> */}
            <div className="mt-6  gap-x-4 gap-y-6 flex justify-start flex-wrap">

              {nftCards.map((card: ExploreCard, index: number) => (
                <div key={index} className=" relative overflow-hidden border w-[14rem] h-[16rem] sm:w-[16rem] sm:h-[20rem] md:w-[18rem] md:h-[22rem] lg:w-[18rem] lg:h-[22rem] z-2  rounded-xl">
                  <Link href={card.href}>
                    <div className='h-4/5 w-full relative overflow-hidden' >

                      <Image src={card.image} fill className="zoom cursor-pointer whitespace-nowrap " alt="NFT Image"  />
                    </div>
                    <div className="p-3">

                      <h3 className=" text-sm text-gray-500">
                        {card.name}
                      </h3>
                      <p className="text-base font-semibold text-gray-900">{card.description}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}

export default Explore
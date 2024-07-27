'use client'
import React, { useContext, useEffect, useState } from 'react'
import { ExploreCard } from '../../../types/general'
import { ProviderContext } from '@/Functions/Contexts'
import { getExploreNFTs } from '@/Functions/SupabaseFuncs'
import Image from 'next/image'
import { toIPFS } from '@/Functions/General'
import Link from 'next/link'
import { PlusIcon } from '@heroicons/react/24/outline'
import Info from '../Components/NewNFT/Info'

function Add() {

  const [nftCards, setNftCards] = useState<ExploreCard[]>([])
  const [search, setSearch] = useState<any>({})
  const { provider } = useContext(ProviderContext)





  return (
    <div className="bg-white h-[100vh] ">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:max-w-none lg:py-32">
          <div className="flex justify-between items-center">

            <h2 className="text-2xl font-semibold text-gray-500">Fractionalize NFT</h2>
            {/* <div className='flex gap-4 '>
              <div className="rounded-lg p-2 text-gray-500 opacity-100  hover:opacity-75   
                border-2  flex gap-2 items-center"> <input placeholder='NFT Collection Address' className='' value={search.nftAddress} onChange={(e) => { setSearch({ ...search, nftAddress: e.target.value }) }} />
              </div>
              <div className="rounded-lg p-2 opacity-100 text-gray-500  hover:opacity-75   
                border-2  flex gap-2 items-center"> <input type='number' placeholder='Token Id' className='w-20' value={search.tokenId} onChange={(e) => { setSearch({ ...search, tokenId: e.target.value }) }} />
              </div>

            </div> */}
          </div>

          <div className="mt-6 ">
            <Info />
          </div>
        </div>
      </div>
    </div >
  )
}

export default Add
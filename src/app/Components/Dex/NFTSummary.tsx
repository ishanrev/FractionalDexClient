'use client'
import React, { useContext, useEffect, useState } from 'react'
import { NFTInfo, NFTShare } from '../../../../types/general'
import { Database } from '../../../../types/supabase'
import { PaperClipIcon } from '@heroicons/react/20/solid'
import Copy from '../General/Copy'
import { ProviderContext } from '@/Functions/Contexts'
import { getTokenBalance } from '@/Functions/BlockchainFunctions'
import { truncateValue } from '@/Functions/General'

function NFTSummary({
  nft,
  swapping
}: {
  nft: Database['public']['Tables']['nfts']['Row'],
  swapping: boolean
}) {
  const [share, setShare] = useState<NFTShare>({ tokens: null, ownership: null })
  const { provider } = useContext(ProviderContext)



  const loadShares = async () => {
    try {
      const signer = await provider?.getSigner()
      if (!signer) {
        throw ("no signer avaailable")
      }
      let account = await signer.getAddress()
      const loadedShare = await getTokenBalance(signer, account ?? "", nft.token_address ?? "")
      setShare(loadedShare)



    } catch (loadError) {
      console.log(loadError);
    }

  }

  useEffect(()=>{
    loadShares()
  },[provider])

  useEffect(() => {
    loadShares()
  }, [])

  useEffect(() => {
    if (swapping === false) {

      loadShares()
    }
  }, [swapping])

  return (
    <div className='p-4 flex flex-col gap-6'>
      <div>
        <div className="px-4 sm:px-0">
          <h3 className="text-base font-semibold leading-7 text-gray-500">NFT Information</h3>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-900">NFT details and information.</p>
        </div>
        <div className="mt-2 border-t border-gray-100">
          <dl className="divide-y divide-gray-100">
            <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-500">Collection Address</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-900 sm:col-span-2 sm:mt-0">
                {nft.nft_address && <Copy text={nft.nft_address} />}
              </dd>
            </div>
            <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-500">Token Id</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-900 sm:col-span-2 sm:mt-0">
                {nft.token_id && nft.token_id}
              </dd>
            </div>
            <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-500">Creator address</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-790009000 sm:col-span-2 sm:mt-0">
                {nft.owner && <Copy text={nft.owner} />}
              </dd>
            </div>
            <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-500">Trade Token</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-900 sm:col-span-2 sm:mt-0">{nft.token_symbol && nft.token_symbol}</dd>
            </div>


          </dl>
        </div>
      </div>
      <div className='rounded-lg bg-[#f9f9f9] p-4 w-full h-full'>
        <h3 className="text-base font-semibold mb-3 leading-7 text-gray-500">Your Balance / Fractional Share</h3>
        <div className='flex gap-24 justify-start'>
          <span className='text-huge text-button-secondary'>
            {share.tokens && nft.token_symbol && `${truncateValue(share.tokens.toString()) + ' ' + nft.token_symbol}`}
          </span>
          <span className='text-huge text-button-secondary'>
            {share.ownership && `${truncateValue(share.ownership.toString())} %`}

          </span>
        </div>
      </div>
    </div>
  )
}

export default NFTSummary
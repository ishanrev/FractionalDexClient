import React from 'react'
import { NFTInfo } from '../../../../types/general'
import { Database } from '../../../../types/supabase'
import { PaperClipIcon } from '@heroicons/react/20/solid'
import Copy from '../General/Copy'

function NFTSummary({
  nft
}: {
  nft: Database['public']['Tables']['nfts']['Row']
}) {
  return (
    <div className='p-4 text-whit'>
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
    </div>
  )
}

export default NFTSummary
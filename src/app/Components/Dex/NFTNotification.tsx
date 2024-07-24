'use client'
import React, { useContext, useEffect, useState } from 'react'
import { Button, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'

import { NFTInfo, NFTShare, Transaction } from '../../../../types/general'
import { Database } from '../../../../types/supabase'
import { PaperClipIcon } from '@heroicons/react/20/solid'
import Copy from '../General/Copy'
import { ProviderContext } from '@/Functions/Contexts'
import { getTokenBalance } from '@/Functions/BlockchainFunctions'
import { truncateValue } from '@/Functions/General'

function NFTNotification({
  tokenValue,
  ethValue,
  type,
  swapping,
  transaction,
  nft
}: {
  tokenValue: string,
  ethValue: string,
  type: "native" | "eth",
  swapping: boolean,
  transaction: Transaction,
  nft: Database['public']['Tables']['nfts']['Row'],

}) {
  const [isOpen, setIsOpen] = useState<boolean>(true)
  function open() {
    setIsOpen(true)
  }

  function close() {
    setIsOpen(false)
  }



  useEffect(() => {
  }, [])

  useEffect(() => {
    let newOpen = !isOpen
    setIsOpen(newOpen)
  }, [transaction])

  return (
    <Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={close}>
      <DialogBackdrop className="fixed inset-0 bg-black/30" />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className="w-full max-w-md rounded-xl bg-white/50 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
          >
            <DialogTitle as="h3" className="text-base/7 font-medium text-gray-900">
              {transaction.success ? "Transaction successful": "Transaction Failed"}
            </DialogTitle>
            <p className="mt-2 text-sm/6 text-gray-600">
              The transaction was successful. { '\n' + 
              type==="native"?`${tokenValue} ${nft.token_symbol} was successfully swapped for ${ethValue} ETH`:`${ethValue} ETH was successfully swapped for ${tokenValue} ${nft.token_symbol} `}
            </p>
            <div className="mt-4">
              <Button
                className="inline-flex items-center gap-2 rounded-md bg-button-secondary py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:opacity-50 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"
                onClick={close}
              >
                Got it, thanks!
              </Button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}

export default NFTNotification
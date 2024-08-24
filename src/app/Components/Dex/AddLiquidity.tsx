'use client'
import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react'
import { Button, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'

import { NFTInfo, NFTShare, Transaction } from '../../../../types/general'
import { Database } from '../../../../types/supabase'
import { PaperClipIcon } from '@heroicons/react/20/solid'
import Copy from '../General/Copy'
import { ProviderContext } from '@/Functions/Contexts'
import { addLiquidity, getTokenBalance } from '@/Functions/BlockchainFunctions'
import { truncateValue } from '@/Functions/General'

function AddLiquidity({
  dexAddress,
  isOpen,
  setIsOpen,
  setReloadShares
}: {
  dexAddress: string,
  isOpen: boolean,
  setIsOpen: Dispatch<SetStateAction<boolean>>,
  setReloadShares: Dispatch<SetStateAction<boolean>>


}) {
  const [addTokens, setAddTokens] = useState<string>("")
  const [liquidity, setLiquidity] = useState<{
    initialLiquidityTokens: string,
    initialLiquidityValue: string
  }>({
    initialLiquidityTokens:  "",
    initialLiquidityValue:  ""
  })
  const [addEth, setAddEth] = useState<string>("~")
  const { provider, setProvider } = useContext(ProviderContext)

  function close() {
    setIsOpen(false)
  }


  async function addLiquidityFunction() {
    try {
      let signer = await provider?.getSigner()
      if (!signer) throw ("No provider available")
      console.log({
        dexAddress,
        ...liquidity
      })
      let res = await addLiquidity(signer, {
        dexAddress,
        ...liquidity
      })
      setIsOpen(false)
      setReloadShares((value)=>{
        return !value
      })
    } catch (err) {
      alert("Transaction Failed")
    }
  }


  useEffect(() => {
  }, [])



  return (
    <>
      {<Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={close}>
        <DialogBackdrop className="fixed inset-0 bg-black/30" />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="w-full max-w-md rounded-xl bg-white/50 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
            >
              <DialogTitle as="h3" className="text-base/7 font-medium text-gray-900">
                Add Liquidity
              </DialogTitle>
              <p className="mt-2 text-sm/6 text-gray-600">
              <div className="sm:col-span-3">
                    <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                      Liquitity Tokens
                    </label>
                    <div className="mt-2">
                      <input
                        onChange={(e) => { setLiquidity({ ...liquidity, initialLiquidityTokens: e.target.value }) }}
                        value={liquidity.initialLiquidityTokens}
                        placeholder='1000'

                        type="number"
                        autoComplete="given-name"
                        className="block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-button-secondary sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <br />
                  <div className="sm:col-span-3">
                    <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                      Liquitity Value (ETH)
                    </label>
                    <div className="mt-2">
                      <input
                        onChange={(e) => { setLiquidity({ ...liquidity, initialLiquidityValue: e.target.value }) }}
                        value={liquidity.initialLiquidityValue}
                        placeholder='0.3'

                        type="number"
                        autoComplete="family-name"
                        className="block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-button-secondary sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

              </p>
              <div className="mt-4">
                <Button
                  className="inline-flex items-center gap-2 rounded-md bg-button-secondary py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:opacity-50 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"
                  onClick={addLiquidityFunction}
                >
                  Add
                </Button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>}
    </>

  )
}

export default AddLiquidity
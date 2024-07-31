'use client'
/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import { useContext, useEffect, useState } from 'react'
import { NewFraction, newFractionToSupabase, UploadStages } from '../../../../types/newFraction'
import { addLiquidity, approveTransferOfAssetToken, approveTransferOfNFT, deployDex, fetchNFT, lockNFT } from '@/Functions/BlockchainFunctions'
import { ProviderContext } from '@/Functions/Contexts'
import { calculateProgress, nextStage, pastUploadStage, toIPFS } from '@/Functions/General'
import Image from 'next/image'
import { addNFTRow } from '@/Functions/SupabaseFuncs'
import { useIsMount } from '@/Functions/Hooks'
import { Line } from 'rc-progress'

export default function Info() {
  const { provider } = useContext(ProviderContext)
  const [config, setConfig] = useState<NewFraction>({})
  const [stage, setStage] = useState<UploadStages>("loadNFT")
  const isMount = useIsMount()
  const USER_INPUT_STAGES = ["loadNFT", "basicValues"]

  //Stages
  const loadNFT = async () => {
    const signer = await provider?.getSigner() ?? null
    let { metadata, owner } = await fetchNFT(signer, config.nftAddress ?? "", config.tokenId ?? "")
    if (owner && owner !== await signer?.getAddress()) {
      alert("You are not the owenr of this nft")
      return;
    }
    if (metadata) {
      setConfig({ ...config, metadata, fractionalOwners: [owner], liquidityProviders: [owner], owner })
      setStage(nextStage(stage))
      console.log("success")
    } else {
      alert("Invalid NFT address")
    }
  }

  const basicValues = () => {
    if (!config.tokenName || !config.tokenSymbol || !config.valuation || !config.numFractionalTokens || !config.initialLiquidityTokens || !config.initialLiquidityValue) {
      alert("Missing Token Name and Token Symbol")
      return
    }
    if (config.tokenSymbol.indexOf(" ") != -1) {
      alert("You can't have spaces in the token symbol")
      return
    }
    setStage(nextStage(stage))
  }

  const createDex = async () => {
    // setConfig({ ...config, dexAddress: "0x95cb369653C1C29C1D2EE83B883e75c3fF4BCa4e", tokenAddress:"0x7247d738Ca4dDbF64983397D6f70aCE17deDa265" })
    // setStage(nextStage(stage))

    let { dexAddress, tokenAddress } = await deployDex(await provider?.getSigner() ?? null, config.tokenName!, config.tokenSymbol!)
    if (dexAddress) {
      setConfig({ ...config, dexAddress, tokenAddress })
      setStage(nextStage(stage))
      console.log("success")
    } else {
      alert("Failed to deploy the DEX")
    }
  }

  const createSupabase = async () => {

    let res = await addNFTRow(newFractionToSupabase(config))
    if (res) {
      setStage(nextStage(stage))
      console.log("success")
    } else {
      alert("Invalid NFT address")
    }
  }

  const approvals = async () => {
    let signer = await provider?.getSigner()

    if (!signer) return

    let nftApproved = await approveTransferOfNFT(signer, config.dexAddress!, config.nftAddress!, config.tokenId!)

    if (!nftApproved) return

    let assetTokenApproved = await approveTransferOfAssetToken(signer, config.dexAddress!, config.tokenAddress!)

    if (!assetTokenApproved) return

    setStage(nextStage(stage))


  }

  const lock = async () => {
    let signer = await provider?.getSigner()
    if (!signer) return

    let locked = await lockNFT(signer, config)
    if (!locked) return

    console.log("successfully locked the NFT")
    setStage(nextStage(stage))

  }

  const liquidity = async () => {
    let signer = await provider?.getSigner()
    if (!signer) return

    let locked = await addLiquidity(signer, config)
    if (!locked) return

    console.log("successfully locked the NFT")
    setStage(nextStage(stage))

  }



  const processNext = async () => {
    console.log(stage)
    if (stage === "loadNFT") {
      await loadNFT()
    } else if (stage === "basicValues") {
      //Blockchain function to create dex
      basicValues()
    } else if (stage === "createDex") {
      //Blockchain function to create dex
      await createDex()
    } else if (stage === "createSupabase") {
      //Blockchain function to create dex
      await createSupabase()
    } else if (stage === "approvals") {
      //Blockchain function to create dex
      await approvals()
    } else if (stage === "lock") {
      //Blockchain function to create dex
      await lock()
    } else if (stage === "liquidity") {
      //Blockchain function to create dex
      await liquidity()
    }
  }

  useEffect(() => {
    if (!isMount && !USER_INPUT_STAGES.includes(stage)) {
      processNext()
    }
  }, [stage])


  return (
    <>
      <div className="space-y-12">
        <Line strokeWidth={1} strokeColor={"#008080"} percent={calculateProgress(stage)} />

        <div className="border-b border-gray-900/10 pb-12">
          {
            pastUploadStage(stage, "loadNFT") &&
            <div className=" overflow-hidden  relative w-[16rem] h-[20vh]   rounded-lg">

              {config?.metadata?.image && config?.metadata?.image !== "" &&
                <Image src={toIPFS(config?.metadata?.image)}
                  fill
                  className=" zoom -md whitespace-nowrap   text-sm text-gray-300"
                  alt="NFT Image"
                />}

            </div>
          }

          {/* <h2 className="text-base font-semibold leading-7 text-gray-900">Personal Information</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">Use a permanent address where you can receive mail.</p> */}
          {stage === "loadNFT" ?
            <>
              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                    NFT (ERC721) Address
                  </label>
                  <div className="mt-2">
                    <input
                      onChange={(e) => { setConfig({ ...config, nftAddress: e.target.value }) }}
                      value={config.nftAddress}
                      placeholder='0x504...57d38'

                      type="text"
                      autoComplete="given-name"
                      className="block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-button-secondary sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                    Token ID
                  </label>
                  <div className="mt-2">
                    <input
                      onChange={(e) => { setConfig({ ...config, tokenId: e.target.value }) }}
                      value={config.tokenId}
                      placeholder='Token Id'

                      type="number"
                      autoComplete="family-name"
                      className="block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-button-secondary sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>


              </div>
            </> :
            stage === "basicValues" ?
              <>
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                      Valutaion
                    </label>
                    <div className="mt-2">
                      <input
                        onChange={(e) => { setConfig({ ...config, valuation: e.target.value }) }}
                        value={config.valuation}
                        placeholder='5 ETH'

                        type="number"
                        autoComplete="given-name"
                        className="block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-button-secondary sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                      Number of Fractional Tokens
                    </label>
                    <div className="mt-2">
                      <input
                        onChange={(e) => { setConfig({ ...config, numFractionalTokens: e.target.value }) }}
                        value={config.numFractionalTokens}
                        placeholder='3000'

                        type="number"
                        autoComplete="family-name"
                        className="block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-button-secondary sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                      Token Name
                    </label>
                    <div className="mt-2">
                      <input
                        onChange={(e) => { setConfig({ ...config, tokenName: e.target.value }) }}
                        value={config.tokenName}
                        placeholder='APE'

                        type="text"
                        autoComplete="given-name"
                        className="block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-button-secondary sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                      Token Symbol
                    </label>
                    <div className="mt-2">
                      <input
                        onChange={(e) => { setConfig({ ...config, tokenSymbol: e.target.value }) }}
                        value={config.tokenSymbol}
                        placeholder='ARTAPE'

                        type="text"
                        autoComplete="family-name"
                        className="block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-button-secondary sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-3">
                    <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                      Initial Liquitity Tokens
                    </label>
                    <div className="mt-2">
                      <input
                        onChange={(e) => { setConfig({ ...config, initialLiquidityTokens: e.target.value }) }}
                        value={config.initialLiquidityTokens}
                        placeholder='APE'

                        type="number"
                        autoComplete="given-name"
                        className="block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-button-secondary sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                      Initial Liquitity Value (ETH)
                    </label>
                    <div className="mt-2">
                      <input
                        onChange={(e) => { setConfig({ ...config, initialLiquidityValue: e.target.value }) }}
                        value={config.initialLiquidityValue}
                        placeholder='ARTAPE'

                        type="number"
                        autoComplete="family-name"
                        className="block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-button-secondary sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>


                </div>
              </> :
              stage === "createDex" ?
                <>
                  <div className="mt-10 p-10 text-gray-700">

                    Please apprve the creation of the DEX contract for this NFT.
                    This contract manages all the liquidity pool functions for tokenization of this particular NFT

                  </div>
                </> : stage === "createSupabase" ?
                  <>
                    <div className="mt-10 p-10 text-gray-700">

                      Please apprve the creation of the DEX contract for this NFT.
                      This contract manages all the liquidity pool functions for tokenization of this particular NFT

                    </div>
                  </> : stage === "approvals" ?
                    <>
                      <div className="mt-10 py-10 text-gray-700">

                        Please approve the NFT to transfer and manage your NFT and its custom fractional tokens.
                        <br />
                        Note there will be two approvals in your connected wallet
                      </div>
                    </> : stage === "lock" ?
                      <>
                        <div className="mt-10 py-10 text-gray-700">

                          Please approve the trasnfer of the NFT from your wallet to the DEX contract, locking the NFT.
                          <br />
                          The NFT can be unlocked and re-trasnferred back into your account at anytime
                        </div>
                      </> : stage === "liquidity" ?
                        <>
                          <div className="mt-10 py-10 text-gray-700">

                            Please approve the initial liquidity trasnfer into the pool to successfully finalixe the creation of a DEX for this NFT

                          </div>
                        </> :
                        <></>
          }
          <br />
          {USER_INPUT_STAGES.includes(stage) && <button className=' disabled:opacity-75 rounded-lg p-2 bg-button-secondary text-white hover:opacity-75' onClick={processNext}>Next</button>}
        </div>

        {/* <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">Notifications</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
          </p>

          <div className="mt-10 space-y-10">
            <fieldset>
              <legend className="text-sm font-semibold leading-6 text-gray-900">By Email</legend>
              <div className="mt-6 space-y-6">
                <div className="relative flex gap-x-3">
                  <div className="flex h-6 items-center">
                    <input
                      id="comments"
                      name="comments"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-button-secondary"
                    />
                  </div>
                  <div className="text-sm leading-6">
                    <label htmlFor="comments" className="font-medium text-gray-900">
                      Comments
                    </label>
                    <p className="text-gray-500">Get notified when someones posts a comment on a posting.</p>
                  </div>
                </div>
                <div className="relative flex gap-x-3">
                  <div className="flex h-6 items-center">
                    <input
                      id="candidates"
                      name="candidates"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-button-secondary"
                    />
                  </div>
                  <div className="text-sm leading-6">
                    <label htmlFor="candidates" className="font-medium text-gray-900">
                      Candidates
                    </label>
                    <p className="text-gray-500">Get notified when a candidate applies for a job.</p>
                  </div>
                </div>
                <div className="relative flex gap-x-3">
                  <div className="flex h-6 items-center">
                    <input
                      id="offers"
                      name="offers"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-button-secondary"
                    />
                  </div>
                  <div className="text-sm leading-6">
                    <label htmlFor="offers" className="font-medium text-gray-900">
                      Offers
                    </label>
                    <p className="text-gray-500">Get notified when a candidate accepts or rejects an offer.</p>
                  </div>
                </div>
              </div>
            </fieldset>
            <fieldset>
              <legend className="text-sm font-semibold leading-6 text-gray-900">Push Notifications</legend>
              <p className="mt-1 text-sm leading-6 text-gray-600">These are delivered via SMS to your mobile phone.</p>
              <div className="mt-6 space-y-6">
                <div className="flex items-center gap-x-3">
                  <input
                    id="push-everything"
                    name="push-notifications"
                    type="radio"
                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-button-secondary"
                  />
                  <label htmlFor="push-everything" className="block text-sm font-medium leading-6 text-gray-900">
                    Everything
                  </label>
                </div>
                <div className="flex items-center gap-x-3">
                  <input
                    id="push-email"
                    name="push-notifications"
                    type="radio"
                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-button-secondary"
                  />
                  <label htmlFor="push-email" className="block text-sm font-medium leading-6 text-gray-900">
                    Same as email
                  </label>
                </div>
                <div className="flex items-center gap-x-3">
                  <input
                    id="push-nothing"
                    name="push-notifications"
                    type="radio"
                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-button-secondary"
                  />
                  <label htmlFor="push-nothing" className="block text-sm font-medium leading-6 text-gray-900">
                    No push notifications
                  </label>
                </div>
              </div>
            </fieldset>
          </div>
        </div> */}
      </div>
      {/* 
      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-button-secondary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Save
        </button>
      </div> */}
    </>
  )
}

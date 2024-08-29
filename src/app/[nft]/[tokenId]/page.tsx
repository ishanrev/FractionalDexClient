'use client'
import { Provider } from "ethers";
import { Signer } from "ethers";
import { JsonRpcSigner } from "ethers";
import { ethers, BrowserProvider, TransactionRequest } from "ethers";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { addLiquidity, approveTransferOfAssetToken, getMainForTokens, getTokenBalance, getTokensForMain, swapMainForTokens, swapTokensForMain } from "@/Functions/BlockchainFunctions";
import { addFractionalOwner, getListOfNfts, getNft } from "@/Functions/SupabaseFuncs";
import { useParams } from "next/navigation";
import { NFTInfo, Transaction } from "../../../../types/general";
import { Database } from "../../../../types/supabase";
import { emptyValue, SCREENS, toIPFS } from "@/Functions/General";
import SwapToken from "@/app/Components/Dex/SwapToken";
import useWindowDimensions, { useDebounce } from "@/Functions/Hooks";
import { ProviderContext } from "@/Functions/Contexts";
import NFTSummary from "@/app/Components/Dex/NFTSummary";
import Copy from "@/app/Components/General/Copy";
import NFTNotification from "@/app/Components/Dex/NFTNotification";
import { useRouter } from "next/navigation";
import ReactLoading from 'react-loading';
import Loading from "@/app/Components/General/Loading";
import AddLiquidity from "@/app/Components/Dex/AddLiquidity";

declare var window: any



export default function NFTProfile() {
	const [nft, setNft] = useState<Database['public']['Tables']['nfts']['Row'] | null>(null)
	const [ethValue, setEthValue] = useState<string>("")
	const [tokenValue, setTokenValue] = useState<string>("")
	const [type, setType] = useState<"native" | "eth">("native")
	const [current, setCurrent] = useState<string>("")
	const { debounce } = useDebounce()
	const { provider } = useContext(ProviderContext)
	const [swapping, setSwapping] = useState<boolean>(false)
	const [reloadShares, setReloadShares] = useState<boolean>(false)
	const router = useRouter()
	const { width } = useWindowDimensions()
	const [transaction, setTransaction] = useState<Transaction>({
		success: false,

	})
	const [addLiquidity, setAddLiquidity] = useState<boolean>(false)

	const handleNativeChange = async (newValue: string) => {
		if (emptyValue(newValue)) return
		if (!provider) {
			throw ("no provider available")
		}
		let signer = await provider?.getSigner() as JsonRpcSigner
		const ethReturn = await getTokensForMain(signer, nft?.dex_address ?? "", newValue)
		setEthValue(ethReturn)
		setType("native")
	}
	const handleEthChange = async (newValue: string) => {
		if (emptyValue(newValue)) return
		if (!provider) {
			throw ("no provider available")
		}


		let signer = await provider?.getSigner() as JsonRpcSigner
		const tokenReturn = await getMainForTokens(signer, nft?.dex_address ?? "", newValue)
		setTokenValue(tokenReturn)
		setType("eth")

	}
	const debouncedNativeSearch = debounce(handleNativeChange, 1500)
	const debouncedEthSearch = debounce(handleEthChange, 1500)

	const params = useParams()
	useEffect(() => {
		if (params) {
			fetchNFT(params)
		}
	}, [])

	const fetchNFT = async (params: any) => {
		try {
			const tempNFT = await getNft(params.nft, params.tokenId)
			setNft(tempNFT)
		} catch (nftError) {
			console.log(nftError)
			setNft(null)
			router.push("/404")
		}
	}

	function onEthChange(event: any) {
		const { value } = event.target;
		setEthValue(value)
		debouncedEthSearch(value)

	}
	function onTokenChange(event: any) {
		const { value } = event.target;
		setTokenValue(value)
		debouncedNativeSearch(value)
	}

	

	async function swap() {
		try {
			//Null checks
			setSwapping(true)
			if (nft?.dex_address && provider) {

				let signer = await provider?.getSigner() as JsonRpcSigner
				let account = await signer.getAddress()
				//Checks if the current user is one of the fractional owners, if not they need approval themselves
				if (!nft?.fractional_owners?.includes(account)) {
					let approvalResponse = await approveTransferOfAssetToken(signer, account, nft?.token_address!)
					let updateOwners = await addFractionalOwner(nft.dex_address!, [...nft.fractional_owners!, account])

					if(!approvalResponse){
						throw("")
					}
				}
				let res;
				if (type === "native") {

					res = await swapTokensForMain(signer, nft?.dex_address, tokenValue)
				} else {

					res = await swapMainForTokens(signer, nft?.dex_address, ethValue)
				}
				setSwapping(false)
				setTransaction({
					success: true
				})
			} else {
				throw ("provider missing or nft information missing or user does not have approval to accept these tokens")
			}
		} catch (swapError: any) {
			console.log(typeof (swapError))
			setTransaction({
				success: false,
				error: ""
			})
		}
	}



	return (
		<main className="flex bg-white min-h-screen flex-col items-center w-screen justify-between p-10  xl:px-48">
			{nft && <AddLiquidity nft={nft} tokenAddress={nft.token_address!} setReloadShares={setReloadShares} dexAddress={nft.dex_address!} isOpen={addLiquidity} setIsOpen={setAddLiquidity} />}
			{nft && <NFTNotification setSwapping={setSwapping} swapping={swapping} tokenValue={tokenValue} ethValue={ethValue} type={type} transaction={transaction} nft={nft} />}
			{nft &&
				<div className="mt-8 grid grid-cols-3  gap-8 2xl:max-w-[80%]">
					<div className=" overflow-hidden col-span-3 sm:col-span-3 md:col-span-1 lg:flex lg:flex-col justify-start items-center  w-full  rounded-lg">

						{nft?.metadata?.image && nft?.metadata?.image !== "" &&
							<Image src={toIPFS(nft?.metadata?.image)}
								width={width &&width > SCREENS.sm ? 420 : 250}
								height={width &&width > SCREENS.sm ? 160 : 80}
								className="  rounded-md whitespace-nowrap   text-sm text-gray-300"
								alt="NFT Image"
							/>}

					</div>
					<div className="h-full sm:col-span-3 col-span-3 md:col-span-2 lg:col-span2  bg-white rounded-lg">
						{nft && <NFTSummary reloadShares={reloadShares} nft={nft} swapping={swapping} />}
					</div>
					<div className="h-full bg-back border-t border-gray-300 gap-6 flex flex-col sm:flex-row justify-between  col-span-3 row-span-1   bg">
						<div className="flex flex-col py-4 gap-4 w-full sm:w-2/5">

							<div className="bg-[#f9f9f9] p-4 flex justify-between gap-4 rounded-lg ">
								<input
									type="number"
									placeholder="0.0"
									value={tokenValue}
									onChange={onTokenChange}

									className="bg-transparent w-4/5 text-text"
								/>
								<span className="text-text"> {nft?.token_symbol && nft.token_symbol}</span>
							</div>
							<div className=" flex justify-center items-center">{nft?.token_symbol &&
								<span className="text-text text-sm">

									{nft?.token_symbol && (type === "native" ? nft?.token_symbol + ' -> ' + 'ETH' : 'ETH' + ' -> ' + nft?.token_symbol)}

								</span>}</div>
							<div className="bg-[#f9f9f9] p-4 flex justify-between gap-4 rounded-lg ">
								<input
									type="number"

									placeholder="0.0"
									value={ethValue}
									onChange={onEthChange}

									className="bg-transparent w-4/5 text-text"
								/>
								<span className="text-text"> ETH </span>

							</div>

							<div className="w-full flex justify-between gap-4">

								<button disabled={provider === null} onClick={() => { setAddLiquidity(true) }} className="rounded-lg  text-xs lg:text-base hover:opacity-75 disabled:opacity-30 text-white text-center w-full p-3 py-2 bg-button-secondary cursor-pointer">
									Add Liquidity
								</button>

								<div className="flex hover:opacity-75 gap-2 w-full justify-end">
									{
										nft?.token_symbol && <button onClick={() => { swap() }} disabled={swapping} className="rounded-lg text-xs lg:text-base  disabled:opacity-30 text-white text-center w-full p-3 py-1 bg-button-secondary cursor-pointer">
											{swapping ?
												<>
													{/* Loading component */}
													<Loading />
												</> : <>
													{`Swap ${nft?.token_symbol + '  / ' + 'ETH'}`}
												</>}
										</button>
									}


								</div>

								{/* <div className="flex gap-2 bg justify-end">
								<button className="rounded-lg bg-background p-3 py-2 text-button-primary">
									Swap
								</button>

							</div> */}
							</div>
						</div>
						<div className="flex flex-col sm:w-1/2">

							<div className="flex w-full ">
								<div className="flex flex-col py-4 gap-4 h-3/5 w-1/2 ">

									<div className="px-4 sm:px-0">
										<h3 className="text-base font-semibold leading-7 text-gray-500">List of Owners</h3>
									</div>
									<div className="overflow-y-scroll no-scrollbar">
										{nft?.fractional_owners && nft.fractional_owners.map((owner, index) => {
											return (
												<div key={index}>
													<span className="p-1">
														<Copy text={owner} length={8} />
													</span>

												</div>
											)
										})}
									</div>


								</div>
								<div className="flex flex-col py-4 gap-4 h-3/5 w-1/2 ">

									<div className="px-4 sm:px-0">
										<h3 className="text-base font-semibold leading-7 text-gray-500">Liquidity Providers</h3>
									</div>
									<div className="overflow-y-scroll no-scrollbar">
										{nft?.liquidity_providers && nft.liquidity_providers.map((owner, index) => {
											return (
												<div key={index}>
													<span className="p-1">
														<Copy text={owner} length={8} />
													</span>

												</div>
											)
										})}
									</div>


								</div>
							</div>

						</div>
					</div>

				</div>}
		</main>
	);
}

//what else do we need on this we need a dex pool which Ill copy directly form the uniswap or somethig else,
//then Ill need a list of the fractional_owners which makes sense sorted in ascending and a button to see where your
//  ownership lies then some stats borrowed from the home page.tsx file similar to how thirdweb has
//then what else - I think theats pretty much it to be honest
/*honestly what all information do I need in this section I dont understand well we have the number of tokens that you own, 
the amount ownership in terms of the fractional ownership and bviously the 
liquidity but it can be calculated 
also I need an intermediary toWEI and toEth converter
*/

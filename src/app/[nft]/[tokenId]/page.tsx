'use client'
import { Provider } from "ethers";
import { Signer } from "ethers";
import { JsonRpcSigner } from "ethers";
import { ethers, BrowserProvider, TransactionRequest } from "ethers";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { getMainForTokens, getTokenBalance, getTokensForMain, swapMainForTokens, swapTokensForMain } from "@/Functions/BlockchainFunctions";
import { getListOfNfts, getNft } from "@/Functions/SupabaseFuncs";
import { useParams } from "next/navigation";
import { NFTInfo } from "../../../../types/general";
import { Database } from "../../../../types/supabase";
import { emptyValue, toIPFS } from "@/Functions/General";
import SwapToken from "@/app/Components/Dex/SwapToken";
import { useDebounce } from "@/Functions/Hooks";
import { ProviderContext } from "@/Functions/Contexts";
import NFTSummary from "@/app/Components/Dex/NFTSummary";
import Copy from "@/app/Components/General/Copy";
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


	const handleNativeChange = async (newValue: string) => {
		if (emptyValue(newValue)) return
		let signer = await provider?.getSigner() as JsonRpcSigner
		const ethReturn = await getTokensForMain(signer, nft?.dex_address ?? "", newValue)
		setEthValue(ethReturn)
		setType("native")
	}
	const handleEthChange = async (newValue: string) => {
		if (emptyValue(newValue)) return


		let signer = await provider?.getSigner() as JsonRpcSigner
		const tokenReturn = await getMainForTokens(signer, nft?.dex_address ?? "", newValue)
		setTokenValue(tokenReturn)
		setType("eth")

	}
	const debouncedNativeSearch = debounce(handleNativeChange, 1500)
	const debouncedEthSearch = debounce(handleEthChange, 1500)

	const params = useParams()
	useEffect(() => {

		console.log(provider)
		if (params) {
			console.log(params)
			fetchNFT(params)
		}
	}, [])

	const fetchNFT = async (params: any) => {
		try {
			const tempNFT = await getNft(params.nft, params.tokenId)
			setNft(tempNFT)
			console.log(tempNFT)
		} catch (nftError) {
			console.log(nftError)
		}
	}

	function onEthChange(event: any) {
		const { value } = event.target;
		setEthValue(value)
		console.log(event.target.value)
		debouncedEthSearch(value)

	}
	function onTokenChange(event: any) {
		const { value } = event.target;
		setTokenValue(value)
		console.log(event.target.value)
		debouncedNativeSearch(value)
	}

	async function swap() {
		try {
			//Null checks
			setSwapping(true)
			if (nft?.dex_address && provider) {

				let signer = await provider?.getSigner() as JsonRpcSigner
				let res;
				if (type === "native") {

					res = await swapTokensForMain(signer, nft?.dex_address, tokenValue)
				} else {

					res = await swapMainForTokens(signer, nft?.dex_address, ethValue)
				}
				console.log(res)
				setSwapping(false)
			}else{
				throw("provider missing or nft information missing")
			}
		} catch (swapError) {
			console.log(swapError)
		}
	}

	return (
		<main className="flex bg-white min-h-screen flex-col items-center justify-between p-20 px-16 xl:px-48">
			<div className="mt-8 grid   gap-8 w-full h-[80vh] 2xl:max-w-[70%]">
				<div className="  flex flex-col justify-start items-center  w-full  rounded-lg">

					{nft?.metadata?.image && nft?.metadata?.image !== "" &&
						<Image src={toIPFS(nft?.metadata?.image)}
							width={400}
							height={160}
							className="  rounded-md whitespace-nowrap my-2  text-sm text-gray-300"
							alt="NFT Image"
						/>}

				</div>
				<div className="h-full  bg-white rounded-lg">
					{nft && <NFTSummary nft={nft} swapping = {swapping} />}
				</div>
				<div className="h-full bg-back border-t border-gray-300 gap-6 flex justify-between  col-span-3 row-span-1   bg">
					<div className="flex flex-col py-4 gap-4 w-2/5">

						<div className="bg-[#f9f9f9] p-4 rounded-lg ">
							<input
								type="number"
								placeholder="0.0"
								value={tokenValue}
								onChange={onTokenChange}

								className="bg-transparent w-full text-text"
							/>

						</div>
						<div className=" flex justify-center items-center">{nft?.token_symbol &&
							<span className="text-text text-sm">

								{nft?.token_symbol && (type === "native" ? nft?.token_symbol + ' -> ' + 'ETH' : 'ETH' + ' -> ' + nft?.token_symbol)}

							</span>}</div>
						<div className="bg-[#f9f9f9] p-4 rounded-lg ">
							<input
								type="number"

								placeholder="0.0"
								value={ethValue}
								onChange={onEthChange}

								className="bg-transparent w-full text-text"
							/>

						</div>

						<div className="w-full">

							<div className="flex gap-2 w-full justify-end">
								{
									nft?.token_symbol && <button onClick={() => {swap() }} disabled={swapping} className="rounded-lg disabled:opacity-30 text-white text-center w-full p-3 py-2 bg-button-secondary cursor-pointer">
										Swap {nft?.token_symbol + ' / ' + 'ETH'}
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
					<div className="flex flex-col py-4 gap-4 h-3/5 w-2/5 ">

						<div className="px-4 sm:px-0">
							<h3 className="text-base font-semibold leading-7 text-gray-500">List of Owners</h3>
							<p className="mt-1 max-w-2xl text-sm leading-6 text-gray-900">NFT details and information.</p>
						</div>
						<div className="overflow-y-scroll">
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
				</div>

			</div>
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

import { Signer, toBigInt } from "ethers";
import { Provider, ethers } from "ethers";
import { Contract } from "ethers";
//ABI imports
import AssetToken from "./../../abi/AssetToken.json"
import NFTDex from "./../../abi/NFTDex.json"
import ERC721ABI from "./../../abi/ERC721.json"

import { JsonRpcSigner } from "ethers";
import { ContractTransactionResponse } from "ethers";
import { BrowserProvider } from "ethers";
import { Dispatch, SetStateAction } from "react";
import { Metadata } from "../../types/metadata";
import axios from "axios";
import { toIPFS } from "./General";
import { ContractFactory } from "ethers";
import { NewFraction } from "../../types/newFraction";

export const PLATFORM_ADDRESS = "0x9f889ee78F0B1E86d52Bb24367D889a0296Fa2dD"
export const MAX_TRANSFER_TOKENS = "10000"
export async function getTokenBalance(signer:Signer, accountAddress:string, tokenAddress:string) : Promise<{tokens:number, ownership:number}>{
	try{
	const tokenContract:Contract = new ethers.Contract(tokenAddress, AssetToken.abi, signer)
	
	const balance = await tokenContract.balanceOf(accountAddress);

	const decimals = await tokenContract.decimals()
	const totalSupply = await tokenContract.totalSupply()
	const formattedBalance = ethers.formatUnits(balance, decimals);
	const formattedTotalSupply = ethers.formatUnits(totalSupply, decimals);
	const balanceNumber = parseFloat(formattedBalance);
	const totalSupplyNumber = parseFloat(formattedTotalSupply);
	const percentageOwnership = (balanceNumber / totalSupplyNumber) * 100;

		return {tokens: balanceNumber, ownership: percentageOwnership};
	}catch(error){
		console.log(error)
		throw(error)
	}

}
export async function getTokensForMain(signer:JsonRpcSigner, dexAddress:string, tokens:string) : Promise<string>{
	try{
		const tokensInWei = ethers.parseUnits(tokens)
		const dexContract:Contract = new ethers.Contract(dexAddress, NFTDex.abi, signer)
		const ethInWei = await dexContract.getNativeForMainTokens(ethers.toBigInt(tokensInWei))
		const returnEth = ethers.formatEther(ethInWei)
		return returnEth
	}catch(error){
		console.log(error)
		throw(error)
	}

}

export async function getMainForTokens(signer:Signer, dexAddress:string, ethAmount:string) : Promise<string>{
	try{
		const ethInWei = ethers.parseUnits(ethAmount)
		const dexContract:Contract = new ethers.Contract(dexAddress, NFTDex.abi, signer)
		
		const tokensInWei = await dexContract.getMainForNativeTokens(ethers.toBigInt(ethInWei))
		const returnTokens = ethers.formatUnits(tokensInWei)
		return returnTokens
	}catch(error){
		console.log(error)
		throw(error)
	}

}
export async function swapTokensForMain(signer:JsonRpcSigner, dexAddress:string, tokens:string) : Promise<boolean>{
	try{
		const tokensInWei = ethers.parseUnits(tokens)
		const dexContract:Contract = new ethers.Contract(dexAddress, NFTDex.abi, signer)
		const ethInWei:ContractTransactionResponse = await dexContract.swapNativeForMain(ethers.toBigInt(tokensInWei))
		const receipt = await ethInWei.wait()
		
		return true
	}catch(error){
		console.log(error)
		throw(error)
	}

}

export async function swapMainForTokens(signer:Signer, dexAddress:string, ethAmount:string) : Promise<boolean>{
	try{
		const ethInWei = ethers.parseUnits(ethAmount)
		const dexContract:Contract = new ethers.Contract(dexAddress, NFTDex.abi, signer)
		const contractFunctionCallMetadata = {
			value: ethInWei
		}
		const tokensInWei:ContractTransactionResponse = await dexContract.swapMainforNative(contractFunctionCallMetadata)
		const receipt = await tokensInWei.wait()
		
		return true
	}catch(error){
		console.log(error)
		throw(error)
	}

}

export const connectToWalet = async (
	window:any,
	setProvider: Dispatch<SetStateAction<ethers.BrowserProvider | null>> |null,
  setIsConnected: Dispatch<SetStateAction<boolean>> |null,
	setAccount: Dispatch<SetStateAction<string>>,
	onConnect?: (...args:any)=>{}
	 ) => {
	try {
		if (window.ethereum) {
			const providerTemp: BrowserProvider = new BrowserProvider(window.ethereum)
			await providerTemp.send("eth_requestAccounts", [])
			const signer: Signer = await providerTemp.getSigner()
			const address = await signer.getAddress()
			
			setProvider && setProvider(providerTemp)
			
			setIsConnected && setIsConnected(true)
			setAccount(address)
			onConnect && onConnect()

		} else {
			alert("No ethereum in the wallet")
			throw ("No ethereum in the wallet")
		}

	} catch (connectError) {
		console.log(connectError)
	}
}


export const fetchNFT = async (signer:Signer|null, nftAddress:string, tokenId:string):Promise<{metadata:Metadata|null, owner:string}>=>{
	try{
		const nftContract:Contract = new ethers.Contract(nftAddress, ERC721ABI ,signer);
		const tokenURI:string = await nftContract.tokenURI(tokenId)
		const owner:string = await nftContract.ownerOf(tokenId)
		let res = await axios.get(toIPFS(tokenURI));
		return {metadata:res.data, owner}||null
	}catch(fetchError){
		console.log(fetchError)
		return {metadata:null, owner:""}
	}
}

export const deployDex = async (signer:Signer |null, tokenName:string, tokenSymbol:string):Promise<{dexAddress:string, tokenAddress:string}>=>{
	try{
		const deployArgs = [ 
			tokenName,
			tokenSymbol,
			PLATFORM_ADDRESS
		]
		const dexContractFactory:ContractFactory = new ethers.ContractFactory(NFTDex.abi, NFTDex.bytecode, signer )
		const dex = await dexContractFactory.deploy(...deployArgs)
		const receipt = await dex.deploymentTransaction()?.wait()

		const dexContract = new ethers.Contract(receipt?.contractAddress??"", NFTDex.abi, signer)
		const tokenAddress = await dexContract.assetToken();
		if(!receipt || !receipt.contractAddress || !tokenAddress){
			throw("Still not deploying the contract properly")
		}
		return {dexAddress:receipt?.contractAddress??null, tokenAddress}
	}catch(deployError){
		console.log(deployError)
		throw(deployError)
	}
	
}


export async function approveTransferOfNFT(signer:Signer, dexAddress:string,nftAddress:string, tokenId:string) : Promise<boolean>{
	try{
		const account = await signer.getAddress()
		const nftContract:Contract = new ethers.Contract(nftAddress, ERC721ABI, signer)
		
		const approveResponse:ContractTransactionResponse = await nftContract.approve(dexAddress, tokenId)
		const receipt = await approveResponse.wait()
		
		return true
	}catch(error){
		console.log(error)
		return false
	}

}
//here dexAddress ciuld be the user address as well
export async function approveTransferOfAssetToken(signer:Signer, dexAddress:string, tokenAddress:string) : Promise<boolean>{
	try{
		const account = await signer.getAddress()
		const nftContract:Contract = new ethers.Contract(tokenAddress, AssetToken.abi, signer)
		const maxTokensInWei = ethers.parseUnits(MAX_TRANSFER_TOKENS)
		const approveResponse:ContractTransactionResponse = await nftContract.approve(dexAddress,maxTokensInWei )
		const receipt = await approveResponse.wait()
		
		
		return true
	}catch(error){
		console.log(error)
		return false
	}

}
export async function lockNFT(signer: JsonRpcSigner, config:NewFraction): Promise<boolean>{
	try{
		const account = await signer.getAddress()
		const dexContract:Contract = new ethers.Contract(config.dexAddress!, NFTDex.abi, signer)
		const numTokensInWei = ethers.parseUnits(config.numFractionalTokens!)
		const lockedResponse:ContractTransactionResponse = await dexContract.uploadNFT(config.valuation,numTokensInWei,config.nftAddress, config.tokenId  )
		const receipt = await lockedResponse.wait()
		
		return true
	}catch(error){
		console.log(error)
		return false
	}
}
export async function addLiquidity(signer: JsonRpcSigner, config:NewFraction): Promise<boolean>{
	try{
		const account = await signer.getAddress()
		const dexContract:Contract = new ethers.Contract(config.dexAddress!, NFTDex.abi, signer)
		const transactionMetadata = {
			value: ethers.parseUnits(config.initialLiquidityValue!)
		}
		const initialLiquidityTokensInWei = ethers.parseUnits(config.initialLiquidityTokens!)
		const lockedResponse:ContractTransactionResponse = await dexContract.addLiquidity(initialLiquidityTokensInWei,transactionMetadata  )
		const receipt = await lockedResponse.wait()
		
		return true
	}catch(error){
		console.log(error)
		return false
	}
}

export async function getMinTokensForAddingLiquidity(provider: Provider, signer:JsonRpcSigner, amount:string, dexAddress:string, tokenAddress:string):Promise<string>{
	try{
	const tokenContract:Contract = new ethers.Contract(tokenAddress, AssetToken.abi, signer)
	
	const decimals = await tokenContract.decimals()
	const tokenReserve = await tokenContract.balanceOf(dexAddress);
	const reservedEth = await provider.getBalance(dexAddress)
	const formattedTokenReserve = ethers.formatUnits(tokenReserve, decimals)
	const formattedReserveEth = ethers.formatUnits(reservedEth, decimals)
	const tokenReserveNumber = parseFloat(formattedTokenReserve)
	const reservedEthNumber = parseFloat(formattedReserveEth)
	const ethAmountNumber = parseFloat(amount)
	console.log(tokenReserveNumber, ethAmountNumber, reservedEthNumber)

	const minimumAmount = (tokenReserveNumber* ethAmountNumber)/reservedEthNumber
	return minimumAmount.toString();

	
	}catch(error){
		console.log(error)
		throw(error)
	}
}
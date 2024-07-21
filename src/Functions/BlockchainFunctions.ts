import { Signer, toBigInt } from "ethers";
import { Provider, ethers } from "ethers";
import { Contract } from "ethers";
import AssetToken from "./../../abi/AssetToken.json"
import NFTDex from "./../../abi/NFTDex.json"
import { JsonRpcSigner } from "ethers";
import { ContractTransactionResponse } from "ethers";

export async function getTokenBalance(signer:Signer, accountAddress:string, tokenAddress:string) : Promise<{tokens:number, ownership:number}>{
	try{

	const tokenContract:Contract = new ethers.Contract(tokenAddress, AssetToken.abi, signer)
	
	const balance = await tokenContract.balanceOf(accountAddress);
	console.log(balance)

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
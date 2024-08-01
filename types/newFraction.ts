import { Database } from "./supabase"

export type UploadStages = "loadNFT" | "basicValues" | "createDex" | "createSupabase" | "approvalNFT"| "approvalToken" | "lock" | "liquidity" | "Done"

export type NewFraction = {
  nftAddress?:string,
  tokenId?:string,
  metadata?: any,
  valuation?:string,
  numFractionalTokens?:string,
  tokenName?: string,
  tokenSymbol?: string,
  dexAddress ?: string,
  fractionalOwners?:string[],
  tokenAddress?:string,
  liquidityProviders?:string[],
  owner?:string,
  initialLiquidityTokens?:string,
  initialLiquidityValue?:string
}

export function newFractionToSupabase(nft:NewFraction): any{
  return{
    dex_address: nft.dexAddress!,
    fractional_owners: nft.fractionalOwners!,
    liquidity_providers: nft.liquidityProviders!,
    metadata: nft.metadata,
    nft_address:nft.nftAddress!,
    owner: nft.owner!,
    token_address: nft.tokenAddress!,
    token_id: parseInt(nft.tokenId!),
    token_name: nft.tokenName!,
    token_symbol: nft.tokenSymbol!
  }
}

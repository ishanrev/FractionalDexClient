export interface NFTInfo{
  nftAddress:string,
  tokenId:number
}

export interface NFTShare{
  tokens:number|null,
  ownership:number|null
}

export interface Transaction{
  success: boolean,
  error?:string
}
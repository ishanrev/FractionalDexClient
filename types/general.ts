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

export interface ExploreCard{
  name: string,
  description: string,
  image: string,
  imageAlt: string,
  href: string,
}
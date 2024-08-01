import { UploadStages } from "../../types/newFraction";
export const  STAGES = ["loadNFT" , "basicValues" , "createDex" , "createSupabase" , "approvalNFT", "approvalToken" , "lock" , "liquidity", "Done"]
 
export function toIPFS(baseURL:string){
  let ipfsURL = "https://ipfs.io/ipfs/"+ baseURL.substring(baseURL.indexOf("/")+2)
  return ipfsURL
}

export function emptyValue(value:string):boolean{
  console.log(value==="" || value==="0")
  return value==="" || value==="0"
}

export function truncateAddress(baseAddress:string, stopLength:number):string{
    if (typeof baseAddress !== 'string' || baseAddress.length < 10) {
      throw new Error('Invalid address format ' + baseAddress);
    }
  
    // Extract the first 4 characters and the last 4 characters
    const start = baseAddress.slice(0, stopLength);
    const end = baseAddress.slice(-1*stopLength);
  
    // Combine them with '...'
    return `${start}...${end}`;
}

export function truncateValue(value:string, sliceNum = 4):string{
  if (typeof value !== 'string' ) {
    throw new Error('Invalid address format');
  }

  // Extract the first 4 characters and the last 4 characters
  const start = value.slice(0, sliceNum);

  // Combine them with '...'
  return `${start}`;
}

export function pastUploadStage(currStage:UploadStages, targetStage:UploadStages):boolean{

  return STAGES.indexOf(currStage) > STAGES.indexOf(targetStage)
}

export function nextStage(currStage:UploadStages): UploadStages{
  //@ts-ignore
  return STAGES[STAGES.indexOf(currStage)+1]
}

export function calculateProgress(currStage:UploadStages){
  return (STAGES.indexOf(currStage)+1)*100/STAGES.length
}
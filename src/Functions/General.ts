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


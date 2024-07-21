import { Database } from "../../types/supabase";
import { SupabaseClient, createClient } from '@supabase/supabase-js'

const supabase: SupabaseClient<Database> = createClient<Database>(process.env.SUPABASE_PROJECT_URL ||"", process.env.SUPABASE_ANON_KEY ||"")


export async function getListOfNfts(userAddress:string):Promise<Database['public']['Tables']['nfts']['Row'][]>{
        const { data, error } = await supabase
        .from('nfts')
        .select('*')
        .contains('fractional_owners', [userAddress])
        console.log(data)
        if(error && !data){
            throw(error)
        }
        return data || []
}

export async function getNft(nftAddress:string, tokenId:string):Promise<Database['public']['Tables']['nfts']['Row']>{
    const { data, error } = await supabase
    .from('nfts')
    .select('*')
    .match({nft_address: nftAddress, token_id:tokenId})
    console.log(data)
    if(error && !data){
        throw(error)
    }
    return data[0] 
}
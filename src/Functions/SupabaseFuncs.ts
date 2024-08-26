import { NewFraction } from './../../types/newFraction';
import { Database } from "../../types/supabase";
import { SupabaseClient, createClient } from '@supabase/supabase-js'

const projectURL = process.env.NODE_ENV==="production"?process.env.SUPABASE_PROJECT_URL_PRODUCTION: process.env.SUPABASE_PROJECT_URL
const anonKey = process.env.NODE_ENV==="production"?process.env.SUPABASE_ANON_KEY_PRODUCTION: process.env.SUPABASE_ANON_KEY
const supabase: SupabaseClient<Database> = createClient<Database>(projectURL ||"",anonKey ||"")


export async function getListOfNfts(userAddress:string):Promise<Database['public']['Tables']['nfts']['Row'][]>{
        const { data, error } = await supabase
        .from('nfts')
        .select('*')
        .contains('fractional_owners', [userAddress])
        if(error || !data){
            throw(error)
        }
        return data || []
}

export async function getNft(nftAddress:string, tokenId:string):Promise<Database['public']['Tables']['nfts']['Row']>{
    const { data, error } = await supabase
    .from('nfts')
    .select('*')
    .match({nft_address: nftAddress, token_id:tokenId})
    if(error || !data){
        throw(error)
    }
    return data[0] 
}

export async function getExploreNFTs({nftAddress, tokenId}:{nftAddress?:string, tokenId?:string}):Promise<Database['public']['Tables']['nfts']['Row'][]>{
    let match = {
        nft_address: nftAddress, token_id:tokenId
    }
    if(match.nft_address=== undefined){
        delete match['nft_address']
    }
    if(match.token_id=== undefined){
        delete match['token_id']
    }
    const { data, error } = await supabase
    .from('nfts')
    .select('*')
    .match(match)
    if(error || !data){
        throw(error)
    }
    return data || []
}

export async function addNFTRow(nft:any):Promise<boolean>{
    try {
        const { data, error } = await supabase
            .from('nfts')
            .insert([nft])
            .select("*");

       

        if (error) {
            console.error('Error inserting data:', error);
            throw error;
        }

        if (!data) {
            console.error('No data returned after insertion');
            return false;
        }

        return true;
    } catch (err) {
        console.error('Unexpected error:', err);
        throw err;
    }
}

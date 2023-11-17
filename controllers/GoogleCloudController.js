
import fetch from 'node-fetch';
import * as dotenv from 'dotenv'
dotenv.config()

export async function pageSpeed(pageUrl){
    
    const url = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${pageUrl}&key=${process.env.GOOGLEAPIKEY} `
    const res = await fetch(url);
    const json = await res.json();
    return json
}

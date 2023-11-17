
import fetch from 'node-fetch';

export async function pageSpeed(pageUrl){
    
    const url = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${pageUrl}&key= AIzaSyAmuh6GfvSNZRiYm1QFWyNPy5gfu24iuZI `
    const res = await fetch(url);
    const json = await res.json();
    return json
}

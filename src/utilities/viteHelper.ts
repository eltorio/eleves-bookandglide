/**
 * 
 * @param url absolute path of asset (must begin with @/assets/)
 * @returns a vite transformed url string
 */
export function $require(url:string):string{
    const correctedUrl = `../assets/${url.replace('@/assets/','')}`;
    let metaUrl = import.meta.url;
    if (metaUrl.search(/\?/) !== -1){
      metaUrl = metaUrl.split('?')[0]
    } 
    console.log(`req url: ${url} correctedUrl: ${correctedUrl} metaUrl:${metaUrl}`);
    return new URL(correctedUrl,metaUrl).href
  }
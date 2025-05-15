
export default function hashGenerator(len:number){
    let options = "ncsdkhusfojfofhonnadiojaSNNOIODFJJNDOSOIAPQPOCNII";
    const length = options.length;
    let ans = "";
    for (let i=0; i<len; i++){
         ans += options[(Math.floor(Math.random()*length))]
    }
    return ans;
}
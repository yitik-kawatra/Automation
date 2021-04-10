const fs=require('fs');
const pup = require("puppeteer");
let finalData={};
let names=["diegomura","yitik-kawatra"];
let count=0;
let github=async function() {
    for(let i=0;i<names.length;i++){
       personData(names[i]);
    }
}
async function personData(personid){
    let browser = await pup.launch({
        headless: false,
        defaultViewport: false,
        args: ["--start-maximized"]
      });
    
      let pages = await browser.pages();
      let tab = pages[0];
      
    await tab.goto("https://github.com/"+personid);
    await tab.waitForSelector('a.UnderlineNav-item');
    let list=await tab.$$('a.UnderlineNav-item');
    await list[1].click();
    
    await tab.waitForSelector('.wb-break-all a')
    let elems=await tab.$$('.wb-break-all a');
    let nametag=await tab.$('.p-name.vcard-fullname.d-block.overflow-hidden');
    let personName="";
     personName=await tab.evaluate(function(ele){
        return ele.innerText;
    },nametag);
    let temparr=[];
    finalData[personName]=temparr;
    for(let i=0;i<elems.length;i++){
        let link=await tab.evaluate(function(elem){
            return elem.getAttribute('href');
        },elems[i]);
        let obj={};
        let repname=await tab.evaluate(function(elem){
            return elem.innerText;
        },elems[i]);
        obj["reponame"]=repname;

        await repoData("https://github.com/"+link,obj,await browser.newPage());
        temparr.push(obj);
        
    }
   await browser.close();
    count++;
    if(count==names.length){
        fs.writeFileSync('repodata.json',JSON.stringify(finalData));
    }
        
}

async function repoData(link,obj,tab){
 await tab.goto(link);
 await tab.waitForSelector('.social-count.js-social-count');
 let starelem=await tab.$('.social-count.js-social-count');
 let starcount=await tab.evaluate(function(ele){
     return ele.innerText;
 },starelem);
 obj['stars']=starcount;
 let commitelem=await tab.$('span strong');
 let commitscount=await tab.evaluate(function(ele){
     return ele.innerText;
 },commitelem);
 obj['commits']=commitscount;
  tab.close();
}


module.exports.github=github;
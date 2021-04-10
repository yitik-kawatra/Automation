const pup = require("puppeteer");
const fs=require('fs');
const file2=require('./githubscript.js');

let count=0;
  let splaces = ["Chennai","Kolkata"];
  let dplaces = ["New delhi","Mumbai"];

async function main() {
  let browser = await pup.launch({
    headless: false,
    defaultViewport: false,
    args: ["--start-maximized"]
  });

  for(let i=0;i<splaces.length;i++ ){
    getDetails(splaces[i],dplaces[i],await browser.newPage());
  }
}

  async function getDetails(splace,dplace,tab){
  await tab.goto("https://www.google.co.in/maps");
  await tab.waitForNavigation({ waitUntil: "networkidle2" });
  await tab.waitForSelector(".tactile-searchbox-input", { visible: true });
  await tab.type(".tactile-searchbox-input", dplace);
  await tab.keyboard.press("Enter");
  await tab.waitForSelector('button[data-value="Directions"]', {
    visible: true,
  });
  await tab.click('button[data-value="Directions"]');
  await tab.waitForNavigation({ waitUntil: "networkidle2" });
  await tab.click('div[data-travel_mode="0"]');
  await tab.click("#directions-searchbox-0 .tactile-searchbox-input");
  await tab.keyboard.type(splace);
  await tab.keyboard.press("Enter");
  await tab.waitForNavigation({ waitUntil: "networkidle2" });
  await tab.waitForSelector(".section-directions-trip-numbers",{visible:true});
  let time=" ";
  let distance=" ";
  await tab.waitForXPath('//*[@id="section-directions-trip-0"]/div/div[1]/div[1]/div[1]/span[1]');
  await tab.waitForXPath('//*[@id="section-directions-trip-0"]/div/div[1]/div[1]/div[2]/div');
  let num1 = (await tab.$x(
    '//*[@id="section-directions-trip-0"]/div/div[1]/div[1]/div[1]/span[1]'
  ))[0];
  let num2 = (await tab.$x(
    '//*[@id="section-directions-trip-0"]/div/div[1]/div[1]/div[2]/div'
  ))[0];

  
  time = await tab.evaluate(function (ele) {
    return ele.innerText;
  }, num1);
  
  distance= await tab.evaluate(function(ele){
     return ele.innerText;
 },num2);
let ans=`The travelling time between ${splace} and ${dplace} is ${time} and the distance is ${distance}`;

 fs.appendFileSync('details.txt',ans+'\n');
 tab.close();
 count++;
 if(count==splaces.length){
   file2.github();
 }
}





main()
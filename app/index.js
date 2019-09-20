const puppeteer = require('puppeteer');

(async () => {

    const browser = await puppeteer.launch({
        headless: false,
        // executablePath: 'D:/Program Files (x86)/360/360chrome/360cse_11.0.2086.0/Chrome-bin/360chrome.exe',
        defaultViewport:{
            width: 1280,
            height: 1080,
        }
    })
    console.log('launch');

    const page = await browser.newPage()
    await page.goto('https://fanyi.baidu.com')
    
    page.click('.account-login');await page.waitFor(3000);
    page.click('.tang-pass-footerBarULogin.pass-link');await page.waitFor(1000);
    page.type('.pass-text-input.pass-text-input-userName', 'web_jim', {delay: 100});await page.waitFor(3000);
    page.type('.pass-text-input.pass-text-input-password', 'ljm192389590', {delay: 100});await page.waitFor(3000);
    page.click('.pass-button.pass-button-submit');;await page.waitFor(1000);
    await page.waitFor(10000);

    page.type('#baidu_translate_input', 'test001', {delay: 100});await page.waitFor(1000);    
    page.click('.operate-btn.op-sound.data-hover-tip');await page.waitFor(500);    
    
    const input_value = await page.$('#baidu_translate_input');
    input_value.target.value = '';
    page.type('#baidu_translate_input', 'test002', {delay: 100});await page.waitFor(1000);    
    page.click('.operate-btn.op-sound.data-hover-tip');await page.waitFor(500);



    console.log('game over');
    // await browser.close();

})()
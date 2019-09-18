import fs from 'fs'
import path from 'path'
import jsdom from 'jsdom'

function resolve (dir) {
    return path.join(__dirname, '..', dir)
}

const { JSDOM } = jsdom;

const readFiles = (dir = './public/json/')=>{
    fs.readdir(dir,(err,paths)=>{
        if (err) throw err;
        const sumData = [];
        paths.map(item=>{
            const filePath = dir + item;
            const json = require(resolve(filePath));
            const oneData = getUrl(json);
            sumData.push(oneData);
        })
        const fileData = JSON.stringify(sumData);
        fs.writeFile('./public/log/sumData.json', fileData, 'utf8', (err) => {
            if (err) throw err;
            console.log('sumData已被保存');
        });
    })
}

export const getUrl = (json)=>{
    const html = json.data.desc.replace('\\/g','');
    const { document } = new JSDOM(`<!DOCTYPE html>${html}`).window;
    const imgUrls = Array.from(document.querySelectorAll("img")).map(item=>item.src);
    const curObj = {
        id: json.data.id,
        title: json.data.title,
        audio_url: json.data.audio_url,
        imgUrls
    }
    console.log('处理',json.data.title)
    return curObj;    
}


export default ()=>{
    readFiles();
}
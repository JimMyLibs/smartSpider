import fs from 'fs'
import path from 'path'
import jsdom from 'jsdom'

function resolve (dir) {
    return path.join(__dirname, '..', dir)
}

const { JSDOM } = jsdom;

const getAllIndex = (dir)=>{
    let sumData = fs.readdirSync(dir)
    return sumData;
}

const getFullName = (index,arr)=>{
    return arr.filter(item=>item.split('-')[0]==index)[0]
}

const readFiles = (dir = './public/json/')=>{
        const fileName_josn = getAllIndex('./public/json/');
        const paths_json = fileName_josn.map(item=>item.split('-')[0]);
        const paths_pic = getAllIndex('./public/pic/').map(item=>item.split('-')[0]);
        console.log('paths_json',paths_json)
        console.log('paths_pic',paths_pic)
        const sumData = [];
        
        paths_json.map(item=>{
            if(!paths_pic.includes(item)){// only handle missing pic
                const fullName = getFullName(item,fileName_josn)
                const filePath = dir + fullName;
                const json = require(resolve(filePath));
                const oneData = getUrl(json);
                sumData.push(oneData);
            }
        })
        const fileData = JSON.stringify(sumData);
        fs.writeFile('./public/log/missing.json', fileData, 'utf8', (err) => {
            if (err) throw err;
            console.log('missing已被保存');
        });
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
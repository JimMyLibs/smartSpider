import fs from 'fs'
import path from 'path'
import request from 'request'
import sumData from '../public/log/sumData.min.json'
// import sumData from '../public/log/missing.json'

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

const sleep = (time) => {
    const count = Math.ceil(Math.random() * time) * 1000;// Seconds
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('等待了', count / 1000, '秒');
            resolve();
        }, count)
    })
}

const downPic = async (curItem) => {
    return new Promise((resolve,reject)=>{        
        const picName = curItem.title.replace(/[\u4e00-\u9fa5]/g,'') + '-' + curItem.audio_url.slice(-4);
        const writeStream = fs.createWriteStream('./public/audio/' + picName);
        const readStream = request(curItem.audio_url)
        readStream.pipe(writeStream);
        readStream.on('end', function () {
            // console.log('文件下载成功',picName);
        });
        readStream.on('error', (error)=> {
            console.log("错误信息:",picName, error)
            fs.appendFile('./public/log/audio.log',picName, (error)  => {
                if (error) return console.log("错误信息记录失败",picName, error.message);
                console.log("错误信息记录成功",picName);
            });
        })
        writeStream.on("finish", function () {
            console.log("文件写入成功",picName);
            writeStream.end();
            resolve();
        });
    })
}

const loop = ()=>{
    let count = 0;
    const runOnece = async ()=>{
        if(count<sumData.length){
            await sleep(3);
            await downPic(sumData[count]);
            count++;
            await runOnece();
        }else{
            console.log('执行完毕，共处理了',count,'个文件')
        }
    }
    runOnece();
}

export default () => {
    loop();
}
import fs from 'fs'
import path from 'path'
import fetch from 'node-fetch'
import { ids } from './config'

function resolve (dir) {
    return path.join(__dirname, '..', dir)
}

const post = (id)=>{
    fetch("https://pc-shop.xiaoe-tech.com/appmo2YgYLf9030/open/audio.detail.get/1.0", {
        credentials: "include",
        headers: {
            Cookie: 'laravel_session=eyJpdiI6ImQ5d01JOUNUaEc3SjZ6UE9Cd3VwNXc9PSIsInZhbHVlIjoia3hGNjV2cTBNaVlKNVB5VzZaTlNKZ2ZoM084eHR4eEdSZnhyTjdXV3J5eXVnSCtmTUZrMTlkMm8ySEtFdGZxeXdkWjFvTGY2OEhoXC9HSXhEU3htanpRPT0iLCJtYWMiOiJkNTkwOTQwNDc1YzNhMmMyNTFlYWJhN2YyMWJkOGI2NzJmYTUxMjk0NmIzZGFlMmEyNjA4NTc2YjA1ODYyYjc1In0%3D; path=/; domain=pc-shop.xiaoe-tech.com; HttpOnly; Expires=Wed, 28 Aug 2019 01:51:44 GMT;',
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36'
        },
        referrerPolicy: "no-referrer-when-downgrade",
        body: "data%5Bresource_id%5D="+id,
        method: "POST",
        mode: "cors"
    }).then(res=>{
        if (res.ok || res.status === 200) {
            return res.json();
        } else {
            throw new Error(`response data abnormal.error code: ${data.status}`)
        }
    }).then(res=>{
        // console.log('res',res);
        writeFile(res);
    })
}

const writeFile = (res)=>{
    const fileName = res.data.title;
    const filtePath = `${resolve('./public/json/')}${fileName}.json`;
    const fileData = JSON.stringify(res);
    fs.writeFile(filtePath, fileData, 'utf8', (err) => {
        if (err) throw err;
        console.log(fileName,'已被保存');
    });
}

const sleep = (time)=>{
    const count = Math.ceil(Math.random() * time)*1000;// Seconds
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            console.log('等待了',count/1000,'秒');
            resolve();
        },count)
    })
}

const loop = ()=>{
    let count = 0;
    const runOnece = async ()=>{
        if(count<ids.length-1){
            await sleep(5);
            await post(ids[count]);
            count++;
            await runOnece();
        }else{
            console.log('执行完毕，共处理了',count,'个文件')
        }
    }
    runOnece();
}

export const downJson = ()=>{
    loop();
}
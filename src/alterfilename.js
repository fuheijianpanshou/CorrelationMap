const fs=require('fs');
const testFolder = './src/img1/';

// fs.readFile('./src/entity_geo.json',(err,res)=>{
//     let object=JSON.parse(res.toString());
//     let count=0;
//     for(let i=0;i<object.length;i++){
//         object[i].img='/src/img/'+count+".png";
//         count++;
//         if(count>1162){
//             count=0;
//         }
//     }
//     fs.writeFile('./src/entity_geo.json',JSON.stringify(object),(err)=>{
//         if(err){
//             console.log(err);
//         }
//     })
// })

fs.readdir(testFolder,(err,files)=>{
    if(err){
        throw err;
    }
   // console.log(files.length);
    for(let i=0;i<files.length;i++){
        console.log()
        fs.rename(testFolder+files[i],testFolder+'a'+i+'.png',(err)=>{
            if(err){
                throw err;
            }
        })
    }
})


console.log('aaaaaa');
//アンカーの桁丸め関数
//for文で書き換えます
function Truncate(data){
    var i=0;
    tmp=data;
    if(tmp>=100){    
      while(tmp>=100){
        tmp=tmp/10;
        i+=1;
      }
      tmp_floor = Math.floor(tmp);
      data = tmp_floor*(10**i);
      return data;
    }else if(tmp>=10){
      data = Math.floor(tmp);
      return data;
    }else{
      //ここに0で入ってエラー出てる。
      tmp+=0.000000001
      while(tmp<10){
        tmp=tmp*10;
        i+=1;
      }
      tmp_floor = Math.floor(tmp);
      data = tmp_floor/(10**i);
      return data;
    }
  }

//　アンカーの値を求める関数
function genAnchor(flag, min, max){
    // logitのアンカー
    if(flag === 'logit') {
        max = max/100;
        min = min/100;
        max = Math.log(max/(1-max));
        min = Math.log(min/(1-min));
        tmp = Math.random() * (max - min) + min; 
        anchor = (Math.exp(tmp))/(1+Math.exp(tmp))*100;
        anchor = Truncate(anchor);
        return anchor;
        
        // logのアンカー
    } else if(flag == 'log') {
        max = Math.log(max);
        min = Math.log(min);
        tmp = Math.random() * (max - min) + min;  
        anchor = Math.exp(tmp);
        anchor = Truncate(anchor);
        return anchor;

        //intのアンカー
        //コメントアウト部分要対応
    } else if (flag == 'int'){
        //console.log('test');
        max = Math.log(max);
        //console.log(max);
        min = Math.log(min);
        //console.log(min);
        tmp = Math.random() * (max - min) + min;
        // console.log('test');
        //console.log(tmp);
        //tmp = Truncate(tmp);
        // anchor = Math.floor(Math.exp(tmp)); //ここバグ(ある値が入ると無限ループ？)
        anchor = Math.floor(Math.exp(tmp));
        // anchor = Math.exp(tmp);
        //0で桁丸めに入って無限ループ防ぐため
        if(anchor!=0){
            anchor = Truncate(anchor);
        }
        //anchor = Truncate(anchor);
        return anchor;
    }
    else{
        tmp = Math.random() * (max - min) + min; 
        anchor = Truncate(tmp);
        return anchor; 
    }
    // 修正前
    // //intのアンカー
    // } else if (flag == 'int'){
    //     anchor = Math.floor(Math.random() * (max - min) + min);
    //     anchor = Truncate(anchor);
    //     return anchor;
    // }

}
// console.log('test')
// console.log(genAnchor('log',0.1,10000000));
// for (let i = 1; i < 20; i++){
//     console.log(genAnchor('log',0.1,10000000));
// }

// console.log(Math.floor(0.0234));
// console.log(Truncate(0.00000));
// JavaScriptでデータを整理
// console.log('"2000年に日本を入出国した人における女性の割合は何%か"');
// let data = [];
// for (let i = 0; i <100; i++){
//     data.push(genAnchor('logit',9.895474887943156,80.18603848469506));
// }
// let data = [];
// for (let i = 0; i <100; i++){
//     data.push(genAnchor('log',27.49350034182185,13094.003874566133));
// }
let data = [];
for (let i = 0; i <100; i++){
    data.push(genAnchor('int',0.83,825000.00));
}
console.log(data);
// let csvContent = 'data:text/csv;charset=utf-8,'; // CSVのコンテンツタイプを指定
// data.forEach(function (row) {
//     const rowStr = row.map(function (cell) {
//         return cell.toString();
//     }).join(',');
//     csvContent += rowStr + '\n'; // 各行をカンマで区切り、改行で区切ります
// });
// console.log(csvContent);

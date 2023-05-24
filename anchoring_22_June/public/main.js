//genAnchorのintを修正した
//2023年5月24日 komatsu

// DBの接続
const database = firebase.database();

// 問題文リスト
const question_list = ["カンブリア紀の生物オパビニアの体長は何cmか","ティラノサウルスの体長は何cmか","土星の直径は地球の直径の何倍か",
"2000年に日本を入出国した人における女性の割合は何%か","2012年での日本におけるスマートフォンの普及率は何%か","野生のライオンが狩りに成功する割合は何%か",
"織田信長の身長は何cmか","2017年時点での稼働中の（軌道上にある）人工衛星の数は何個か","東京駅から電車に乗る人の１日あたり平均数は何人か",
"アフリカ大陸の面積は北海道の面積の何倍か","東京ドームの面積は何km2か","令和3年10月に行われた第49回衆議院議員総選挙の投票率は何%か",
"令和3年度の待機児童数は何人か","2021年の日本全国にいる美容師数は何人か","人の脳全体の神経細胞の数は何億個か","日本にある大学の数は何校か",
"2020年の世界の大気中の二酸化炭素濃度平均値は何ppmか","2021年における世界全体の電気自動車(EV)販売台数は何台か","世界の時価総額トップ10を足すと合計何ドルか",
"世界全体における女性の平均寿命は何歳か","日本で1日に消費する石油の量は何Lか","シロナガスクジラの体重は何kgか","日本で最も人口が多い市区町村の人口は何人か",
"日本の3歳男児の平均身長は何cmか","日本の中学3年生男子の平均握力は何kgか","国連加盟国の中で最も人口密度の高い国の人口密度は何人 / 平方キロか","ドイツの州の数は何州か",
"日本の市区町村数は何市区町村か","海水における塩分濃度は何%か","安倍元首相の首相在任日数は何日か"];

// 単位リスト
const unit_list = ["cm","cm","倍","%","%","%","cm","個","人","倍","km2","%","人","人",
"億個","校","ppm","台","ドル","歳","L","kg","人","cm","kg","人/平方キロ","州","市区町村",
"%","日"];

// +-3sigmaの値リスト
const min_list = [0.45290939920828627,
  27.49350034182185,
  0.16827242802519204,
  9.895474887943156,
  0.20953020494437388,
  0.8737091237005883,
  139.53390688336827,
  0.03247206899652188,
  77.82537369461754,
  0.754848998660526,
  1.2208791656903796e-05,
  17.836614084729487,
  7.782537369464911,
  754.8489986306269,
  0.0035661532318896046,
  12.513370771917705,
  0.0001441813135930198,
  7.633775656641163,
  4.535237134514486e-05,
  43.25802910988497,
  0.016749667527085576,
  22.64546995899248,
  2423.765776667202,
  33.18618375074148,
  17.61971018273977,
  0.7878270338767204,
  3.2946652380216643,
  42.683536603752046,
  0.14142270424594286,
  329.4665237616793];

const max_list = [7948.609603627182,
  13094.003874566133,
  2377.09769053856,
  80.18603848469506,
  99.79046979505563,
  92.6503354075404,
  183.46795106739305,
  692903.1840474961,
  128492797.7248097,
  13247.682672885474,
  51192617.387043126,
  79.69550742528526,
  12849279.772478081,
  13247682.673145553,
  2804141.984359236,
  49622.44077311989,
  3668991.402999744,
  130996776035.7264,
  2.204956367969615e+22,
  113.27376907747961,
  3582160655008.5693,
  397430.4801933298,
  412581120.5136539,
  188.03005633386763,
  61.805783907432364,
  11423827.328847822,
  121.40838936346275,
  93712.94691762692,
  89.70905910820129,
  12140.838936636284];

//%問題のリスト
// label_list の logit と情報が重複
//const percent_list = [3,4,5,11,28];

// アンカーのラベルリスト
const label_list = ["log","log","log","logit","logit","logit","log","int","int","log","log","logit","int","int","log","int","log","int","log","int","log","log","int","log","log","log","int","int","logit","int"];

// 正規表現による電話番号チェック関数
function isTelnum(numVal){
  var pattern = /^0[-0-9]{9,12}$/;
  return pattern.test(numVal);
}

// 整数または小数であるかどうか判定
// マイナス値は許さない
function isDecimal(numVal){
  var pattern = /^[+]?([1-9][0-9]*|0)(\.[0-9]+)?$/;
  return pattern.test(numVal);
}

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
    //ここを修正した
  } else if (flag == 'int'){
    max = Math.log(max);
    min = Math.log(min);
    tmp = Math.random() * (max - min) + min;
    anchor = Math.floor(Math.exp(tmp));
    anchor = Truncate(anchor);
    return anchor;
  }

}

// 配列のポインタをシャッフルする関数
function shuffle(array){
  for (let i = array.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// 現在の設定
var userData = {
  user: null,
  TEL: null,
  q_number_list: null,
  anchor_list: null,
  response_num: null
};

function initUserData() {
  //　問題用idになるリスト
  userData.q_number_list = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29];
  //  ランダム化のためシャッフル
  shuffle(userData.q_number_list);

  // アンカーの生成
  userData.anchor_list = [];
  for (let i=0;i<30;i++){
    j = userData.q_number_list[i];
    const anchor = genAnchor(label_list[j], min_list[j], max_list[j])
    userData.anchor_list.push(anchor);
  }

  //  シャッフルしたq_numberを先頭から取り出すポインタ
  userData.response_num = 0;
}

function setupNewQuestion() {
  //  問題情報
  const num = userData.response_num;
  const qnum = userData.q_number_list[num];
  const anchor = userData.anchor_list[num];
  const question = question_list[qnum];
  const unit = unit_list[qnum];

  // 回答欄をリセット
  document.getElementById('inbox').value = '';
  //  問題を表示
  document.getElementById('sentence').textContent = '問' + String(num+1) + '　' + question;
  //  単位とアンカを設定
  document.getElementById('unit').textContent = ' ' + unit;
  document.getElementById('inbox').placeholder = '回答例　' + String(anchor);
}

// DBへの書き込み用関数
// ユーザーデータの書き込み関数
function writeUserData() {
  const ref = database.ref('userData/' + userData.user);
  return ref.set(userData);
}

// 回答の書き込み関数
function writeAnswerData(answer) {
  const num = userData.response_num
  const answerData = {
    user: userData.user,
    list_number: num + 1,
    q_number: userData.q_number_list[num],
    anchor_value: userData.anchor_list[num],
    answer: answer,
    timestanp: Date.now(),
  };
  userData.response_num += 1;
  const newKey = database.ref('answerData/' + userData.user).push().key;
  const updates = {};
  updates['/answerData/' + userData.user + '/' + newKey] = answerData;
  updates['/userData/' + userData.user] = userData;
  return database.ref().update(updates);
  /* key の代わりに list_number を使う場合
  const updates = {};
  updates['/userData/' + user + '/response_num'] = userData.response_num;
  updates['/answerData/' + user + '/' + list_number] = answerData;
  return database.ref().update(updates);
   */
}

// ウィンドウを開いた際の挙動
window.onload = function () {

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      userData.user = user.uid;

      database.ref().child("userData/"+userData.user).on('value', (snapshot) => {
        if (snapshot.exists()){
          //既にDBにある場合

          // userData を読み込み
          userData = snapshot.val();

          if(userData.response_num==30){
            document.getElementById('end_section').style.display = 'block';
          }
          else{
            // question 画面を表示
            setupNewQuestion();
            document.getElementById('question').style.display = 'block';
          }

        } else{
          // DBに存在しない場合
          
          // userData を初期化
          initUserData();

          // verview を表示
          document.getElementById('overview').style.display = 'block';
        }
      });

    }
  })
  firebase.auth().signInAnonymously()
}

// 最初の画面で確認後
document.getElementById('overview_button').onclick = function(){
  document.getElementById('overview').style.display = 'none';
  document.getElementById('tel_section').style.display = 'block';
}

// 電話番号入力後の挙動
document.getElementById('start_button').onclick = function(){
  const tel_box = document.getElementById('tel_number');
  userData.TEL = tel_box.value;

  if (isTelnum(userData.TEL)==false){
      window.alert('電話番号を入力してください');
      return;
  }
  writeUserData();

  // 電話番号画面とアンケート画面の表示切り替え
  document.getElementById('tel_section').style.display = 'none';
  setupNewQuestion();
  document.getElementById('question').style.display = 'block';
}

// 「次へ」ボタンを押した後の挙動を指定
document.getElementById('button').onclick = function(){
    const num = userData.response_num;
    const qnum = userData.q_number_list[num];

    // 回答の取得
    var answer_box = document.getElementById('inbox');
    var answer = answer_box.value;

    //小数でも整数でもなかったらエラー判定
    if(isDecimal(answer)==false){
      
      window.alert('半角数値で入力してください');
      return;
    }

    // 回答を数値に変換
    answer = Number(answer); 

    if(answer<=0){
      window.alert('0より大きい値で回答してください');
      return;
    }

    // パーセント問題の回答域を0から100に限定
    //if((q_number[list_number] in percent_list)==true){
    if(label_list[qnum] == 'logit'){
      if(answer>=100){
        window.alert('100未満で回答してください');
        return;
      }
    }

    // DBに書き込み
    // response_num の更新も含む
    writeAnswerData(answer);

    if (num == 29){
      // 終了処理
      document.getElementById('question').style.display = 'none';
      document.getElementById('end_section').style.display = 'block';
    } else {
      // 問題の切り替え
      setupNewQuestion();
    }
}

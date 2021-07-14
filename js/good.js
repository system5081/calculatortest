"use strict";
//-----------------------------------------------------------------------------------
{//初期状態
document.getElementById("math").style.display="block";
document.getElementById("construction").style.display="none";
document.getElementById("func").style.display="none";
document.getElementById("content").style.display="none";
}
document.getElementById("cmath").addEventListener("click",function(){//math表示
    document.getElementById("construction").style.display="none";
    document.getElementById("func").style.display="none";
    document.getElementById("content").style.display="none";
    
    document.getElementById("math").style.display="block";
});
document.getElementById("cconstruction").addEventListener("click",function(){//構造表示
    document.getElementById("func").style.display="none";
    document.getElementById("content").style.display="none";
    document.getElementById("math").style.display="none";

    document.getElementById("construction").style.display="block";
});
document.getElementById("cfunction").addEventListener("click",function(){//関数表示
    document.getElementById("math").style.display="none";
    document.getElementById("construction").style.display="none";
    document.getElementById("content").style.display="none";

    document.getElementById("func").style.display="block";
});
document.getElementById("ccontent").addEventListener("click",function(){//定数表示
    document.getElementById("math").style.display="none";
    document.getElementById("construction").style.display="none";
    document.getElementById("func").style.display="none";

    document.getElementById("content").style.display="block";
});
//----------------------------------------------------------------------------------
//基礎部分
let output_sub = document.getElementById("output_sub");//計算結果を表示する場所;
const output_total = document.getElementById("output_total");//計算過程を表示する場所
var total = 0;//計算式を表す変数 
//最初の状態を定義
let state = "leftside";
//-------------------------------------------------------------------------
//  1)計算する前の最初の状態<左端>（leftside）　
//  2)数字を入力している最中（calculation）
//  3)「＋　÷　－　×　＝」を押した直後（calBtn)
//  4)<右端>(rightside)
//  5)「＝」を教えて計算が終わった直後（finish）
//  6)定数(変数)を入力した後(content)
//  変数stateに、leftside,calculation, calBtn, finishを代入して状態を管理します。
//-------------------------------------------------------------------------
//@があるかどうか
var moveinput=0;
//-------------------------------------------------------------------------
// 1)@がある(@)
// 2)@はない(0)
//-------------------------------------------------------------------------
let mode = "integer_mode"; //最初は整数入力モード
//-----------------------------------------------------------------------------
//計算過程結果、計算結果画面の表示の切り替え
//  「=」を押した後、 計算後state==='finish'の時だけ計算結果画面output_totalにclass="active"を付ける。そのほかの時はその逆にする。
function changeOutput(){
  if(state==='finish'){
    output_total.classList.add('active');
    output_sub.classList.remove('active');   
  }
  else{
    output_sub.classList.add('active');
    output_total.classList.remove('active'); 
  } 
  }
//-------------------------------------------------------------------------
//リセット関数
  function reset() {
    total = 0; 
    output_sub.textContent = 0;
    output_total.textContent = 0;
    moveinput="0";
    mode ='integer_mode';//整数モードに戻す
    state ='leftside';
    changeOutput()//計算結果・計算過程画面の入れ替える
}
//----------------------------------------------------------------------------
//桁数を揃える関数10桁を表示させる関数
function digitNum(num) {
  return Math.round(num*100000000)/100000000;
}
//----------------------------------------------------------------------------
//自作関数計算式を与えて@の前を返す。端の場合は"leftside","rightside"
function beforewordstate(total){
  var index=output_sub.textContent.indexOf("@");
  var totallength=total.length;
  if(index===0){
    return "leftside";
  }
  else if (index===totallength-1){
    return "rightside";
  }
  else{ 
    return total[index-1];
  }
}
//-----------------------------------------------------------------------------
//自作関数@の直後を返す
function afterwordstate(total){
  var before=beforewordstate(total);
  if(before==="rightside"){
    return "rightside";
  }
  else {
    var index=output_sub.indexOf("@");
    var char=total[index+1];
    return char;
  }
}
//------------------------------------------------------------------------------
//自作関数文字を与えてstateを返す。"calBtn","calculation"
function charstate(char){
    if (char==="+"||char==="-"||char==="*"||char==="/"){
      return "calBtn";
    }
    else if(char==="x"||char==="π"||char==="e"||char==="g"){
      return "content"
    }
    else if(char==="rightside"){
      return "rightside";
    }
    else if(char==="leftside"){
      return "leftside";
    }
    else{
      return "calculation";
  }
}
//--------------------------------------------------------------------------
//左ボタンを押したときの処理
document.getElementById("moveleft").addEventListener("click",function(){
    var indexs=output_sub.textContent.indexOf("@");
    if(indexs===0){
      state="leftside";
    }
    if(state!=="leftside"&&moveinput===0){
        var lastword=output_sub.textContent.slice(-1)[0];
        total=output_sub.textContent.slice(0,-1);
        total+="@";
        total+=lastword;
        moveinput="@";
    }
    else if(state!=="leftside"&&moveinput==="@"){
        var position=output_sub.textContent.indexOf("@");
        var lastword=output_sub.textContent.slice(position+1);
        var beforone=output_sub.textContent[position-1];
        total=output_sub.textContent.slice(0,position-1);
        total+="@";
        total+=beforone;
        total+=lastword;
        moveinput="@";
    }
    else if(state==="leftside"&&moveinput==="@"){
        return;
    }
    output_sub.textContent=total;
    lastword=0;
    position=0;
    beforone=0;
  })
//---------------------------------------------------------------------------
//右ボタンを押したときの処理
  document.getElementById("moveright").addEventListener("click",function(){
    var indexs=output_sub.textContent.indexOf("@");
    var leng=output_sub.textContent.length;
    if(indexs+1===leng){
      state="rightside";
    }
    if(state!=="rightside"&&moveinput==="@"){
        var potison=output_sub.textContent.indexOf("@");
        var lastword=output_sub.textContent.slice(potison+2);
        total=output_sub.textContent.slice(0,potison);
        total+=output_sub.textContent[potison+1];
        total+="@";
        total+=lastword;
        moveinput="@"
    }
    else if(state==="rightside"&&moveinput=="@"){
        moveinput=0
        return;
    }
    output_sub.textContent=total;
    lastword=0;
    potison=0;
    //右に行き過ぎるのを抑制するelseif文
  })
//---------------------------------------------------------------------------
// 1-9の数字ボタンを押した時
const one_nine = document.querySelectorAll(".one_nine");
one_nine.forEach(index => {    
  index.addEventListener("click", ()=> {
    if(state==="content"){
      return;
    }
    if(state === "leftside") {
      total = index.dataset.indexId;         
    }
    else if(state === 'finish') {
      //計算後は、リセット処理後に、totalに打った数字を代入する
      reset();
      total = index.dataset.indexId;  
    }
    else if(moveinput==="@"){//@入力
      var position=output_sub.textContent.indexOf("@");
      var lastword=total.slice(position+1);
      total=total.slice(0,position);
      total+=index.dataset.indexId;
      total+="@";
      total+=lastword;
    }
    else if(state === 'calculation'||state === 'calBtn'){
      //計算中totalに打った数字を追加して、totalに代入する。
      total += index.dataset.indexId;
    }
    output_sub.textContent = total;
    state = 'calculation'//数字を入力している状態にする。
    changeOutput()//計算結果・計算過程画面の入れ替える
  }) //click   
})
//---------------------------------------------------------------------------
// 0の数字ボタンを押した時
document.getElementById("zero").addEventListener("click",function(){
  
  if(moveinput==="@"){
    if(charstate(beforewordstate(total))==="calBtn"){
      console.log("前の文字はゼロ");
      return;
    }
    else {
      var indexs=output_sub.textContent.indexOf("@");
      var lastword=total.slice(indexs+1);
      total=output_sub.textContent.slice(0,indexs);
      total+=0;
      total+="@";
      total+=lastword;
      output_sub.textContent=total;
      indexs=0;
      lastword=0;
    }
  }
  else if(moveinput===0){
    if(state==='leftside'||state==='finish'||state==='calBtn'){
        console.log('前の文字はゼロ');
        return;
      }
    else {
      total=output_sub.textContent;
      total+=0;
      output_sub.textContent=total;
    }
  }
})
//------------------------------------------------------------------------------
// 00の数字ボタンを押した時
document.getElementById("zerozero").addEventListener("click",function(){
  if(moveinput==="@"){
    if(charstate(beforewordstate(total))==="calBtn"){
      console.log("前の文字はゼロ");
      return;
    }
    else {
      var indexs=output_sub.textContent.indexOf("@");
      var lastword=total.slice(indexs+1);
      total=output_sub.textContent.slice(0,indexs);
      total+=0;
      total+=0;
      total+="@";
      total+=lastword;
      output_sub.textContent=total;
      indexs=0;
      lastword=0;
    }
  }
  else if(moveinput===0){
    if(state==='leftside'||state==='finish'||state==='calBtn'){
        console.log('前の文字はゼロ');
        return;
      }
    else {
      total=output_sub.textContent;
      total+=0;
      total+=0;
      output_sub.textContent=total;
    }
  }
})
//--------------------------------------------------------------------------------
//演算子のボタンを押した時
document.querySelectorAll(".cal").forEach(index => {     
index.addEventListener('click', () => {
  if(moveinput==="@"){
    if(charstate(beforewordstate(total))==="calBtn"){
      return;
    }
    else if(charstate(beforewordstate(total)==="calculation")){
      var indexs=output_sub.textContent.indexOf("@");
      var lastword=total.slice(indexs+1);
      total=total.slice(0,indexs);
      total+=index.dataset.indexId;
      total+="@";
      total+=lastword; 
      indexs=0;
      lastword=0;
    }
  }
  else if(moveinput===0){
    if(state === 'leftside') {
      return;//最初記号は押せない
    }else if(state === 'calculation'||state==="content"){
      total += index.dataset.indexId;//計算中はtotalに打った記号を追加し、totalに代入する。
    }else if(state === 'finish'){
      //計算後は前の計算結果をtotal に代入して計算しなおす。
      total = output_total.textContent;
      total += index.dataset.indexId;
      output_total.textContent = 0
    }else if(state ==='calBtn') {
      // 演算記号入力状態state = 'calBtn'の時に、演算記号を押したら、totalの最後の一文字（演算記号）を削除し、新たに押した演算記号を追加する。
  //        →totalに、totalの最初から最後から二文字目までを代入する（最後の一文字を削除する）
      total = total.slice(0, -1)
      total += index.dataset.indexId;
    }
  }
  output_sub.textContent = total;
  state = 'calBtn'//演算記号を入力している状態する。
  mode ='integer_mode'//整数モードに戻す
  changeOutput()//計算結果・計算過程画面の入れ替える
}) //click   
})//forEach
//--------------------------------------------------------------------------------
//BSのボタンを押した時
document.getElementById('bs').addEventListener("click", function(){
//moveinput="@"の時
  if(moveinput==="@"){
    console.log("test");
    var indexs=output_sub.textContent.indexOf("@");
    var lastword=output_sub.textContent.slice(indexs+1);
    total=output_sub.textContent.slice(0,indexs-1);
    total+="@";
    total+=lastword;
    output_sub.textContent=total;
    indexs=0;
    lastword=0;
}  
  else if(moveinput===0) {
    var leng=output_sub.textContent.length;
    var total=output_sub.textContent.slice(0,leng-1);
    output_sub.textContent=total;
    leng=0;
  }
})
//---------------------------------------------------------------------------------
//Cのボタンを押した時
document.getElementById("clear").addEventListener("click", function(){
  reset();
  moveinput=0;
})
//-----------------------------------------------------------------------------------
//=のボタンを押した時
document.getElementById('equal_btn').addEventListener("click",function(){
  if(moveinput==="@"){
    var indexes=output_sub.indexOf("@");
    var lastword=output_sub.textContent.slice(indexes+1);
    total=output_sub.textContent.slice(0,indexes);
    total+=lastword;
    indexes=0;
    lastword=0;
  }
  console.log(eval(total));
  output_total.textContent = digitNum(eval(total));//桁数を揃える関数10桁を表示させる関数digitNum
  state = 'finish'//計算が終わった状態にする。
  mode ='integer_mode'//整数モードに戻す
  changeOutput()//計算結果・計算過程画面の入れ替える
});
//----------------------------------------------------------------------------------
//小数点
document.getElementById("point").addEventListener("click",function(){
  if(mode==="decimal_mode"||state==="content"){
    return;
  }
  if(state==='leftside'||state==='finish') {
    total = 0;//(1)最初と計算終了直後なら、0を入力
  }else if(state==='calBtn'){
    //これを入れないと、0.4+0.4と打つと0.4+00.4となる。
    if(output_sub.textContent.slice(-1)!=='0'){
      total += 0;//(1')演算記号入力直後なら、今までの計算結果に0を入力
    }   
  }
  total += point.dataset.indexId;//(2)「.」を入力
  
  output_sub.textContent = total;
  state = 'calculation'//数字を入力している状態にする。
  mode = 'decimal_mode'; //小数入力モードに変更
  changeOutput()//計算結果・計算過程画面の入れ替える
  })
//-----------------------------------------------------------------------------------
//()について
//----------------------------------------------------------------------------------
//定数
/*
document.getElementById("pi").addEventListener("click",function(){
  if(state==="calBtn"&&moveinput===0){
    total+="π";
    output_sub.textContent=total;
    state="content";
  }
  else if(moveinput==="@"){
    console.log("注)先に演算子前に演算子が必要です。後に演算子がある場合一度消してから打ち直してください")
    var beforestate=charstate(beforewordstate(output_sub.textContent));
    var afterstate=charstate(afterwordstate(output_sub.textContent));
    if(beforestate==="calBtn"&&afterstate==="calBtn"){
      var indexs=output_sub.textContent.indexOf("@");
      var lastword=total.slice(indexs+1);
      total=total.slice(0,indexs);
      total+="π";
      console.log(total);
      total+="@";
      total+=lastword; 
      //演算子が入力されるまで待機させたい
      console.log("+*-/のいずれかを入力してください。")
    }
  }
})
document.getElementById("napier").addEventListener("click",function(){
  if(state==="calBtn"&&moveinput===0){
    console.log("test");
    total+="e";
    output_sub.textContent=total;
    state="content";
  }
})
document.getElementById("gravity").addEventListener("click",function(){
  if(state==="calBtn"&&moveinput===0){
    total+="g";
    output_sub.textContent=total;
    state="content";
  }
})
//-------------------------------------------------------------------------------
//変数xのボタンを押した時
document.getElementById("variable").addEventListener("click",function(){
  if(state==="calBtn"&&moveinput===0){
    total+="x";
    output_sub.textContent=total;
    state="content";
  }
})
*/
//-------------------------------------------------------------------------------
document.getElementById("test").onclick=function(){
  console.log(total);
};
//--------------------------------------------------------------------------------
//total変数をbladeファイルに渡す
const data = 'Hello World！'; // 渡したいデータ
 
$.ajax({
    type: "POST", //　GETでも可
    url: "request.php", //　送り先
    data: { 'データ': data }, //　渡したいデータをオブジェクトで渡す
    dataType : "json", //　データ形式を指定
    scriptCharset: 'utf-8' //　文字コードを指定
})
.then(
    function(param){　 //　paramに処理後のデータが入って戻ってくる
        console.log(param); //　帰ってきたら実行する処理
    },
    function(XMLHttpRequest, textStatus, errorThrown){ //　エラーが起きた時はこちらが実行される
        console.log(XMLHttpRequest); //　エラー内容表示
});
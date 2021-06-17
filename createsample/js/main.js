
"use strict";
{//初期状態
document.getElementById("math").style.display="block";
document.getElementById("construction").style.display="none";
document.getElementById("func").style.display="none";
document.getElementById("content").style.display="none";
}
document.getElementById("cmath").addEventListener("click",function(){
    document.getElementById("construction").style.display="none";
    document.getElementById("func").style.display="none";
    document.getElementById("content").style.display="none";
    
    document.getElementById("math").style.display="block";
});
document.getElementById("cconstruction").addEventListener("click",function(){
    document.getElementById("func").style.display="none";
    document.getElementById("content").style.display="none";
    document.getElementById("math").style.display="none";

    document.getElementById("construction").style.display="block";
});
document.getElementById("cfunction").addEventListener("click",function(){
    document.getElementById("math").style.display="none";
    document.getElementById("construction").style.display="none";
    document.getElementById("content").style.display="none";

    document.getElementById("func").style.display="block";
});
document.getElementById("ccontent").addEventListener("click",function(){
    document.getElementById("math").style.display="none";
    document.getElementById("construction").style.display="none";
    document.getElementById("func").style.display="none";

    document.getElementById("content").style.display="block";
});
//基礎部分
//基本
    let output_sub = document.getElementById("output_sub");//計算結果を表示する場所
    const output_total = document.getElementById("output_total");//計算過程を表示する場所
    var total = 0;//計算式を表す変数 
    let state = "start";//最初の状態を定義
    //  1)計算する前の最初の状態（start）　
    //  2)数字を入力している最中（calculation）
    //  3)「＋　÷　－　×　＝」を押した直後（calBtn）
    //  4)「＝」を教えて計算が終わった直後（finish）
    //  変数stateに、start,calculation, calBtn, finishを代入して状態を管理します。 
    var modifucation=0;//@があるかどうか 
    let mode = 'integer_mode'; //最初は整数入力モード
// 1-9の数字ボタンを押した時
const one_nine = document.querySelectorAll('.one_nine');
one_nine.forEach(index => {     
  index.addEventListener('click', () => {
    if(state === 'start') {
      //最初totalに打った数字を代入する
      total = index.dataset.indexId;         
    }
    else if(state === 'finish') {
      //計算後は、リセット処理後に、totalに打った数字を代入する
      reset();
      total = index.dataset.indexId;  
    }
    else if(modifucation==="@"){//@入力
      var indexs=total.indexOf("@");
      var lastword=total.slice(indexs+1);
      total=total.slice(0,indexs);
      total+=index.dataset.indexId;
      total+="@";
      total+=lastword;
      indexs=0;
      lastword=0;
    }
    else if(state === 'calculation'||state === 'calBtn'){
      //計算中totalに打った数字を追加して、totalに代入する。
      total += index.dataset.indexId;
    }
    output_sub.textContent = total;
    state = 'calculation'//数字を入力している状態にする。
    changeOutput()//計算結果・計算過程画面の入れ替える
  }) //click   
})//forEach
//00のボタンを押した時
document.getElementById("00").addEventListener("click",function(){
  if(modifucation==="@"){
    if(boforecharstate(beforewordstate(total))==="calBtn"){
      console.log("前の文字はゼロ");
      return;
    }
    else{
      var indexs=total.indexOf("@");
      var lastword=total.slice(indexs+1);
      total=total.slice(0,indexs);
      total+=00;
      console.log(total);
      total+="@";
      total+=lastword;
      indexs=0;
      lastword=0;
    }
  }
})
// 0の数字ボタンを押した時
const zero = document.getElementById('zero');
zero.addEventListener('click', () => {
//    - 最初state==='start
//    - 計算終了後state==='finish'
//    - 演算記号入力直後state==='calBtn'の時、
//    前の文字が0の時は0が入力できないようにする。
if(modifucation==="@"){
  if(boforecharstate(beforewordstate(total))==="calBtn"){
    console.log("前の文字はゼロ");
    return;
  }
  else{
      var indexs=total.indexOf("@");
      var lastword=total.slice(indexs+1);
      total=total.slice(0,indexs);
      total+=0;
      console.log(total);
      total+="@";
      total+=lastword;
      indexs=0;
      lastword=0;
  }
}else if(modifucation==="0"){
  if(state==='start'||state==='finish'||state==='calBtn'){
    if(output_sub.textContent.slice(-1) === '0') {
    //sliceで切り出されたのは0ではなく'0'
    console.log('前の文字はゼロ');
    return;
    }
  }
  if(state==='start') {
    total = zero.dataset.indexId;  
  }else{
  total += zero.dataset.indexId;
  }  
}    
output_sub.textContent = total;
changeOutput()//計算結果・計算過程画面の入れ替える
//    state = 'calculation'//数字を入力している状態にする。
}) //click    

// 「.」小数点ボタンを押した時
const point = document.getElementById('point');
point.addEventListener('click', () => {
console.log(point.dataset.indexId)
if(mode === 'decimal_mode'){
  return; //小数点入力モードではもう一度小数点を押せない
   }      
//「.4」と入力したら0.4としたい。(1)+(2)で0.4となる
if(state==='start'||state==='finish') {
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
}) //click  

//「＋　÷　－　×」ボタンを押した時
const cal = document.querySelectorAll('.cal');
cal.forEach(index => {     
index.addEventListener('click', () => {
  if(modifucation==="@"){
    if(boforecharstate(beforewordstate(total))==="calBtn"){
      return;
    }
    else if(boforecharstate(beforewordstate(total)==="calculation")){
      var indexs=total.indexOf("@");
      var lastword7=total.slice(indexs+1);
      total=total.slice(0,indexs);
      total+=index.dataset.indexId;
      console.log(total);
      total+="@";
      total+=lastword; 
      indexs=0;
      lastword=0;
    }
  }
  else if(modifucation===0){
    if(state === 'start') {
      return;//最初記号は押せない
    }else if(state === 'calculation'){
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

//イコールを押した時
const equal_btn = document.getElementById('equal_btn');
equal_btn.addEventListener('click',() =>{
if(modifucation==="@"){
  var indexes=total.indexOf("@");
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

//Cボタン（リセットボタン）を押した時の処理
const clear = document.getElementById('clear')
clear.addEventListener('click', () => {
reset();
})

//リセットを行う関数
function reset() {
total = 0; 
output_sub.textContent = 0;
output_total.textContent = 0;
mode ='integer_mode'//整数モードに戻す
state ='start';
changeOutput()//計算結果・計算過程画面の入れ替える
}

//BSボタン（バックスペース）を押した時の処理
const bs = document.getElementById('bs')
bs.addEventListener('click', () => {
//modification="@"の時
if(modifucation==="@"){
  var indexes=total.indexOf("@");
  var lastword=output_sub.textContent.slice(position+1);
  total=output_sub.textContent.slice(0,position-1);
  total+="@";
  total+=lastword;
  output_sub.textContent=total;
}  

if(state !=='finish'&&modifucation===0) {
  
//一文字目から、最後から二文字目までをtotalに代入（最後の一文字を除きtotalに代入する）     
total = output_sub.textContent.slice(0, -1);
output_sub.textContent = total;
}
let lastWord = output_sub.textContent.slice(-1)
if(lastWord==='+'||lastWord==='-'||lastWord==='*'||lastWord==='/') {
//bsを押し、最後の文字が演算記号ならstateを演算記号入力中calBtに変更
  state = 'calBtn'
}else if(lastWord==='') {
//bsを押し、文字が空ならstateを最初startに変更
  state = 'start';
}
});
//左ボタンを押したときの処理
document.getElementById("moveleft").addEventListener("click",function(){
  if(state!=="start"&&modifucation===0){
    var lastword2=output_sub.textContent.slice(-1)[0];
    total=output_sub.textContent.slice(0,-1);
    total+="@";
    total+=lastword2;
    output_sub.textContent=total;
    modifucation="@";
  }
  else if(modifucation==="@"){
    var position=total.indexOf("@");
    var lastword3=output_sub.textContent.slice(position+1);
    var beforone=output_sub.textContent[position-1];
    total=output_sub.textContent.slice(0,position-1);
    total+="@";
    total+=beforone;
    total+=lastword3;
    output_sub.textContent=total;
    modifucation="@";
  }
  //左に行きすぎるのを抑制するelseif文
})
//右ボタンを押したときの処理
document.getElementById("moveright").addEventListener("click",function(){
  if(state!=="start"&&modifucation==="@"){
    var potison2=total.indexOf("@");
    var lastword4=output_sub.textContent.slice(potison2+2);
    total=output_sub.textContent.slice(0,potison2);
    total+=output_sub.textContent[potison2+1];
    total+="@";
    total+=lastword4;
    output_sub.textContent=total;
    modifucation="@"
  }
  //右に行き過ぎるのを抑制するelseif文
})
//定数π,e,gの定義(=時に置き換えが必要)
document.getElementById("pi").addEventListener("click",function(){
  if(state==="calBtn"&&modifucation===0){
    total+="π";
    output_sub.textContent=total;
    state="calculation";
  }
})
document.getElementById("napier").addEventListener("click",function(){
  if(state==="calBtn"&&modifucation===0){
    total+="e";
    output_sub.textContent=total;
    state="calculation";
  }
})
document.getElementById("gravity").addEventListener("click",function(){
  if(state==="calBtn"&&modifucation===0){
    total+="g";
    output_sub.textContent=total;
    state="calculation";
  }
})
//桁数を揃える関数10桁を表示させる関数
function digitNum(num) {
return Math.round(num*100000000)/100000000;
}

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
//@左右振り切り対策アイディア
function beforewordstate(total){
  var index=total.indexOf("@");
  var totallength=total.length;
  if(index===0){
    return "left";
  }
  else if (index===totallength-1){
    return "right";
  }
  else{ 
    return total[index-1];
  }
}
function boforecharstate(char){
    if (char==="+"||char==="-"||char==="*"||char==="/"){
      return "calBtn";
    }
    else{
      return "calculation";
  }
}

/*
document.getElementById("contain").addEventListener("click",function(){
  console.log(state);
  console.log(mode);
})*/
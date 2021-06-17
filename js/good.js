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
    mode ='integer_mode'//整数モードに戻す
    state ='leftside';
    changeOutput()//計算結果・計算過程画面の入れ替える
}
//----------------------------------------------------------------------------
//自作関数計算式を与えて@の前を返す。端の場合は"leftside","rightside"
function beforewordstate(total){
  var index=total.indexOf("@");
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
//------------------------------------------------------------------------------
//自作関数計算式を与えてstateを返す。"calBtn","calculation"
function beforecharstate(char){
    if (char==="+"||char==="-"||char==="*"||char==="/"){
      return "calBtn";
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
        var position=total.indexOf("@");
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
        var potison=total.indexOf("@");
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
    if(state === "leftside") {
      total = index.dataset.indexId;         
    }
    else if(state === 'finish') {
      //計算後は、リセット処理後に、totalに打った数字を代入する
      reset();
      total = index.dataset.indexId;  
    }
    else if(moveinput==="@"){//@入力
      var position=total.indexOf("@");
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
    if(beforecharstate(beforewordstate(total))==="calBtn"){
      console.log("前の文字はゼロ");
      return;
    }
    else {
      var indexs=total.indexOf("@");
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
    if(beforecharstate(beforewordstate(total))==="calBtn"){
      console.log("前の文字はゼロ");
      return;
    }
    else {
      var indexs=total.indexOf("@");
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
//-------------------------------------------------------------------------------
//変数xのボタンを押した時

//--------------------------------------------------------------------------------
//演算子のボタンを押した時
document.querySelectorAll(".cal").forEach(index => {     
index.addEventListener('click', () => {
  if(moveinput==="@"){
    if(beforecharstate(beforewordstate(total))==="calBtn"){
      return;
    }
    else if(beforecharstate(beforewordstate(total)==="calculation")){
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
  else if(moveinput===0){
    if(state === 'leftside') {
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
//--------------------------------------------------------------------------------
//BSのボタンを押した時

//---------------------------------------------------------------------------------
//Cのボタンを押した時

//-----------------------------------------------------------------------------------
//=のボタンを押した時

//----------------------------------------------------------------------------------

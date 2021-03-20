// 問題のリスト
const questionsList = [
  {
    // 問題文
    q:
      "目黒株式会社は、設立にあたって発行株式総数1,000株のうち300株を1株あたり4,000円で発行することとし、全株について引受け・払い込みを受け、払込金については普通預金に入金した。なお、資本金は会社法で認められている最低限度額を計上することとした。また、発起人が株式発行に係る諸経費50,000円を立て替え払いしていたことが判明したので、現金で精算した。",
    // 答え-借方
    dr: [
      ["普通預金", "1,200,000"],
      ["創立費", "50,000"],
    ],
    // 答え-貸方
    cr: [
      ["資本金", "600,000"],
      ["資本準備金", "600,000"],
      ["現金", "50,000"],
    ],
    // 選択する勘定科目
    actList: [
      "現金",
      "普通預金",
      "資本金",
      "資本準備金",
      "利益準備金",
      "創立費",
      "株式交付費",
    ],
  },
  {
    q:
      "商品80,000円をクレジット払いの条件で販売した。なお、信販会社への手数料(販売代金の3%)は販売時に計上する。",
    dr: [
      ["支払手数料", "2,400"],
      ["クレジット売掛金", "77,600"],
    ],
    cr: [["売上", "80,000"]],
    actList: ["現金", "クレジット売掛金", "売上", "受取利息", "支払手数料"],
  },
];

let currentQuestion;
// console.log(questionsList);
window.onload = function () {
  currentQuestion = questionsList[1];

  setCurrentQuestion(currentQuestion);
};

// 問題を表示
function setCurrentQuestion(current) {
  document.getElementById("answer-table").style.display = "none";
  // 問題文を表示
  document.getElementById("question").innerHTML = current.q;
  // 勘定科目選択をセット
  setAccounts("dr-ac-1", current.actList);
  setAccounts("cr-ac-1", current.actList);
  setAccounts("dr-ac-2", current.actList);
  setAccounts("cr-ac-2", current.actList);
  setAccounts("dr-ac-3", current.actList);
  setAccounts("cr-ac-3", current.actList);
}

/**
 * アンサーチェック
 */
//document.getElementById("answer").onsubmit = function () {
function ansButton() {
  let correct = true;
  const drList = getAnswerList("dr");
  correct = checkAnswerList(drList, currentQuestion.dr);
  // console.log("testcorrect " + testcorrect);
  const crList = getAnswerList("cr");
  correct = checkAnswerList(crList, currentQuestion.cr);

  if (correct) {
    console.log("正解");
    nextQuestion();
  } else {
    console.log("不正解");
    viewAnswer();
  }
}

function nextQuestion() {
  // 入力クリア
  removeChildren("dr-ac-1");
  removeChildren("cr-ac-1");
  removeChildren("dr-ac-2");
  removeChildren("cr-ac-2");
  removeChildren("dr-ac-3");
  removeChildren("cr-ac-3");
  document.getElementById("dr-amt-1").value = "";
  document.getElementById("cr-amt-1").value = "";
  document.getElementById("dr-amt-2").value = "";
  document.getElementById("cr-amt-2").value = "";
  document.getElementById("dr-amt-3").value = "";
  document.getElementById("cr-amt-3").value = "";

  const next = Math.floor(Math.random() * questionsList.length);
  console.log(next);
  currentQuestion = questionsList[next];
  setCurrentQuestion(currentQuestion);
}

function viewAnswer() {
  const dr = currentQuestion.dr;
  let drAc = dr[0][0];
  if (dr.length > 1) drAc += "<br />" + dr[1][0];
  if (dr.length > 2) drAc += "<br />" + dr[2][0];
  let drAmt = dr[0][1];
  if (dr.length > 1) drAmt += "<br />" + dr[1][1];
  if (dr.length > 2) drAmt += "<br />" + dr[2][1];
  const cr = currentQuestion.cr;
  let crAc = cr[0][0];
  if (cr.length > 1) crAc += "<br />" + cr[1][0];
  if (cr.length > 2) crAc += "<br />" + cr[2][0];
  let crAmt = cr[0][1];
  if (cr.length > 1) crAmt += "<br />" + cr[1][1];
  if (cr.length > 2) crAmt += "<br />" + cr[2][1];

  document.getElementById("a-dr-ac").innerHTML = drAc;
  document.getElementById("a-dr-amt").innerHTML = drAmt;
  document.getElementById("a-cr-ac").innerHTML = crAc;
  document.getElementById("a-cr-amt").innerHTML = crAmt;
  document.getElementById("answer-table").style.display = "";
}

// 貸方または借方の答えリストが答えと同じかチェック
function checkAnswerList(list, ansList) {
  console.log("lengthCheck 入力" + list.length + " 正解" + ansList.length);
  if (list.length != ansList.length) return false;
  const countCheck = function (list, some) {
    let count = 0;
    for (let i = 0; i < list.length; i++) {
      console.log("check " + list[i] + " " + some);
      if (list[i][0] == some[0] && list[i][1] == some[1]) count++;
    }
    return count;
  };

  for (let i = 0; i < ansList.length; i++) {
    const a = countCheck(list, ansList[i]);
    // console.log("a " + a);
    if (countCheck(list, ansList[i]) != 1) return false;
  }

  return true;
}

// 貸方または借方の答えリストを返す
function getAnswerList(drOrCr) {
  console.log(drOrCr);
  const list = [];
  for (let i = 1; i <= 3; i++) {
    if (
      document.getElementById(drOrCr + "-ac-" + i).value != "" &&
      document.getElementById(drOrCr + "-amt-" + i).value != ""
    ) {
      list.push([
        document.getElementById(drOrCr + "-ac-" + i).value,
        document.getElementById(drOrCr + "-amt-" + i).value,
      ]);
    }
  }
  console.log(list);
  return list;
}

/**
 * セレクトボックスの中身を設定
 * name = id , accountsList = 勘定科目のリスト
 * @param {number} duration スクロール時間のミリ秒です。
 */
function setAccounts(name, accountsList) {
  for (let i = -1; i < accountsList.length; i++) {
    const option = document.createElement("option");
    const accountName = i < 0 ? "" : accountsList[i];
    option.setAttribute("value", accountName);
    option.innerHTML = accountName;
    document.getElementById(name).appendChild(option);
  }
}

function removeChildren(x) {
  var select = document.getElementById(x);
  const length = select.options.length;
  for (i = length - 1; i >= 0; i--) {
    select.options[i] = null;
  }
}

// テキストボックスのフォーカスを外すとカンマを挿入
function toComma(obj) {
  if (obj.value.trim().length != 0 && !isNaN(obj.value)) {
    obj.value = Number(obj.value).toLocaleString();
  }
}

// テキストボックスのフォーカスするとカンマを外す
function offComma(obj) {
  var reg = new RegExp(",", "g");
  var chgVal = obj.value.replace(reg, "");
  if (!isNaN(chgVal)) {
    obj.value = chgVal; //値セット
    obj.select(); //全選択
  }
}

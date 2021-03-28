// 問題のリスト
const questionsList = [
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
  {
    q: "譲渡記録により、電子記録債権40,000円を現金38,000円で譲渡した。",
    dr: [
      ["現金", "38,000"],
      ["電子記録債権売却損", "2,000"],
    ],
    cr: [["電子記録債権", "40,000"]],
    actList: [
      "現金",
      "支払手形",
      "電子記録売却損",
      "電子記録売却益",
      "電子記録債務",
      "電子記録債権",
      "支払手数料",
    ],
  },
  {
    q:
      "建物の改修工事で代金500,000円(うち300,000円は耐用年数延長のために支出)を小切手を振り出して支払った。なお、この修繕については前期に修繕引当金100,000円を設定している。",
    dr: [
      ["建物", "300,000"],
      ["修繕引当金", "100,000"],
      ["修繕費", "100,000"],
    ],
    cr: [["当座預金", "500,000"]],
    actList: [
      "現金",
      "当座預金",
      "建物",
      "修繕費",
      "修繕引当金",
      "修繕引当金繰入",
      "減価償却費",
      "建物減価償却累計額",
    ],
  },
];

let currentQuestion;
// console.log(questionsList);
window.onload = function () {
  currentQuestion = questionsList[0];

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
  console.log("QuestionNumber" + next);
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

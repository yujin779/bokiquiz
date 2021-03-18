import "./styles.css";

let month = document.getElementById('karikata');
document.createElement('option')
for(let i = 1; i <= 12; i++){
  let option = document.createElement('option');
  option.setAttribute('value', i);
  option.innerHTML = i + '月';
  month.appendChild(option);
};

document.getElementById('answer').onsubmit = function() {
  console.log("btn");
  const karikata = document.getElementById('karikata').value;
  console.log(karikata);
}
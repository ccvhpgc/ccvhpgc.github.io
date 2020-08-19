









/* Updating Page Views */

function updateViews(){
const pageViews = document.getElementById("page-views");

fetch('https://api.countapi.xyz/update/ccvhpgc/home/?amount=1') .then(res => res.json())
.then(res =>{pageViews.innerText = res.value})
.catch(err =>{pageViews.innerText = err})
 }

updateViews();



/* Updating Copyright Year */

const copyYear=document.getElementById("copy-year")
const date=new Date()
const year=date.getFullYear()
copyYear.innerText=year;

/* RexArvind Web Services */
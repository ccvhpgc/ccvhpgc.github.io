var firebaseConfig={
apiKey:"AIzaSyBN-tGMjWsrJylOpVTLnyrXAfYvrx9gCEU",
authDomain:"ccvhpgc.firebaseapp.com",
databaseURL:"https://ccvhpgc.firebaseio.com",
projectId:"ccvhpgc",
storageBucket:"ccvhpgc.appspot.com",
messagingSenderId:"396547340937",
appId:"1:396547340937:web:fc1280a69df6f029c4e458",
measurementId:"G-T37JYYJ6NE"}
firebase.initializeApp(firebaseConfig)
const auth=firebase.auth()

const ROOT_URL="https://ccvhpgc.000webhostapp.com/api/nn/"
const ADD_USER=ROOT_URL+"add-user"
const COUNT_HIGH_SCORE=ROOT_URL+"count-high-score"
const LIMIT_HIGH_SCORE=ROOT_URL+"limit-high-score.php"
const USER_ANS=ROOT_URL+"user-ans/"

/* shortcut for getting elements by id */
const _=x=>document.getElementById(x)

/* get DOM elements */
const playBtn=_("playBtn")
const logoutBtn=_("logoutBtn")
const paginationBtns=_("paginationBtns")
const resultsBox=_("resultsBox")
const quizKey=_("quizKey")
const certificateName=_("certificateName")
const userPercentage=_("userPercentage")

/* define variables */
let userID, userName, userEmail, userPhoto;
let resStatus, totalRows, pn, rpp=6;

/* use custom alert by alertBS(x) */
const alertBSModal=_("alertBSModal")
const alertBSBody=_("alertBSBody")
const alertBS=text=>{
  const aBS=new bootstrap.Modal(alertBSModal)
  alertBSBody.innerHTML=text
  /* close any already opened modal */
  aBS.hide()
  aBS.toggle()
}


/* enable button after authentication check */
playBtn.disabled="true"


/* check change in user authentication */
auth.onAuthStateChanged(user=>{
  if(user){
    userID=user.uid
    userName=user.displayName
    userEmail=user.email
    userPhoto=user.photoURL
    playBtn.addEventListener("click", startQuiz)
    playBtn.disabled=""
    playBtn.innerText="Click to Start Quiz"
    logoutBtn.classList.remove("d-none")
    getScore(userID)
  } else {
    playBtn.addEventListener("click", loginUser)
    playBtn.disabled=""
    playBtn.innerText="Login to Start Quiz"
    logoutBtn.classList.add("d-none")
  }
})


/* login with Google Firebase Auth */
const loginUser=()=>{
  const googleProvider=new firebase.auth.GoogleAuthProvider()
  auth.signInWithRedirect(googleProvider)
  .then(()=>{
    playBtn.addEventListener("click", startQuiz)
    playBtn.innerText="Click to Start Quiz"
  }).catch(error=>alertBS(error))
}


/* logout */
logoutBtn.addEventListener("click", ()=>{
  let user=firebase.auth().currentUser
  auth.signOut()
  .then(()=>alertBS("Logged out."))
  .catch(error=>alertBS(error))
})


/* trim extra letters */
const shave=(str, n)=>
(str.length>n) ? str.substr(0, n-2)+'..' : str;


/* check API response status */
const checkStatus=res=>{
  if(res.status==true){
    sessionStorage.setItem("key", userID)
    document.location.href="quiz.html"
  } else if(res.status==false){
    playBtn.disabled=""
    playBtn.innerText="Click to Start Quiz"
    alertBS(resStatus.message)
  }
}


/* save user data on database */
const startQuiz=()=>{
  playBtn.disabled="true"
  playBtn.innerText="Loading..."
  let fd=new FormData()
  fd.append("uid", userID)
  fd.append("name", shave(userName,250))
  fd.append("email", shave(userEmail,250))
  fd.append("photoURL", shave(userPhoto,250))
  var xhr=new XMLHttpRequest()
  xhr.open("POST", ADD_USER, true)
  xhr.onreadystatechange = function(){
    if(xhr.readyState==4 && xhr.status==200){
      res=JSON.parse(xhr.responseText)
      playBtn.disabled="true"
      playBtn.innerText="Redirecting..."
      checkStatus(res)
    }
  }
  xhr.onerror = function(){
    playBtn.disabled=""
    playBtn.innerText="Retry"
    alertBS("Ajax Request Error...")
  }
  xhr.send(fd)
}




/* check high score response from API */
const checkScoreStatus=res=>{
  if(res.status==true){
    let output=""
    data=res.data
    data.forEach(data=>{
    output+=`<div class="col-sm-6 col-md-4">
    <div class="card"><span class="card-header h5 text-truncate">${data.name}</span>
    <div class="card-body">
    <div class="row gx-1 gy-0">
    <p class="col-8">Percentage: ${data.percentage} &#37; <br>
    Score: ${data.score} out of ${data.maxScore}<br>Answered: ${data.ques} out of ${data.maxQues}</p>
<img src="${data.photoURL}" class="col-4">
    </div>
    </div>
    </div></div>`
    })
    resultsBox.innerHTML=output
  } else {
    alertBS(res.message)
  }
}



/* get scores and show pagination buttons */
function request_page(pn){
  let last=Math.ceil(totalRows/rpp)
  if(last < 1){last = 1}
  resultsBox.innerHTML='<div class="text-center mb-5"><div class="spinner-border text-light my-5" role="status"></div></div>';
  let fd=new FormData()
  fd.append("rpp", rpp)
  fd.append("last", last)
  fd.append("pn", pn)

  var xhr=new XMLHttpRequest()
  xhr.open("POST", LIMIT_HIGH_SCORE, true)
  xhr.onreadystatechange=()=>{
    if(xhr.readyState == 4 && xhr.status == 200){
        var xhrRes=JSON.parse(xhr.responseText)
        checkScoreStatus(xhrRes)
    }
  }
  xhr.onerror = function(){
    alertBS("Ajax Request Error...")
  }
  xhr.send(fd)

  let paginationCtrls = "";
  if(last != 1){
    if(pn > 1){
      paginationCtrls += '<li class="page-item"><span onclick="request_page('+(pn-1)+')" class="page-link shadow-none">&lt;</span></li>';
      for(let i = pn-3; i < pn; i++){
        if(i > 0){
          paginationCtrls += '<li class="page-item"><span onclick="request_page('+i+')" class="page-link shadow-none">'+i+'</span></li>';
        }
      }
    }
    paginationCtrls += '<li class="page-item active"><span class="page-link shadow-none">'+pn+'</span></li>';

    for(let j = pn+1; j <= last; j++){
      paginationCtrls += '<li class="page-item"><span onclick="request_page('+j+')" class="page-link shadow-none">'+j+'</span></li>';
      if(j >= pn+3){
        break;
      }
    }
    if(pn != last){
      paginationCtrls += '<li class="page-item"><span onclick="request_page('+(pn+1)+')" class="page-link shadow-none">&gt;</span></li>';
    }
  }
  paginationBtns.innerHTML=paginationCtrls
}


/* count total users for displaying scores */
fetch(COUNT_HIGH_SCORE)
.then(res=>res.json())
.then(res=>{
  if(res.status==true){
    totalRows=res.data
    request_page(1);
  } else {
    alertBS(res.message)
  }
})
.catch(err=>alertBS("Can not load High Scores.<br>"+err))



if ('serviceWorker' in navigator){
  navigator.serviceWorker
  .register('/sw.js')
  .then(function(){
    console.log('Service Worker Registered')
  })
}

let deferredPrompt;
const pwaBtn = _("pwaBtn");

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  pwaBtn.classList.remove("d-none");

  pwaBtn.addEventListener('click', (e) => {
    pwaBtn.classList.add("d-none");
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) =>{
    if (choiceResult.outcome === 'accepted') {
    console.log('User accepted the A2HS prompt');
    } else {
    console.log('User dismissed the A2HS prompt');
    }
    deferredPrompt = null;
    });
  });
});



const userAns=(el)=>{
  el.classList.add("disabled")
  fetch(USER_ANS+userID).then(res=>res.json())
  .then(res=>{
    if(res.status==true){
      if(res.data==null){
      alertBS("No data found, play quiz")
      el.classList.remove("disabled")
      return 
      }

      let allData=JSON.parse(res.data);
      let output="";
      allData.forEach((data, index)=>{
        output+=`<b>Q ${index+1}.</b> ${data.q}<br><b>Ans.</b> ${data.a}<br><b>Result:</b> ${data.c}<br><hr>`
      }) 
      alertBS(output)
    } else { alertBS(res.message) }
    el.classList.remove("disabled")
  })
  .catch(err=>{
    alertBS(err)
  el.classList.remove("disabled")
 })
}






const getScore=id=>{
  quizKey.value=id
  fetch(ROOT_URL+"get-score/"+uid)
  .then(res=>res.json())
  .then(res=>{
  if(res.status==true){
    data=res.data
   certificateName.value=shave(data.name,28)
   userPercentage.innerHTML=data.percentage
  }
})
.catch(err=>alertBS("Can not load Scores.<br>"+err))

}





const updateViews=()=>{
const pageViews=_("page-views")
fetch('https://api.countapi.xyz/update/rexarvind/home/?amount=1').then(res =>res.json())
.then(res=>{pageViews.innerText = res.value})
.catch(err=>{pageViews.innerText=err})
}
updateViews()

const date=new Date();
_("copyYear").innerText=date.getFullYear()
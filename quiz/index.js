/* shortcut for getting elements by id */
const _=id=>document.getElementById(id)

/* get DOM elements */
const playBtn=_("playBtn")
const alertBSModal=_("alertBSModal")
const alertBSBody=_("alertBSBody")

/* define variables */
let userID, userName, userEmail, userPhoto;
let resStatus;

/* use custom alert by alertBS(x) */
const alertBS=text=>{
  const aBS=new bootstrap.Modal(alertBSModal)
  alertBSBody.innerHTML=text
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
    playBtn.innerText="Start Quiz"
  } else {
    playBtn.addEventListener("click", loginUser)
    playBtn.disabled=""
    playBtn.innerText="Login to Start Quiz"
  }
})


/* login with Google Firebase Auth */
const loginUser=()=>{
  const googleProvider=new firebase.auth.GoogleAuthProvider()
  auth.signInWithRedirect(googleProvider)
  .then(()=>{
    playBtn.addEventListener("click", startQuiz)
    playBtn.innerText="Start Game"
  }).catch(error=>alertBS(error))
}


/* trim extra letters */
const shave=(str, n)=>
(str.length>n) ? str.substr(0, n-2)+'..' : str;


/* check API response status */
const checkStatus=resStatus=>{
  if(resStatus.status==true){
    sessionStorage.setItem("key", userID)
    document.location.href="quiz.html"
  } else if(resStatus.status==false){
    playBtn.disabled=""
    playBtn.innerText="Start Game"
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
      resStatus=JSON.parse(xhr.responseText)
      playBtn.disabled="true"
      playBtn.innerText="Redirecting..."
      checkStatus(resStatus)
    }
  }
  xhr.onerror = function(){
    playBtn.disabled=""
    playBtn.innerText="Retry"
    alertBS("Ajax Request Error...")
  }
  xhr.send(fd)
}


/* update copyright year */
const date=new Date();
_("copyYear").innerText=date.getFullYear()
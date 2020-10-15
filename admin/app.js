var firebaseConfig={
apiKey:"AIzaSyAIBhvdbyFlTqZLgtNA7uTWHymjHOpzyMU",
authDomain:"rexarvind.firebaseapp.com",
databaseURL:"https://rexarvind.firebaseio.com",
projectId:"rexarvind",
storageBucket:"rexarvind.appspot.com",
messagingSenderId:"685927662051",
appId:"1:685927662051:web:252add00d42a851bc320d6"}
firebase.initializeApp(firebaseConfig);
const auth=firebase.auth();

const _=id=>document.getElementById(id)
const qsa=el=>document.querySelectorAll(el)

const guestEl=qsa(".guest")
const memberEl=qsa(".member")

auth.onAuthStateChanged(user=>{
if(user){
memberID = user.uid;
guestEl.forEach(el=>el.style.display="none")
memberEl.forEach(el=>el.style.display="block")
getProfile()
}else{
guestEl.forEach(el=>el.style.display="block")
memberEl.forEach(el=>el.style.display="none")}
})

const signupForm=_("signupForm")
const signupEmail=_("signupEmail")
const signupPwd=_("signupPwd")

const loginForm=_("loginForm")
const loginEmail=_("loginEmail")
const loginPwd=_("loginPwd")

const logout=_("logout")

const resetPwdForm=_("resetPwdForm")
const resetPwdEmail=_("resetPwdEmail")

const deleteAcc=_("deleteAcc")

const profileForm=_("profileForm")
const profileName=_("profileName")
const profileClass=_("profileClass")
const profileEmail=_("profileEmail")
const profileWA=_("profileWA")
const profilePhone=_("profilePhone")
const profileErrMsg=_("profileErrMsg")
const profileOutput=_("profileOutput")



signupForm.addEventListener("submit", (e)=>{e.preventDefault()
const email=signupEmail.value
const pwd=signupPwd.value
auth.createUserWithEmailAndPassword(email, pwd).then(cred=>{sendVerificationEmail()
signupForm.reset()
}).catch(error=>alert(error.message))
})

const sendVerificationEmail=()=>{
auth.currentUser.sendEmailVerification()
.then(()=>console.log("Email sent"))
.catch(error=>alert(error))
}

loginForm.addEventListener("submit", (e)=> {e.preventDefault()
const email=loginEmail.value
const pwd=loginPwd.value
auth.signInWithEmailAndPassword(email, pwd)
.then(cred=>loginForm.reset())
.catch(error=>alert(error.message))
})

logout.addEventListener("click", ()=>{
let user=firebase.auth().currentUser
auth.signOut()
.then(()=>console.log("logged out."))
.catch(error=>alert(error))
})

resetPwdForm.addEventListener("submit", (e)=>{e.preventDefault()
const email=resetPwdEmail.value
auth.sendPasswordResetEmail(email)
.then(()=>alert("Pwd Reset Email Sent."))
.catch(error=>alert(error))
})

const createCredential=user=>{
const pwd=prompt("Enter your password for verification:")
const credential= firebase.auth.EmailAuthProvider.credential(
user.email,
pwd)
return credential}


deleteAcc.addEventListener("click", ()=>{
let user=firebase.auth().currentUser
const credential=createCredential(user)
user.reauthenticateWithCredential(credential)
.then(()=>{user.delete()
alert("Your Account Has Been Deleted.") })
.catch(error=>alert(error))
})








profileForm.addEventListener("submit", (e)=> {e.preventDefault()

let fd=new FormData()
fd.append("uid", memberID)
fd.append("name", profileName.value)
fd.append("class", profileClass.value)
fd.append("email", profileEmail.value)
fd.append("whatsapp", profileWA.value)
fd.append("phone", profilePhone.value)

var xhr=new XMLHttpRequest()

xhr.open("POST", "https://rexarvind.000webhostapp.com/api/cc/post.php" , true)

xhr.onreadystatechange = function(){
  if(xhr.readyState==4 && xhr.status==200){
    output=JSON.parse(xhr.responseText)
    profileErrMsg.innerHTML=output.message
    getProfile()
  }
}
xhr.send(fd)
})






function getProfile(){

fetch('https://rexarvind.000webhostapp.com/api/cc/get/'+memberID)
.then(res=>res.json())
.then(res=>showProfile(res))
.catch(err=>console.log(err))
}


function showProfile(data){
data=data.message
let allData="";

allData=`Name:<br>${data[0].name}<br><br>
Class:<br>${data[0].class}<br><br>
Email:<br>${data[0].email}<br><br>
WhatsApp:<br>${data[0].whatsapp}<br><br>
Phone:<br>${data[0].phone}<br><br>`;

profileOutput.innerHTML=allData

profileName.value=data[0].name
profileClass.value=data[0].class
profileEmail.value=data[0].email
profileWA.value=data[0].whatsapp
profilePhone.value=data[0].phone
}





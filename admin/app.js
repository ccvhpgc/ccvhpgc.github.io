var firebaseConfig={
apiKey:"AIzaSyAIBhvdbyFlTqZLgtNA7uTWHymjHOpzyMU",
authDomain:"rexarvind.firebaseapp.com",
databaseURL:"https://rexarvind.firebaseio.com",
projectId:"rexarvind",
storageBucket:"rexarvind.appspot.com",
messagingSenderId:"685927662051",
appId:"1:685927662051:web:252add00d42a851bc320d6"}
firebase.initializeApp(firebaseConfig)
const auth=firebase.auth()

const _=id=>document.getElementById(id)

const ROOT_URL="https://rexarvind.000webhostapp.com"

const guestArea=_("guestArea")
const userArea=_("userArea")

const displayEmail=_("displayEmail")

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

const updateEmailForm=_("updateEmailForm")
const newEmail=_("newEmail")

const userDetailsForm=_("userDetailsForm")
const userFullName=_("userFullName")
const userClass=_("userClass")
const userEmail=_("userEmail")
const userWhatsApp=_("userWhatsApp")
const userPhone=_("userPhone")
const userAbout=_("userAbout")
const userErrMsg=_("userErrMsg")

const userDetailsOutput=_("userDetailsOutput")

const userImg=_("userImg")
const userImgForm=_("userImgForm")
const userImgFile=_("userImgFile")
const userImgMsg=_("userImgMsg")



auth.onAuthStateChanged(user=>{
if(user){
guestArea.style.display="none"
userArea.style.display="block"
userID=user.uid
displayEmail.innerHTML=user.email
getProfile()
}else{
guestArea.style.display="block"
userArea.style.display="none"}
})

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

updateEmailForm.addEventListener("submit", (e)=>{e.preventDefault()
const user=auth.currentUser;
const newEmail=newEmailEl.value
const credential = createCredential(user)
changeEmail(user, credential, newEmail)
})

const changeEmail=(user, credential, newEmail)=>{
user.reauthenticateWithCredential(credential)
.then(()=>{user.updateEmail(newEmail)
.then(()=>alert('Email Updated!'))
.catch(error=>alert(error))
}).catch(error =>alert(error))
}




userDetailsForm.addEventListener("submit", (e)=> {e.preventDefault()

let fd=new FormData()
fd.append("uid", userID)
fd.append("name", userFullName.value)
fd.append("class", userClass.value)
fd.append("email", userEmail.value)
fd.append("whatsapp", userWhatsApp.value)
fd.append("phone", userPhone.value)
fd.append("about", userAbout.value)

var xhr=new XMLHttpRequest()

xhr.open("POST", "https://rexarvind.000webhostapp.com/api/cc/post.php" , true)

xhr.onreadystatechange = function(){
  if(xhr.readyState==4 && xhr.status==200){
    output=JSON.parse(xhr.responseText)
    userErrMsg.innerHTML=output.message
    userErrMsg.style.display="block";
    setTimeout(()=>{
    userErrMsg.style.display="none";},3000)
    getProfile()
  }
}
xhr.send(fd)
})



function getProfile(){
fetch('https://rexarvind.000webhostapp.com/api/cc/get/'+userID)
.then(res=>res.json())
.then(res=>showProfile(res))
.catch(err=>alert(err))
}


function showProfile(data){
data=data.message
let output="";

output=`<b>Name:</b> ${data[0].name}<br>
<b>Class:</b> ${data[0].class}<br>
<b>Email:</b> ${data[0].email}<br>
<b>WhatsApp:</b> ${data[0].whatsapp}<br>
<b>Phone:</b> ${data[0].phone}<br>
<b>About:</b><span style="white-space: pre-wrap"> ${data[0].about}</span>`;

userDetailsOutput.innerHTML=output

userFullName.value=data[0].name
userClass.value=data[0].class
userEmail.value=data[0].email
userWhatsApp.value=data[0].whatsapp
userPhone.value=data[0].phone
userAbout.value=data[0].about
userImg.src=ROOT_URL+'/uploads/cc/'+userID+'-0.jpg?'+Math.random()
}




userImgForm.addEventListener("submit", (e)=>{
e.preventDefault();
userImgMsg.innerHTML="Please wait..."
let img=userImgFile.files[0];

var imgFD = new FormData();	
imgFD.append("img", img);
imgFD.append("uid", userID);

var ajax = new XMLHttpRequest();
ajax.open("POST", "https://rexarvind.000webhostapp.com/api/cc/photo.php");

ajax.addEventListener("load", userImgComplete, false);
ajax.onreadystatechange=function(){
  if(ajax.readyState==4 && ajax.status==200) {
      userImgMsg.innerHTML=ajax.responseText;
      setTimeout(()=>{userImgMsg.innerHTML=""},3000)
  }
}
ajax.send(imgFD)
})

function userImgComplete(e){
userImg.src=ROOT_URL+'/uploads/cc/'+userID+'-0.jpg?'+Math.random()
}







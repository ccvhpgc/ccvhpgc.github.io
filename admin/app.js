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

bsCustomFileInput.init()

const _=id=>document.getElementById(id)

const ROOT_URL="https://rexarvind.000webhostapp.com"

const guestArea=_("guestArea")
const userArea=_("userArea")

const displayEmail=_("displayEmail")

const signupEmail=_("signupEmail")
const signupPwd=_("signupPwd")
const signupBtn=_("signupBtn")

const loginEmail=_("loginEmail")
const loginPwd=_("loginPwd")
const loginBtn=_("loginBtn")

const logout=_("logout")

const resetPwdEmail=_("resetPwdEmail")
const resetPwdBtn=_("resetPwdBtn")

const deleteAcc=_("deleteAcc")


const newEmailEl=_("newEmail")
const updateEmailBtn=_("updateEmailBtn")

const newPwdEl=_("newPwd")
const newPwdBtn=_("newPwdBtn")

const userFullName=_("userFullName")
const userClass=_("userClass")
const userEmail=_("userEmail")
const userWhatsApp=_("userWhatsApp")
const userPhone=_("userPhone")
const userAbout=_("userAbout")
const userErrMsg=_("userErrMsg")
const userDetailsBtn=_("userDetailsBtn")

const userDetailsOutput=_("userDetailsOutput")

const userVideo=_("userVideo")
const userVideoOutput=_("userVideoOutput")


const userImg=_("userImg")
const userImgForm=_("userImgForm")
const userImgFile=_("userImgFile")
const userImgMsg=_("userImgMsg")

const alertBSModal=_("alertBSModal")
const alertBSBody=_("alertBSBody")
const aBox=new bootstrap.Modal(alertBSModal)



userVideo.addEventListener("blur", ()=>{

userVideoOutput.src="https://www.youtube.com/embed/"+userVideo.value+"?rel=0";
})





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


function alertBS(text){
alertBSBody.innerHTML=text
aBox.toggle()}



signupBtn.addEventListener("click", ()=>{
signupBtn.disabled="true"
const email=signupEmail.value
const pwd=signupPwd.value
auth.createUserWithEmailAndPassword(email, pwd).then(cred=>{sendVerificationEmail()
signupEmail.value=""
signupBtn.disabled=""
}).catch(error=>{alertBS(error.message)
signupBtn.disabled=""
})
})

const sendVerificationEmail=()=>{
auth.currentUser.sendEmailVerification()
.then(()=>console.log("Email sent"))
.catch(error=>alertBS(error))
}

loginBtn.addEventListener("click", ()=> {
const email=loginEmail.value
const pwd=loginPwd.value
auth.signInWithEmailAndPassword(email, pwd)
.then(cred=>loginEmail.value="")
.catch(error=>alertBS(error.message))
})

logout.addEventListener("click", ()=>{
let user=firebase.auth().currentUser
auth.signOut()
.then(()=>alertBS("Logged out."))
.catch(error=>alertBS(error))
})

resetPwdBtn.addEventListener("click", ()=>{
resetPwdBtn.disabled="true"
const email=resetPwdEmail.value
auth.sendPasswordResetEmail(email)
.then(()=>{
alertBS("Password Reset Email Sent. Check your inbox.")
})
.catch(error=>{alertBS(error)
resetPwdBtn.disabled=""
})
})

const createCredential=user=>{
const pwd=prompt("Enter your password for verification:")
const credential= firebase.auth.EmailAuthProvider.credential(
user.email,
pwd)
return credential}


function deleteUserDB(){
fetch('https://rexarvind.000webhostapp.com/api/cc/delete/'+userID)
.then(res=>res.text())
.then(res=>alertBS(res))
.catch(err=>alertBS("Info:"+err))}



deleteAcc.addEventListener("click", ()=>{
let user=firebase.auth().currentUser
const credential=createCredential(user)
user.reauthenticateWithCredential(credential)
.then(()=>{let resDEL=deleteUserDB();
user.delete();
})
.catch(error=>{alertBS(error)})
})

updateEmailBtn.addEventListener("click", ()=>{
const user=auth.currentUser;
const newEmail=newEmailEl.value
const credential = createCredential(user)
changeEmail(user, credential, newEmail)
})

const changeEmail=(user, credential, newEmail)=>{
user.reauthenticateWithCredential(credential)
.then(()=>{user.updateEmail(newEmail)
.then(()=>{alertBS('Email Updated!')})
}).catch(error =>{alertBS(error)})
}





newPwdBtn.addEventListener("click", ()=>{
const user=auth.currentUser;
const newPwd=newPwdEl.value
const credential = createCredential(user)
changePwd(user, credential, newPwd)
})

const changePwd=(user, credential, newPwd)=>{
user.reauthenticateWithCredential(credential)
.then(()=>{user.updatePassword(newPwd)
.then(()=>{alertBS('Password Updated!')
})
.catch(error=>{alertBS(error)
})
}).catch(error =>{alertBS(error)
})
}



/* Remove extra characters */
const shave=(str, n)=>
(str.length>n) ? str.substr(0, n-3)+'...' : str;








userDetailsBtn.addEventListener("click", ()=> {
let fd=new FormData()
fd.append("uid", userID)
fd.append("name", shave(userFullName.value,150))
fd.append("class", shave(userClass.value,250))
fd.append("email", shave(userEmail.value,250))
fd.append("whatsapp", shave(userWhatsApp.value,250))
fd.append("phone", shave(userPhone.value,250))
fd.append("about", shave(userAbout.value,250))
fd.append("video", shave(userVideo.value,50))


var xhr=new XMLHttpRequest()

xhr.open("POST", "https://rexarvind.000webhostapp.com/api/cc/post.php" , true)

xhr.onreadystatechange = function(){
  if(xhr.readyState==4 && xhr.status==200){
    output=xhr.responseText
    userErrMsg.innerHTML=output
    userErrMsg.classList.remove("d-none");
    setTimeout(()=>{
    userErrMsg.classList.add("d-none")},3000)
    getProfile()
  }
}
xhr.send(fd)
})



function getProfile(){
fetch('https://rexarvind.000webhostapp.com/api/cc/get/'+userID)
.then(res=>res.json())
.then(res=>showProfile(res))
.catch(err=>console.log(err))
}




function showProfile(data){
if (data.status==false){
alertBS(data.message)
}
data=data.data
let output="";

output=`<b>Name:</b> ${data[0].name}<br>
<b>Class:</b> ${data[0].class}<br>
<b>Email:</b> ${data[0].email}<br>
<b>WhatsApp:</b> ${data[0].whatsapp}<br>
<b>Phone:</b> ${data[0].phone}<br>
<b>Video code:</b> ${data[0].video}<br>
<b>About:</b><span style="white-space: pre-wrap"> ${data[0].about}</span>`;

userDetailsOutput.innerHTML=output

userFullName.value=data[0].name
userClass.value=data[0].class
userEmail.value=data[0].email
userWhatsApp.value=data[0].whatsapp
userPhone.value=data[0].phone
userVideo.value=data[0].video
userAbout.value=data[0].about
userImg.src=ROOT_URL+'/uploads/cc/'+userID+'-0.jpg';
userVideoOutput.src="https://www.youtube.com/embed/"+data[0].video+"?rel=0";
}






userImgForm.addEventListener("submit", (e)=>{
e.preventDefault();
let img=userImgFile.files[0];

if(img.size > 2000000){
alertBS("Maximum file size is 2MB")
return
}

userImgMsg.classList.remove("d-none");
userImgMsg.innerHTML="Please wait..."
var imgFD = new FormData();	
imgFD.append("img", img);
imgFD.append("uid", userID);

var ajax = new XMLHttpRequest();
ajax.open("POST", "https://rexarvind.000webhostapp.com/api/cc/photo.php");

ajax.addEventListener("load", userImgComplete, false);
ajax.onreadystatechange=function(){
  if(ajax.readyState==4 && ajax.status==200) {
      userImgMsg.innerHTML=ajax.responseText;
      setTimeout(()=>{userImgMsg.classList.add("d-none");},3000)
  }
}
ajax.send(imgFD)
})

function userImgComplete(e){
userImg.src=ROOT_URL+'/uploads/cc/'+userID+'-0.jpg?'+Math.random()
}


/* opens all.html */
const allPage=()=>{
sessionStorage.setItem("key", userID)
document.location.href="all.html"}




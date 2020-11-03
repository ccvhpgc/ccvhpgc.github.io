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
const ROOT_URL="https://ccvhpgc.000webhostapp.com/api/quiz/"
const ADD_QUES=ROOT_URL+"add-ques/cm"
const DELETE_QUES=ROOT_URL+"del-ques/cm/"
const  QUESTIONS=ROOT_URL+"questions/cm/"


/* shortcut for getting elements by id */
const _=id=>document.getElementById(id)

/* get DOM elements */
const loader=_("loader")
const guestCard=_("guestCard")
const loginBtn=_("loginBtn")
const logoutBtn=_("logoutBtn")
const userCard=_("userCard")
const totalQuesAdded=_("totalQuesAdded")
const quesID=_("quesID")
const ques=_("ques")
const ans1=_("ans1")
const ans2=_("ans2")
const ans3=_("ans3")
const ans4=_("ans4")
const correct=_("correct")
const desc=_("desc")
const submitBtn=_("submitBtn")
const clearForm=_("clearForm")
const pagination_controls=_("paginationBtns")
const results_box=_("results_box")

/* define variables */
let userID, resStatus, availableQues=[]

/* use custom alert by alertBS(x) */
const alertBSModal=_("alertBSModal")
const alertBSBody=_("alertBSBody")
const alertBS=text=>{
  const aBS=new bootstrap.Modal(alertBSModal)
  alertBSBody.innerHTML=text
  aBS.hide()
  aBS.toggle()
}


/* check change in user authentication */
auth.onAuthStateChanged(user=>{
  if(user){
    userID=user.uid
    loader.classList.add("d-none")
    guestCard.classList.add("d-none")
    logoutBtn.classList.remove("d-none")
    request_page(1)
  } else {
    loader.classList.add("d-none")
    guestCard.classList.remove("d-none")
    userCard.classList.add("d-none")
    logoutBtn.classList.add("d-none")
  }
})


/* login with Google Firebase Auth */
loginBtn.addEventListener("click", ()=>{
  loginBtn.disabled="true"
  const googleProvider=new firebase.auth.GoogleAuthProvider()
  auth.signInWithRedirect(googleProvider)
  .then(()=>{
    guestCard.classList.add("d-none")
    userCard.classList.remove("d-none")
    loginBtn.disabled=""
  }).catch(error=>{
    alertBS(error)
    loginBtn.disabled=""
  })
})


/* logout */
logoutBtn.addEventListener("click", ()=>{
let user=firebase.auth().currentUser
auth.signOut()
.then(()=>alertBS("Logged out."))
.catch(error=>alertBS(error))
})


clearForm.addEventListener("click", ()=>{
  quesID.value=""
  ques.innerHTML=""
  ans1.innerHTML=""
  ans2.innerHTML=""
  ans3.innerHTML=""
  ans4.innerHTML=""
  correct.value=""
  desc.innerHTML=""
})


const deleteQues=id=>{
delPath=DELETE_QUES+id+"/"+userID
let confirmRes=confirm("Are you sure you want to delete this question!");
  if (confirmRes == true) {
    fetch(delPath).then(res=>res.json())
    .then(res=>alertBS(res.message))
    .catch(err=>alertBS(err))
  }
}

const outEntity=str=>{
  return str .replace(/&/g, '&#38;')
  .replace(/"/g, '&#34;') .replace(/'/g, '&#39;')
  .replace(/</g, '&#60;') .replace(/>/g, '&#62;');
}

const inEntity=str=>{
  return str .replace(/&#38;/g, '&')
  .replace(/&#34;/g, '"') .replace(/&#39;/g, "'")
  .replace(/&#60;/g, '<') .replace(/&#62;/g, '>');
}

const editQues=i=>{
quesID.value=availableQues[i].id
ques.innerHTML=outEntity(availableQues[i].ques)
ans1.innerHTML=outEntity(availableQues[i].ans1)
ans2.innerHTML=outEntity(availableQues[i].ans2)
ans3.innerHTML=outEntity(availableQues[i].ans3)
ans4.innerHTML=outEntity(availableQues[i].ans4)
correct.value=availableQues[i].correct
desc.innerHTML=outEntity(availableQues[i].desc)
}

const showQuesDesc=i=>{
  let tempDesc;
  tempDesc=`<span style="white-space:pre-wrap">${availableQues[i].desc}</span>`
  alertBS(tempDesc)
}



const showQues=data=>{
  let output=""
  data.forEach((data, index)=>{
    output+=`<div class="col-sm-6 col-md-4">
    <div class="card h-100 shadow-sm border-secondary">
    <span class="card-header h6" style="white-space:pre-wrap">${data.ques}</span><div class="card-body">1. ${data.ans1}<br>2. ${data.ans2}<br>3. ${data.ans3}<br>4. ${data.ans4}<br>Correct Ans: ${data.correct}
    </div><div class="card-footer d-flex justify-content-between">
    <button onclick="deleteQues('${data.id}')" class="btn btn-danger btn-sm flex-fill mr-2">Delete</button>
    <button onclick="editQues('${index}')" class="btn btn-success btn-sm flex-fill">Edit</button>
    <button onclick="showQuesDesc('${index}')" class="btn btn-dark btn-sm flex-fill ml-2">Description</button>
    </div>
    </div>
    </div>`
  })

  results_box.innerHTML=output
availableQues=[...data]
}


/* get questions and show pagination buttons */
function request_page(pn){
  results_box.innerHTML='<div class="text-center mb-5"><div class="spinner-border my-5" role="status"></div></div>';

  let last, paginationCtrls=""

  fetch(QUESTIONS+pn+"/"+userID)
  .then(res=>res.json())
  .then(res=>{
    if(res.status==false){
      alertBS("Error: "+res.message)
    } else if(res.status==true){
      userCard.classList.remove("d-none")

      last=Math.ceil(res.total/res.rpp)
      if(last<1){last=1}

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
 pagination_controls.innerHTML=paginationCtrls
updateQuesAdded(res.total)
showQues(res.data)

    }
  }).catch(err=>alertBS(err))
}
    
    







submitBtn.addEventListener("click", ()=>{
  let fd=new FormData()
  fd.append("uid", userID)
  fd.append("id", quesID.value)
  fd.append("ques", outEntity(ques.value))
  fd.append("ans1", outEntity(ans1.value))
  fd.append("ans2", outEntity(ans2.value))
  fd.append("ans3", outEntity(ans3.value))
  fd.append("ans4", outEntity(ans4.value))
  fd.append("correct", correct.value)
  fd.append("desc", outEntity(desc.value))
  let xhr=new XMLHttpRequest()
  xhr.open("POST", ADD_QUES, true)
  xhr.onreadystatechange = function(){
    if(xhr.readyState==4 && xhr.status==200){
      res=JSON.parse(xhr.responseText)
      alertBS(res.message)
      if(res.status){request_page(1)}
    }
  }
  xhr.onerror = function(){
    alertBS("Request Error...")
  }
  xhr.send(fd)
})

const updateQuesAdded=(totalQues)=>{
  totalQuesAdded.innerHTML=totalQues
}

const updateViews=()=>{
const pageViews=_("page-views")
fetch('https://api.countapi.xyz/update/ccvhpgc/home/?amount=1').then(res =>res.json())
.then(res=>{pageViews.innerText = res.value})
.catch(err=>{pageViews.innerText=err.message})
}
updateViews()

const date=new Date();
_("copyYear").innerText=date.getFullYear()
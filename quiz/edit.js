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
const ROOT_URL="https://ccvhpgc.000webhostapp.com/api/cm/"
const ADD_QUES=ROOT_URL+"add-ques"
const DELETE_QUES=ROOT_URL+"del-ques"
const  QUESTIONS=ROOT_URL+"questions/"


/* shortcut for getting elements by id */
const _=id=>document.getElementById(id)

/* get DOM elements */
const loader=_("loader")
const guestCard=_("guestCard")
const loginBtn=_("loginBtn")
const logoutBtn=_("logoutBtn")
const userCard=_("userCard")
const totalQuesAdded=_("totalQuesAdded")
const refreshBtn=_("refreshBtn")
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
let userID
let resStatus
let availableQues=[]

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
    userCard.classList.remove("d-none")
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
  ques.value=""
  ans1.value=""
  ans2.value=""
  ans3.value=""
  ans4.value=""
  correct.value=""
  desc.value=""
})


const deleteQues=id=>{
delPath=DELETE_QUES+".php?uid="+userID+"&id="+id
let confirmRes=confirm("Are you sure you want to delete this question!");
  if (confirmRes == true) {
    fetch(delPath).then(res=>res.json())
    .then(res=>alertBS(res.message))
    .catch(err=>alertBS(err))
  }
}


const editQues=i=>{
  quesID.value=availableQues[i].id
  ques.innerHTML=availableQues[i].ques
  ans1.innerHTML=availableQues[i].ans1
  ans2.innerHTML=availableQues[i].ans2
  ans3.innerHTML=availableQues[i].ans3
  ans4.innerHTML=availableQues[i].ans4
  correct.value=availableQues[i].correct
  desc.innerHTML=availableQues[i].desc
}

const showQuesDesc=i=>{
  let tempDesc;
  tempDesc=`<span style="white-space:pre-wrap">${availableQues[i].desc}</span>`
  alertBS(tempDesc)
}



const showQues=data=>{
  availableQues=[...data]
  let output=""
  data.forEach((index, data)=>{
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


showQues(res.data)
updateQuesAdded(res.total)

    }
  }).catch(err=>alertBS(err))
}


    
    




refreshBtn.addEventListener("click", request_page(1))


submitBtn.addEventListener("click", ()=>{
  let fd=new FormData()
  fd.append("uid", userID)
  fd.append("id", quesID.value)
  fd.append("ques", ques.value)
  fd.append("ans1", ans1.value)
  fd.append("ans2", ans2.value)
  fd.append("ans3", ans3.value)
  fd.append("ans4", ans4.value)
  fd.append("correct", correct.value)
  fd.append("desc", desc.value)
  let xhr=new XMLHttpRequest()
  xhr.open("POST", ADD_QUES, true)
  xhr.onreadystatechange = function(){
    if(xhr.readyState==4 && xhr.status==200){
      res=JSON.parse(xhr.responseText)
      alertBS(res.message)
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
import {initializeApp} from 'firebase/app'
import {
    collection,
    getFirestore,
    getDocs,
    addDoc,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp,
    getDoc,
    updateDoc,
} from 'firebase/firestore'
import {
    getAuth,
    createUserWithEmailAndPassword,
    signOut,
    signInWithEmailAndPassword,
    onAuthStateChanged
} from 'firebase/auth'


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDIlCJG3rT_BTRcgwFVAr2XnqkbRMK0Seg",
    authDomain: "project01-af8c0.firebaseapp.com",
    projectId: "project01-af8c0",
    storageBucket: "project01-af8c0.appspot.com",
    messagingSenderId: "518428872000",
    appId: "1:518428872000:web:c5dbca5246c93a92c9bea5",
    measurementId: "G-XKTYC0DR8N"
  }


  // init firebase app
  initializeApp(firebaseConfig)

  // init services
  const db = getFirestore()
  const auth = getAuth()

  //collection ref
  const colRef = collection(db , 'books')

  // queries
  const q = query(colRef , 
   orderBy('createdAt')
   )

  // get collection data
    const unsubCol = onSnapshot(q,(snapshot)=> {
        let books = []
        snapshot.docs.forEach((doc) => {
            books.push({...doc.data() , id: doc.id })
        })
        console.log(books)
    })


    // adding documents
    const addBookForm = document.querySelector('.add')
    addBookForm.addEventListener('submit' , (e)=> {
        e.preventDefault()

        addDoc(colRef , {
            title: addBookForm.title.value, 
            author: addBookForm.author.value,
            createdAt: serverTimestamp()
        })
        .then(() => {
            addBookForm.reset()
        })
    })

    // deleting document
    const deleteBookForm = document.querySelector('.delete')
    deleteBookForm.addEventListener('submit' , (e)=>{
        e.preventDefault()

        const docRef = doc(db , 'books' , deleteBookForm.id.value)

        deleteDoc(docRef)
        .then(()=> {
            deleteBookForm.reset()
        })
    })


// getting a single document
const docRef = doc(db , 'books' , 'MQxyPNyw1lnuFLePChQ9')

getDoc(docRef)


const unsubDoc = onSnapshot(docRef , (doc)=> {
    console.log(doc.data() , doc.id)
})

// updating a document
const updateForm = document.querySelector('.update')
updateForm.addEventListener('submit' , (e)=> {
    e.preventDefault()

    const docRef = doc(db , 'books' , updateForm.id.value)
    updateDoc(docRef , {
        title: 'updated title'
    })
    .then(() =>{
        updateForm.reset()
    })
})


// signing users up
const signupForm = document.querySelector('.signup')
signupForm.addEventListener('submit' , (e) => {
    e.preventDefault()

    const email = signupForm.email.value
    const password = signupForm.password.value

    createUserWithEmailAndPassword(auth , email,password)
    .then((cred)=>{
        // console.log('user created:',cred.user)
        signupForm.reset()
    })
    .catch((err)=>{
        console.log(err.message)
    })
})

// loggin in and out
const logoutButton = document.querySelector('.logout')
logoutButton.addEventListener('click' , ()=> {
    signOut(auth)
    .then(()=>{
        // console.log('the user signed out')
    })
    .catch((err)=> {
        console.log(err.message)
    })

})

const loginForm = document.querySelector('.login')
loginForm.addEventListener('submit' , (e)=> {
    e.preventDefault()

    const email = loginForm.email.value
    const password = loginForm.password.value

    signInWithEmailAndPassword(auth, email,password)
    .then((cred)=>{
        // console.log("user logged in:" , cred.user)
    })
    .catch((err)=>{
        console.log(err.message)
    })
})

//subscribing to auth changes
const unsubAuth = onAuthStateChanged(auth, (user)=>{
    console.log('user status changes:' , user)
})

//unsubscribing from changes (auth & db)
// const unsubButton = document.querySelector('.unsub')
// unsubButton.addEventListener('click' , () => {
//     console.log('unsubscribing')

//     unsubCol()
//     unsubDoc()
//     unsubAuth()
// })
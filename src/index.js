import { initializeApp } from "firebase/app"
import { 
    getFirestore, collection, onSnapshot, addDoc, deleteDoc, doc, query, where, orderBy, serverTimestamp 
} from "firebase/firestore"
import {
    getAuth, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword
} from "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyCLVvtDaUTz9MvaBHFq-nuNK51BMSSOu-c",
    authDomain: "peak-plating-362706.firebaseapp.com",
    projectId: "peak-plating-362706",
    storageBucket: "peak-plating-362706.appspot.com",
    messagingSenderId: "128107305008",
    appId: "1:128107305008:web:603a97a1de63c92841f5f5"
};

// init firebase app
initializeApp(firebaseConfig);

// init services
const db = getFirestore();
const auth = getAuth();

// collection ref
const colref = collection(db, "books");

// queries
const q = query(colref, orderBy("createAt"));

// real time collection data
/*
getDocs(colref)
    .then((snapshot) => {
        let books = [];
        snapshot.docs.forEach((doc) => {
            books.push({ ...doc.data(), id: doc.id });
        })
        console.log(books);
    })
    .catch(err => {
        console.log(err.message);
    })
*/

onSnapshot(q, (snapshot) => {
    let books = [];
    snapshot.docs.forEach((doc) => {
        books.push({ ...doc.data(), id: doc.id });
    });
    console.log(books);
});

// adding documents
const addBookForm = document.querySelector(".add");
addBookForm.addEventListener("submit", (e) => {
    e.preventDefault();

    addDoc(colref, {
        title: addBookForm.title.value,
        author: addBookForm.author.value,
        createdAt: serverTimestamp()
    })
    .then(() => {
        addBookForm.reset();
    })

});

// deleting documents
const deleteBookForm = document.querySelector(".delete");
deleteBookForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const docRef = doc(db, "books", deleteBookForm.id.value);

    deleteDoc(docRef)
    .then(() => {
        deleteBookForm.reset();
    })

});

// signing users up
const signupForm = document.querySelector(".signup");
signupForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = signupForm.email.value;
    const password = signupForm.password.value;

    createUserWithEmailAndPassword(auth, email, password)
    .then((cred) => {
        console.log("user created:", cred.user);
        signupForm.reset();
    })
    .catch((err) => {
        console.log(err.message);
    })
});

// logging in and out
const logoutButton = document.querySelector(".logout");
logoutButton.addEventListener("click", () => {
    signOut(auth)
        .then(() => {
            console.log("the user signed out");
        })
        .catch((err) => {
            console.log(err.message);
        })
});

const loginForm = document.querySelector(".login");
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = loginForm.email.value;
    const password = loginForm.password.value;

    signInWithEmailAndPassword(auth, email, password)
        .then((cred) => {
            console.log("user logged in: ", cred.user);
        })
        .catch((err) => {
            console.log(err.message);
        })
})

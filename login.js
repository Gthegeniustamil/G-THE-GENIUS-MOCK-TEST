// ======================================================
// G THE GENIUS
// LOGIN SYSTEM
// Firebase Authentication + Firestore
// ======================================================

import {
    auth,
    db
} from "./firebase-config.js";

import {
    signInWithEmailAndPassword,
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ======================================================
// ELEMENTS
// ======================================================

const loginForm =
    document.getElementById("loginForm");

const emailInput =
    document.getElementById("email");

const passwordInput =
    document.getElementById("password");

const loginBtn =
    document.getElementById("loginBtn");

const message =
    document.getElementById("loginMessage");

const forgotPassword =
    document.getElementById("forgotPassword");


// ======================================================
// MESSAGE FUNCTION
// ======================================================

function showMessage(text, type = "normal") {

    if (!message) return;

    message.textContent = text;

    if (type === "success") {

        message.style.color = "#00ff99";

    }

    else if (type === "error") {

        message.style.color = "#ff7777";

    }

    else {

        message.style.color = "#ffd700";

    }

}


// ======================================================
// LOGIN BUTTON LOADING
// ======================================================

function setLoading(loading) {

    if (!loginBtn) return;

    if (loading) {

        loginBtn.disabled = true;

        loginBtn.classList.add("loading");

        loginBtn.textContent =
            "Checking Login... ⏳";

    }

    else {

        loginBtn.disabled = false;

        loginBtn.classList.remove("loading");

        loginBtn.textContent =
            "Login 🚀";

    }

}


// ======================================================
// LOGIN
// ======================================================

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const email =
                emailInput.value.trim();

            const password =
                passwordInput.value;


            // ------------------------------------------
            // VALIDATION
            // ------------------------------------------

            if (!email) {

                showMessage(
                    "Please enter your email.",
                    "error"
                );

                emailInput.focus();

                return;

            }


            if (!password) {

                showMessage(
                    "Please enter your password.",
                    "error"
                );

                passwordInput.focus();

                return;

            }


            setLoading(true);

            showMessage(
                "Checking Login... ⏳"
            );


            try {

                // --------------------------------------
                // FIREBASE LOGIN
                // --------------------------------------

                const userCredential =
                    await signInWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );


                const user =
                    userCredential.user;


                console.log(
                    "Firebase Login Success:",
                    user.uid
                );


                // --------------------------------------
                // GET STUDENT PROFILE
                // --------------------------------------

                const studentRef =
                    doc(
                        db,
                        "students",
                        user.uid
                    );


                const studentSnap =
                    await getDoc(studentRef);


                if (!studentSnap.exists()) {

                    showMessage(
                        "Student profile not found. Please contact admin.",
                        "error"
                    );

                    setLoading(false);

                    return;

                }


                const studentData =
                    studentSnap.data();


                // --------------------------------------
                // STUDENT DATA
                // --------------------------------------

                const student = {

                    uid: user.uid,

                    name:
                        studentData.name ||
                        "Student",

                    district:
                        studentData.district ||
                        "-",

                    email:
                        studentData.email ||
                        user.email ||
                        "",

                    role:
                        studentData.role ||
                        "student"

                };


                // --------------------------------------
                // SAVE LOGIN DATA
                // --------------------------------------

                localStorage.setItem(
                    "student",
                    JSON.stringify(student)
                );


                // Compatibility with
                // Mock Test / Dashboard
                localStorage.setItem(
                    "studentName",
                    student.name
                );


                localStorage.setItem(
                    "district",
                    student.district
                );


                localStorage.setItem(
                    "email",
                    student.email
                );


                localStorage.setItem(
                    "uid",
                    student.uid
                );


                localStorage.setItem(
                    "role",
                    student.role
                );


                // --------------------------------------
                // SUCCESS
                // --------------------------------------

                showMessage(
                    "Login Successful 🎉",
                    "success"
                );


                // --------------------------------------
                // REDIRECT
                // --------------------------------------

                setTimeout(() => {

                    window.location.href =
                        "dashboard.html";

                }, 700);


            }

            catch (error) {

                console.error(
                    "Login Error:",
                    error
                );


                setLoading(false);


                // --------------------------------------
                // FIREBASE ERROR HANDLING
                // --------------------------------------

                switch (error.code) {


                    case "auth/invalid-credential":

                        showMessage(
                            "Invalid email or password.",
                            "error"
                        );

                        break;


                    case "auth/invalid-email":

                        showMessage(
                            "Please enter a valid email.",
                            "error"
                        );

                        break;


                    case "auth/user-not-found":

                        showMessage(
                            "Account not found.",
                            "error"
                        );

                        break;


                    case "auth/wrong-password":

                        showMessage(
                            "Incorrect password.",
                            "error"
                        );

                        break;


                    case "auth/too-many-requests":

                        showMessage(
                            "Too many attempts. Try again later.",
                            "error"
                        );

                        break;


                    case "auth/network-request-failed":

                        showMessage(
                            "Network error. Check your internet connection.",
                            "error"
                        );

                        break;


                    default:

                        showMessage(
                            "Login failed. Please try again.",
                            "error"
                        );

                }

            }

        }
    );

}


// ======================================================
// FORGOT PASSWORD
// ======================================================

if (forgotPassword) {

    forgotPassword.addEventListener(
        "click",
        async (event) => {

            event.preventDefault();


            const email =
                emailInput.value.trim();


            // ------------------------------------------
            // EMAIL REQUIRED
            // ------------------------------------------

            if (!email) {

                showMessage(
                    "Enter your email first.",
                    "error"
                );

                emailInput.focus();

                return;

            }


            try {

                showMessage(
                    "Sending reset email... 📩"
                );


                await sendPasswordResetEmail(
                    auth,
                    email
                );


                showMessage(
                    "Password reset email sent 📩",
                    "success"
                );


            }

            catch (error) {

                console.error(
                    "Password Reset Error:",
                    error
                );


                if (
                    error.code ===
                    "auth/user-not-found"
                ) {

                    showMessage(
                        "No account found with this email.",
                        "error"
                    );

                }

                else if (
                    error.code ===
                    "auth/invalid-email"
                ) {

                    showMessage(
                        "Please enter a valid email.",
                        "error"
                    );

                }

                else {

                    showMessage(
                        "Reset failed. Please try again.",
                        "error"
                    );

                }

            }

        }
    );

}


// ======================================================
// AUTO REDIRECT IF ALREADY LOGGED IN
// ======================================================

auth.onAuthStateChanged(async (user) => {

    if (!user) return;


    // Don't redirect while user is
    // actively submitting the login form.

    if (
        document.activeElement === loginBtn
    ) {

        return;

    }


    const currentPage =
        window.location.pathname;


    if (
        currentPage.endsWith("login.html") &&
        localStorage.getItem("student")
    ) {

        console.log(
            "User already logged in."
        );

        // Uncomment if you want
        // automatic dashboard redirect.

        // window.location.href =
        //     "dashboard.html";

    }

});


// ======================================================
// END
// ======================================================

console.log(
    "G THE GENIUS Login System Ready 🚀"
);

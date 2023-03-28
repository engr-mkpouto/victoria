// function setFormMessage(formElement, type, message) {
//     const messageElement = formElement.querySelector(".form__message");

//     messageElement.textContent = message;
//     messageElement.classList.remove("form__message--success", "form__message--error");
//     messageElement.classList.add(`form__message--${type}`);
// }

// function setInputError(inputElement, message) {
//     inputElement.classList.add("form__input--error");
//     inputElement.parentElement.querySelector(".form__input-error-message").textContent = message;
// }

// function clearInputError(inputElement) {
//     inputElement.classList.remove("form__input--error");
//     inputElement.parentElement.querySelector(".form__input-error-message").textContent = "";
// }

// document.addEventListener("DOMContentLoaded", () => {
//     // const loginForm = document.querySelector("#login");
//     const AccountForm = document.querySelector("#createAccount");

//     // document.querySelector("#linkCreateAccount").addEventListener("click", e => {
//     //     e.preventDefault();
//     //     loginForm.classList.add("form--hidden");
//     //     createAccountForm.classList.remove("form--hidden");
//     // });

//     // document.querySelector("#linkLogin").addEventListener("click", e => {
//     //     e.preventDefault();
//     //     loginForm.classList.remove("form--hidden");
//     //     createAccountForm.classList.add("form--hidden");
//     // });
 
//     AccountForm.addEventListener("submit", e => {
//         // e.preventDefault();
//         if (e.target.id === "username" && e.target.value.length > 0 && e.target.value.length < 8) {
//             setInputError(inputElement, "Your username must be up to 8 digit");
//         };
//     });

//     document.querySelectorAll("#username").forEach(inputElement => {
//         inputElement.addEventListener("submit", e => {
//             if (e.target.id === "username" && e.target.value.length > 0 && e.target.value.length < 8) {
//                 setInputError(inputElement, "Your username must be up to 8 digit");
//             }
//         });

//         inputElement.addEventListener("input", e => {
//             clearInputError(inputElement);
//         });
//     });

//     document.querySelectorAll(".form__input").forEach(inputElement => {
//         inputElement.addEventListener("blur", e => {
//             if (e.target.id === "username" && e.target.value.length > 0 && e.target.value.length < 8) {
//                 setInputError(inputElement, "Your username must be up to 8 digit");
//             }
//         });

//         inputElement.addEventListener("input", e => {
//             clearInputError(inputElement);
//         });
//     });

//     document.querySelectorAll("#password").forEach(inputElement => {
//         inputElement.addEventListener("blur", e => {
//             if (e.target.id === "password" && e.target.value.length > 0 && e.target.value.length < 6) {
//                 setInputError(inputElement, "Your password must be up to 6 characters");
//             }
//         });

//         inputElement.addEventListener("input", e => {
//             clearInputError(inputElement);
//         });
//     });

//     document.querySelectorAll("#passwordRe-enter").forEach(inputElement => {
//         inputElement.addEventListener("blur", e => {
//             let password = document.querySelector("#password").value
//             let passwordEnter = document.querySelector("#passwordRe-enter").value
//             if (passwordEnter === password ) {
//                 setInputSuccess(inputElement, " It's the same");
//             }else{
//                 setInputError(inputElement, "it must be the same with your password");
//             }
//         });

//         inputElement.addEventListener("input", e => {
//             clearInputError(inputElement);
//         });
//     });
// });
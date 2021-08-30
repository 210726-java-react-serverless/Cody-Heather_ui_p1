import { ViewComponent } from '../view.component.js';
import env from '../../util/env.js';
import state from '../../util/state.js';
import router from '../../app.js';

RegisterComponent.prototype = new ViewComponent('register');
function RegisterComponent() {

    let firstnameFieldElement;
    let lastnameFieldElement;
    let emailFieldElement;
    let usernameFieldElement;
    let passwordFieldElement;
    let verifypasswordFieldElement;

    let registerButtonElement;
    let errorMessageElement;

    let firstname = '';
    let lastname = '';
    let email = '';
    let username = '';
    let password = '';
    let vpassword ='';

    function updateFirstname(e) {
        firstname = e.target.value;
        console.log(firstname);
    }

    function updateLastname(e) {
        lastname = e.target.value;
        console.log(lastname);
    }

    function updateEmail(e) {
        email = e.target.value;
        console.log(email);
    }

    function updateUsername(e) {
        username = e.target.value;
        console.log(username);
    }

    function updatePassword(e) {
        password = e.target.value;
        console.log(password);
    }

    function verifypassword(e) {
        vpassword = e.target.value;
        console.log(vpassword);
    }

    function updateErrorMessage(errorMessage) {
        if (errorMessage) {
            errorMessageElement.removeAttribute('hidden');
            errorMessageElement.innerText = errorMessage;
        } else {
            errorMessageElement.setAttribute('hidden', 'true');
            errorMessageElement.innerText = '';
        }
    }


    function register() {

        if (!firstname || !lastname|| !email|| !username|| !password) {
            updateErrorMessage('Please fill out all fields');
            return;
        } else {
            updateErrorMessage('');
        }
        if(vpassword != password){
            updateErrorMessage (`Passwords do not match!`);
            return;
        } else {
            updateErrorMessage('');
        }


        let userInfo = {
            firstName: firstname,
            lastName: lastname,
            email: email,
            username: username,
            password: password,
            faculty: false          //TODO: Specify this in the API for better security
        };

        let status = 0;

        fetch(`${env.apiUrl}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userInfo)
        })
            .then(resp => {
                status = resp.status;
                let token = resp.headers.get('Authorization');
                state.token = token;
                return resp.json();
            })
            .then(payload => {
                if (status >= 400 && status < 500) {
                    updateErrorMessage(payload.message);
                }else if (status >= 500) {
                    updateErrorMessage('The server encountered an error, please try again later.');
                }
                 else {
                    state.authUser = payload;
                    router.navigate('/student-dashboard');
                }
            })
            .catch(err => console.error(err));

    }


    this.render = function() {
        RegisterComponent.prototype.injectTemplate(() => {
            
            firstnameFieldElement = document.getElementById('register-form-firstname');
            lastnameFieldElement = document.getElementById('register-form-lastname');;
            emailFieldElement = document.getElementById('register-form-email');
            usernameFieldElement = document.getElementById('register-form-username');
            passwordFieldElement = document.getElementById('register-form-password');;
            verifypasswordFieldElement = document.getElementById('register-form-verifypassword');
            registerButtonElement = document.getElementById('register-form-button');;
            errorMessageElement = document.getElementById('error-msg');

            firstnameFieldElement.addEventListener('keyup', updateFirstname);
            lastnameFieldElement.addEventListener('keyup', updateLastname);
            emailFieldElement.addEventListener('keyup', updateEmail);
            usernameFieldElement.addEventListener('keyup', updateUsername);
            passwordFieldElement.addEventListener('keyup', updatePassword);
            verifypasswordFieldElement.addEventListener('keyup', verifypassword);
            registerButtonElement.addEventListener('click', register);

            window.history.pushState('register', 'Register', '/register');

        });
        RegisterComponent.prototype.injectStylesheet();
    }

}

export default new RegisterComponent();
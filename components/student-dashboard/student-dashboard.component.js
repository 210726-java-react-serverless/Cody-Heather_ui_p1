import { ViewComponent } from '../view.component.js';
import env from '../../util/env.js';
import state from '../../util/state.js';
import router from '../../app.js';


StudentDashboardComponent.prototype = new ViewComponent('student-dashboard');
function StudentDashboardComponent() {

    let welcomeUserElement;

    //input fields
    let enrollAbvFieldElement;
    let withdrawAbvFieldElement;

    //Messages
    let enrollErrorMessageElement;
    let withdrawErrorMessageElement;
    let enrollSuccessMessageElement;
    let withdrawSuccessMessageElement;

    //tables
    let openCourseTableBody;
    let scheduleTableBody;

    //buttons
    let enrollButtonElement;
    let withdrawButtonElement;
    let viewButtonElement;
    let scheduleButtonElement;

    let abv = '';

    function updateAbv(e) {
        abv = e.target.value;
        console.log(abv);
    }

    function updateEnrollErrorMessage(errorMessage) {
        if (errorMessage) {
            enrollErrorMessageElement.removeAttribute('hidden');
            enrollErrorMessageElement.innerText = errorMessage;
        } else {
            enrollErrorMessageElement.setAttribute('hidden', 'true');
            enrollErrorMessageElement.innerText = '';
        }
    }

    function enrollSuccessMessage(successMessage){
        if(successMessage) {
            enrollSuccessMessageElement.removeAttribute('hidden');
            enrollSuccessMessageElement.innerText = successMessage;
        }else{
            enrollSuccessMessageElement.setAttribute('hidden', 'true');
            enrollSuccessMessageElement.innerText = '';
        }
    }


    function updateWithdrawErrorMessage(errorMessage) {
        if (errorMessage) {
            withdrawErrorMessageElement.removeAttribute('hidden');
            withdrawErrorMessageElement.innerText = errorMessage;
        } else {
            withdrawErrorMessageElement.setAttribute('hidden', 'true');
            withdrawErrorMessageElement.innerText = '';
        }
    }

    function withdrawSuccessMessage(successMessage){
        if(successMessage) {
            withdrawSuccessMessageElement.removeAttribute('hidden');
            withdrawSuccessMessageElement.innerText = successMessage;
        }else{
            withdrawSuccessMessageElement.setAttribute('hidden', 'true');
            withdrawSuccessMessageElement.innerText = '';
        }
    }

    function enroll() {

        if (!abv) {
            updateEnrollErrorMessage('Please fill out all fields');
            enrollSuccessMessage('');
            return;
        } else {
            updateEnrollErrorMessage('');
        }

        let enrollInfo = {
            courseAbbreviation: abv
        };

        let status = 0;

        fetch(`${env.apiUrl}/student/courses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': state.token
            },
            body: JSON.stringify(enrollInfo)
        })
            .then(resp => {
                status = resp.status;
                console.log(status);
                console.log(resp);
                return resp.json();
            })
            .then(payload => {
                if (status >= 400 && status < 500) {
                    console.log('Anybody home?');
                    updateEnrollErrorMessage(payload.message);
                    enrollSuccessMessage('');
                    //console.log(payload.message);
                }else if (status >= 500) {
                    updateEnrollErrorMessage('The server encountered an error, please try again later.');
                    enrollSuccessMessage('');
                }else{
                    enrollSuccessMessage(payload.message);
                    updateEnrollErrorMessage('');
                }
            })
            .catch(err => console.error(err));

    }

    function withdraw() {

        if (!abv) {
            updateWithdrawErrorMessage('Please fill out all fields');
            withdrawSuccessMessage('');
            return;
        } else {
            updateWithdrawErrorMessage('');
        }

        let withdrawInfo = {
            courseAbbreviation: abv
        };

        let status = 0;

        fetch(`${env.apiUrl}/student/courses`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': state.token
            },
            body: JSON.stringify(withdrawInfo)
        })
            .then(resp => {
                console.log(resp.message);
                status = resp.status;
                return resp.json();
            })
            .then(payload => {
                if (status >= 400 && status < 500) {
                    updateWithdrawErrorMessage(payload.message);
                    withdrawSuccessMessage('');
                }else if (status >= 500) {
                    updateWithdrawErrorMessage('The server encountered an error, please try again later.');
                    withdrawSuccessMessage('');
                }else{
                    withdrawSuccessMessage(payload.message);
                    updateWithdrawErrorMessage('');
                }
            })
            .catch(err => console.error(err));

    }

    //view schedule
    function getSchedule(){

        fetch(`${env.apiUrl}/student/courses?action=schedule`, {
            method: 'GET',
            headers: {
                'Authorization': state.token,     
            }
        })
            .then(resp => {
                status = resp.status;
                return resp.json();
            })
            .then(payload => {
                console.log(payload);
                populateScheduleTable(payload);
                if (status >= 400 && status < 500) {
                    // updateErrorMessage(payload.message);
                }else if (status >= 500) {
                    // updateErrorMessage('The server encountered an error when retrieving the courses.');
                }
            })
            .catch(err => console.error(err));

    }

    function populateScheduleTable(ScheduleArray){

        if(ScheduleArray.length > 0){
            let allRows = ``;

            for(let course of ScheduleArray) {

                let rowTemplate =`
            <tr>
                <td>${course.courseAbbreviation}</td>
                <td>${course.courseName}</td>
                <td>${course.professorName}</td>
            </tr>
            `;
                allRows += rowTemplate;
            }

            scheduleTableBody.innerHTML = allRows;
 
        }else{
            scheduleTableBody.innerHTML = ``;
        }

    }
        

//View open courses
        function getOpenCourses(){

            fetch(`${env.apiUrl}/student/courses?action=view`, {
                method: 'GET',
                headers: {
                    'Authorization': state.token,     
                }
            })
                .then(resp => {
                    status = resp.status;
                    return resp.json();
                })
                .then(payload => {
                    populateOpenCourseTable(payload);
                    if (status >= 400 && status < 500) {
                        updateErrorMessage(payload.message);
                    }else if (status >= 500) {
                        updateErrorMessage('The server encountered an error when retrieving the courses.');
                    }
                })
                .catch(err => console.error(err));
    
        }
    
        function populateOpenCourseTable(openCourseArray){
            
            let allRows = ``;
    
            for(let course of openCourseArray) {
    
                let rowTemplate =`
            <tr>
                <td>${course.courseAbbreviation}</td>
                <td>${course.courseName}</td>
                <td>${course.professorName}</td>
                <td>${course.courseDetail}</td>
                <td>${course.slotsTaken}/${course.courseCapacity}</td>
            </tr>
            `;
                allRows += rowTemplate;
            }
    
            openCourseTableBody.innerHTML = allRows;
    
        }

    this.render = function() {

        console.log(state);

        if (!state.authUser) {
            router.navigate('/login');
            return;
        }else if(state.authUser.faculty === true) {
            router.navigate('/faculty-dashboard');
        }

        let currentUsername = state.authUser.username;

        StudentDashboardComponent.prototype.injectStylesheet();
        StudentDashboardComponent.prototype.injectTemplate(() => {

            welcomeUserElement = document.getElementById('welcome-user');
            welcomeUserElement.innerText = currentUsername;

            enrollAbvFieldElement = document.getElementById('enroll-form-abv');
            withdrawAbvFieldElement = document.getElementById('withdraw-form-abv');

            enrollErrorMessageElement = document.getElementById('enroll-error-msg');
            enrollSuccessMessageElement = document.getElementById('enroll-success-msg');
            withdrawErrorMessageElement = document.getElementById('withdraw-error-msg');
            withdrawSuccessMessageElement = document.getElementById('withdraw-success-msg');

            enrollButtonElement = document.getElementById('enroll-course-form-button');
            withdrawButtonElement = document.getElementById('withdraw-course-form-button');

            enrollAbvFieldElement.addEventListener('keyup', updateAbv);
            withdrawAbvFieldElement.addEventListener('keyup', updateAbv);

            enrollButtonElement.addEventListener('click', enroll);
            withdrawButtonElement.addEventListener('click', withdraw);

            // View open courses elements
            openCourseTableBody = document.getElementById('courseopen-table-body');
            viewButtonElement = document.getElementById('v-pills-viewo-tab');
            viewButtonElement.addEventListener('click', getOpenCourses);
            
            // View schedule elements
            scheduleTableBody = document.getElementById('schedule-table-body');
            scheduleButtonElement = document.getElementById('v-pills-home-tab');
            scheduleButtonElement.addEventListener('click', getSchedule);
            
            getSchedule();
            


            window.history.pushState('student-dashboard', 'Student Dashboard', '/student-dashboard');

        });

    }

}

export default new StudentDashboardComponent();

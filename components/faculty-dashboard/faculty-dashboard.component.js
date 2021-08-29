import { ViewComponent } from '../view.component.js';
import state from '../../util/state.js';
import router from '../../app.js';
import env from '../../util/env.js';

FacultyDashboardComponent.prototype = new ViewComponent('faculty-dashboard');
function FacultyDashboardComponent() {

    let welcomeUserElement;

    // Elements for course addition
    let abvFieldElement;
    let courseNameFieldElement;
    let courseDetailsFieldElement;
    let courseOpenDateFieldElement;
    let courseCloseDateFieldElement;
    let courseCapacityFieldElement;

    let addButtonElement;
    let addErrorMessageElement;
    let addSuccessMessageElement;

    let abv = '';
    let courseName = '';
    let courseDetails = '';
    let courseOpen = '';
    let courseClose = '';
    let courseCap = '';

    function updateAbv(e) {
        abv = e.target.value;
        console.log(abv);
    }

    function updateCourseName(e) {
        courseName = e.target.value;
        console.log(courseName);
    }

    function updateCourseDetails(e) {
        courseDetails = e.target.value;
        console.log(courseDetails);
    }

    function updateCourseOpen(e) {
        courseOpen = e.target.value;
        console.log(courseOpen);
    }

    function updateCourseClose(e) {
        courseClose = e.target.value;
        console.log(courseClose);
    }

    function updateCourseCap(e) {
        courseCap = e.target.value;
        console.log(courseCap);
    }

    function updateErrorMessage(errorMessage) {
        if (errorMessage) {
            addErrorMessageElement.removeAttribute('hidden');
            addErrorMessageElement.innerText = errorMessage;
        } else {
            addErrorMessageElement.setAttribute('hidden', 'true');
            addErrorMessageElement.innerText = '';
        }
    }

    function updateSuccessMessage(successMessage){
        if(successMessage) {
            addSuccessMessageElement.removeAttribute('hidden');
            addSuccessMessageElement.innerText = successMessage;
        }else{
            addSuccessMessageElement.setAttribute('hidden', 'true');
            addSuccessMessageElement.innerText = '';
        }
    }


    function addCourse() {

        if (!abv || !courseName|| !courseDetails|| !courseOpen || !courseClose || !courseCap) {
            updateErrorMessage('Please fill out all fields');
            updateSuccessMessage('');
            return;
        } else {
            updateErrorMessage('');
        }

        let addCourseInfo = {
            courseName: courseName,
            courseAbbreviation: abv,
            courseDetail: courseDetails,
            courseOpenDate: courseOpen,
            courseCloseDate: courseClose,
            courseCapacity: courseCap          
        };

        let status = 0;

        fetch(`${env.apiUrl}/faculty/courses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': state.token
            },
            body: JSON.stringify(addCourseInfo) 
        })
            .then(resp => {
                status = resp.status;
                return resp.json();
            })
            .then(payload => {
                if (status >= 400 && status < 500) {
                    updateErrorMessage(payload.message);
                    updateSuccessMessage('');
                }else if (status >= 500) {
                    updateErrorMessage('The server encountered an error, please try again later.');
                    updateSuccessMessage('');
                }else{
                    updateSuccessMessage('Course added!');
                    updateErrorMessage('');
                }
            })
            .catch(err => console.error(err));

    }



    // Elements for fetching courses

    let courseTableBody;
    let viewButtonElement;

    function getCourses(){

        fetch(`${env.apiUrl}/faculty/courses`, {
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
                populateCourseTable(payload);
                if (status >= 400 && status < 500) {
                    updateErrorMessage(payload.message);
                }else if (status >= 500) {
                    updateErrorMessage('The server encountered an error when retrieving the courses.');
                }
            })
            .catch(err => console.error(err));

    }

    // Populating the course table
    function populateCourseTable(courseArray){

        let allRows = ``;

        for(let course of courseArray)
        {
            let open = formatDate(course.courseOpenDate);
            let close = formatDate(course.courseCloseDate);

            let rowTemplate =`
        <tr>
            <td>${course.courseAbbreviation}</td>
            <td>${course.courseName}</td>
            <td>${course.professorName}</td>
            <td>${course.courseDetail}</td>
            <td>${open}</td>
            <td>${close}</td>
            <td>${course.slotsTaken}/${course.courseCapacity}</td>
        </tr>
        `;
            allRows += rowTemplate;
        }

        courseTableBody.innerHTML = allRows;

    }

    function formatDate(date){

        return date.toString().replace(/,/g, '/');

    }


    // Elements for Editing a course
    let originalAbvFieldElement;
    let editAbvFieldElement;
    let editCourseNameFieldElement;
    let editCourseDetailsFieldElement;
    let editCourseOpenDateFieldElement;
    let editCourseCloseDateFieldElement;
    let editCourseCapacityFieldElement;

    let editButtonElement;
    let editErrorMessageElement;
    let editSuccessMessageElement;

    let orignalAbv = '';
    let editAbv = '';
    let editCourseName = '';
    let editCourseDetails = '';
    let editCourseOpen = '';
    let editCourseClose = '';
    let editCourseCap = '';

    function updateOriginalAbv(e) {
        orignalAbv = e.target.value;
        console.log(orignalAbv);
    }

    function updateEditAbv(e) {
        editAbv = e.target.value;
        console.log(editAbv);
    }

    function updateEditCourseName(e) {
        editCourseName = e.target.value;
        console.log(editCourseName);
    }

    function updateEditCourseDetails(e) {
        editCourseDetails = e.target.value;
        console.log(editCourseDetails);
    }

    function updateEditCourseOpen(e) {
        editCourseOpen = e.target.value;
        console.log(editCourseOpen);
    }

    function updateEditCourseClose(e) {
        editCourseClose = e.target.value;
        console.log(editCourseClose);
    }

    function updateEditCourseCap(e) {
        editCourseCap = e.target.value;
        console.log(editCourseCap);
    }

    function updateEditErrorMessage(errorMessage) {
        if (errorMessage) {
            editErrorMessageElement.removeAttribute('hidden');
            editErrorMessageElement.innerText = errorMessage;
        } else {
            editErrorMessageElement.setAttribute('hidden', 'true');
            editErrorMessageElement.innerText = '';
        }
    }

    function updateEditSuccessMessage(successMessage){
        if(successMessage) {
            editSuccessMessageElement.removeAttribute('hidden');
            editSuccessMessageElement.innerText = successMessage;
        }else{
            editSuccessMessageElement.setAttribute('hidden', 'true');
            editSuccessMessageElement.innerText = '';
        }
    }


    function editCourse() {

        if (!orignalAbv || !editAbv || !editCourseName|| !editCourseDetails|| !editCourseOpen || !editCourseClose || !editCourseCap) {
            updateEditErrorMessage('Please fill out all fields');
            updateEditSuccessMessage('');
            return;
        } 

        let editCourseInfo = {
            courseName: editCourseName,
            courseAbbreviation: editAbv,
            courseDetail: editCourseDetails,
            courseOpenDate: editCourseOpen,
            courseCloseDate: editCourseClose,
            courseCapacity: editCourseCap          
        };

        let status = 0;

        fetch(`${env.apiUrl}/faculty/courses?edit=${orignalAbv}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': state.token
            },
            body: JSON.stringify(editCourseInfo) 
        })
            .then(resp => {
                status = resp.status;
                return resp.json();
            })
            .then(payload => {
                if (status >= 400 && status < 500) {
                    updateEditErrorMessage(payload.message);
                    updateEditSuccessMessage('');
                }else if (status >= 500) {
                    updateEditErrorMessage('The server encountered an error, please try again later.');
                    updateEditSuccessMessage('');
                }else{
                    updateEditSuccessMessage('Course edited!');
                    updateEditErrorMessage('');
                }
            })
            .catch(err => console.error(err));

    }

    // Elements for Removing a course
    let removeAbvFieldElement;

    let removeButtonElement;
    let removeErrorMessageElement;
    let removeSuccessMessageElement;

    let removeAbv = '';

    function updateRemoveAbv(e) {
        removeAbv = e.target.value;
        console.log(removeAbv);
    }

    function removeErrorMessage(errorMessage) {
        if (errorMessage) {
            removeErrorMessageElement.removeAttribute('hidden');
            removeErrorMessageElement.innerText = errorMessage;
        } else {
            removeErrorMessageElement.setAttribute('hidden', 'true');
            removeErrorMessageElement.innerText = '';
        }
    }

    function removeSuccessMessage(successMessage){
        if(successMessage) {
            removeSuccessMessageElement.removeAttribute('hidden');
            removeSuccessMessageElement.innerText = successMessage;
        }else{
            removeSuccessMessageElement.setAttribute('hidden', 'true');
            removeSuccessMessageElement.innerText = '';
        }
    }

    function removeCourse() {

        if (!removeAbv) {
            removeErrorMessage('Please fill out all fields');
            removeSuccessMessage('');
            return;
        }

        let removeCourseInfo = {
            courseAbbreviation: removeAbv   
        };

        let status = 0;

        fetch(`${env.apiUrl}/faculty/courses`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': state.token
            },
            body: JSON.stringify(removeCourseInfo) 
        })
            .then(resp => {
                status = resp.status;
                return resp.json();
            })
            .then(payload => {
                if (status >= 400 && status < 500) {
                    removeErrorMessage(payload.message);
                    removeSuccessMessage('');
                }else if (status >= 500) {
                    removeErrorMessage('The server encountered an error, please try again later.');
                    removeSuccessMessage('');
                }else{
                    removeSuccessMessage('Course removed!');
                    removeErrorMessage('');
                }
            })
            .catch(err => console.error(err));

    }


    this.render = function() {

        if (!state.authUser) {
            router.navigate('/login');
            return;
        }

        let currentUsername = state.authUser.username;

        FacultyDashboardComponent.prototype.injectStylesheet();
        FacultyDashboardComponent.prototype.injectTemplate(() => {

            welcomeUserElement = document.getElementById('welcome-user');
            welcomeUserElement.innerText = currentUsername;

            //Add course elements
            abvFieldElement = document.getElementById('add-form-abv');
            courseNameFieldElement = document.getElementById('add-form-course-name');
            courseDetailsFieldElement = document.getElementById('add-form-details');
            courseOpenDateFieldElement = document.getElementById('add-form-open-date');
            courseCloseDateFieldElement = document.getElementById('add-form-close-date');
            courseCapacityFieldElement = document.getElementById('add-form-capacity');

            addButtonElement = document.getElementById('add-course-form-button');
            addErrorMessageElement = document.getElementById('add-error-msg');
            addSuccessMessageElement = document.getElementById('add-success-msg');

            abvFieldElement.addEventListener('keyup', updateAbv);
            courseNameFieldElement.addEventListener('keyup', updateCourseName);
            courseDetailsFieldElement.addEventListener('keyup', updateCourseDetails);
            courseOpenDateFieldElement.addEventListener('blur', updateCourseOpen);
            courseCloseDateFieldElement.addEventListener('blur', updateCourseClose);
            courseCapacityFieldElement.addEventListener('keyup', updateCourseCap);

            addButtonElement.addEventListener('click', addCourse);


            // View courses elements
            courseTableBody = document.getElementById('course-table-body');
            viewButtonElement = document.getElementById('v-pills-view-tab');
            viewButtonElement.addEventListener('click', getCourses);

            // Edit course elements

            originalAbvFieldElement = document.getElementById('editing-course-form-abv');
            editAbvFieldElement = document.getElementById('edit-form-abv');
            editCourseNameFieldElement = document.getElementById('edit-form-course-name');
            editCourseDetailsFieldElement = document.getElementById('edit-form-details');
            editCourseOpenDateFieldElement = document.getElementById('edit-form-open-date');
            editCourseCloseDateFieldElement = document.getElementById('edit-form-close-date');
            editCourseCapacityFieldElement = document.getElementById('edit-form-capacity');

            editButtonElement = document.getElementById('edit-course-form-button');
            editErrorMessageElement = document.getElementById('edit-error-msg');
            editSuccessMessageElement = document.getElementById('edit-success-msg');

            originalAbvFieldElement.addEventListener('keyup', updateOriginalAbv);
            editAbvFieldElement.addEventListener('keyup', updateEditAbv);
            editCourseNameFieldElement.addEventListener('keyup', updateEditCourseName);
            editCourseDetailsFieldElement.addEventListener('keyup', updateEditCourseDetails);
            editCourseOpenDateFieldElement.addEventListener('blur', updateEditCourseOpen);
            editCourseCloseDateFieldElement.addEventListener('blur', updateEditCourseClose);
            editCourseCapacityFieldElement.addEventListener('keyup', updateEditCourseCap);

            editButtonElement.addEventListener('click', editCourse);

            // Remove course elements
            removeAbvFieldElement = document.getElementById('remove-form-abv');
            removeAbvFieldElement.addEventListener('keyup', updateRemoveAbv);

            removeButtonElement = document.getElementById('remove-course-form-button');
            removeButtonElement.addEventListener('click', removeCourse);

            removeErrorMessageElement = document.getElementById('remove-error-msg');
            removeSuccessMessageElement = document.getElementById('remove-success-msg');

            window.history.pushState('faculty-dashboard', 'Faculty Dashboard', '/faculty-dashboard');

        });

    }

}



export default new FacultyDashboardComponent();

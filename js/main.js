var students = document.getElementsByClassName('student-item'); 
var allStudentsArray = [];
var activeArray;
var paginationArray;
var firstArray;
var searchInput;
var searchButton;
var list;
var aTag;
var marginLeftset;


/* Here I've created an Object for each student so that all of their information can be stored and accessed via an array
   and basic dot notaion. This make it easier to access during the search function when looking through records as I don't
   have to write DOM traverseing code to pull and grab values.
*/

for(var i = 0; i < students.length; i++){
	var student = {
		'name' : students[i].querySelector('h3').innerHTML,
		'email' : students[i].querySelector('.email').innerHTML

	};

	allStudentsArray.push(student);
}


//This section runs on the initial page load

//Create and append the search bar
appendSearch();
createNoUsersMessage();

//Create the pagination section and append to the DOM
createPagSection();

//Run the first check to determine the list and pagination lenghts variable
var initialCheck = listLength(students.length);

//Hide all the elements from the page while applying the "invisible" class to each element in the first run
hideStudentVisibility();
hideAllStudents();

//Place all the student elements into the array builder	
placeIntoArray(initialCheck, students);

//Display all students
displayFirstPage();

//Create and append pagination links
createPagLinks(initialCheck);



/************************************** FUNCTIONS ****************************************
******************************************************************************************/

/* When called, this helps to determine the number of Pagination buttons that need to be added to the DOM. This is also used
   to determine the number of pagination Arrays should be created in a  */
function listLength(number){
	var listNumber = Math.floor((number / 10) + 1);
	return listNumber;

}

//Creates the no users found elements and store them onto the page in the header section
function createNoUsersMessage(){
	var nousers = document.createElement('div');
	var nousersbox = document.createElement('div');
	var nousersmessage = document.createElement('span');
	var pageheader = document.getElementsByClassName('page-header')[0];

	nousers.classList.add('no-users');
	nousersbox.classList.add('no-users-box');
	nousersmessage.classList.add('no-users-message');
	nousersmessage.innerHTML = "Sorry, no users found";

	nousers.appendChild(nousersbox);
	nousersbox.appendChild(nousersmessage);
	pageheader.appendChild(nousers);


}

//Creates the pagination section to hold the pagination links and appends it to the bottom of the page
function createPagSection(){
	var pag = document.createElement('div');
	var pagul = document.createElement('ul');
	var pages = document.getElementsByClassName('page')[0];

	pag.classList.add('pagination');
	pag.appendChild(pagul);
	pages.appendChild(pag);

}


//DYNAMICALLY CREATE THE PAGINATION LINKS
function createPagLinks(number){
	var pagination = document.getElementsByClassName('pagination')[0].querySelector('ul');

	//Grab the current number of pagination links that exist
	var pagLength = pagination.childElementCount;
	
	//Remove all the pagination links that currently exist so that we can start with a clean slate 
	if(pagination.firstElementChild){
		for(var i = 0; i < pagLength; i++){
			pagination.removeChild(pagination.firstElementChild);
		}
	}

	//If the number of pagination links to create is 1, end the function and don't display any at all
	if(number === 1){
		return false;
	}

	//For loop to build and append the required amount of pagination links
	for(var x = 0; x < number; x++){

		list = document.createElement('li');
		aTag = document.createElement('a');
		if(x === 0){
			aTag.classList.add('active');
		}
		aTag.innerHTML = x + 1;

		list.appendChild(aTag);
		pagination.appendChild(list);

	}

	//Quick fix to help center the pagination parent element when items are removed
	marginLeftset = number * -26.91;
	document.getElementsByClassName('pagination')[0].style.marginLeft = marginLeftset + "px";
	
	//Grab all of the pagination links after they've been created
	var paginationButton = pagination.querySelectorAll('a');

	//Loop through each pagination button and apply an Event Listener and conditions to add or remove the 'active' class
	for(var c = 0; c < paginationButton.length; c++){

		addEvents(paginationButton, c);
	
	}
}

//This adds the event listeners and actions to the pagination links
function addEvents(array, index){
	var pagination = document.getElementsByClassName('pagination')[0].querySelector('ul');
	array[index].addEventListener('click',function(e){
		var numberIndex = e.target.innerHTML - 1;
		var paginationli = pagination.children;

		for(var a = 0; a < paginationli.length; a++){
			paginationli[a].firstElementChild.classList.remove('active');

		}

		e.target.classList.add('active');

		changePagination(numberIndex);
	});
}


//Running this allows the user to jump to another set of elements within the current activeArray. 
function changePagination(number){
	hideStudentVisibility();
	hideAllStudents();
	var arrayIndex = activeArray[number];
	for(var i = 0; i < arrayIndex.length; i++){
		displayFirstPageBlock(arrayIndex,i);
		displayFirstPageVisible(arrayIndex,i);

	}
}

//Resets the student listing back to the original layout that is run on first load.
function resetSearch(){
	var length = listLength(students.length);

	placeIntoArray(length, students);
	displayFirstPage();
	createPagLinks(length);

}

//Display the first array within the activeArray index
function displayFirstPage(){
	firstArray = activeArray[0];
	var firstArrayLength = firstArray.length;
	for(var i = 0; i < firstArrayLength; i++){

		displayFirstPageBlock(firstArray,i);
		displayFirstPageVisible(firstArray,i);

	} 
}

//Utilizing timeouts to delay the removal of the invisible class which thus brings opacity back to 1 for the selected elements
function displayFirstPageVisible(arrayTarget, i){
	setTimeout(function(){
		arrayTarget[i].classList.remove('invisible');

	}, 200);

}

/*Utilizing timeouts to delay adding the elements back to "block". Having this timeout run first before the "invisible" class is removed
/ensures that the transition of opacity effect is applied and seen on the page*/
function displayFirstPageBlock(arrayTarget, i){
	setTimeout(function(){
		arrayTarget[i].style.display = "block";

	}, 60);

}

/*Set all the students to display "none". A timeout is applied so that change of opacity to 0 transitions and the effect is run*/
function hideAllStudents(){
	setTimeout(function(){

		for(var i = 0; i < students.length; i++){
		
			students[i].style.display = "none";

		}

	}, 50);
}

/*Add the "invisible" class which sets the opacity of set elements to 0*/
function hideStudentVisibility(){
	for(var i = 0; i < students.length; i++){

			if(!students[i].classList.contains('invisible')){
			students[i].classList.add('invisible');
		}
	}
}


/*This serves as the Array within Array builder and is crucial to placing elements appropriately within a pagination state.
Essentially, any array provided here along with number number for which it should be broken will build an array with a number of arrays within it
These arrays are indexed and are the building blocks of allowing pagination*/
function placeIntoArray(number, arrayList){
	activeArray = [];
	var index = 0;		
	
	for(var a = 0; a < number; a++){
		paginationArray = [];
		for(var b = 0; b < 10; b++){
			if(typeof arrayList[index] == "undefined"){
				break;
			} else {
				paginationArray.push(arrayList[index]);
				index++;
			}
		}

		activeArray.push(paginationArray);
	}
}


/*This simply appends the search bar and ads basic Event listers to the respective elements. While the "keyup" listener will
more of less take over the "click", I've included it for good measure if the user decides they want to click it anyways.*/
function appendSearch(){
	var pageHeader = document.getElementsByClassName('page-header')[0];
	var searchParent = document.createElement('div');
	searchInput = document.createElement('input');
	searchButton = document.createElement('button');

	searchParent.classList.add('student-search');
	searchInput.setAttribute('placeholder', "Search for Students...");
	searchButton.innerHTML = "Search";

	searchParent.appendChild(searchInput);
	searchParent.appendChild(searchButton);

	pageHeader.appendChild(searchParent);

	searchButton.addEventListener('click', function(){
		searchSubmit();

	});

	searchInput.addEventListener('keyup', function(e){
			searchSubmit();
	});
}


/*Here exists the search function which is applied when users keyup within the search input or hit the submit button.
 The function starts by cleaning out the activeArray of students as well as the pagination array so as to start with
 a clean slate. From there the function implements a regex Object utilizing a "^" symbol before the searched value so as to
 match the first value against the first name or emails of the users. Using indexOf or other regex values I found to
 be too loosely matched as it just looks for any common string within a string regardlesss of where it exists. Once
 matches are found, the elements of the students to show are pushed into a local "searchArray" which is then sent into
 other functions to help rebuild the "activeArray" and eventually pushed live to the DOM.
  */
function searchSubmit(){	
	var noresults = document.getElementsByClassName('no-users')[0];
	var searchArray = [];
	paginationArray = [];
	activeArray = [];
	var searchFieldInput = searchInput.value;
	var searchFieldLower = searchFieldInput.toLowerCase();
	
	//Regex Object that implements a more controlled search so that searches start with the first letter of the persons name or email address
	var re = new RegExp('^'+searchFieldLower, 'i');
	
	//Hide all students so as to reset the field on each individual submit
	hideStudentVisibility(); 
	hideAllStudents();

	//This is a used for is a user decides to delete all the way back to empty. If this occurs, the page resets to as it was on original pageload
	if(searchFieldLower === ""){
		resetSearch();
		if(noresults.classList.contains('active')){
			noresults.classList.remove('active');
		}
		return false;

	} else {

		//If there is a value in the search input, begin to loop through each Object in the "allStudentsArray"
		for(var i = 0; i < allStudentsArray.length; i++){
			//Utilize the .search method agains the Regex variable
			if(allStudentsArray[i].name.search(re) > -1 || allStudentsArray[i].email.search(re) > -1){
				
				//Search array is used as a temporary array to store the active elements to be eventually displayed	
				searchArray.push(students[i]);

			}
		}

		//Run "Listlength" to determine number of pagination links required as well as the number 
		var pagnumber = listLength(searchArray.length);

		//If nothing was pushed into the "searchArray", this means nothing was found thus add a class to element to increase its opacity to 1.
		if(searchArray.length === 0){

			noresults.classList.add('active');

		} else {

			noresults.classList.remove('active');

		}

		//Run the Array builder function based on the number Paginations required and elements that match the search
		placeIntoArray(pagnumber,searchArray);
		
		//Create the number of pagination links based on the identified number
		createPagLinks(pagnumber);
		
		//Display the elements that meeting the Regex criteria
		displayFirstPage();

	}
}

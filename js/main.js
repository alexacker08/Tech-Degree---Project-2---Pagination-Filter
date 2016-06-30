"use strict";
//Grabs all the student elements from the page
var students = document.getElementsByClassName('student-item'); 
//Array that will hold the Object of each student
var allStudentsArray = [];
//Holds the Pagination Arrays which breaks up the elements
var activeArray;
//An array that holds elements which will exist on one page. 
var paginationArray;
//The first array within the activeArray
var firstArray;
var searchInput;
var searchButton;
var list;
var aTag;

//Grab students names and emails and store them in their own Object. All the student objects are then stored in the "allStudentsArray"
for(var i = 0; i < students.length; i++){
	var student = {
		'name' : students[i].querySelector('h3').innerHTML,
		'email' : students[i].querySelector('.email').innerHTML
	};
	allStudentsArray.push(student);
}


//Create and append the search bar
appendSearch();

//Create and build in messaging if no users found
createNoUsersMessage();

//Create the pagination section and build out the number of links
var studentLength = listLength(students.length);
createPagSection(studentLength);

//Resets the search area to a beginning state where all the pagination links are displayed and no search has been committed
resetSearch();


/************************************** FUNCTIONS ****************************************
******************************************************************************************/

//Determines the number of Pagination links needed to build
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
function createPagSection(length){
	var pag = document.createElement('div');
	var pagul = document.createElement('ul');
	var pages = document.getElementsByClassName('page')[0];

	pag.classList.add('pagination');
	pag.appendChild(pagul);
	pages.appendChild(pag);

	for(var i = 0; i < length; i++){
		list = document.createElement('li');
		aTag = document.createElement('a');
		addEvents(aTag, pagul);
		if(i === 0){
			aTag.classList.add('active');
		}
		aTag.innerHTML = i + 1;
		list.appendChild(aTag);
		pagul.appendChild(list);

	}
}

//This adds the event listeners and actions to the pagination links
function addEvents(element, list){
	element.addEventListener('click',function(e){
		var numberIndex = e.target.innerHTML - 1;
		var paginationli = list.children;

		for(var a = 0; a < paginationli.length; a++){
			paginationli[a].firstElementChild.classList.remove('active');

		}

		e.target.classList.add('active');

		changePagination(numberIndex);
	});
}

//This adjusts the number of Pagination links that need to be present on the page based on the search results
function adjustPagLinks(number){
	var pagination = document.getElementsByClassName('pagination')[0].querySelectorAll('li');
	for(var x = 0; x < pagination.length; x++){
		pagination[x].classList.add('remove');
	}

	if(number <= 1){
		return false;
	} else {
		for(var i = 0; i < number; i++){
			pagination[i].classList.remove('remove');
		}
	}

	var marginLeftset = number * -26.91;
	document.getElementsByClassName('pagination')[0].style.marginLeft = marginLeftset + "px";

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
	hideStudentVisibility();
	hideAllStudents();
	pagArrayBuilder(studentLength, students);
	displayFirstPage();
	adjustPagLinks(studentLength);

}

//Display the first array of elements within the activeArray index
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

/*Set all the students to display "none". A timeout is applied so that change of opacity to 0 transitions and the effect is run first*/
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


/*This serves as the Array within Array builder and is crucial to placing the right elements appropriately within a pagination state.
Essentially, any array provided here along with a number will determine how many arrays should be built inside.
These arrays are indexed and are the building blocks of allowing pagination*/
function pagArrayBuilder(number, arrayList){
	//Clear out what is 
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


//Search function which fires on a the keyup listener. 
function searchSubmit(){	
	var noresults = document.getElementsByClassName('no-users')[0];
	var searchArray = [];
	paginationArray = [];
	activeArray = [];
	var searchFieldInput = searchInput.value;
	var searchFieldLower = searchFieldInput.toLowerCase();

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
			//Check to see if the string exists against the Names and Emails
			if(allStudentsArray[i].name.indexOf(searchFieldLower) > -1 || allStudentsArray[i].email.indexOf(searchFieldLower) > -1){
				
				//Search array is used as a temporary array to store the active elements to be eventually displayed	or stored in paginationli
				searchArray.push(students[i]);

			} 
		}

		//Run "Listlength" to determine number of pagination links required and arrays to be placed within the activeArray
		var pagnumber = listLength(searchArray.length);

		//If nothing was pushed into the "searchArray", this means nothing was found thus add a class to element to increase its opacity to 1.
		if(searchArray.length === 0){
			noresults.classList.add('active');
		} else {
			noresults.classList.remove('active');
		}

		//Run the Array builder function based on the number Paginations required and elements that match the search
		pagArrayBuilder(pagnumber,searchArray);
		
		//Create the number of pagination links based on the listLength function run earlier
		adjustPagLinks(pagnumber);
		
		//Display the elements that meeting the Regex criteria
		displayFirstPage();

	}
}

//OVERVIEW
/* Approaching this project, I felt that dynamically storing Arrays within Arrays was an appropriate setup given that it itself
   represents a similar version of pagination */ 

var students = document.getElementsByClassName('student-item'); 
var allStudentsArray = [];
var activeArray;
var activePaginationArray;
var paginationArray;
var firstArray;
var pagination = document.getElementsByClassName('pagination')[0].querySelector('ul');
var noresults = document.getElementsByClassName('no-users')[0];
var searchInput;
var searchButton;
var list;
var aTag;


/* Here I've created an Object for each student so that all of their information can be stored and accessed via an array
   and basic dot notaion. This make it easier to access during the search function when looking through records as I don't
   have to write DOM traverseing code to pull and grab values.

   */
(function(){

	for(var i = 0; i < students.length; i++){
		var student = {
			'name' : students[i].querySelector('h3').innerHTML,
			'email' : students[i].querySelector('.email').innerHTML

		}

		allStudentsArray.push(student);
	}
})();


/* When called, this helps to determine the number of Pagination buttons that need to be added to the DOM. This is also used
   to determine the number of pagination Arrays should be created in a  */
function listLength(number){
	var listNumber = Math.floor((number / 10) + 1);
	return listNumber;

}

//DYNAMICALLY CREATE THE PAGINATION LINKS
function createPagLinks(number){
	
	var pagLength = pagination.childElementCount;

	if(pagination.firstElementChild){
		for(var i = 0; i < pagLength; i++){
			pagination.removeChild(pagination.firstElementChild);
		}
	}

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

	//GRAB THE PAGINATION LINKS AFTER CREATED
	var paginationButton = pagination.querySelectorAll('a');

	//LOOP THROUGH EACH PAGINATION LINK AND ADD CLICK LISTENERS
	for(var c = 0; c < paginationButton.length; c++){
		paginationButton[c].addEventListener('click',function(e){
			var numberIndex = e.target.innerHTML - 1;
			
			var paginationli = pagination.children;

			//REMOVE ANY EXISTANCE OF THE ACTIVE CLASS ON THE THE LI ELEMENTS
			for(var a = 0; a < paginationli.length; a++){
				paginationli[a].firstElementChild.classList.remove('active');

			}

			//ADD THE ACTIVE CLASS ON THE CLICKED LIST ITEM
			e.target.classList.add('active');
			
			//CHANGE INDEX OF THE ACTIVE ARRAY FOR WHAT IS SHOWN
			changePagination(numberIndex);

		});
	}
}

function resetSearch(){
	var length = listLength(students.length);

	placeIntoArray(length, students);
	displayFirstPage();
	createPagLinks(length);

}

//DISPLAY FIRST PAGE ONLY
function displayFirstPage(){
	hideAllStudents();
	firstArray = activeArray[0];
	var firstArrayLength = firstArray.length;
	for(var i = 0; i < firstArrayLength; i++){
		firstArray[i].style.display = "block";


	} 


}

//GIVE ALL STUDENTS THE INLINE STYLING OF BLOCK SO THAT THIS CAN BE USED LATER ON AS A WORKING CONDITION
/*function allElementsBlock(){
	for(var i = 0; i < students.length; i++){
		students[i].style.display = "block";

	}

}*/

function hideAllStudents(){
	for(var i = 0; i < students.length; i++){
		
		students[i].style.display = "none";

	}

}

//DYNAMICALLY PLACE THE ELEMENTS INTO INDEXED ARRAYS

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

//DISPLAY THE ELEMENTS IN THE PARTICULAR INDEX OF THE ACTIVE ARRAY
function changePagination(number){
	hideAllStudents();
	var arrayIndex = activeArray[number];
	for(var i = 0; i < arrayIndex.length; i++){
		arrayIndex[i].style.display = "block" 
		arrayIndex[i].classList.add('activate');

	}
}

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

	})

	searchInput.addEventListener('keyup', function(){
		searchSubmit();

	})
}


//SEARCH FOR NAME AND EMAIL WITHIN A STUDENTS RECORD
function searchSubmit(){	
	var searchArray = [];
	paginationArray = [];
	activeArray = [];
	var searchFieldInput = searchInput.value;
	var searchFieldLower = searchFieldInput.toLowerCase();
	hideAllStudents();
	if(searchFieldLower === ""){
		resetSearch();
		return false;

	} else {

		for(var i = 0; i < allStudentsArray.length; i++){
			if(allStudentsArray[i].name.indexOf(searchFieldLower) > -1 || allStudentsArray[i].email.indexOf(searchFieldLower) > -1){

					
				noresults.classList.remove('active');


				searchArray.push(students[i]);

			} else {

				noresults.classList.add('active');

			}
		}



		var pagnumber = listLength(searchArray.length);

		if(searchArray.length === 0){
			noresults.classList.add('active');
		} else {
			noresults.classList.remove('active');
		}

		placeIntoArray(pagnumber,searchArray)

		createPagLinks(pagnumber);
		displayFirstPage();


	}
}

appendSearch();

var initialCheck = listLength(students.length);


placeIntoArray(initialCheck, students);
displayFirstPage();
createPagLinks(initialCheck);







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
var marginLeftset;

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
	marginLeftset = number * -26.91;

	//This goes through and removes every child element of the pagination UL. 
	if(pagination.firstElementChild){
		for(var i = 0; i < pagLength; i++){
			pagination.removeChild(pagination.firstElementChild);
		}
	}

	if(number === 1){
		return false;
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

	document.getElementsByClassName('pagination')[0].style.marginLeft = marginLeftset + "px";
	
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
	hideStudentVisibility();
	hideAllStudents();
	firstArray = activeArray[0];
	var firstArrayLength = firstArray.length;
	for(var i = 0; i < firstArrayLength; i++){
		//firstArray[i].style.display = "block";


		displayFirstPageBlock(firstArray,i);
		displayFirstPageVisible(firstArray,i);

	} 
}

function displayFirstPageVisible(arrayTarget, i){
	setTimeout(function(){
		arrayTarget[i].classList.add('visible');

	}, 200)

}

function displayFirstPageBlock(arrayTarget, i){
	setTimeout(function(){
		arrayTarget[i].style.display = "block";

	}, 60)

}

function hideAllStudents(){
	setTimeout(function(){

		for(var i = 0; i < students.length; i++){
		
			students[i].style.display = "none";

		}

	}, 50)
}

function hideStudentVisibility(){
	for(var i = 0; i < students.length; i++){

			if(students[i].classList.contains('visible')){
			students[i].classList.remove('visible');
		}
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
	hideStudentVisibility();
	hideAllStudents();
	var arrayIndex = activeArray[number];
	for(var i = 0; i < arrayIndex.length; i++){
		displayFirstPageBlock(arrayIndex,i);
		displayFirstPageVisible(arrayIndex,i);

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
	var re = new RegExp(searchFieldLower+'.+$', 'i');
	console.log(re);
	hideAllStudents();
	if(searchFieldLower === ""){
		resetSearch();
		if(noresults.classList.contains('active')){
			noresults.classList.remove('active');
		}
		return false;

	} else {

		for(var i = 0; i < allStudentsArray.length; i++){
			if(allStudentsArray[i].name.search(re) > -1 || allStudentsArray[i].email.search(re) > -1){
					
				searchArray.push(students[i]);

			}
		}

		var pagnumber = listLength(searchArray.length);
		console.log(pagnumber);

		if(searchArray.length === 0){
			noresults.classList.add('active');
			pagination.classList.add('remove');
		} else {
			noresults.classList.remove('active');
			pagination.classList.remove('remove');
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







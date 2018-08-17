let data,				// var for "server data stprong"
accountOpened,			// var for account dialog display status true/false
citiesOpened,			// var for cities dialog display status true/false
cities,					// var for user cities array 
filterCitySelect,		// var to store selected city, for filtering
filterActiveSelect,		// var to store selected activity, for filtering
nameFilterValue,		// var to store input name, for filtering
nameSortDirection,		// var to store name sorting direction
surnameSortDirection,	// var to store surname sorting direction
userData,				// var to store selected or edited user data
lastId;					// var to store last item id from server, is used when assigning id for new user

const regEx = /[^a-zA-Z\s]/g;

// Header
const userAccount = document.getElementById('userAccount');
const userAccountActions = document.getElementById('userAccountActions');
const headerTabs = document.getElementsByClassName('header-tab');

// User Data Box
const userAvatar = document.getElementById('userAvatar');
const userName = document.getElementById('userName');
const userSurname = document.getElementById('userSurname');
const userCity = document.getElementById('userCity');
const userEmail = document.getElementById('userEmail');
const userPhone = document.getElementById('userPhone');

// Data Filter
const nameFilter = document.getElementById('nameFilter');
const cityFilter = document.getElementById('cityFilter');
const citySelect = document.getElementById('citySelect');
const citySelectContainer = document.getElementById('citySelectContainer');
const cityFilterSelection = document.getElementById('cityFilterSelection');
const activeCheckboxContainer = document.getElementById('activeCheckboxContainer');
const activeCheckbox = document.getElementById('activeCheckbox');
const filterButton = document.getElementById('filterButton');
const resetFilterButton = document.getElementById('resetFilterButton');
const addNewContact = document.getElementById('addNewContact');

// Data table
const table = document.getElementById('dataTable');
const sortName = document.getElementById('sortName');
const sortSurname = document.getElementById('sortSurname');

// Footer
const syncButton = document.getElementById('syncButton');
const syncTimeContainer = document.getElementById('syncTimeContainer');
const syncIndicator = document.getElementById('syncIndicator');

// User form fields
const userDataDialog = document.getElementById('userDataDialog');
const userDataDialogClose = document.getElementById('userDataDialogClose');
const userDataDialogSubmit = document.getElementById('userDataDialogSubmit');
const userDataDialogName = document.getElementById('userDataDialogName');
const userDataDialogSurname = document.getElementById('userDataDialogSurname');
const userDataDialogAvatar = document.getElementById('userDataDialogAvatar');
const userDataDialogCity = document.getElementById('userDataDialogCity');
const userDataDialogEmail = document.getElementById('userDataDialogEmail');
const userDataDialogPhone = document.getElementById('userDataDialogPhone');

// HTML template'as lentelės įrašui
const Item = ({id, avatar, active, name, surname, city, email, phone, online}) => `
	<th class="data-item__name">
		<i class="${online}"></i>
		${name}
	</th>
	<th class="data-item__surname">${surname}</th>
	<th class="data-item__city">${city}</th>
	<th class="data-item__email">${email}</th>
	<th class="data-item__phone">${phone}</th>
	<th class="data-item__actions">
		<button class="edit-item"></button>
		<button class="delete-item"></button>
	</th>
`;


// Header
userAccount.addEventListener("click", toggleAccountActions);

for (tab of headerTabs) {
	tab.addEventListener("click", addSelectedStyle);
}


// Table Filter
nameFilter.addEventListener("input", setFilterName);
cityFilter.addEventListener("click", toggleCities);
activeCheckbox.addEventListener("change", setActiveFilter);
filterButton.addEventListener("click", filterTable);
resetFilterButton.addEventListener("click", resetFilter);
addNewContact.addEventListener("click", addNewUser);

// Table
sortName.addEventListener("click", sortItemsByName);
sortSurname.addEventListener("click", sortItemsBySurname);

// Footer
syncButton.addEventListener("click", updateTable);

// User data form events
userDataDialogClose.addEventListener("click", closeDialog);
userDataDialogSubmit.addEventListener("click", submitNewData);


// Header methods
function addSelectedStyle(event) {
	for (tab of headerTabs) {
		tab.classList.remove("selected-tab");
	}
	this.classList.add("selected-tab");
}

function toggleAccountActions(event) {
	if (accountOpened) {
		userAccountActions.style.visibility = "hidden";
		accountOpened = false;
	} else {
		userAccountActions.style.visibility = "visible";
		accountOpened = true;
	}
}

// Data Table Filter methods
function setFilterName(event) {
	nameFilterValue = nameFilter.value;
	nameFilterValue = nameFilterValue.replace(regEx, "");
	if (nameFilterValue.length == 0) {
		nameFilterValue = null;
		this.value = "";
	} else {
		this.value = nameFilterValue;
	}
}

function toggleCities(event) {
	if (cities != null && cities.length > 0) {
		if (citiesOpened) {
			citySelect.style.visibility = "hidden";
			citiesOpened = false;
		} else {
			citySelect.style.visibility = "visible";
			citiesOpened = true;
		}
	}
}

function setFilterCity(event) {
	filterCitySelect = this.innerText;
	if (filterCitySelect == "All") {
		cityFilterSelection.innerText = "City";
		filterCitySelect = null;
	} else {
		cityFilterSelection.innerText = filterCitySelect;
	}
}

function setActiveFilter(event) {
	if (this.checked) {
		filterActiveSelect = true;
		activeCheckboxContainer.classList.add("input-checked");
	} else {
		filterActiveSelect = false;
		activeCheckboxContainer.classList.remove("input-checked");
	}
}

function filterTable(event) {
	let itemsArr = table.childNodes;
	let idArr = [];

	for (item of data) {
		let filterIndicators = [];
		if (nameFilterValue != null) {
			let name = (item.name).toLowerCase();
			nameFilterValue = nameFilterValue.trim().toLowerCase();
			if (name.indexOf(nameFilterValue) != -1) {
				filterIndicators.push(true);
			} else {
				filterIndicators.push(false);
			}
		}
		if (filterCitySelect != null) {
			if (item.city == filterCitySelect) {
				filterIndicators.push(true);
			} else {
				filterIndicators.push(false);
			}
		}
		if (filterActiveSelect) {
			console.log("filter " + filterActiveSelect);
			console.log("item " + item.active);
			if (item.active == filterActiveSelect) {
				filterIndicators.push(true);
			} else {
				filterIndicators.push(false);
			}	
		}
		if (filterIndicators.indexOf(false) == -1) {
			idArr.push(item.id);	
		}
	}

	for (let i = 0; i < itemsArr.length; i++) {
		let elementId = parseInt(itemsArr[i].id);
		if (itemsArr[i]) {
			if (idArr.indexOf(elementId) == -1) {
				itemsArr[i].style.display = "none";
			} else {
				itemsArr[i].style.display = "flex";
			}
		}
	}
}

function resetFilter() {
	nameFilterValue = null;
	nameFilter.value = "";
	filterCitySelect = null;
	cityFilterSelection.innerText = "City";
	filterActiveSelect = null;
	activeCheckboxContainer.classList.remove("checkbox__input--checked");
	sortName.className = "sort-arrow-inactive";
	nameSortDirection = null;
	sortSurname.className = "sort-arrow-inactive";
	surnameSortDirection = null;
	filterTable();
}

function addNewUser(event) {
	showAddEditUserDialog(null);
}

function createCityDropdown() {
	removeEventsFromItems(citySelectContainer, "click", setFilterCity);
	citySelectContainer.innerHTML = null;
	cities = [];
	for (item of data) {
		if (cities.indexOf(item.city) == -1) {
			cities.push(item.city);
		}
	}
	
	let allCities = document.createElement('div');
	allCities.className = "cities-container__city";
	allCities.innerText = "All";
	allCities.addEventListener("click", setFilterCity);
	citySelectContainer.appendChild(allCities);
	for (city in cities) {
		let newCity = document.createElement('div');
		newCity.className = "cities-container__city";
		newCity.innerText = cities[city];
		newCity.addEventListener("click", setFilterCity);
		citySelectContainer.appendChild(newCity);
	}
}

// Data Table methods
function updateTable(event) {
	syncIndicator.classList.add("sync-animation");
	data = null;
	let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			data = JSON.parse(this.responseText);
			createItems(false);
			createCityDropdown();
			updateSyncTime();
			resetFilter();
		}
	};
	xhttp.open("GET", "contacts.json", true);
	xhttp.send();
}

function createItems(instant) {
	removeEventsFromItems(table, "click", itemSelection);
	table.innerHTML = null;
	let x = 1;
	if (instant) {
		x = 0;
	}
	
	for (item of data) {
		lastId = lastId > item.id ? lastId : item.id;
		if (item.active) {
			item.online = "fa fa-eye user-online-status";
		} else {
			item.online = "fa fa-eye-slash user-online-status";
		}
		let newItem = document.createElement('tr');
		newItem.className = "data-item";
		newItem.setAttribute("id", item.id);
		newItem.innerHTML = Item(item);
		newItem.addEventListener("click", itemSelection);
		setTimeout(function() {
			table.appendChild(newItem);
		}, 100 * x);
		if (!instant) {
			x++;
		}
	}
	setTimeout(function() {
		syncIndicator.classList.remove("sync-animation");
	}, data.length * 100);
}

function itemSelection(event) {
	let itemId = this.getAttribute("id");
	let selectedUser = data.find(obj => {
  		return obj.id == itemId;
	});

	if (event.target.className != "edit-item" && event.target.className != "delete-item") {
		userAvatar.style.backgroundImage = "url(" + selectedUser.avatar + ")";
		userName.innerHTML = selectedUser.name;
		userSurname.innerHTML = selectedUser.surname;
		userCity.innerHTML = selectedUser.city;
		userEmail.innerHTML = selectedUser.email;
		userEmail.setAttribute("href", selectedUser.email);
		userPhone.innerHTML = selectedUser.phone;
	} else if (event.target.className == "edit-item") {
		showAddEditUserDialog(selectedUser);
	} else if (event.target.className == "delete-item") {
		data.splice(data.indexOf(selectedUser), 1);
		createItems(true);
	}
}

function sortItemsByName() {
	if (data != null && data.length > 0) {
		sortSurname.className = "sort-arrow-inactive";
		surnameSortDirection = null;
		switch(nameSortDirection) {
			case "asc":
				nameSortDirection = "desc";
				data.sort(function(a, b) {
					return a.name < b.name;
				});
				sortName.className = "sort-arrow-asc";
				break;
			case "desc":
				nameSortDirection = "asc";
				data.sort(function(a, b) {
					return a.name > b.name;
				});
				sortName.className = "sort-arrow-desc";
				break;
			default:
				nameSortDirection = "asc";
				data.sort(function(a, b) {
					return a.name > b.name;
				});
				sortName.className = "sort-arrow-desc";
				break;
		}
		createItems(true);
		filterTable();
	}
}

function sortItemsBySurname() {
	if (data != null && data.length > 0) {
		sortName.className = "sort-arrow-inactive";
		nameSortDirection = null;
		switch(surnameSortDirection) {
			case "asc":
				surnameSortDirection = "desc";
				data.sort(function(a, b) {
					return a.surname < b.surname;
				});
				sortSurname.className = "sort-arrow-asc";
				break;
			case "desc":
				surnameSortDirection = "asc";
				data.sort(function(a, b) {
					return a.surname > b.surname;
				});
				sortSurname.className = "sort-arrow-desc";
				break;
			default:
				surnameSortDirection = "desc";
				data.sort(function(a, b) {
					return a.surname > b.surname;
				});
				sortSurname.className = "sort-arrow-desc";
				break;
		}
		createItems(true);
		filterTable();
	}
}

function showAddEditUserDialog(user) {
	userData = null;
	if (user == null) {
		userData = {
			id: null,
			avatar: null,
			active: false,
			name: null,
			surname: null,
			city: null,
			email: null,
			phone: null,
			online: null
		}
		userDataDialogName.value = "";
		userDataDialogSurname.value = "";
		userDataDialogAvatar.value = "";
		userDataDialogCity.value = "";
		userDataDialogEmail.value = "";
		userDataDialogPhone.value = "";
	} else {
		userData = user;
		userDataDialogName.value = user.name;
		userDataDialogSurname.value = user.surname;
		userDataDialogAvatar.value = user.avatar;
		userDataDialogCity.value = user.city;
		userDataDialogEmail.value = user.email;
		userDataDialogPhone.value = user.phone;
	}
	userDataDialog.style.display = "flex";
}

// Footer methods
function updateSyncTime() {
	let date = new Date();
	let year = date.getFullYear();
	let month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
	let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
	let hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
	let minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
	let seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
	syncTimeContainer.innerText = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
}

// User Data Dialog methods
function closeDialog(event) {
	userDataDialog.style.display = "none";
}

function submitNewData(event) {
	if (userDataDialogName.value.length > 0 &&
		userDataDialogSurname.value.length > 0 &&
		userDataDialogAvatar.value.length > 0 &&
		userDataDialogCity.value.length > 0 &&
		userDataDialogEmail.value.length > 0 &&
		userDataDialogPhone.value.length > 0 &&
		data != null)
	{
		userData.name = userDataDialogName.value;
		userData.surname = userDataDialogSurname.value;
		userData.avatar = userDataDialogAvatar.value;
		userData.city = userDataDialogCity.value;
		userData.email = userDataDialogEmail.value;
		userData.phone = userDataDialogPhone.value;
	
		if (userData.id == null) {
			userData.id = ++lastId;
			data.push(userData);
		} else {
			let selectedItem = data.find(obj => {
	  			return obj.id == userData.id ;
			});
			userData.active = selectedItem.active;
			selectedItem = userData;
		}
		createItems(true);
		userDataDialog.style.display = "none";
	}
}

// General
function removeEventsFromItems(parentElement, event, method) {
	if (parentElement.innerHTML != "") {
		for (let x = 0; x < parentElement.childNodes.length; x++) {
			parentElement.childNodes[x].removeEventListener(event, method);
		}
	}
}
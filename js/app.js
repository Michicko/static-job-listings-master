const mainContent = document.querySelector('.main__content');
const filterInput = document.querySelector('#filter-input');
const search = document.querySelector('#search');
const clear = document.querySelector('#search-clear');
const filterCont = document.querySelector('.display-filters');
const searchBar = document.querySelector('.header__filter-wrapper');


window.addEventListener('load', getJob);
search.addEventListener('keyup', addFilter);
clear.addEventListener('click', clearFilter);
filterCont.addEventListener('click', removeFilterItem);
mainContent.addEventListener('click', showSearchBar);


// Get Job from data
function getJob() {
    const xhr = new XMLHttpRequest();

    xhr.open('GET', "data.json", true);

    xhr.onload = function (err) {
        if (this.status === 200) {
            const data = JSON.parse(this.responseText);
            data.forEach((item) => {
                showJob(item);
            });
        } else {
            console.log(err);
        }
    }
    xhr.send();
}

// display jobs on DOM
function showJob(job) {
    let html =
        `<div class="job ${job.new ? "new" : ""} ${job.featured ? "featured" : ""}">
          <div class="job__details">
            <img src="${job.logo}" alt="${job.company} logo" class="job__app-avatar">
            <div class="job__content">
              <p class="company">${job.company}</p>
              <p class="${job.new ? "new" : ""}">${job.new ? "new!" : ""}</p>
              <p class="${job.featured ? "featured" : ""}">${job.featured ? "featured" : ""}</p>
              <h4 class="position"><a href="#" class="position-link">${job.position}</a></h4>
              <p class="postedAt">${job.postedAt}</p>
              <p class="contract">${job.contract}</p>
              <p class="location">${job.location}</p>
            </div>
          </div>
          <hr class="job__under">
          <div class="job__skills">
            <p class="role rs">${job.role}</p>
            <p class="level rs">${job.level}</p>
            ${job.languages.map(jobItem => `<p class="language rs">${jobItem}</p>`).join("")}
            ${job.tools.map(jobTools => `<p class="tool rs">${jobTools}</p>`).join("")}
          </div>
        </div>`;
    mainContent.innerHTML += html;
}


// display searched word
function displayFilter(filterItem) {
    let html =
        `<div class="filter">
            <p class="text">${turnCap(filterItem)}</p>
            <a href="#" class="del">x</a>
         </div>`;
    filterCont.innerHTML += html;
}



// transform text 
function turnCap(item) {
    if (item.toLowerCase() === 'css' || item.toLowerCase() === 'html') {
        return item.toUpperCase();
    } else {
        // return capitalized word
        return item.charAt(0).toUpperCase() + item.toLowerCase().slice(1);
    }
}


// add searched word
function addFilter(e) {
    if (e.key === 'enter' || e.keyCode === 13) {
        const item = e.target.value;
        checkFilter(item);
        filterJobList()
        e.target.value = "";
    }
}

// search jobs
function filterJobList() {
    const jobs = document.querySelectorAll('.job');
    const filters = document.querySelectorAll('.filter');
    jobs.forEach((job) => {
        filters.forEach((filter) => {
            if (job.innerHTML.toLowerCase().indexOf(filter.firstElementChild.textContent.toLowerCase()) > -1) {
                job.style.display = '';
            } else {
                job.style.display = 'none';
            }
        });
    });
    if (!filterCont.firstElementChild) {
        getJob();
    }
}

// clear search bar and filter list
function clearFilter(e) {
    while (filterCont.firstElementChild) {
        filterCont.removeChild(filterCont.firstElementChild);
    }
    searchBar.style.display = 'none';
    getJob();
    e.preventDefault();
}

// remove search item
function removeFilterItem(e) {
    if (e.target.classList.contains('del')) {
        e.target.parentElement.remove();
        filterJobList();
    }

    if (!filterCont.firstElementChild) {
        searchBar.style.display = 'none';
    }
}

// display search bar
function showSearchBar(e) {
    if (e.target.classList.contains('rs')) {

        if (!filterCont.firstElementChild) {
            displayFilter(e.target.textContent);
        } else {
            // check to see if word already exists
            checkFilter(e.target.textContent);
        }

        clear.style.display = 'block';
        searchBar.style.display = 'flex';
        filterJobList();
    }
}


// check to see if word already exists in filter list
function checkFilter(word) {
    const filters = document.querySelectorAll('.filter');
    let array = [];
    filters.forEach((filter) => {
        array.push(filter.firstElementChild.textContent.toLowerCase());
    });
    if (array.indexOf(word.toLowerCase()) < 0) {
        displayFilter(word);
    }
}
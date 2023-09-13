async function fetchFilterData() {
    try {
        const response = await axios.get('/api/filters'); // API endpoint for fetching filter data
        const filterData = response.data;

  
        let filterTemplate = document.querySelector('#filterTemplate');
        let filterTemplateInstance = Handlebars.compile(filterTemplate.innerHTML);
        let filterArea = document.getElementById('filterArea');
        
        if (filterArea) {
            let generatedHTML = filterTemplateInstance(filterData);
            filterArea.innerHTML = generatedHTML;

            attachFilterBoxEventListeners();
        }
    } catch (error) {
        console.error('API Error:', error);
    }
}
function toggleFilterOptions(element) {
    const optionsList = element.querySelector('.filter-options'); // Changed from nextElementSibling
    if (optionsList) {
        optionsList.classList.toggle('hidden');
    }
}

function attachFilterBoxEventListeners() {
    const filterBoxes = document.querySelectorAll('.filter-box h3'); // Target h3 within .filter-box
    filterBoxes.forEach(box => {
        box.addEventListener('click', function() {
            toggleFilterOptions(this.parentElement); // pass the parent .filter-box
        });
    });
}


document.addEventListener('DOMContentLoaded', function () {

    console.log("DOMContentLoaded event fired");  // Debugging line

    // Compile Handlebars template
    let shoeListTemplate = document.querySelector('#shoeListTemplate');
    if (shoeListTemplate) {
        // Continue with existing logic
        let shoeListTemplateInstance = Handlebars.compile(shoeListTemplate.innerHTML);
        let shoesElem = document.querySelector('.shoes');
        if (shoesElem) {
            function fetchShoes() {
                axios.get('/api/shoes')
                .then(function (response) {
                    let shoeList = response.data.data;  
                    let generatedHTML = shoeListTemplateInstance({ shoeList: shoeList });
                    shoesElem.innerHTML = generatedHTML;
                })
                .catch(function (error) {
                    console.error('API Error:', error);
                });
            }
            fetchShoes();
        }
    } else {
        console.error('Handlebars template not found');
    }

    
    fetchFilterData();


    // Function to handle filter button clicks
  function handleFilterButtonClick(event) {
    const filterType = event.target.getAttribute('data-filter');
    const filterValue = event.target.getAttribute('data-value');
    if (filterType && filterValue) {
      let apiEndpoint = `/api/shoes/${filterType}/${filterValue}`;
      fetchFilteredShoes(apiEndpoint);
    }
  }

  // Attach event listeners to filter buttons
  const filterArea = document.getElementById('filterArea');
  if (filterArea) {
    filterArea.addEventListener('click', (event) => {
      if (event.target.classList.contains('filter-button')) {
        handleFilterButtonClick(event);
      }
    });
  }



// signup
    const signupButton = document.querySelector("#signupButton");
    if (signupButton) {
        signupButton.addEventListener("click", () => {
            window.location.href = "/signup";
        });
    }
    

    // logout
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            window.location.href = '/logout';
        });
    }
// login
    const loginButton = document.querySelector("#loginButton");
    if (loginButton) {
        loginButton.addEventListener("click", () => {
            window.location.href = "/login";
        });
    }


});

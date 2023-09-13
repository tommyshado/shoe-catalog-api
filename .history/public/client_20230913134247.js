

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
        }
    } catch (error) {
        console.error('API Error:', error);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    // ... (Your existing code)

    // Fetch and display the filters
    fetchFilterData();

    // ... (Your existing code)
});

In this updated code, I've added an async function called fetchFilterData. This function:

    Makes an API call to /api/filters to fetch the filter data.
    Compiles the Handlebars filter template using this data.
    Inserts the compiled template into the filterArea DOM element.

I also added a call to fetchFilterData() in the DOMContentLoaded event listener, so it runs when the document is ready.

This should replace your hardcoded `



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

    function toggleFilterOptions(element) {
        const optionsList = element.querySelector('.filter-options');
        if (optionsList) {
            optionsList.classList.toggle('hidden');
        }
    }

    let filterTemplate = document.querySelector('#filterTemplate');
    if (filterTemplate) {
      let filterTemplateInstance = Handlebars.compile(filterTemplate.innerHTML);
      let filterArea = document.getElementById('filterArea'); // Assuming you have a div with this id in your HTML
      if (filterArea) {
        // Fetch your filter options or use hardcoded data
        const filterData = {
          colors: ['Red', 'Blue', 'Green'],
          sizes: [6, 7, 8, 9],
          brands: ['Nike', 'Adidas', 'Puma'],
          prices: [100, 200, 300]
        };
        let generatedHTML = filterTemplateInstance(filterData);
        filterArea.innerHTML = generatedHTML;
      }
    }


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
    //   shoe form


});

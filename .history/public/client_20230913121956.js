


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


    let filterTemplate = document.querySelector('#filterTemplate');
    if (filterTemplate) {
        let filterTemplateInstance = Handlebars.compile(filterTemplate.innerHTML);
        let filterArea = document.querySelector('#filterArea');  // Make sure you have a div with id="filterArea" in your HTML
        if (filterArea) {
            // Here you should fetch your filter options like colors, sizes, etc. For now, let's assume it's hardcoded.
            const filterData = {
                colors: ['Red', 'Blue', 'Green'],
                sizes: [6, 7, 8, 9],
                brands: ['Nike', 'Adidas', 'Puma'],
                prices: [100, 200, 300]
            };
            let generatedHTML = filterTemplateInstance(filterData);
            filterArea.innerHTML = generatedHTML;
        }
    } else {
        console.error('Filter Handlebars template not found');
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

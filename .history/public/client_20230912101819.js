document.addEventListener('DOMContentLoaded', function () {

    // Compile Handlebars template
    let shoeListTemplate = document.querySelector('#shoeListTemplate');
    if (!shoeListTemplate) {
        console.error('Handlebars template not found');
        return;
    }
    let shoeListTemplateInstance = Handlebars.compile(shoeListTemplate.innerHTML);

    let shoesElem = document.querySelector('.shoes');
    if (!shoesElem) {
        console.error('Target element not found');
        return;
    }

    // Fetch the shoes from the API
    function fetchShoes() {
        axios.get('/api/shoes')
    .then(function (response) {
        console.log("API Response:", response.data);  // Debugging line
        let shoeList = response.data.data;  // Make sure to access the 'data' field
        console.log("Shoe List:", shoeList);  // Debugging line
        let generatedHTML = shoeListTemplateInstance({ shoeList: shoeList });
        shoesElem.innerHTML = generatedHTML;
    })
    .catch(function (error) {
        console.error('API Error:', error);
    });
    }

    fetchShoes();
});

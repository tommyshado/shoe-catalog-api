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
                // Handle the response data
                let shoeList = response.data;
                let generatedHTML = shoeListTemplateInstance({ shoeList });
                shoesElem.innerHTML = generatedHTML;
            })
            .catch(function (error) {
                console.error('API Error:', error);
            });
    }

    fetchShoes();
});

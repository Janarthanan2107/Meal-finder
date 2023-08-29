const searchInput = document.getElementById('search'),
    submitForm = document.getElementById('submit'),
    meals = document.getElementById('meals'),
    singleMeal = document.getElementById('single-meal');

//global variables
// using for searching
const searchByTerm = "https://www.themealdb.com/api/json/v1/1/search.php?s="
// using for clicking the data
const searchById = "https://www.themealdb.com/api/json/v1/1/lookup.php?i="

//functions
const init = () => {
    fetchData(searchByTerm).then(data => dataToDom(data))
}

const fetchData = async (url) => {
    const res = await fetch(url)
    const data = await res.json()
    // dataToDom(data)
    console.log(data)
    return data
}

const getData = (e) => {
    e.preventDefault();
    const searchTerm = searchInput.value;

    if (searchTerm.trim()) {
        fetchData(searchByTerm + `${searchTerm}`).then(data => dataToDom(data))
    } else {
        meals.innerHTML = "Please enter a search term"
    }
}

const dataToDom = (items) => {
    meals.innerHTML = ''
    singleMeal.innerHTML = ''

    items.meals.forEach(meal => {
        const divEl = document.createElement("div")
        divEl.classList.add("meal")
        divEl.innerHTML = `<img src="${meal.strMealThumb}" alt="${meal.strMeal}" data-mealID="${meal.idMeal}"/>
                <div class="meal-info" >
                <h4>${meal.strMeal}</h4>
                </div>
            `
        meals.appendChild(divEl)
    })
}

const singleMealData = (e) => {
    if (e.target.getAttribute('data-mealID')) {
        const id = e.target.getAttribute('data-mealID')
        fetchData(searchById + `${id}`).then(data => singleMealDataToDom(data))
        scrollToSection()
    }
}

const scrollToSection = () => {
    const scrollTarget = document.getElementById("single-meal");
    scrollTarget.scrollIntoView({ behavior: "smooth", block: "start" });
};

const singleMealDataToDom = (mealData) => {
    const meal = mealData.meals[0];
    console.log(meal)

    const ing = []

    for (let i = 1; i <= 20; i++) {
        const ingredient = {
            // mentioning the values directly
            items: meal[`strIngredient${i}`],
            measures: meal[`strMeasure${i}`]
        }
        console.log(ingredient)

        if (meal[`strIngredient${i}`] && meal[`strMeasure${i}`]) {
            //pushing the ingredient obj to the array
            ing.push(ingredient)
        }
    }

    console.log(ing)

    singleMeal.innerHTML = `
        <div class="single-meal">
            <span id='single-meal-heading'>${meal.strMeal}</span>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
            <div class="single-meal-info">
                ${meal.strCategory ? `<p><b>Category</b> - ${meal.strCategory}</p>` : ''}
                ${meal.strArea ? `<p><b>Place</b> -${meal.strArea}</p>` : ''}
            </div>
            <div class="main">
                <p>${meal.strInstructions}</p>
                    <h2>Ingredients</h2>
                    <ul>
                        ${ing.map(({ items, measures } = ing) =>
        `<li>${items}-${measures}</li>`).join('')
        }
                    </ul>
            </div>
        </div>
    `
}

//event listeners
submitForm.addEventListener("click", getData)

meals.addEventListener("click", singleMealData)

init()
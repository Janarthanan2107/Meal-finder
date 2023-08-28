const searchInput = document.getElementById('search'),
    submitForm = document.getElementById('submit'),
    meals = document.getElementById('meals'),
    singleMeal = document.getElementById('single-meal');


//global variables
const searchByTerm = "https://www.themealdb.com/api/json/v1/1/search.php?s="
const searchById = "https://www.themealdb.com/api/json/v1/1/lookup.php?i="

//functions
const init = () => { }

const fetchAllData = async (url) => {
    const res = await fetch(url)
    const data = await res.json()
    dataToDom(data)
}

const getData = (e) => {
    e.preventDefault();
    const searchTerm = searchInput.value;

    if (searchTerm.trim()) {
        fetchAllData(searchByTerm + `${searchTerm}`)
    } else {
        meals.innerHTML = "Please enter a search term"
    }
}

const dataToDom = (items) => {
    meals.innerHTML = ''

    items.meals.forEach(meal => {
        const divEl = document.createElement("div")
        divEl.classList.add("meal")
        divEl.innerHTML = ` <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                <div class="meal-info" data-mealID="${meal.idMeal}">
                <h3>${meal.strMeal}</h3>
                </div>
            `
        meals.appendChild(divEl)
    })
}

const scrollToSection = () => {
    const scrollTarget = document.getElementById("single-meal-heading");
    scrollTarget.scrollIntoView({ behavior: "smooth" });
};

const fetchSingleMealData = async (url) => {
    const res = await fetch(url)
    const data = await res.json()
    singleMealDataToDom(data)
}

const singleMealData = (e) => {
    if (e.target.classList.contains('meal-info')) {
        const id = e.target.getAttribute('data-mealID')
        fetchSingleMealData(searchById + `${id}`)
        scrollToSection()
    } else {
        singleMeal.innerHTML = "Something Went Wrong!!"
    }
}

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
            <h1 id='single-meal-heading'>${meal.strMeal}</h1>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
            <div class="single-meal-info">
                ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
                ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
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
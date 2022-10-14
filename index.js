import { menuArray } from './data.js'

const mealRowContainer = document.getElementById('meal-row-container')
const currentTotalPrice = document.getElementById("current-total-price")
const orderBox = document.getElementById("order-box")
const popUp = document.getElementById("card-pop-up")
const thanksBox = document.getElementById("thanks-box")
const cardForm = document.getElementById('card-form')
const orderBtn = document.getElementById("order-btn")

let isNextOrder = false
let orderArray = []

init()

// hide pop-up and thanks-box first
function init() {
    popUp.style.display = 'none'
    orderBox.style.display = 'none'
    thanksBox.style.display = 'none'
}

document.addEventListener('click', function(e) {
    // listen for (+) button
    if (e.target.dataset.add) {
        orderBox.style.display = 'flex'

        // if this is next order (not the first)
        if (isNextOrder) {
            thanksBox.style.display = 'none'
            orderArray = []
            isNextOrder = false
        }

        handleAddClick(e.target.dataset.add)
    }

    // listen for 'remove' button
    if (e.target.dataset.remove) {
        handleRemoveClick(e.target.dataset.remove)
    }

    // listen for 'Complete order' button
    if (e.target.dataset.complete) {
        handleCompleteOrderClick(e.target.dataset.complete)
    }

    // listen for 'Pay' button
    if (e.target.dataset.paybtn) {
        handlePayClick(e.target.dataset.paybtn)
    }
})

function handleAddClick(mealId) { 
    // let orderBox = document.getElementById("order-box")
    const selectedMeal = menuArray.filter(function(meal) {
        return meal.name
    })[mealId]

    // set order button active
    orderBtn.classList = "order-btn";
    orderBtn.disabled = false;

    renderMealRowHtml(getSelectedMeal(selectedMeal))
}

function handleRemoveClick(removeButtonId) {
    // remove meal from array by its removeButonId
    const index = orderArray.indexOf(orderArray[removeButtonId])
    if (index > -1) {
        orderArray.splice(index, 1)
        renderMealRowHtml(orderArray)

        // if array gets empty, hide the element
        if (orderArray.length < 1) {
            orderBox.style.display = 'none'
        }
    }
}

function handleCompleteOrderClick() {
    // unhide pop-up window and reset form data
    popUp.style.display = 'flex'
    cardForm.reset();

    // set order button disabled
    orderBtn.classList = "order-btn disabled";
    orderBtn.disabled = true;
}

function handlePayClick() {
    cardForm.addEventListener('submit', function(e){
        e.preventDefault()

        // get data from the form
        const cardFormData = new FormData(cardForm)
        const name = cardFormData.get('name')
        
        const thanksHtml = `
            <h2>Thanks, ${name}! Your order is on its way!</h2>
        `
        init()
        renderThanksHtml(thanksHtml)
    })
}

// make and get selected meal object with name and price
function getSelectedMeal(currentMeal) {
    let itemObj = {}
    itemObj[currentMeal.name] = currentMeal.price
    orderArray.push(itemObj)
    return orderArray
}

function renderMealRowHtml(meal) {
    let mealHtml = ``
    let totalPrice = 0
    let totalPriceHtml = ``

    for (let i = 0; i < meal.length; i++) {
        for (let [mealName, mealPrice] of Object.entries(meal[i])) {
            
            mealHtml += `
            <div id="selected-meal-row">
                <div id="selected-meal-name">
                    <h4>${mealName}</h4>
                </div>
                <div id="selected-meal-remove">
                    <button data-remove="${i}" id="remove-btn" href="">remove</button>
                </div>
                <div id="selected-meal-price">
                    <h4>$${mealPrice}</h4>
                </div>
            </div>
            `
            totalPrice += Number(mealPrice)
            totalPriceHtml = `$${totalPrice}`
        }
    }
    
    mealRowContainer.innerHTML = mealHtml
    currentTotalPrice.innerHTML = totalPriceHtml

    render()
}

function renderThanksHtml(thanksHtmlMessage) {
    popUp.style.display = 'none'
    thanksBox.style.display = 'flex'
    isNextOrder = true
    thanksBox.innerHTML = thanksHtmlMessage
}

// get feed html
function getFeedHtml() {
    let feedHtml = ``
    menuArray.forEach(function(meal) {
        const spacedIngredients = meal.ingredients.join(', ')
        feedHtml += `
            <div id="meal-list-row">
                <div id="meal-img" data-emoji="${meal.id}">
                    <img src="${meal.emoji}" class="meal-img"/>
                </div>
                <div id="meal-description-box" data-name="${meal.id}">
                    <h4>${meal.name}</h4>
                    <div id="meal-ingredients" data-ingredients="${meal.id}">
                        ${spacedIngredients}
                    </div>
                    <div id="meal-price" data-price="${meal.id}">
                        <h4>$${meal.price}</h4>
                    </div>
                </div>
                <button class="meal-add-btn" data-add="${meal.id}">+</button>
            </div>
        `
    })
    return feedHtml 
}

// render feed html into DOM
function render() {
    document.getElementById('meal-box').innerHTML = getFeedHtml()
}

render()
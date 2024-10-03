"use strict";

const addCarForm = document.querySelector("#addCar");
const searchCarForm = document.querySelector("#searchCar");

const cars = [];

class Car {
    constructor(license, maker, model, owner, price, color, year) {
        this.license = license;
        this.maker = maker;
        this.model = model;
        this.owner = owner;
        this.price = parseFloat(price);
        this.color = color;
        this.year = parseInt(year);
    }

    getCarAge() {
        const currentYear = new Date().getFullYear(); // Initiallising current year
        return currentYear - this.year;  // calculate car age 
    }

    getDiscountedPrice() {  // getting car discounted price if car is more than 10 years old
        return this.getCarAge() > 10 ? this.price * 0.85 : this.price; //used ternary opreator to check if car is older than 10 years
        // return this.isEligibleForDiscount() ? this.price * 0.85 : this.price;
    }

    isEligibleForDiscount() {  
        return this.getCarAge() > 10; // checking car is older than 10 years
    }

}

const addCar = (e) => {
    e.preventDefault();   // used preventDefault to stop default behavior of form refreshing the page

    try {   //used try catch for handing any errors
        const license = document.querySelector("#license").value.trim();  //used trim method if by mistake user left space in the form input field
        const maker = document.querySelector("#maker").value.trim();
        const model = document.querySelector("#model").value.trim();
        const owner = document.querySelector("#owner").value.trim();
        const price = parseFloat(document.querySelector("#price").value.trim());
        const color = document.querySelector("#color").value.trim();
        const year = parseInt(document.querySelector("#year").value.trim());
        const currentYear = new Date().getFullYear();

        if (!license || !maker || !model || !owner || isNaN(price) || !color || isNaN(year)) {  // check every fields which are manadetory
            throw new Error("All fields are required and must be valid.");  // throw error if manadetory fields are empty
        }

        if (price <= 0) {  //check price should be a positive number
            throw new Error("Price must be a positive number.");  
        }

        if (year < 1886 || year > currentYear) {  // check year value should be between 1886 to current year
            throw new Error(`Year must be between 1886 and ${currentYear}.`);
        }

        const newCar = new Car(license, maker, model, owner, price, color, year);  //make car object
        addCarForm.reset();  //reset the form for new data to be filled
        cars.push(newCar);  // save newCar object in variable cars of type array
        displayTable(); // display all the cars data in the table

    } catch (error) {  // if try block throws error due to field validation then catch block will catch error
        alert(error.message); // this will show the error message as a popup to the user
    }
};

const displayTable = () => {  // function for displaying cars data in the table
    const table = document.querySelector("#carsTable");  // make DOM object of cars table

    table.innerHTML = table.rows[0].innerHTML;   // I think, this line is unnessesry

    cars.forEach((car) => {  //iterate car in the cars array
        const row = table.insertRow(-1); //insert table row

        const { license, maker, model, owner, year, color, price } = car; //initialising car parameters to use as a variable

        const carDetails = [license, maker, model, owner, year, color];

        carDetails.forEach(detail => {
            row.insertCell(-1).textContent = detail ?? 'N/A';
        });

        row.insertCell(-1).textContent = `${price.toFixed(2)}€`;

        const discountedPrice = car.isEligibleForDiscount()
            ? `$${car.getDiscountedPrice().toFixed(2)}`
            : "No Discount";
        row.insertCell(-1).textContent = discountedPrice;
    });
};


const searchCar = (e) => {  
    e.preventDefault();
    const searchInput = document.querySelector("#search").value.trim();  //getting value of search input field
    const foundCar = cars.find((car) => car.license.toLowerCase() === searchInput.toLowerCase());  // used find method to pass the one object at a time and checking in every object that car license number matches to searchinput number

    const searchResult = document.querySelector("#searchResult");

    if (foundCar) {  //check foundCar has any value
        const originalPrice = foundCar.price.toFixed(2);  //toFixed method keeps 2 digits after decimal 
        const discountedPrice = foundCar.isEligibleForDiscount()  //used ternary operator to check if car is getting discount or not
            ? `$${foundCar.getDiscountedPrice().toFixed(2)}`
            : "No Discount";

        searchResult.innerHTML = ` 
            <p>Maker: ${foundCar.maker}</p>
            <p>Model: ${foundCar.model}</p>
            <p>Owner: ${foundCar.owner}</p>
            <p>Year: ${foundCar.year}</p>
            <p>Original Price: $${originalPrice}</p>
            <p>Discounted Price: ${discountedPrice}</p>
            <p>Color: ${foundCar.color}</p>  
        `;  //displayed text in search result dom if license number matches any car license in cars array
    } else {
        searchResult.innerHTML = "<p>No car found with the given license plate.</p>";  // if license number will not be available in the cars array then this text will shown
    }
};

addCarForm.addEventListener("submit", addCar);  
searchCarForm.addEventListener("submit", searchCar);

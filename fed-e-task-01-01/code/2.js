const fp = require('lodash/fp')

const cars = [
    {name:'Ferrari FF', horsepower:650, dollar_value:700000, in_stock: true},
    {name:'Ferrari CC Ff', horsepower:660, dollar_value:700, in_stock: false},
    {name:'Ferrari FF EE', horsepower:6602, dollar_value:7000, in_stock: true},
    {name:'Ferrari FF', horsepower:6630, dollar_value:7000, in_stock: false},
    {name:'Ferrari FF', horsepower:600, dollar_value:700010, in_stock: true},
    {name:'Ferrari FF', horsepower:560, dollar_value:700002, in_stock: false},
]

//  1

const inLastInStock = fp.flowRight(fp.prop('in_stock') ,fp.last)

console.log(inLastInStock(cars))

// 2
const getFirstName = fp.flowRight(fp.prop('name'),fp.first)

console.log(getFirstName(cars))

// 3
let _average = function(xs){
    return fp.reduce(fp.add, 0, xs) / xs.length
}

let averageDollarValue = fp.flowRight( _average,fp.map((car)=>car.doolar_value))
console.log(averageDollarValue(cars))

// 4

let _underscore  = fp.replace(/\W+/g,'_')

//const sanitizeNames = fp.flowRight(fp.map( _underscore ),fp.map(fp.toLower),fp.map(fp.prop('name')))
const sanitizeNames = fp.map(fp.flowRight(_underscore,fp.toLower,fp.prop('name')))
console.log(sanitizeNames(cars))
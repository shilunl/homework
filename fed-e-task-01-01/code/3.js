const fp = require('lodash/fp')

const { Maybe, Container} = require('./support.js')



// 1
let ex1 = () => {
    return fp.map(fp.add(1))
}

let maybe = Maybe.of([5,6,1])
            .map( ex1() )

console.log(maybe)


// 2

let ex2 = () => {
    return fp.first
}

let xs = Container.of(['do','ray','cc'])
    .map(ex2())

console.log(xs)

// 3

let safeProp = fp.curry(function(x, o){
    return Maybe.of(o[x])
})

let user = { id:2, name:'Albert'}
let ex3 = ()=>{
    return safeProp('name',user)
    .map(fp.first)
}

console.log(ex3())

// 4 

let ex4 = (n) => {
    return Maybe.of(n).map(parseInt)
}

console.log(ex4('3sss'))


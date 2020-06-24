

function first(){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            var a = 'hello '
            resolve(a)
        },10)
    })
}
function second(a){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            var b = 'lagou '
            resolve(a+b)
        },10)
    })
}

function third(a){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            var c = 'I xin you'
            resolve(a+c)
        },10)
    })
}

first().then((value)=>{
    return second(value)
}).then(value=>{
    return third(value)
}).then(value=>{
    console.log(value)
})

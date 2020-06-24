## js异步机制的思考

### 1、为什么是异步

什么是异步？发出调用后一直等待，直到拿到结果（这段时间不能做任何事）为同步；发出调用后不等待，继续执行下一个任务，就是异步任务。

js是运行在浏览器端的语言， 浏览器是多线程的，而js是单线程的，如果在执行一些耗时比较多的任务时候（如ajax请求，定时器等），如果采用同步，浏览器页面就会一直等待，造成假死现象，故采用异步能很好的解决此类问题。 

### 2、消息队列

既然js单线程的，就意味着所有任务需要排队，前一个任务结束，才会执行后一个任务。 js有个主线程，执行完毕同步任务，所有的异步任务会放入消息队列中。同步任务执行完毕，就从消息队列中开始执行异步任务。
    
    （1）所有同步任务都在主线程上执行，形成一个执行栈（execution context stack）。
    （2）只要异步任务有了运行结果，就在"消息队列"之中放置一个事件。
    （3）一旦"执行栈"中的所有同步任务执行完毕，系统就会读取"消息队列"，看看里面有哪些事件、那些对应的异步任务，于是结束等待状态，进入执行栈，开始执行。
    （4）主线程不断重复上面的第三步。

### 3、宏任务与微任务

既然从’消息队列‘中执行任务，那就有先后之分，究竟先执行谁，后执行谁呢？ 
    
    就是先执行所有的 微任务 然后在执行 宏任务，每次执行 宏任务 之前，就执行所有有的 微任务
那么，宏任务和微任务是怎么区分的呢，一般来说

    宏任务（macro task）
        1.script（整体代码）
        2.setTimeout
        3.setInterval
        4.setImmediate
        5.I/O
        6.UI rendering
    微任务（mincro-task）
        1.promise.then
        2.process.nextTick(node.js)

### 4、Event Loop
我感觉，event loop就是整个任务的处理过程，执行过程如下：

    1.整体的script(作为第一个宏任务)开始执行的时候，会把所有代码分为两部分：“同步任务”、“异步任务”；
    2.同步任务会直接进入主线程依次执行；
    3.异步任务会再分为宏任务和微任务；
    4.宏任务每当指定的事件完成时,注册回调函数，进入宏任务队列
    5.微任务每当指定的事件完成时,注册回调函数，进入微任务队列
    6.当主线程内的任务执行完毕，主线程为空时，会检查微任务的队列，如果有任务，就全部执行，如果没有就执行下一个宏任务；
    7.上述过程会不断重复，这就是Event Loop事件循环；

### 5、代码体现

```
console.log('event start')

setTimeout(()=>{
    console.log('setTimeout 1')
},100)

new Promise((resolve, reject)=>{
    console.log('Promise 1')
    resolve()
}).then(()=>{
    console.log('Promise then 1')
})

new Promise((resolve, reject)=>{
    console.log('Promise 2')
    resolve()
}).then(()=>{
    console.log('Promise then 2')
})

setTimeout(()=>{
    console.log('setTimeout 2')
    //宏任务中，加入微任务，验证上面第6步，是否是执行完当前宏任务，开始下一个宏任务前，是否先执行微任务
    new Promise((resolve, reject)=>{
        console.log('setTimeout2 Promise')
        resolve()
    }).then(()=>{
        console.log('setTimeout2 then')
    })

    new Promise((resolve, reject)=>{
        console.log('setTimeout2 Promise2')
        resolve()
    }).then(()=>{
        console.log('setTimeout2 then 2')
    })
},10)

setTimeout(()=>{
    console.log('setTimeout 3')
},1000)


console.log('event end')

```
执行结果如下

    event start
    Promise 1
    Promise 2
    event end //第一次，同步代码结束
    Promise then 1 //微任务
    Promise then 2 //微任务
    setTimeout 2 //宏任务内
    setTimeout2 Promise//宏任务内
    setTimeout2 Promise2//宏任务内
    setTimeout2 then //在下个宏任务之前，执行了微任务内的队列
    setTimeout2 then 2//在下个宏任务之前，执行了微任务内的队列
    setTimeout 1
    setTimeout 3


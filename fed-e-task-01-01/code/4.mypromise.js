
const PENDING = 'pending'  //等待
const FULFILLED = 'fulfilled'//成功
const REJECTED = 'rejected'//失败


class MyPromise {

    constructor(executor){
        try{
            executor(this.resolve, this.reject)
        }catch(e){
            this.reject(e)
        }
        
    }


    status = PENDING;
    value = undefined;
    reason = undefined;
    sucessCallback=[];
    failCallback = [];

    resolve = value => {
        if(this.status !== PENDING) return;
        this.status = FULFILLED;

        this.value = value;

        while(this.sucessCallback.length) this.sucessCallback.shift()()
    }

    reject = reason => {
        if(this.status !== PENDING) return;
        this.status = REJECTED;

        this.reason = reason;

        while(this.failCallback.length) this.failCallback.shift()()
    }

    then(sucessCallback, failCallback){
        sucessCallback = sucessCallback ? sucessCallback : value=>value
        failCallback = failCallback ? failCallback : reason=>{throw reason};
        let promise2 = new MyPromise((resolve,reject)=>{
            if(this.status === FULFILLED){
                setTimeout(() => {
                    try{
                        let x = sucessCallback( this.value )
                        resolvePromise(promise2, x, resolve, reject)
                    }catch(e){
                        reject(e)
                    }
                }, 0);
                
            }else if(this.status === REJECTED){
                setTimeout(() => {
                    try{
                        let x = failCallback( this.reason )
                        resolvePromise(promise2, x, resolve, reject)
                    }catch(e){
                        reject(e)
                    }
                }, 0);
            }else{
                this.sucessCallback.push(()=>{
                    setTimeout(() => {
                        try{
                            let x = sucessCallback( this.value )
                            resolvePromise(promise2, x, resolve, reject)
                        }catch(e){
                            reject(e)
                        }
                    }, 0);
                });
                this.failCallback.push(()=>{
                    setTimeout(() => {
                        try{
                            let x = failCallback( this.reason )
                            resolvePromise(promise2, x, resolve, reject)
                        }catch(e){
                            reject(e)
                        }
                    }, 0);
                });
            }
        })

        return promise2;
        
    }
    catch(failCallback){
        return this.then(undefined , failCallback)
    }
    finally(callback){
        return this.then((value)=>{
            return MyPromise.resolve(callback()).then(()=>{
                value
            })
        },(resaon)=>{
            return MyPromise.resolve(callback()).then(()=>{
                throw resaon
            })
        })
    }

    static all(array){
        return new MyPromise((resolve, reject)=>{
            let result = [];
            let index = 0;
            function addData(key,value){
                result[key] = value;
                index++
                if(index===array.length){
                    resolve(result)
                }
            }

            for(let i = 0;i<array.length; i++){
                let current = array[i]
                if(current instanceof MyPromise){
                    current.then(value=>{addData(i,value)},reason=>{reject(reason)})
                }else{
                    addData(i,current)
                }
            }
           
        })
    }
    static race(array){
        return new MyPromise((resolve, reject)=>{
            for(let i = 0;i<array.length; i++){
                let current = array[i]
                if(current instanceof MyPromise){
                    current.then(value=>{resolve(value)},reason=>{reject(reason)})
                }else{
                    resolve(value)
                }
            }
           
        })
    }

    static resolve(value){
        if(value instanceof MyPromise) return value;
        return new MyPromise((resove)=>{
            resove(value)
        })
    }
}

function resolvePromise(promise2, promise, resolve, reject) {
    if(promise2 === promise){
        return reject (new TypeError('重复使用了'))
    }
    if(promise instanceof MyPromise){
        promise.then(resolve, reject)
    }else{
        resolve(promise)
    }
}

module.exports = MyPromise;

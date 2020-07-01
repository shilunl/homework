

### 强类型与弱类型
这个是从类型安全上划分  
强类型语言，语言层面限制函数的实参类型必须与形参类型相同  
弱类型语言，语言层面不会限制实参的类型

> 由于这种强弱类型之分根本不是某一个权威机构的定义，所以理解各有不同

>强类型有更强的类型约束，而弱类型几乎没有什么约束  
>强类型语言中，不允许有任意类型的隐式类型转换而弱语言类型则允许

### 静态类型与动态类型
这个是从类型检查

静态语言： 一个变量声明时他的类型就是明确的，声明过后不允许修改  
动态语言: 运行阶段才能够明确变量的类型，而且变量的类型随时可以改变

### javaScript自有类型的问题
> js 是弱类型且动态的  

脚本语言，非编译~~~ 历史原因决定了他是弱类型~~~

#### 弱类型问题
1、运行阶段才会发出异常
``` 
var obj = {}

obj.foo()

```
在语言层面不会报错，运行是会报错

2、类型会隐式转换
```
100+'100'

var obj={}
obj[true] = 3;
obj['true']  //3
```
不是求和二是字符串相加


此上问题，虽然可以通过君子约定来来控制，但不是所有规则人人都会执行  
君子约定有隐患，强制要求才有保障。

#### 强类型优势
1、错误可以更早的暴露
>编码阶段就会暴露异常

2、代码更智能，编码更准确
>开发工具智能提示等

3、重构更牢靠  
4、减少一些不必要的类型判断

### Flow静态类型检查方案
#### flow 是js的类型检查器


> 模块名称 flow-bin  flow init 初始化  
>文件开头添加 @flow   
> a: number ->   添加 类型注解  
>检测 flow 


### typeScript语言规范与基本使用

#### 概述
TypeScript——JavaScript的超集

> javascript + es6+ + 类型系统  ==》编译成javascript

#### 环境安装 

page包： typescript  
编译命令：tsc xxx.ts 

> 针对证个工程， 需要有个配置文件  
    tsc --init 初始话这个文件
#### 原始数据类型

string  
number (包括 NaN, Infinity)  
boolean  
null  
underfined  
symbol  
> Symbol()  会报错，promise 也会  与默认的标准库有关 可修改配置文件中的lib选项解决  
lib:["es2015","DOM"]
##### 作用域问题
多文件编译时， 碰到相同的变量名，会提示重名报错问题，解决方案
>1、(function(){  
            const a = xxx  
})()   
>2、export{} 以模块的形式导出

#### 费原始数据
##### object 类型
const foo: object = fucntion(){} //[],//{}
##### 数组类型
const arr1 = Array<number> = [1,2,3]  
const arr2 = number[] = [1,2,3]
##### 元组类型
const tuple:[number, string] = [1,'string']  //位置对应类型需要一致,可通过下标访问
##### 枚举类型
enum 变量{
    v = 1,
    v2 = 2
}

>默认数字，从0开始，如果有指定，一次累加， 如果是字符串，需手动指定值

##### 函数类型
函数声明  
function func1(a:number,b?:number):string{
    return ''
}
function func1(a:number,b:number = 10):string{
    return ''
}
>？可选参数，赋默认值也是可选参数   必须在最后 

函数表达式

const func2: (a:number, b:number)=>string = function(a:number, b:number): string(){}

##### 任意类型
function strings(value:any): string{
    retrun JSON.stringify(value)
}
##### 隐式类型推断
let age = 18  //推断类型为number  
age='age' //报错

let foo //推断为any  
foo=1;
foo='ffoo' //都可以

##### 类型断言

const num = [1,2,4]  
const res = num.find(i=>i>0)  
const num1 = res as number //as关键字断言  
const num2 = <number>res //jsx 不能使用
>告诉js，相信我，这个就是是某类型
##### 接口  （Interfaces)
约束对象的结构

interface 名称{
    title:string
    content?:string
    readonly ss:string
}
>?可选  
readonly:只读 

[]:动态接口，例如[key:string]:string

```
interface Catch{
    [key: string]: string
}

const catch: Catch = {}
catch.foo='111'
catch.bar = '111'
```

##### classe 类
类的属性需要先定义，才可以在构造函数中赋值

修饰符
public //公有属性，默认  
private //私有属性  
protected //受保护的 可以在子类中访问
readonly //只读属性

##### 接口 implements

##### 抽象类 abstract
##### 泛型(Generics)
定义时不确定的类型 ， 使用时在指定他 例如
```
function createArray<T>(length:number,value: T):T[]{
    const arr = Array<T>(length).fill(value)
    return arr;
}
```
##### 类型声明
declare function xx

>可以安装类型声明模块 @types/xx

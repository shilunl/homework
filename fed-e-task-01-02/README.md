# 问题1
打印 10；  
原因在于js没有块级作用域的概念。解决此类问题可采用let声明i；或者采用闭包方式
```
var a=[];
for(var i =0;i<10;i++){
    (function (i){
        a[i]=function( ){
            console.log(i)
        }
    })(i)
}
a[6]() //6
```
# 问题2
会报错；  //ReferenceError  
let声明的变量， 不会像var一样会产生变量提升现象。使用let声明变量时，只要变量在还没有声明完成前使用，就会报错
# 问题3
```
var num = [1,2,4]
console.log(Math.min(...num))
```
# 问题4 -- var\let\cont的差别
var:  
1、变量会提升
2、省略时，默认全局作用域
3、接受重复声明  
let:  
1、不会提升
2、不接受重复声明
3、支持块级作用域  
const:  
1、具有let的所有特性
2、用来声明常量；一旦声明，不可更改

# 问题5
打印 20；  
fn内的setTimeout()内使用的是箭头函数 ， 箭头函数的this指向的是所处上下文的this。如果内部使用的是普通函数,则结果为10. 由于普通函数this指向直接调用者，而setTimeout的调用是window，故为10；
# 问题6 -- symbole类型的用途
symbol能创建一个独一无二的值  
1、解决变量重名冲突问题  
2、模拟实现类的私有成员  
3、可以内置对象的静态常量

# 问题7 --什么是浅拷贝？深拷贝？
首先说明如果拷贝的是基本数据类型,由于基本数据类型，名字和值都会储存在栈内存中，所以是没有这些深拷贝和浅拷贝区别的  
针对引用数据类型：  
名字存在栈内存中，值存在堆内存中，但是栈内存会提供一个引用的地址指向堆内存中的值  
浅拷贝,只是复制了引用地址。所以当 B复制了A，当修改A时，B的值也跟着变了，反之亦然。  
深拷贝，则是重新生成新的地址，存放复制的对象。复制对象和被复制对象都是独立的

# 问题8 -- ts与js的关系
js是弱类型 ts需要静态编译，它提供了强类型与更多面向对象的内容。  
ts是js的超集，可以在ts中使用原生js语法   
ts最终仍要编译为js弱类型，基于对象的原生的js，再运行。

# 问题9 -- ts的优缺点

由于ts提供了强类型与更多面向对象的内容，所以他有强类型的优点  
1、错误可以更早的暴露 编码阶段就会暴露异常  
2、代码更智能，编码更准确 开发工具智能提示等  
3、重构更牢靠  
4、减少一些不必要的类型判断
我认为缺点的话，相对于js，需要更多的学习成本,理解需要理解接口（Interfaces）、泛型（Generics）、类（Classes）、枚举类型（Enums）等前端工程师可能不是很熟悉的概念 。集成的项目中需要工作量，短期项目会增加开发成本。
# 问题10 - 引用计数原理，优缺点
通过引用计数器，引用关系改变时修改引用数字，当有引用时数值+1；减少是-1，当为0时立即回收。  
优点：发现垃圾立即回收；最大限度减少程序暂停  
缺点：无法回收循环引用对象；时间/资源开销大

# 问题11 --标记整理算法流程
分两个阶段进行， 标记阶段，遍历所有对象，对活动对象进行标记  
清除阶段，在清除前，会整理内存，活动的放到一起，非活动的放到一起，形成连续的地址。让后对非活动对象进行回收。最大限度利用空间。
# 问题12 -- v8新生代存储区域垃圾回收流程
1、回收过程采用复制算法+标记整理  
2、新生代内存区分为2个等大小空间  
3、使用空间为from，空闲空间为to  
4、活动对象存储于from空间  
5、标记整理后将活动对象拷贝至to   
6、from与to交换空间完成释放
# 问题13 --描述增量标记算法何时使用，及工作原理。

垃圾回收执行时，会阻塞执行代码.所以需要把垃圾回收分成几段来完成。以达到让垃圾回收和程序执行进行交替完成。

流程如下   
程序执行→遍历对象标记→程序执行→标记→程序执行→标记→程序执行→完成清除→程序执行



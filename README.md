# document 查询器
### 安装
```
npm install itellyou-dom
```
### 使用
```
import $ from 'itellyou-dom'

class Test {
    
    render(){
        const hello = $("<div>hello</div>")
        document.body.append(hello[0])

        // 设置属性
        hello.attr("data-text","hello")
        hello.html("hello world")
        
        // 绑定事件
        hello.on("click",() => {
            hello.append("<p>This is click</p>")
        })
    }
}

const test = new Test()
test.render()
```
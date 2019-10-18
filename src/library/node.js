import getDocument from 'get-document'
import getWindow from 'get-window'
import DOMEvent from './event'
import DOMParse from "./parse"

import { toCamelCase, getStyleMap, getComputedStyle, getAttrMap , toHex } from './utils/string'

const isMatchesSelector = (element, selector) => {
    if (element.nodeType !== Node.ELEMENT_NODE) {
        return false
    }
  
    const matchesSelector = element.matches || element.webkitMatchesSelector || element.mozMatchesSelector || element.oMatchesSelector || element.matchesSelector;
    return matchesSelector.call(element, selector)
}

/**
 * 扩展 Node 类
 * @class DOMNode
 * @constructor
 * @param {NodeList} nodes 需要扩展的 NodeList
 * @param {Node} context 节点上下文，或根节点
 */
class DOMNode {
    constructor(nodes, context){
        // 如果 包含nodeType属性，则转换为数组
        if (nodes.nodeType) {
            nodes = [nodes]
        }
        // 事件
        this.events = []
        
        for (let i = 0; i < nodes.length; i++) {
            this[i] = nodes[i]
            this.events[i] = new DOMEvent() // 初始化事件对象
        }
    
        this.length = nodes.length
    
        if (this.length > 0) {
            this.doc = context ? getDocument(context) : document
            this.root = context
            this.name = this[0].nodeName ? this[0].nodeName.toLowerCase() : ''
            this.type = this.length > 0 ? this[0].nodeType : null
            this.win = getWindow(this[0]) || window
        }
    }

    /**
     * 遍历
     * @param {Function} callback 回调函数
     * @return {DOMNode} 返回当前实例
     */
    each(callback) {
        for (let i = 0; i < this.length; i++) {
            if (callback(this[i], i) === false) {
                break
            }
        }
        return this
    }

    /**
     * 将 DOMNode 转换为 Array
     * @return {Array} 返回数组
     */
    toArray(){
        const nodeArray = []
        this.each(node => {
            nodeArray.push(node)
        })
        return nodeArray
    }

    /**
     * 判断当前节点是否为 Node.ELEMENT_NODE 节点类型
     * @return {boolean}
     */
    isElement() {
        return this.type === Node.ELEMENT_NODE
    }

    /**
     * 判断当前节点是否为 Node.TEXT_NODE 节点类型
     * @return {boolean}
     */
    isText() {
        return this.type === Node.TEXT_NODE
    }

    /**
     * 获取当前第 index 节点
     * @param {Number} index 
     * @return {DOMNode|undefined} DOMNode 类，或 undefined
     */
    eq(index) {
        return this[index] ? new DOMNode(this[index]) : undefined
    }

    /**
     * 获取当前节点所在父节点中的索引
     * @return {Number} 返回索引
     */
    index() {
        let prev = this[0].previousSibling
        let index = 0

        while (prev && prev.nodeType === Node.ELEMENT_NODE) {
            index++
            prev = prev.previousSibling
        }
        return index
    }

    /**
     * 获取当前节点父节点
     * @return {DOMNode} 父节点
     */
    parent() {
        const node = this[0].parentNode
        return node ? new DOMNode(node) : undefined
    }

    /**
     * 查询当前节点的子节点
     * @param {Node | string} selector 查询器
     * @return {DOMNode} 符合条件的子节点
     */
    children(selector) {
        if (0 === this.length)
            return new DOMNode([])
        const childNodes = this[0].childNodes
        if(selector){
            let nodes = [];
            for(let i = 0;i < childNodes.length;i++){
                const node = childNodes[i]
                if(isMatchesSelector(node,selector)){
                    nodes.push(node)
                }
            }
            return new DOMNode(nodes)
        }
        return new DOMNode(childNodes)
    }

    /**
     * 获取当前节点第一个子节点
     * @return {DOMNode} DOMNode 子节点
     */
    first() {
        const node = this.length === 0 ? null : this[0].firstChild
        return node ? new DOMNode(node) : undefined
    }

    /**
     * 获取当前节点最后一个子节点
     * @return {DOMNode} DOMNode 子节点
     */
    last() {
        const node = this.length === 0 ? null : this[0].lastChild
        return node ? new DOMNode(node) : undefined
    }

    /**
     * 返回元素节点之前的兄弟节点（包括文本节点、注释节点）
     * @return {DOMNode} DOMNode 节点
     */
    prev() {
        const node = this.length === 0 ? null : this[0].previousSibling
        return node ? new DOMNode(node) : undefined
    }

    /**
     * 返回元素节点之后的兄弟节点（包括文本节点、注释节点）
     * @return {DOMNode} DOMNode 节点
     */
    next() {
        const node = this.length === 0 ? null : this[0].nextSibling
        return node ? new DOMNode(node) : null
    }

    /**
     * 返回元素节点之前的兄弟元素节点（不包括文本节点、注释节点）
     * @return {DOMNode} DOMNode 节点
     */
    prevElement() {
        const node = this.length === 0 ? null : this[0].previousElementSibling
        return node ? new DOMNode(node) : undefined
    }

    /**
     * 返回元素节点之后的兄弟元素节点（不包括文本节点、注释节点）
     * @return {DOMNode} DOMNode 节点
     */
    nextElement() {
        const node = this.length === 0 ? null : this[0].nextElementSibling
        return node ? new DOMNode(node) : null
    }

    /**
     * 返回元素节点所在根节点路径，默认根节点为 document.body
     * @param {Node} context 根节点，默认为 document.body
     * @return {String} 路径
     */
    getPath(context){
        context = context || document.body
        const path = []
        if(this.length > 0){
            path.push(this.name)
            let parent = this.parent()
            while(parent && !this.equal(context) && !parent.equal(context)){
                path.push(parent.name)
                parent = parent.parent()
            }
        }
        return path
    }

    /**
     * 判断元素节点是否包含要查询的节点
     * @param {DOMNode | Node} node 要查询的节点
     * @return {Boolean} 是否包含
     */
    contains(node) {
        node = node[0] ? node[0] : node
        if (this.length === 0) {
            return undefined
        }
        if (this[0].nodeType === Node.DOCUMENT_NODE && node.nodeType !== Node.DOCUMENT_NODE) {
            return true
        }
      
        while (node = node.parentNode) {
            if (node === this[0]) {
                return true
            }
        }
        return false
    }

    /**
     * 根据查询器查询当前元素节点
     * @param {Node|String} selector 查询器 
     * @return {DOMNode} 返回一个 DOMNode 实例
     */
    find(selector) {
        let nodes = []
        if (this[0] && this.isElement()) {
            nodes = this[0].querySelectorAll(selector)
        }
        return new DOMNode(nodes)
    }

    /**
     * 根据查询器查询符合条件的离当前元素节点最近的父节点
     * @param {Node|String} selector 查询器
     * @return {DOMNode} 返回一个 DOMNode 实例
     */
    closest(selector) {
        const getParent = arguments.length > 1 && undefined !== arguments[1] ? arguments[1] : node => {
            return node.parentNode
        }
        const nodeList = []
        let node = this[0]

        while (node) {
            if (isMatchesSelector(node, selector)) {
                nodeList.push(node)
                return new DOMNode(nodeList)
            }
            node = getParent(node)
        }
        return new DOMNode(nodeList)
    }

    /**
     * 为当前元素节点绑定事件
     * @param {String} eventType 事件类型
     * @param {Function} listener 事件函数
     * @return {DOMNode} 返回当前实例
     */
    on(eventType, listener) {
        this.each((node, i) => {
            node.addEventListener(eventType, listener, false)
            this.events[i].on(eventType, listener)
        })
        return this
    }

    /**
     * 移除当前元素节点事件
     * @param {String} eventType 事件类型
     * @param {Function} listener 事件函数
     * @return {DOMNode} 返回当前实例
     */
    off(eventType, listener) {
        this.each((node, i) => {
            node.removeEventListener(eventType, listener, false)

            this.events[i].off(eventType, listener)
        })
        return this
    }

    /**
     * 获取当前元素节点相对于视口的位置
     * @param {Object} defaultValue 默认值
     * @return {Object} 
     * {
     *  top,
     *  bottom,
     *  left,
     *  right
     * }
     */
    getBoundingClientRect(defaultValue) {
        const node = this[0]
        if (node && node.getBoundingClientRect) {
            const rect = node.getBoundingClientRect()
            const top = document.documentElement.clientTop
            const left = document.documentElement.clientLeft
            return {
                top: rect.top - top,
                bottom: rect.bottom - top,
                left: rect.left - left,
                right: rect.right - left
            }
        }

        return defaultValue || null
    }

    /**
     * 移除当前元素所有已绑定的事件
     * @return {DOMNode} 当前 DOMNode 实例
     */
    removeAllEvents() {
        this.each((node, i) => {
            if (!this.events[i]) {
                return
            }

            Object.keys(this.events[i].listeners).forEach(eventType => {
                const listeners = this.events[i].listeners[eventType]
                for (let _i = 0; _i < listeners.length; _i++) {
                    node.removeEventListener(eventType, listeners[_i], false)
                }
            })
        })
        this.events = []
        return this
    }

    /**
     * 获取当前元素节点相对于视口的位置
     * @return {Object} 
     * {
     *  top,
     *  left
     * }
     */
    offset() {
        const node = this[0]
        const rect = node.getBoundingClientRect()
        return {
            top: rect.top,
            left: rect.left
        }
    }

    /**
     * 获取或设置元素节点属性
     * @param {String|undefined} key 属性名称
     * @param {String|undefined} val 属性值
     * @return {DOMNode|Map} 返回值或当前实例
     */
    attr(key, val) {
        if (key === undefined) {
            return getAttrMap(this.clone(false)[0].outerHTML)
        }

        if (typeof key === 'object') {
            Object.keys(key).forEach(k => {
                const v = key[k]
                this.attr(k, v)
            })
            return this
        }

        if (val === undefined) {
            return this.length > 0 && this.isElement() ? this[0].getAttribute(key) : ''
        }

        this.each(node => {
            node.setAttribute(key, val)
        })
        return this
    }

    /**
     * 移除元素节点属性
     * @param {String} key 属性名称
     * @return {DOMNode} 返当前实例
     */
    removeAttr(key) {
        this.each(node => {
            node.removeAttribute(key)
        })
        return this
    }

    /**
     * 判断元素节点是否包含某个 class 
     * @param {String} className 样式名称
     * @return {Boolean} 是否包含
     */
    hasClass(className) {
        if (this[0] && this[0].classList) {
            for (let i = 0; i < this[0].classList.length; i++) {
                if (this[0].classList[i] === className) {
                    return true
                }
            }
        }
        return false
    }

    /**
     * 为元素节点增加一个 class
     * @param {String} className 
     * @return {DOMNode} 返当前实例
     */
    addClass(className) {
        this.each(node => {
            node.classList.add(className)
        })
        return this
    }

    /**
     * 移除元素节点 class
     * @param {String} className 
     * @return {DOMNode} 返当前实例
     */
    removeClass(className) {
        this.each(node => {
            node.classList.remove(className)
        })
        return this
    }

    /**
     * 获取或设置元素节点样式
     * @param {String|undefined} key 样式名称
     * @param {String|undefined} val 样式值
     * @return {DOMNode|Map} 返回值或当前实例
     */
    style(key, val) {
        if (key === undefined) {
            // 没有参数，返回style所有属性
            return getStyleMap(this.attr('style') || '')
        }

        if (typeof key === 'object') {
            Object.keys(key).forEach(attr => {
                const value = key[attr]
                this.css(attr, value)
            })
            return this
        }

        // 获取style样式值
        if (val === undefined) {
            if (this.length === 0 || this.isText()) {
                return ''
            }

            return this[0].style[toCamelCase(key)] || getComputedStyle(this[0], key) || ''
        }

        this.each(node =>  {
            node.style[toCamelCase(key)] = val
        });
        return this
    }

    /**
     * 获取元素节点宽度
     * @return {Number} 宽度
     */
    width(){
        let width = this.css("width")
        if(width === "auto"){
            width = this[0].offsetWidth
        }
        return parseFloat(width) || 0
    }

    /**
     * 获取元素节点高度
     * @return {Number} 高度
     */
    height(){
        let height = this.css("height")
        if(height === "auto"){
            height = this[0].offsetHeight
        }
        return parseFloat(height) || 0
    }

    /**
     * 获取或设置元素节点html文本
     * @param {String|undefined} val html文本
     * @return {DOMNode|String} 当前实例或html文本
     */
    html(val) {
        if (val === undefined) {
            return this.length > 0 ? this[0].innerHTML : ''
        }

        this.each(node => {
            node.innerHTML = val
        })
        return this
    }

    /**
     * 获取元素节点文本
     * @return {String} 文本
     */
    text() {
        // 返回的数据包含 HTML 特殊字符，innerHTML 之前需要 escape
        // https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent
        return this.length > 0 ? this[0].textContent : ''
    }

    /**
     * 设置元素节点为显示状态
     * @param {String} display display值
     * @return {DOMNode} 当前实例
     */
    show(display) {
        if (display === undefined) {
            display = this.display || ''
        }

        if (display === 'none') {
            display = ''
        }

        if (this.css('display') !== 'none') {
            return this
        }

        return this.css('display', display)
    }

    /**
     * 设置元素节点为隐藏状态
     * @return {DOMNode} 当前实例
     */
    hide() {
        if (!this[0]) {
            return this
        }

        this.display = this[0].style.display
        return this.css('display', 'none')
    }

    /**
     * 移除当前实例所有元素节点
     * @return {DOMNode} 当前实例
     */
    remove() {
        this.each((node, index) => {
            if (!node.parentNode) {
                return
            }
            node.parentNode.removeChild(node)
            delete this[index]
        })
        this.length = 0
        return this
    }

    /**
     * 清空元素节点下的所有子节点
     * @return {DOMNode} 当前实例
     */
    empty() {
        this.each(node => {
            let child = node.firstChild
            while (child) {
                if (!node.parentNode) {
                    return
                }

                const next = child.nextSibling
                child.parentNode.removeChild(child)
                child = next
            }
        })
        return this
    }

    /**
     * 比较两个元素节点是否相同
     * @param {DOMNode|Node} node 比较的节点
     * @return {Boolean} 是否相同
     */
    equal(node){
        if (node.nodeType === Node.ELEMENT_NODE) {
            return this[0] === node
        } else {
            return this[0] === node[0]
        }
    }

    /**
     * 复制元素节点
     * @param {Boolean} deep 是否深度复制
     * @return {DOMNode} 复制后的元素节点
     */
    clone(deep) {
        const nodes = []
        this.each(node => {
            nodes.push(node.cloneNode(deep))
        })
        return new DOMNode(nodes)
    }

    /**
     * 在元素节点的开头插入指定内容
     * @param {DOMNode|Node|String} selector 选择器或元素节点
     * @return {DOMNode} 当前实例
     */
    prepend(selector) {
        this.each(node => {
            const nodes = DOMParse(selector, this.context)
            if (node.firstChild) {
                node.insertBefore(nodes[0], node.firstChild)
            } else {
                node.appendChild(nodes[0])
            }
        })
        return this
    }

    /**
     * 在元素节点的结尾插入指定内容
     * @param {DOMNode|Node|String} selector 选择器或元素节点
     * @return {DOMNode} 当前实例
     */
    append(selector) {
        this.each(node => {
            const nodes = DOMParse(selector, this.context)
            for (let i = 0; i < nodes.length; i++) {
                const child = nodes[i]
                if (typeof selector === 'string') {
                    node.appendChild(child.cloneNode(true))
                } else {
                    node.appendChild(child)
                }
            }
        })
        return this
    }

    /**
     * 在元素节点前插入内容
     * @param {DOMNode|Node|String} selector 选择器或元素节点
     * @return {DOMNode} 当前实例
     */
    before(selector) {
        this.each(node => {
            const nodes = DOMParse(selector, this.context)
            node.parentNode.insertBefore(nodes[0], node)
        })
        return this
    }

    /**
     * 在元素节点后插入内容
     * @param {DOMNode|Node|String} selector 选择器或元素节点
     * @return {DOMNode} 当前实例
     */
    after(selector) {
        this.each(node => {
            const nodes = DOMParse(selector, this.context)
            if (node.nextSibling) {
                node.parentNode.insertBefore(nodes[0], node.nextSibling)
            } else {
                node.parentNode.appendChild(nodes[0])
            }
        })
        return this
    }

    /**
     * 将元素节点替换为新的内容
     * @param {DOMNode|Node|String} selector 选择器或元素节点
     * @return {DOMNode} 当前实例
     */
    replaceWith(selector) {
        const newNodes = []
        this.each(node => {
            const nodes = DOMParse(selector, this.context)
            const newNode = nodes[0]
            node.parentNode.replaceChild(newNode, node)
            newNodes.push(newNode)
        })
        return new DOMNode(newNodes)
    }
}

export {
    DOMNode ,
    DOMEvent ,
    DOMParse ,
    toCamelCase , 
    getStyleMap ,
    getComputedStyle ,
    getAttrMap ,
    toHex
}

/**
 * @param {DOMNode|Node|String} selector 选择器或元素节点
 * @param {Node} context 节点上下文，或根节点
 * @return {DOMNode} DOMNode 实例
 */
export default ( selector, context ) => {
    const nodes = DOMParse( selector , context )
    return new DOMNode( nodes , context )
}
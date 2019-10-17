/**
 * 根据选择器转换为 NodeList
 */
export default ( selector , context ) => {
    // 默认将 document 作为根节点
    context = context || document
    if(!selector){
        return []
    }

    if (typeof selector === 'string') {
        //html 标签处理
        if(/<.+>/.test(selector)){
            const isTr = selector.indexOf('<tr') === 0
            const isTd = selector.indexOf('<td') === 0
            selector = selector.trim()
            /**
             * DOMParser 无法单独解析 tr、td 标签，需要补全 table 结构
             */
            if (isTr) {
                selector = "<table><tbody>".concat(selector, "</tbody></table>")
            }
    
            if (isTd) {
                selector = "<table><tbody><tr>".concat(selector, "</tr></tbody></table>")
            }
            // 解析返回一个 document 对象
            const { body } = new DOMParser().parseFromString(selector, 'text/html')
    
            if (isTr) {
                return body.querySelector('tbody').childNodes
            }
    
            if (isTd) {
                return body.querySelector('tr').childNodes
            }
            // 返回解析后的所有子级
            return body.childNodes
        }
        //默认根据选择器查询所有
        return context.querySelectorAll(selector)
    }
    //类型为 NodeList 直接返回
    if (selector.constructor === NodeList) {
        return selector
    }
    //类型为 DOMNode 类型
    if (selector.length !== undefined && selector.each) {
        const nodes = []
        selector.each(node => {
            nodes.push(node)
        })
        return nodes
    }
    // node 数组
    if (Array.isArray(selector)) {
        return selector
    } 
    // 片段
    if (selector.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
        const nodes = []
        let node = selector.firstChild
        while (node) {
            nodes.push(node)
            node = node.nextSibling
        }
    
        return nodes
    } 
    // 默认返回数组
    return [selector]
}
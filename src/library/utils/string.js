import getWindow from 'get-window'

export const toMap = (value, delimiter) => {
    delimiter = delimiter === undefined ? ',' : delimiter
    const map = {}
    const arr = Array.isArray(value) ? value : value.split(delimiter)
    let match
    Object.keys(arr).forEach(key => {
        const val = arr[key]
    
        if (match = /^(\d+)\.\.(\d+)$/.exec(val)) {
            for (let i = parseInt(match[1], 10); i <= parseInt(match[2], 10); i++) {
                map[i.toString()] = true
            }
        } else {
            map[val] = true
        }
    })
    return map
}

/**
 * 转换为驼峰命名法
 * @param {string} value 需要转换的字符串 
 * @param {upper,lower} type 转换类型，upper 大驼峰命名法，lower，小驼峰命名法（默认）
 */
export const toCamelCase = ( value , type ) => {
    type = type || "lower"
    return value.split('-').map(( str , index ) => {
        if(type === "upper" || (type === "lower" && index > 0)){
            return str.charAt(0).toUpperCase() + str.substr(1)
        }
        if(type === "lower" && index === 0){
            return str.charAt(0).toLowerCase() + str.substr(1)
        }
        return str
    }).join('')
}

/**
 * RGB 颜色转换为16进制颜色代码
 * @param {string} rgb 
 */
export const toHex = rgb => {
    const hex = num => {
        const char = parseInt(num, 10).toString(16).toUpperCase()
        return char.length > 1 ? char : '0' + char
    }

    const reg = /rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/gi
    return rgb.replace(reg, ($0, $1, $2, $3) => {
        return '#' + hex($1) + hex($2) + hex($3)
    })
}

/**
 * 将节点属性转换为 map 数据类型
 * @param {string} value 
 */
export const getAttrMap = value => {
    let map = {}
    const reg = /\s+(?:([\w\-:]+)|(?:([\w\-:]+)=([^\s"'<>]+))|(?:([\w\-:"]+)="([^"]*)")|(?:([\w\-:"]+)='([^']*)'))(?=(?:\s|\/|>)+)/g
    let match
  
    while (match = reg.exec(value)) {
        const key = (match[1] || match[2] || match[4] || match[6]).toLowerCase()
        const val = (match[2] ? match[3] : match[4] ? match[5] : match[7]) || ''
        map[key] = val
    }
  
    return map
}

/**
 * 将 style 样式转换为 map 数据类型
 * @param {string} style 
 */
export const getStyleMap = style => {
    style = style.replace(/&quot;/g, '"')
    let map = {}
    const reg = /\s*([\w\-]+)\s*:([^;]*)(;|$)/g
    let match
  
    while (match = reg.exec(style)) {
        const key = match[1].toLowerCase().trim()
        const val = toHex(match[2]).trim()
        map[key] = val
    }
  
    return map
}

/**
 * 使用window内置函数getComputedStyle获取节点style
 * @param {Node} node 
 * @param {string} attrName 
 */
export const getComputedStyle = (node, attrName) => {
    const win = getWindow(node)
    const camelKey = toCamelCase(attrName)
    const style = win.getComputedStyle(node, null)
    return style[camelKey]
}
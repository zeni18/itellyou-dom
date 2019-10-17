import React from 'react'
import styles from './index.less'

class CodeBlock extends React.Component {

    render(){
        const { children , editable } = this.props
        return (
            <div className={styles['codeblock-warp']} contentEditable={editable}>
                { children }
            </div>
        )
    }
}

CodeBlock.defaultProps = {
    editable:false
}
export default CodeBlock
import React from 'react'
import styles from './Index.less'
import { Button } from 'antd'

class Home extends React.Component {

    render(){
        return (
            <div className={styles["home"]}>
                <h2>ITELLYOU 文本绘图工具</h2>
                <p>使用代码可以生成 PlantUml、Graphviz、Mermaid、Flowchart、Latex 图形</p>
                <p><Button className={styles["github"]} type="link" href="https://github.com/itellyou-com/itellyou-drawing" target="_blank">GitHub</Button></p>
            </div>
        )
    }
}

export default Home
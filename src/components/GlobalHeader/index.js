import React from 'react'
import { Menu } from 'antd'
import classNames from 'classnames'
import Container from '../Container'
import styles from "./index.less"
import logo from "@/assets/logo.svg"

class GlobalHeader extends React.PureComponent {

    render(){
        const { onMenuClick } = this.props
        return (
            <header>
                <Container mode="full">
                    <Menu mode="horizontal" onClick={ onMenuClick }>
                        <Menu.Item key="logo" className={styles["logo"]}><a href="/"><img src={logo} alt="" /></a></Menu.Item>
                        <Menu.Item key="github" className={classNames(styles["logo"],styles["github"])}><a href="https://github.com/itellyou-com/itellyou-drawing" target="_blank">GitHub</a></Menu.Item>
                    </Menu>
                </Container>
            </header>   
        )
    }
}
export default GlobalHeader
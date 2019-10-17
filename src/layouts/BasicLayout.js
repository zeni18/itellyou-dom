import React from 'react'
import Header from './Header'
import Container from '@/components/Container'
import { Layout } from 'antd'
import Sider from './Sider'
const { Content } = Layout
class BasicLayout extends React.Component {

    render(){
        const { children } = this.props
        return (
            <Layout>
                <Header />
                <Layout>
                    <Sider />
                    <Layout style={{ marginLeft: 280 }}>
                        <Content
                        style={{
                            background: '#fff',
                            padding: 24,
                            margin: 0,
                            minHeight: "100%",
                        }}
                        >
                            <Container>{ children }</Container>
                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        )
    }
}
export default BasicLayout
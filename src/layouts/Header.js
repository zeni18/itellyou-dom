import React from 'react'
import GlobalHeader from '@/components/GlobalHeader'

class Header extends React.Component {

    render(){
        return (
            <GlobalHeader {...this.props} />
        )
    }
}

export default Header
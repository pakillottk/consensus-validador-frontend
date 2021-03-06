import React from 'react'
import { connect } from 'react-redux'
import API from '../../API/API'

import UIThemeable from '../ui/UIThemeable'
import Segment from '../ui/segment/Segment'
import Divider from '../ui/divider/Divider'
import Img from '../ui/img/Img'
import Logout from '../logout/Logout'

import RoleTranslator from '../../entities/roles/RoleTranslator'

class UserInfo extends React.Component {
    render() {
        const { me, theme } = this.props
        if( !me ) {
            return null
        }

        return(
            <div>
                <Segment styles={{padding: '10px'}}>
                    {me.company && <div>
                       <h4 style={{textAlign:'center'}}>{me.company.name}</h4> 

                        <div style={{display:'flex', justifyContent:'center', position:'relative', marginBottom:'2px'}}>
                            <Img src={API.getFullPath( me.company.logo_url )} size={'tiny'}/>
                            {me.role === 'admin' && <Img 
                                src={API.getFullPath( '/public/images/admin-over-icon.png' )} 
                                size={'micro'}
                                styles={{
                                    height:'30px',
                                    position:'absolute',
                                    right: 0,
                                    top: 0,
                                    transform: 'translateX(-50%) translateY(5px)'
                                }}
                            />}
                        </div>                        
                    </div>}

                    {me.role === 'superadmin' && <div>
                        <h4 style={{textAlign:'center'}}>SYS ADMIN</h4>
                        <div style={{display:'flex', justifyContent:'center'}}>
                            <Img src={API.getFullPath( '/public/images/admin-icon.png' )} size={'tiny'}/>
                        </div>

                        <Divider full />
                    </div>}

                    <h3 style={{textAlign: 'center'}}>USUARIO</h3>

                    <Segment styles={{ 
                        textAlign: 'center', 
                        background: theme.dark, 
                        color: theme.brightTextColor,
                        borderRadius: '10px 10px 0 0',
                        padding: '5px',
                        margin: 0
                    }}>
                        {me.username}
                    </Segment>
                    <Segment styles={{ 
                        textAlign: 'center', 
                        background: theme.thirdColor, 
                        color: theme.dark,
                        borderRadius: '0 0 10px 10px' 
                    }}>
                        {RoleTranslator(me.role)}
                    </Segment>
                </Segment>
                
                <Logout />
            </div>
        )
    }
}

UserInfo = UIThemeable( UserInfo )

export default connect( ( store ) => {
    return {
        me: store.auth.me
    }
})( UserInfo )
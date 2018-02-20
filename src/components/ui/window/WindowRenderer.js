import React from 'react'
import UIThemeable from '../UIThemeable'
import Segment from '../segment/Segment'

const styles = (theme) => {
    return {
        wrapper: {
            borderColor: theme.altBorderColor,
            borderWidth: '2px',
            borderStyle: 'solid'
        },
        handlersContainer: {
            float: 'right',
            marginLeft: theme.margin.medium,
        },
        theme
    }
}

class WindowRenderer extends React.Component {
    constructor( props ) {
        super( props )

        this.updatePosition = this.updatePosition.bind( this )
        this.disableMovement = this.disableMovement.bind( this ) 
    }

    componentDidUpdate() {
        const { window } = this.props
        if( window.moving ) {
            this.enableMouseEvents()
        } else {
            this.disableMouseEvents()
        }
    }

    componentWillUnmount() {
        this.disableMouseEvents();
    }

    enableMouseEvents() {
        document.addEventListener( 'mousemove', this.updatePosition )
        document.addEventListener( 'mousedown', this.disableMovement )
    }

    disableMouseEvents() {
        document.removeEventListener( 'mousemove', this.updatePosition )
        document.removeEventListener( 'mousdown', this.disableMovement )
    }

    updatePosition( e ) {
        e.preventDefault()

        const [ x, y ] = [ e.pageX, e.pageY ]
        const { window, manager } = this.props
        manager.updateWindow( window.id, { x, y } )
    }

    closeWindow() {
        const { window, manager } = this.props
        manager.removeWindow( window.id )
    }

    maximizeWindow() {
        const { window, manager } = this.props
        manager.updateWindow( window.id, { minimized: false } )
    }

    minimizeWindow() {
        const { window, manager } = this.props
        manager.updateWindow( window.id, { minimized: true } )
    }

    enableMovement() {
        const { window, manager } = this.props
        manager.updateWindow( window.id, { moving: true } )
    }

    disableMovement() {
        this.disableMouseEvents()

        const { window, manager } = this.props
        manager.updateWindow( window.id, { moving: false } )
    }

    renderHeader( title, style ) {
        const { window } = this.props

        return(
            <div>
                <div style={{
                    height: '10px', 
                    background: style.theme.dark,
                    cursor: 'move',
                   }}
                   onClick={() => this.enableMovement()}                
                ></div>
                <Segment secondary>
                    <h1>
                        {title} 
                        <span 
                            style={{...style.handlersContainer, color: style.theme.negative}}
                            className='pointer hovered-transparency'
                            onClick={() => this.closeWindow()}
                        >
                            [X]
                        </span>
                        {   
                            !window.minimized &&
                            <span 
                                style={{...style.handlersContainer, color: style.theme.relevant}}
                                className='pointer hovered-transparency'
                                onClick={() => this.minimizeWindow()}
                            >
                                [-]
                            </span>
                        }
                        {   
                            window.minimized &&
                            <span 
                                style={{...style.handlersContainer, color: style.theme.relevant}}
                                className='pointer hovered-transparency'
                                onClick={() => this.maximizeWindow()}
                            >
                                [+]
                            </span>
                        }
                    </h1>
                </Segment>
            </div>
        )
    }

    renderContent( content ) {
        return(
            <Segment>
                {content}
            </Segment>
        )
    }

    render() {
        const { window, manager, theme } = this.props
        const style = styles( theme )

        return(
            <div style={{
                position:'fixed', 
                left: window.x, 
                top: window.y, 
                zIndex: 9999,
                ...style.wrapper
            }}>
                { this.renderHeader( window.title, style ) }
                { !window.minimized && this.renderContent( window.content ) }
            </div>
        )
    }
}
export default UIThemeable( WindowRenderer )
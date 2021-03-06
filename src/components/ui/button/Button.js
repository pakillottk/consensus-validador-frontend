import React from 'react'

import UIThemeable from '../UIThemeable'

class Button extends React.Component {
    applyThemeStyles( size, context, full, disabled, theme ) {
        let fontSize = 1
        switch( size ) {
            case 'tiny': {
                fontSize = 0.5
                break;
            }
            case 'small': {
                fontSize = 0.7
                break;
            }
            case 'medium': {
                fontSize = 1
                break;
            }
            case 'big': {
                fontSize = 1.2
                break;
            }
            case 'large': {
                fontSize = 1.5
                break;
            }
            default: {
                fontSize = 1
                break;
            }
        }
        
        let color = theme.textColor
        let backgroundColor = theme.secondaryColor
        switch( context ) {
            case 'secondary': {
                backgroundColor = theme.primaryColor
                color = theme.secondaryTextColor
                break;
            }

            case 'possitive': {
                backgroundColor = theme.possitive
                color = theme.brightTextColor
                break;
            }

            case 'negative': {
                backgroundColor = theme.negative
                color = theme.brightTextColor
                break;
            }

            case 'relevant': {
                backgroundColor = theme.relevant
                color = theme.brightTextColor
                break;
            }

            case 'dark': {
                backgroundColor = theme.dark
                color = theme.brightTextColor
                break;
            }
            default: {
                color = theme.textColor
                backgroundColor = theme.secondaryColor 
                break;
            }
        }

        let fullStyle = {}
        if( full ) {
            fullStyle = {
                width: '100%'
            }
        }

        return {
            fontSize: fontSize + 'rem',
            fontStyle: 'bold',
            backgroundColor,
            outline: 'none',
            border: 'none',
            color,
            padding: theme.padding.hard,
            margin: theme.margin.light,
            cursor: 'pointer',
            opacity: disabled ? 0.35 : '1.0',
            pointerEvents: disabled ? 'none' : 'all',
            ...fullStyle
        }
    }

    render() {
        const { onClick, inline, size, type, context, full, theme, styles, disabled } = this.props
        const buttonStyles = this.applyThemeStyles( size, context, full, disabled, theme )
        return(
            <div style={{textAlign: 'center', display: inline ? 'inline-block' : 'block'}}>
                <button 
                    className="transition-all-short hovered-transparency" 
                    style={{...buttonStyles, ...styles}} 
                    type={type}
                    onClick={onClick}
                >
                    {this.props.children}
                </button>
            </div>
        )
    }
}

export default UIThemeable( Button )
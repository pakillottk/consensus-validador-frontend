import React from 'react';

import Segment from '../ui/segment/Segment'
import Form from '../ui/form/Form';
import Label from '../ui/form/Label/Label'
import Input from '../ui/form/Input/Input';
import Select from '../ui/form/Select/Select';
import Button from '../ui/button/Button'
import Tooltip from '../ui/tooltip/Tooltip'
import AutoComplete from '../autocomplete/AutoComplete'
import UIThemeable from '../ui/UIThemeable';

class FormBuilder extends React.Component {
    constructor( props ) {
        super( props );

        const labels = {};
        if( props.fields ) {
            props.fields.forEach( field => {
                labels[ field.name ] = field.label;
            })
        }

        this.state = {
            fields: props.fields || [],
            labels,
            values: props.initialvalues || {},
            changedValues: {},
            errors: {},
            editMode: props.initialvalues ? true : false
        }
        
        this.handleFieldChange = this.handleFieldChange.bind( this );
    }

    handleSubmit( event ) {
        event.preventDefault();

        let { errors } = this.state;
        //Validate the form
        if( this.props.validator ) {
            errors = this.props.validator.validate( this.state.values, this.state.editMode );
            this.setState({ errors });
        }

        //Submit only when no errors
        if( Object.keys( errors ).length === 0 ) {
            this.props.submit( this.state.changedValues, this.state.values );
            if( this.props.resetOnSubmit ) {
                this.setState({ values: this.props.initialvalues || {}, changedValues: {} })
            }
        }
    }

    getValue( field ) {
        let data = this.state.values[ field.name ]
        if( field.inputFormat ) {
            data = field.inputFormat( data )
        }

        return data
    }

    handleFieldChange( event ) {
        const values = {...this.state.values};
        if( event.target.files ) {
            values[ event.target.name ] = event.target.files[0];
        } else {
            values[ event.target.name ] = event.target.value;
        }

        const changedValues = {...this.state.changedValues};
        if( event.target.files ) {
            changedValues[ event.target.name ] = event.target.files[0];
        } else {
            changedValues[ event.target.name ] = event.target.value;
        }
        this.setState({ values, changedValues });
    }

    renderSelect( index, field, disabled ) {
        return(
            <Select 
                key={index} 
                disabled={disabled}
                name={ field.name } 
                value={this.getValue( field )} 
                options={ field.options }
                onChange={this.handleFieldChange}
            />
        );
    }

    renderInput( index, field, disabled, vertical ) {
        return(
            <Input
                key={ index }
                disabled={disabled}
                type={field.component} 
                name={ field.name } 
                value={ this.getValue( field ) } 
                onChange={this.handleFieldChange}
                full={!vertical}
            />
        );
    }

    renderAutoCompleteField( index, field, props, disabled, vertical )
    {
        return(
            <div key={index}>
                <AutoComplete                 
                    {...props}
                    full={!vertical}
                    // onChange={this.handleFieldChange}
                    initialValue={this.getValue(field)}   
                    disabled={disabled}
                    name={field.name}
                    itemSelected={(item, value) => {
                        if(item === null || item === undefined)
                        {
                            const values = {...this.state.values}
                            const changedValues = {...this.state.changedValues}
                            delete values[field.name]
                            delete changedValues[field.name]

                            this.setState({ values, changedValues })
                        }
                        else
                        {
                            this.handleFieldChange({target:{
                                name: field.name,
                                value: value
                            }})
                        }
                        if(this.props.autoCompleteConfirmed)
                        {
                            this.props.autoCompleteConfirmed(field, item)
                        }
                    }} 
                />
            </div>
        )
    }

    renderCustomField( index, field, Component, disabled ) {
        return(
            <div key={index}>
                {field.type === "file" && field.filePreview( this.props.initialvalues[ field.name ] )}
                <Component                    
                    disabled={disabled}
                    name={field.name}
                    value={ this.getValue( field ) } 
                    onChange={this.handleFieldChange}
                />
            </div>
        )
    }

    renderFields( fields, vertical ) {
        if( !fields ) {
            return null;
        }

        const disabled = this.props.disabled || {}

        const output = [];
        fields.forEach( ( field, index ) => {
            output.push( 
                <div key={fields.length + index} style={{display:'flex', justifyContent:'center'}}>
                    <Label>{ field.label }</Label> 
                    {field.tooltip && <Tooltip>{field.tooltip}</Tooltip>}
                </div>
            );

            if( field.type === 'input' ) {
                output.push(
                    this.renderInput( index, field, disabled[ field.name ], vertical )
                );
            } else if( field.type === 'select' ) {
                output.push(
                    this.renderSelect( index, field, disabled[ field.name ] )
                )
            } else if( field.type === 'autocomplete' ) {
                output.push( this.renderAutoCompleteField( index, field, field.props, disabled[ field.name ], vertical ) )
            } else {
                output.push( this.renderCustomField( index, field, field.component, disabled[ field.name ] ) );
            }
        });

        if( vertical ) {
            const verticalOutput = []
            for( let i = 0; i < output.length; i=i+8 ) {
                const currentFields = []
                for( let j = i; j < (i + 8); j++ ) {
                    currentFields.push( output[j] )
                }
                verticalOutput.push(
                    <div key={verticalOutput.length+1} style={{marginBottom:'5px', display: 'flex', flexWrap:'wrap', justifyContent: 'center'}}>
                        {currentFields}
                    </div>
                ) 
            }

            return verticalOutput
        }

        return output;
    }

    render() {
        const { labels, fields, errors } = this.state;
        const { vertical, extErrors, title, secondary, submitText, submitColor, multipart } = this.props;
        const allErrors = {...errors, ...extErrors };

        return(
            <div>
                <Segment secondary={!secondary}>
                    {title && <Segment secondary={secondary}>
                        <h2 className="center-aligned">{title}</h2>
                    </Segment>}
                    <Form multipart={multipart} onSubmit={this.handleSubmit.bind(this)}>
                        <div style={{color:'red'}}>
                            { Object.keys( allErrors ).map( ( key, index ) => <p key={index}>{labels[key] || ''}: {errors[key]} </p> ) }
                        </div>
                        
                        {this.renderFields( fields, vertical )}

                        <Button type="submit" context={submitColor || 'possitive'}>{submitText || "Submit"}</Button>
                    </Form>
               </Segment>
            </div>
        );
    }
}

export default UIThemeable( FormBuilder );
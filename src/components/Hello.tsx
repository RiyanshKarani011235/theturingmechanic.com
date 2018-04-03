import * as React from 'react';

export interface HelloProps {
    name: string;
}

export default class Hello extends React.Component<HelloProps, any> {
    state: {name: string};

    constructor(props: HelloProps) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        return (
            <div>
                <p>Hello World {this.state.name}</p>
                <input 
                    type='text' 
                    value={this.props.name} 
                    onChange={this.handleChange}
                />
            </div>
        )
    }

    /*
     * Whenever setState is called, the virtual DOM re-renders, 
     * the diff algorithm runs, and the real DOM is updated with 
     * the necessary changes.
     */
    handleChange(e) {
        this.setState({
            name: e.target.value
        })
    }
}
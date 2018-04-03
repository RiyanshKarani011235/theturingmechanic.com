import * as React from 'react';

export interface ShowListProps {
    elements: string[];
}

export default class ShowList extends React.Component<ShowListProps, any> {
    constructor(props: ShowListProps) {
        super(props);
    }

    render() {
        return (
            <ul>
                {this.props.elements.map((element, index) => <li key={index}>{element}</li>)}
            </ul>
        )
    }
}
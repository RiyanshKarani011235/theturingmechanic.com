import * as React from 'react';

export interface AddFriendProps {
    addFriendCallback: (friendName: string) => void;
}

export default class AddFriend extends React.Component<AddFriendProps, any> {
    state: {
        text: string
    }

    constructor(props) {
        super(props);

        this.state = {
            text: 'name'
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleOnClick = this.handleOnClick.bind(this);
    }

    render() {
        return (
            <div>
                <input 
                    type='text'
                    value={this.state.text}
                    onChange={this.handleChange}
                />
                <button onClick={this.handleOnClick}>Add Friend</button>
            </div>
        )
    }

    handleChange(e) {
        this.setState({
            text: e.target.value
        })
    }

    handleOnClick(e) {
        this.props.addFriendCallback(this.state.text);
    }

}
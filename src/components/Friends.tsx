import * as React from 'react';
import ShowList from './ShowList';
import AddFriend from './AddFriend';
import Plane2D from './Plane2D';

export type FriendsState = {
    name: string,
    friends: string[]
}


export default class Friends extends React.Component {
    state: FriendsState;

    constructor(props) {
        super(props);

        this.state = {
            name: 'ironstein',
            friends: ['ab', 'cd']
        }
    }

    render() {
        return (
            <div>
                <h3>Name: {this.state.name}</h3>
                <ShowList elements={this.state.friends}/>
                <AddFriend addFriendCallback={
                    (friendName: string) => {
                        console.log(this.state.friends);
                        this.setState((state: FriendsState) => ({
                            friends: state.friends.concat([friendName])
                        }))
                    }
                }/>
                <Plane2D/>

            </div>
        )
    }
}
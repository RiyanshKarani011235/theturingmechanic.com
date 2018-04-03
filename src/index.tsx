import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Hello from './components/Hello';
import Friends from './components/Friends';
import Plane2D from './components/Plane2D';


// Render the root component normally
ReactDOM.render(<Plane2D planeWidth={800}/>, document.getElementById('root'));
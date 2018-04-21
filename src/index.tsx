import * as React from 'react';
import * as ReactDOM from 'react-dom';
import InteractivePlane2D from './components/InteractivePlane2D';
import NonInteractivePlane2D from './components/NonInteractivePlane2D';

// Render the root component normally
ReactDOM.render(<NonInteractivePlane2D planeWidth={800}/>, document.getElementById('root'));
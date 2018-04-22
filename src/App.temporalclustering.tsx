import * as React from 'react';
import './App.css';
import {TemporalSampling} from './components/TemporalSampling';
import {Grid, Row, Col} from 'react-bootstrap';
import '../node_modules/bootstrap/dist/css/bootstrap.css';

import logo from './logo.svg';

const NUMBER_OF_CLUSTERS = 5;

class App extends React.Component {
  public render() {
    return (
      	<div className="App">
          

			<header className="App-header">
			<img src={logo} className="App-logo" alt="logo" />
			<h1 className="App-title">Welcome to React</h1>
			</header>
			<p className="App-intro">
			<code>Hello World!</code>
			</p>

			<Grid width='100%'>
				<Row width='100%'>
					<Col md={4} lg={3}></Col>
					<Col md={4} lg={6}>
						<TemporalSampling numberOfLevels={NUMBER_OF_CLUSTERS}/>
					</Col>
					<Col md={4} lg={3}></Col>
				</Row>
			</Grid>
      	</div>
    );
  }
}

export default App;

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import InteractivePlane2D from './components/InteractivePlane2D';
import NonInteractivePlane2D from './components/NonInteractivePlane2D';
import {Grid, Row, Col} from 'react-bootstrap';

let App = () => {
    return (
        <Grid>
            <Row>
                <Col md={4}></Col>
                <Col md={8}>
                    <NonInteractivePlane2D planeWidth={300}/>
                </Col>
                <Col md={4}></Col>
            </Row>
        </Grid>
    )
}

// Render the root component normally
ReactDOM.render(App(), document.getElementById('root'));
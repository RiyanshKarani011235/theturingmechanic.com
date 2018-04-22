import * as React from 'react';
// import * as d3 from 'd3';
import {Plane1D} from './Plane1D';
import { Row, Checkbox, Col, Grid } from 'react-bootstrap';
import Measure, { MeasuredComponentProps } from 'react-measure';

export interface ITemporalSamplingProps {
    numberOfLevels: number,
    distanceBetweenLevels?: number,
    levelHeight?: number
}

export interface ITemporalSamplingState {
    points: {[id: string]: {x: number, y: number}}[],
    width: number
}

export class TemporalSampling extends React.Component<ITemporalSamplingProps, ITemporalSamplingState> {

    static defaultProps = {
        distanceBetweenLevels: 40,
        levelHeight: 60
    }

    constructor(props: ITemporalSamplingProps) {
        super(props);

        // set state
        let points = [];
        for (let i=0; i<this.props.numberOfLevels; i++) points.push({});
        this.state = {
            points: points,
            width: 0
        }
    }

    /*
     * REACT LIFECYCLE METHODS
     */

    render() {
        return (
            <div>
                <Measure
                    bounds
                    onResize={(contentRect) => {
                        this.setState({width: (contentRect as {bounds: {width: number}}).bounds.width})
                    }}
                >
                    {(({measureRef}) => {
                        return (
                            <div ref={measureRef}>
                                <svg width={'100%'} />
                            </div>
                        )
                    }) as React.StatelessComponent<MeasuredComponentProps>}
                </Measure>

                <svg
                    width={'100%'}
                    height={((this.props.levelHeight as number) + (this.props.distanceBetweenLevels as number)) * this.props.numberOfLevels - (this.props.distanceBetweenLevels as number)}
                >
                    {
                        (() => {
                            let sampleIds = [];
                            for(let i=0; i<this.props.numberOfLevels; i++) sampleIds.push(i);
                            return sampleIds.map((id: number) => {
                                return <Plane1D
                                    width={this.state.width}
                                    height={this.props.levelHeight as number}
                                    x={0}
                                    y={((this.props.levelHeight as number) + (this.props.distanceBetweenLevels as number)) * id}
                                    key={id}
                                    onPointsUpdated={(points: {[id: string]: {x: number, y: number}}) => {
                                        this.onPointsUpdated(id, points);
                                    }}
                                />
                            }
                        )})()
                    })}
                </svg>
                <br/><br/><br/>
                <Grid>
                <Row>
                    <Col md={2}><Checkbox/></Col>
                    <Col md={4}><p>Show 2R-Net</p></Col>
                </Row>
                </Grid>
            </div>
        )
    }

    /*
     * CLASS METHODS
     */

    onPointsUpdated(id: number, points: {[id: string]: {x: number, y: number}}): void {
        this.setState((prevState: ITemporalSamplingState, props: ITemporalSamplingProps) => {
            prevState.points[id] = points;
            return {points: prevState.points};
        })
    }
}

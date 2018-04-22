import * as React from 'react';
// import * as d3 from 'd3';
import {TemporalSample} from './TemporalSample';
import { Row, Checkbox, Grid, Col } from 'react-bootstrap';

export interface ITemporalSamplingProps {
    numberOfLevels: number,
    distanceBetweenLevels?: number,
    levelHeight?: number
}

export interface ITemporalSamplingState {
    points: {[id: string]: {x: number, y: number}}[],
    show2Rnet: boolean,
    r: number
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
            show2Rnet: false,
            r: 0
        }
    }

    /*
     * REACT LIFECYCLE METHODS
     */

    render() {
        return (
            <div>
                <svg
                    width={'100%'}
                    height={((this.props.levelHeight as number) + (this.props.distanceBetweenLevels as number)) * this.props.numberOfLevels - (this.props.distanceBetweenLevels as number)}
                >
                    {
                        (() => {
                            let sampleIds = [];
                            for(let i=0; i<this.props.numberOfLevels; i++) sampleIds.push(i);
                            return sampleIds.map((id: number) => {
                                return <TemporalSample
                                    r={this.state.r}
                                    show2RNet={this.state.show2Rnet}
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
                    <Checkbox
                       onChange={e => {
                            this.setState((prevState: ITemporalSamplingState, props: ITemporalSamplingProps) => {
                                return {show2Rnet: !prevState.show2Rnet}
                            })
                       }}
                    />
                    <Col md={1}/>
                    <p>Show 2R-net</p>
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

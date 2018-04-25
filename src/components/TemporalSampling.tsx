import * as React from 'react';
// import * as d3 from 'd3';
import { Row, Checkbox, Grid, Col } from 'react-bootstrap';
import Slider from 'rc-slider';
import {InlineMath} from 'react-katex';
import * as uniqud from 'uniqid';
import 'rc-slider/assets/index.css';
import 'katex/dist/katex.min.css';
import '../css/TemporalSampling.css';

import {TemporalSample} from './TemporalSample';
import {GraphVertex, GraphEdge, DirectedGraph} from '../dataStructures/Graph';

export interface ITemporalSamplingProps {
    numberOfLevels: number,
    distanceBetweenLevels?: number,
    levelHeight?: number
}

export interface ITemporalSamplingState {
    points_: {[id: string]: {x: number, y: number}}[],
    twoRNets: {id: string, x: number, y: number}[][],
    show2Rnet: boolean,
    showGraph: boolean,
    networkGraph: DirectedGraph,
    r: number,
    k: number,
    delta: number,
    maxRadius: number
}

class TemporalNetworkVertex extends GraphVertex {
    x: number;
    y: number;

    constructor(id: string, x: number, y: number) {
        super(id);
        this.x = x;
        this.y = y;
    }
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
        let twoRNets = [];
        for (let i=0; i<this.props.numberOfLevels; i++) {
            points.push({})
            twoRNets.push([])
        }
        this.state = {
            points_: points,
            twoRNets: twoRNets,
            networkGraph: new DirectedGraph(),
            show2Rnet: false,
            showGraph: false,
            r: 0,
            k: 0,
            delta: 0,
            maxRadius: 100
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
                                    twoRNet={this.state.twoRNets[id]}
                                    height={this.props.levelHeight as number}
                                    x={0}
                                    y={((this.props.levelHeight as number) + (this.props.distanceBetweenLevels as number)) * id}
                                    key={id}
                                    onPointsUpdated={(points: {[id: string]: {x: number, y: number}}) => {
                                        this.onPointsUpdated(id, points);
                                    }}
                                    onWidthUpdated={(width: number) => {
                                        console.log('onWidthUpdated: ' + width);
                                        this.setState({maxRadius: width});
                                    }}
                                />
                            }
                        )})()
                    })}
                    {
                        (() => {
                            if (!this.state.showGraph) return;   // don't show graph

                            let returnValue = [];

                            for (let i=0; i<this.props.numberOfLevels - 1; i++) {
                                let level1 = this.state.points_[i];
                                let level2 = this.state.points_[i+1];
                                let level1Points = Object.keys
                                (level1).map((id: string) => {
                                    let point_ = level1[id];
                                    return {id: id, x: point_.x, y: point_.y}
                                });


                                let level2Points = Object.keys
                                (level2).map((id: string) => {
                                    let point_ = level2[id];
                                    return {id: id, x: point_.x, y: point_.y}
                                });

                                for (let level1Point of level1Points) {
                                    for (let level2Point of level2Points) {
                                         if (Math.abs(level1Point.x - level2Point.x) <= this.state.r + this.state.delta) {
                                            returnValue.push(
                                                <line
                                                    x1={level1Point.x}
                                                    x2={level2Point.x}
                                                    y1={((this.props.levelHeight as number) + (this.props.distanceBetweenLevels as number)) * i + level1Point.y}
                                                    y2={((this.props.levelHeight as number) + (this.props.distanceBetweenLevels as number)) * (i+1) + level2Point.y}
                                                    key={level1Point.id + '-' + level2Point.id}
                                                    stroke='black'
                                                    strokeWidth='1px'
                                                />
                                            )
                                        }
                                    }
                                }
                            }
                            
                            return <svg>{returnValue}</svg>;
                        })()
                    }
                </svg>
                <br/><br/><br/>
                <Grid>
                <Row>
                    <Col md={6}>
                        <Row>
                            <Checkbox
                            onChange={e => {
                                this.onShowTwoRNetUpdated();
                            }}
                            />
                            <Col md={1}/>
                            <p>Show 2R-net</p>
                            <Col md={1}/>
                        </Row>

                        <Row>
                            <Checkbox
                            onChange={e => {
                                    this.setState((prevState: ITemporalSamplingState, props: ITemporalSamplingProps) => {
                                        return {showGraph: !prevState.showGraph}
                                    })
                            }}
                            />
                            <Col md={1}/>
                            <p>Show Graph</p>
                            <Col md={1}/>
                        </Row>
                    </Col>

                    <Col md={6}>

                        <Row>
                            <Slider 
                                className='rslider'
                                min={0}
                                max={100}
                                onChange={(k: number) => {
                                    this.setState({k: k})
                                }}
                            />
                            <Col md={1}/>
                            <p>{'k = ' + this.state.k}</p>
                        </Row>

                        <Row>
                            <Slider 
                                className='rslider'
                                min={0}
                                max={this.state.maxRadius}
                                onChange={(r: number) => {
                                    this.onRadiusUpdated(r);
                                }}
                            />
                            <Col md={1}/>
                            <p>{'r = ' + this.state.r}</p>
                        </Row>

                        <Row>
                            <Slider 
                                className='rslider'
                                min={0}
                                max={100}
                                onChange={(delta: number) => {
                                    this.setState({delta: delta})
                                }}
                            />
                            <Col md={1}/>
                            <p><InlineMath>\delta</InlineMath>{' = ' + this.state.delta}</p>
                        </Row>
                        
                    </Col>

                </Row>
                </Grid>
            </div>
        )
    }

    /*
     * CLASS METHODS
     */

    onPointsUpdated(id: number, points: {[id: string]: {x: number, y: number}}): void {
        this.setState((prevState: ITemporalSamplingState, props: ITemporalSamplingProps): {} => {
            prevState.points_[id] = points;
            return {points_: prevState.points_};
        })

        if (this.state.show2Rnet) {
            this.updateTwoRNet();
        }
    }

    onRadiusUpdated(r: number) {
        this.setState({r: r});
        this.updateTwoRNet();
    }

    onShowTwoRNetUpdated() {
        this.updateTwoRNet();
        this.setState({show2Rnet: !this.state.show2Rnet});
        this.updateNetworkGraph();
        console.log(this.state.networkGraph);
    }

    updateTwoRNet() {
        if (this.state.show2Rnet) {
            this.setState((prevState: ITemporalSamplingState, props: ITemporalSamplingProps) => {
                if (this.state.show2Rnet) {
                    let newTwoRNets: {id: string, x: number, y: number}[][] = [];
                    for (let i=0; i<this.props.numberOfLevels; i++) {
                        newTwoRNets.push(this.computeTwoRNet(prevState.points_[i], this.state.r));
                    }
                    prevState.twoRNets = newTwoRNets;
                }
                return {twoRNets: prevState.twoRNets};
            });
        }
    }

    updateNetworkGraph() {
        let newGraph = new DirectedGraph();
        let sourceVertex = new TemporalNetworkVertex(uniqud(), 0, 0);
        let sinkVertex = new TemporalNetworkVertex(uniqud(), 0, 0);
        newGraph.addVertex(sourceVertex);
        newGraph.addVertex(sinkVertex);

        for (let i=0; i<this.props.numberOfLevels - 1; i++) {
            let level1 = this.state.points_[i];
            let level2 = this.state.points_[i+1];

            let level1IncomingVertices: TemporalNetworkVertex[] = [];
            let level1OutgoingVertices: TemporalNetworkVertex[] = [];
            let level2IncomingVertices: TemporalNetworkVertex[] = [];
            let level2OutgoingVertices: TemporalNetworkVertex[] = [];
            let level1TwoRNet: {id: string, x: number, y: number}[] = this.state.twoRNets[i];
            let level2TwoRNet: {id: string, x: number, y: number}[] = this.state.twoRNets[i+1];

            // level 1 vertices
            let currentCenterIndex = 0;
            Object.keys(level1)
            .map((id: string) => {
                let point = level1[id];
                let incomingVertex = new TemporalNetworkVertex(id + ':inc', point.x, point.y);
                let outgoingVertex = new TemporalNetworkVertex(id + ':out', point.x, point.y);
                level1IncomingVertices.push(incomingVertex);
                level1OutgoingVertices.push(outgoingVertex);
                if (i === 0) {
                    newGraph.addVertex(incomingVertex);
                    newGraph.addVertex(outgoingVertex);
                    if (currentCenterIndex < level1TwoRNet.length  && level1TwoRNet[currentCenterIndex].id === id) {
                        currentCenterIndex++;
                        newGraph.addEdge(new GraphEdge(outgoingVertex, incomingVertex, 1, Infinity));
                    } else newGraph.addEdge(new GraphEdge(outgoingVertex, incomingVertex, 0, Infinity));
                }
            });

            // level 2 vertices
            currentCenterIndex = 0;
            Object.keys(level2)
            .map((id: string) => {
                let point = level2[id];
                let incomingVertex = new TemporalNetworkVertex(id + ':inc', point.x, point.y);
                let outgoingVertex = new TemporalNetworkVertex(id + ':out', point.x, point.y);
                level2IncomingVertices.push(incomingVertex);
                level2OutgoingVertices.push(outgoingVertex);
                newGraph.addVertex(incomingVertex);
                newGraph.addVertex(outgoingVertex);
                if (currentCenterIndex < level2TwoRNet.length && level2TwoRNet[currentCenterIndex].id === id) {
                    currentCenterIndex++;
                    newGraph.addEdge(new GraphEdge(outgoingVertex, incomingVertex, 1, Infinity));
                } else newGraph.addEdge(new GraphEdge(outgoingVertex, incomingVertex, 0, Infinity));
            });

            // connect source to level1 incoming vertices
            if (i === 0) {
                // add vertex from source to all vertices of level 1
                let vertex: TemporalNetworkVertex;
                for (vertex of level1OutgoingVertices) {
                    newGraph.addEdge(new GraphEdge(sourceVertex, vertex, 0, Infinity));
                }
            }

            // connect level2 outgoing vertices to sink
            if (i === this.props.numberOfLevels - 2) {
                let vertex: TemporalNetworkVertex;
                for (vertex of level2IncomingVertices) {
                    newGraph.addEdge(new GraphEdge(vertex, sinkVertex, 0, Infinity));
                }
            }
            
            for (let level1OutgoingVertex of level1OutgoingVertices) {
                for (let level2IncomingVertex of level2IncomingVertices) {
                    if (Math.abs(level1OutgoingVertex.x - level2IncomingVertex.x) <= this.state.r + this.state.delta) {
                        newGraph.addEdge(new GraphEdge(level1OutgoingVertex, level2IncomingVertex, 0, Infinity));
                    }
                }
            }
        }
        this.setState({networkGraph: newGraph});
    }

    computeTwoRNet(points: {[id: string]: {x: number, y: number}}, r: number): {id: string, x: number, y: number}[] {
        r *= 2;
        let hashTable = {};
        interface Result {
            value: number,
            solution: {id: string, x: number, y: number}[]
        }

        let recurse = function(points: {id: string, x: number, y: number}[], r: number): Result {
            // base case
            if (points.length === 0 || points.length === 1) return {value: points.length, solution:points};

            let hashString = '';
            let point: {id: string, x: number, y: number};
            for (point of points) hashString += point.x + '-';
            if (hashTable[hashString]) /* already computed */ return hashTable[hashString];

            // not computed yet
            let currentPoint = points.pop() as {id: string, x: number, y: number};
            let res1: Result = recurse(points.concat(), r); // don't add this vertex to the r-net
            
            let points_ = [];
            for (let i=0; i<points.length; i++) {
                if (points[i].x - currentPoint.x <= r) break;
                points_.push(points[i]);
            }
            points_.sort((a: {x: number, y: number}, b: {x: number, y: number}) => {
                return b.x - a.x;
            })
            let res2: Result = recurse(points_, r); // add this vertex to the r-net

            let max = Math.max(res1.value, res2.value + 1);

            let returnValue: Result;
            if (max === res1.value) returnValue = res1;
            else returnValue = {value: res2.value + 1, solution: res2.solution.concat([currentPoint])};
            hashTable[hashString] = returnValue;
            return returnValue;
        } 

        let twoRNet = recurse(
            Object.keys(points)
            .map((id: string): {id: string, x: number, y: number} => {
                let point = points[id];
                return {id: id, x: point.x, y: point.y};
            })
            .concat()
            .sort((a: {x: number, y: number}, b: {x: number, y: number}): number => {
            return b.x - a.x;
        }), r)
        .solution
        .sort((a: {x: number, y: number}, b: {x: number, y: number}): number => {
            return b.x - a.x;
        })
        .reverse();

        return twoRNet;
    }
}
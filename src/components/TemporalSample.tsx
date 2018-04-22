import * as React from 'react';
import {Plane1D} from './Plane1D';
import {IPlaneState, IPlaneProps, getInitialState as getInitialPlaneState} from './Plane';
import {Point} from './Point';

export interface ITemporalSampleState extends IPlaneState {
    show2RNet: boolean,
    twoRNet: {id: string, x: number, y: number}[],
    r: number
}

export interface ITemporalSampleProps extends IPlaneProps {
    show2RNet: boolean,
    r: number
}

export class TemporalSample extends Plane1D<ITemporalSampleProps, ITemporalSampleState> {

    getInitialState(): ITemporalSampleState {
        let state = getInitialPlaneState();
        return {
            points: state.points,
            width: state.width,
            twoRNet: [],
            show2RNet: this.props.show2RNet,
            r: this.props.r
        }
    }

    static getDerivedStateFromProps(nextProps: ITemporalSampleProps, prevState: ITemporalSampleState) {
        let returnState = {};
        if (nextProps.show2RNet !== prevState.show2RNet) {
            returnState['show2RNet'] = nextProps.show2RNet;
        }
        if (nextProps.r != prevState.r) returnState['r'] = nextProps.r;
        return returnState;
    }

    computeRNet(r: number): {x: number, y: number}[] {
        let hashTable = {};
        interface Result {
            value: number,
            solution: {x: number, y: number}[]
        }

        let recurse = function(vertexSet: {x: number, y: number}[], r: number): Result {
            // base case
            if (vertexSet.length === 0 || vertexSet.length === 1) return {value: vertexSet.length, solution:vertexSet};

            let hashString = '';
            let vertex: {x: number, y: number};
            for (vertex of vertexSet) hashString += vertex.x + '-';
            if (hashTable[hashString]) /* already computed */ return hashTable[hashString];

            // not computed yet
            let currentVertex = vertexSet.pop() as {x: number, y: number};
            let res1: Result = recurse(vertexSet.concat(), r); // don't add this vertex to the r-net
            
            let vertexSet_ = [];
            for (let i=0; i<vertexSet.length; i++) {
                if (vertexSet[i].x - currentVertex.x <= r) break;
                vertexSet_.push(vertexSet[i]);
            }
            vertexSet_.sort((a: {x: number, y: number}, b: {x: number, y: number}) => {
                return b.x - a.x;
            })
            let res2: Result = recurse(vertexSet_, r); // add this vertex to the r-net

            let max = Math.max(res1.value, res2.value + 1);

            let returnValue: Result;
            if (max === res1.value) returnValue = res1;
            else returnValue = {value: res2.value + 1, solution: res2.solution.concat([currentVertex])};
            hashTable[hashString] = returnValue;
            return returnValue;
        } 

        return recurse(
            Object.keys(this.state.points)
            .map((id: string): {x: number, y: number} => {
                return this.state.points[id];
            })
            .concat()
            .sort((a: {x: number, y: number}, b: {x: number, y: number}): number => {
            return b.x - a.x;
        }), r).solution
        .sort((a: {x: number, y: number}, b: {x: number, y: number}): number => {
            return b.x - a.x;
        })
        .reverse();
    }

    getRenderedPoints() {
        if (!this.state.show2RNet) return super.getRenderedPoints();
        return (
            <svg>
                {(() => {
                    let currentCenterIndex: number = 0;
                    return Object.keys(this.state.points).map((id: string) => {
                        let point = this.state.points[id];
                        return {
                            id: id,
                            x: point.x,
                            y: point.y
                        }
                    })
                    .sort((a: {x: number, y: number}, b: {x: number, y: number}) => {
                        return b.x - a.x;
                    })
                    .map((point: {id: string, x: number, y: number}) => {
                        if (this.state.twoRNet[currentCenterIndex].id === point.id) {

                        } else {
                            return (() => {
                                Object.keys(this.state.points).map((key: string, index: number) => {
                                    const point: {x: number, y: number} = this.state.points[key];
                                    return <Point
                                        id={key}
                                        cx={point.x}
                                        cy={point.y}
                                        onPointDragStart={this.onPointDragStart}
                                        onPointDragEnd={this.onPointDragEnd}
                                        onPointDrag={this.onPointDrag}
                                        onPointClick={this.onPointClick}
                                        key={key}
                                    />
                                })
                            })()
                        }
                    })
                })()}
            </svg>
        )
    }
}
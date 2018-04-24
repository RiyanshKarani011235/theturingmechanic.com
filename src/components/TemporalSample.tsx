import * as React from 'react';
import {Plane1D} from './Plane1D';
import {IPlaneState, IPlaneProps, getInitialState as getInitialPlaneState} from './Plane';
import {Point} from './Point';

export interface ITemporalSampleState extends IPlaneState {
    show2RNet: boolean,
    r: number
}

export interface ITemporalSampleProps extends IPlaneProps {
    show2RNet: boolean,
    r: number,
    centerColor?: string
}

export class TemporalSample extends Plane1D<ITemporalSampleProps, ITemporalSampleState> {

    getInitialState(): ITemporalSampleState {
        let state = getInitialPlaneState();
        return {
            points: state.points,
            width: state.width,
            show2RNet: this.props.show2RNet,
            r: this.props.r
        }
    }

    static defaultProps = {
        background_color: 'rgb(255, 255, 200)',
        onPointsUpdated: () => {},
        x: 0,
        y: 0,
        padding: 10,
        centerColor: 'black'
    }

    static getDerivedStateFromProps(nextProps: ITemporalSampleProps, prevState: ITemporalSampleState) {
        let returnState = {};
        if (nextProps.show2RNet !== prevState.show2RNet) {
            returnState['show2RNet'] = nextProps.show2RNet;
        }
        if (nextProps.r != prevState.r) {
            console.log('changing radius');
            returnState['r'] = nextProps.r
        };
        return returnState;
    }

    computeRNet(r: number): {id: string, x: number, y: number}[] {
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

        return recurse(
            Object.keys(this.state.points)
            .map((id: string): {id: string, x: number, y: number} => {
                let point = this.state.points[id];
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
    }

    getRenderedPoints() {
        if (!this.state.show2RNet) return super.getRenderedPoints();

        let twoRNet = this.computeRNet(this.state.r * 2);
        console.log(twoRNet);
        return (
            <svg>
                {(() => {
                    let currentCenterIndex: number = 0;
                    let a = Object.keys(this.state.points)
                    .concat()
                    .map((id: string) => {
                        let point = this.state.points[id];
                        return {
                            id: id,
                            x: point.x,
                            y: point.y
                        }
                    })
                    .sort((a: {x: number, y: number}, b: {x: number, y: number}) => {
                        return a.x - b.x;
                    })
                    .concat();

                    return a.map((point: {id: string, x: number, y: number}) => {
                        console.log(currentCenterIndex);
                        console.log(point);
                        if ((currentCenterIndex < twoRNet.length) &&  twoRNet[currentCenterIndex].id === point.id) {
                            currentCenterIndex++;
                            return <Point
                                id={point.id}
                                cx={point.x}
                                cy={point.y}
                                onPointDragStart={this.onPointDragStart}
                                onPointDragEnd={this.onPointDragEnd}
                                onPointDrag={this.onPointDrag}
                                onPointClick={this.onPointClick}
                                key={point.id}
                                mouseOutColor={this.props.centerColor}
                            />
                        } else {
                            return <Point
                                id={point.id}
                                cx={point.x}
                                cy={point.y}
                                onPointDragStart={this.onPointDragStart}
                                onPointDragEnd={this.onPointDragEnd}
                                onPointDrag={this.onPointDrag}
                                onPointClick={this.onPointClick}
                                key={point.id}
                            />
                        }
                    })
                })()}
            </svg>
        )
    }
}
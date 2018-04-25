import * as React from 'react';
import {Plane1D} from './Plane1D';
import {IPlaneState, IPlaneProps, getInitialState as getInitialPlaneState} from './Plane';
import {Point} from './Point';

export interface ITemporalSampleState extends IPlaneState {
    show2RNet: boolean,
    r: number,
    twoRNet: {id: string, x: number, y: number}[]
}

export interface ITemporalSampleProps extends IPlaneProps {
    show2RNet: boolean,
    r: number,
    centerColor?: string,
    twoRNet: {id: string, x: number, y: number}[],
}

export class TemporalSample extends Plane1D<ITemporalSampleProps, ITemporalSampleState> {

    getInitialState(): ITemporalSampleState {
        let state = getInitialPlaneState();
        return {
            points: state.points,
            width: state.width,
            show2RNet: this.props.show2RNet,
            r: this.props.r,
            twoRNet: []
        }
    }

    static defaultProps = {
        background_color: 'rgb(255, 255, 200)',
        onPointsUpdated: () => {},
        x: 0,
        y: 0,
        padding: 10,
        centerColor: 'black',
        onWidthUpdated: () => {},
        onTwoRNetUpdated: () => {}
    }

    static getDerivedStateFromProps(nextProps: ITemporalSampleProps, prevState: ITemporalSampleState) {
        let returnState = {}
        if (nextProps.show2RNet !== prevState.show2RNet) {
            returnState['show2RNet'] = nextProps.show2RNet;
        }
        if (nextProps.r != prevState.r) {
            console.log('changing radius');
            returnState['r'] = nextProps.r
        };
        returnState['twoRNet'] = nextProps.twoRNet;
        return returnState;
    }

    getRenderedPoints() {
        if (!this.state.show2RNet) return super.getRenderedPoints();

        let twoRNet = this.state.twoRNet;

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
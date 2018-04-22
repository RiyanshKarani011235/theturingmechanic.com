import * as d3 from 'd3';
import * as React from 'react';
import * as uniqud from 'uniqid';
import Measure, { MeasuredComponentProps } from 'react-measure';

import {Point} from './Point';

// import css
import '../css/Plane.css';

export interface IPlaneProps {
    height: number,
    background_color?: string,
    onPointsUpdated?: (points: {[id: string]: {x: number, y: number}}) => void,
    x?: number,
    y?: number,
    padding?: number
}

export interface IPlaneState {
    points: {[id: string]: {x: number, y: number}},
    width: number
}

export class Plane extends React.Component<IPlaneProps, IPlaneState> {
    private svgNode: SVGElement;
    private dragId: string | null;

    static defaultProps = {
        background_color: 'rgb(255, 255, 200)',
        onPointsUpdated: () => {},
        x: 0,
        y: 0,
        padding: 10,
    }

    constructor(props: IPlaneProps) {
        super(props);

        // initialize state
        this.state = {
            points: {},
            width: 0
        }

        // initialize instance variables
        this.dragId = null;

        // bind
        this.onPointDragStart = this.onPointDragStart.bind(this);
        this.onPointDragEnd = this.onPointDragEnd.bind(this);
        this.onPointDrag = this.onPointDrag.bind(this);
        this.onPointClick = this.onPointClick.bind(this);
        this.onClick = this.onClick.bind(this);

    }

    /*
     * REACT LIFECYCLE METHODS
     */

    public render() {
        return (
            <svg
                width={'100%'}
                height={this.props.height}
                x={this.props.x}
                y={this.props.y}
                background-color={this.props.background_color}
                ref={node => this.svgNode = (node as SVGElement)}
                className='plane'
            >
                <Measure
                    bounds
                    onResize={(contentRect) => {
                        this.updateWidth((contentRect as {bounds: {width: number}}).bounds.width);
                    }}
                >
                    {(({measureRef}) => {
                        return (
                            <svg 
                                ref={measureRef}
                                width={'100%'}
                            >
                                <rect
                                    width={'100%'}
                                    height={this.props.height}
                                    opacity={0}
                                />
                            </svg>
                        )
                    }) as React.StatelessComponent<MeasuredComponentProps>}
                </Measure>

                <rect
                    className='plane'
                    width={'100%'}
                    height={this.props.height}
                />

                {
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
                }
            </svg>
        )
    }

    public componentDidMount() {
        const svgDrag = d3.drag()
        // when dragging over svg while nothing else selected,
        // do not propagate this event to so that point not added
        // when drag ends
        .on('drag', () => {});

        d3
        .select(this.getSvgNode())
        .on('click', () => {
            this.onClick();
        })
        .call(svgDrag as d3.DragBehavior<SVGElement, {}, {}>);
    }

    /*
     * CALLBACKS
     */ 

    public onClick() {
        let coordinates = d3.mouse(this.getSvgNode() as d3.ContainerElement);
        this.addPoint(coordinates[0], coordinates[1]);
    }

    /*
     * POINT CALLBACKS
     */

    public onPointDragStart(id: string) {
        if (!this.dragId) this.dragId = id;
    }

    public onPointDragEnd(id: string) {
        if (this.dragId === id) this.dragId = null;
    }

    public onPointDrag(id: string) {
        if (this.dragId === id) this.updatePointCoordinates(id, d3.event.x, d3.event.y);
    }

    private onPointClick(id: string) {
        this.removePoint(id);
        d3.event.stopPropagation();
    }

    /*
     * CLASS METHODS
     */

    public addPoint(x: number, y: number) {
        this.setState((prevState: IPlaneState, props: IPlaneProps) => {
            prevState.points[uniqud()] = {x: x, y: y};
            (this.props.onPointsUpdated as (ponits: any) => {})(prevState.points);
            return {
                points: prevState.points
            }
        })
    }

    public removePoint(id: string) {
        this.setState((prevState: IPlaneState, props: IPlaneProps) => {
            delete prevState.points[id];
            (this.props.onPointsUpdated as (points: any) => {})(prevState.points);
            return {
                points: prevState.points
            }
        })
    } 

    public updatePointCoordinates(id: string, x: number, y: number) {
        // boundary conditions
        x = x < (this.props.padding as number) ? (this.props.padding as number) : x;
        y = y < (this.props.padding as number) ? (this.props.padding as number) : y;
        x = x > (this.state.width - (this.props.padding as number)) ? (this.state.width - (this.props.padding as number)) : x;
        y = y > (this.props.height - (this.props.padding as number)) ? (this.props.height - (this.props.padding as number)) : y;

        this.setState((prevState: IPlaneState, props: IPlaneProps) => {
            prevState.points[id] = {x: x, y: y};
            (this.props.onPointsUpdated as (points: any) => {})(prevState.points);
            return {
                points: prevState.points
            }
        })
    }

    public updateWidth(newWidth: number) {
        this.setState((prevState: IPlaneState, props: IPlaneProps) => {
            let newState = {};
            if (newWidth !== prevState.width) {
                // width was modified, scale points to fit inside
                // a plane with this new width
                newState['width'] = newWidth;

                if (prevState.width === 0) {
                    // this method called for the first time after
                    // component rendered. Don't scale the points
                    // (in fact, there can be no points)
                    return newState;
                }

                newState['points'] = {};
                let scale: number = newWidth / prevState.width;
                Object.keys(prevState.points).forEach((id: string) => {
                    newState['points'][id] = {x: prevState.points[id].x * scale, y: prevState.points[id].y}
                })
            } return newState;
        })
    }

    public getSvgNode() {
        return this.svgNode;
    }
}
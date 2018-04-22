import * as React from 'react';
import * as d3 from 'd3';
import {Plane, IPlaneProps, IPlaneState} from './Plane';
import {Point} from './Point';

// import css
import '../css/Plane1D.css';

export abstract class Plane1D<Props extends IPlaneProps, State extends IPlaneState> extends Plane<Props, State> {
    pointsYCoordinate: number;

    constructor(props: Props) {
        super(props);

        // instantiate instance variables
        this.pointsYCoordinate = this.props.height / 2;
    }

    onClick() {
        let coordinates = d3.mouse(this.getSvgNode() as d3.ContainerElement);
        this.addPoint(coordinates[0], this.pointsYCoordinate);
    }

    public onPointDrag(id: string) {
        this.updatePointCoordinates(id, d3.event.x, this.pointsYCoordinate);
    }

    public getRenderedPoints() {
        return (
            <svg>
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
}
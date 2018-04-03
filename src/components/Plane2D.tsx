import * as React from 'react';
import d3 = require('d3');

class Point {
    x: number;
    y: number;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

export interface Plane2DProps {
    planeWidth?: number;
    planeHeight?: number;
    pointRadius?: number;
}

export interface Plane2DState {}

export default class Plane2D extends React.Component<Plane2DProps, Plane2DState> {
    svgNode: d3.ContainerElement;
    points: Point[];

    static defaultProps = {
        planeWidth: 500,
        planeHeight: 500,
        pointRadius: 5
    }

    constructor(props) {
        super(props);

        // initialize instance variables
        this.points = [];
    }
    
    render() {
        return (
            <svg 
                id='plane2d' 
                className='plane' 
                width={this.props.planeWidth} 
                height={this.props.planeHeight} 
                ref={node => this.svgNode = node}>
            </svg>
        )
    }

    componentDidMount() {
        d3
        .select(this.svgNode)
        .on('click', () => {
            var coordinates = d3.mouse(this.svgNode);
            this.addPoint(new Point(Math.floor(coordinates[0]), Math.floor(coordinates[1])));
        })
    }

    addPoint(point: Point) {
        console.log('adding point at : ' + point.x + ', ' + point.y);
        // add point to points array
        this.points.push(point);
        console.log(this.points);

        // render this point
        d3
        .select(this.svgNode)
        .selectAll('circle')
        .data(this.points)
        .enter()
        .append('circle')
        .attr('cx', (point: Point) => point.x)
        .attr('cy', (point: Point) => point.y)
        .attr('r', this.props.pointRadius)
    }
    
}
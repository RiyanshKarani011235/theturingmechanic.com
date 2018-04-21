import * as React from 'react';
import d3 = require('d3');
import {Vertex, VertexComponent} from './Vertex';

export interface Plane2DProps {
    planeWidth?: number;
    planeHeight?: number;
    pointRadius?: number;
    vertexUnhighlightedColor?: string;
    vertexHighlightedColor?: string;
}

export interface Plane2DState {
    vertexSet: Vertex[];
}

export class Plane2D extends React.Component<Plane2DProps, Plane2DState> {
    public svgNode: d3.ContainerElement;
    public edgeLineGenerator: d3.Line<[number, number]>;
    public currentDragVertex: Vertex;
    public currentMouseOnVertex: Vertex;

    static defaultProps = {
        planeWidth: 500,
        planeHeight: 500,
        pointRadius: 5,
        vertexUnhighlightedColor: 'gray',
        vertexHighlightedColor: 'red'
    }

    onClick() {}
    onVertexDrag(vertex: Vertex) {}
    onVertexDragStart(vertex: Vertex) {}
    onVertexDragEnd(vertex: Vertex) {}

    constructor(props) {
        super(props);

        // initialize instance variables
        this.state = {
            vertexSet: []
        }
        this.edgeLineGenerator = d3.line();
        this.currentDragVertex = null;
        this.currentMouseOnVertex = null;

        // bind
        this.addVertex = this.addVertex.bind(this);
        this.removeVertex = this.removeVertex.bind(this);
        this.onVertexDragStart = this.onVertexDragStart.bind(this);
        this.onVertexDrag = this.onVertexDrag.bind(this);
        this.onVertexDragEnd = this.onVertexDragEnd.bind(this);
    }
    
    /* REACT COMPONENT METHODS */

    render() {
        return (
            <svg 
                id='plane2d' 
                className='plane' 
                width={this.props.planeWidth} 
                height={this.props.planeHeight} 
                ref={node => this.svgNode = node}
            >

                {this.state.vertexSet.map((vertex: Vertex, index: number) => {

                    return <VertexComponent
                        vertex={vertex}
                        unhighlightedRadius={this.props.pointRadius}
                        unhighlightedColor={this.props.vertexUnhighlightedColor}
                        highlightedColor={this.props.vertexHighlightedColor}
                        onVertexDelete={this.removeVertex}
                        onVertexDragStart={this.onVertexDragStart}
                        onVertexDrag={this.onVertexDrag}
                        onVertexDragEnd={this.onVertexDragEnd}
                        key={index}
                    />
                })}

            </svg>
        )
    }

    componentDidMount() {
        let svgDrag = d3.drag()
        // when dragging over svg while nothing else selected,
        // do not propagate this event to so that point not added
        // when drag ends
        .on('drag', () => {});

        d3
        .select(this.svgNode)
        .on('click', () => {
            this.onClick();
        })
        .call(svgDrag)
    }

    /* D3 EVENT LISTENERS */
    

    /* */

    addVertex(vertex: Vertex) {
        this.setState((previousState, props) => {
            return {vertexSet: previousState.vertexSet.concat([vertex])}
        })
    }

    removeVertex(vertex: Vertex) {
        this.setState((previousState, props) => {
            let vertexIndex = previousState.vertexSet.indexOf(vertex);
            let vertexSet = previousState.vertexSet.slice();
            let removed: Vertex = vertexSet.splice(vertexIndex, 1)[0];
            return {vertexSet: vertexSet}
        });

        d3.event.stopPropagation();
    }
}
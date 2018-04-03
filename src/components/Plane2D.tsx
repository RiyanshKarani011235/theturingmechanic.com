import * as React from 'react';
import d3 = require('d3');

class Vertex {
    x: number;
    y: number;
    svgElement: d3.ContainerElement;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    addSvgElement(element: d3.ContainerElement) {
        this.svgElement = element;
    }
}

class Edge {
    v1: Vertex;
    v2: Vertex;
    svgElement: d3.ContainerElement;

    constructor(v1, v2) {
        this.v1 = v1;
        this.v2 = v2;
    }

    addSvgElement(element: d3.ContainerElement) {
        this.svgElement = element;
    }
}

export interface Plane2DProps {
    planeWidth?: number;
    planeHeight?: number;
    pointRadius?: number;
    vertexUnhighlightedColor?: string;
    vertexHighlightedColor?: string;
}

export interface Plane2DState {}

export default class Plane2D extends React.Component<Plane2DProps, Plane2DState> {
    svgNode: d3.ContainerElement;
    vertexSet: Vertex[];
    edgeSet: Edge[];
    edgeLineGenerator: d3.Line<[number, number]>;
    vertexDrag;
    currentDragVertex: Vertex;
    currentMouseOnVertex: Vertex;

    static defaultProps = {
        planeWidth: 500,
        planeHeight: 500,
        pointRadius: 5,
        vertexUnhighlightedColor: 'gray',
        vertexHighlightedColor: 'red'
    }

    constructor(props) {
        super(props);

        // initialize instance variables
        this.vertexSet = [];
        this.edgeSet = [];
        this.edgeLineGenerator = d3.line();
        this.currentDragVertex = null;
        this.currentMouseOnVertex = null;

        this.vertexDrag = d3
        .drag()
        .on('start', (vertex, index) => this.onVertexDragStart.call(this, vertex, index))
        .on('drag', (vertex, index) => this.onVertexDrag.call(this, vertex, index))
        .on('end', (vertex, index) => this.onVertexDragEnd.call(this, vertex, index))

        // bind
        this.addVertex = this.addVertex.bind(this);
        this.onVertexMouseOver.bind(this);
        this.onVertexMouseOut.bind(this);
    }
    
    /* REACT COMPONENT METHODS */

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
        let svgDrag = d3.drag()
        // when dragging over svg while nothing else selected,
        // do not propagate this event to so that point not added
        // when drag ends
        .on('drag', () => {});

        d3
        .select(this.svgNode)
        .on('click', () => {
            var coordinates = d3.mouse(this.svgNode);
            this.addVertex(new Vertex(Math.floor(coordinates[0]), Math.floor(coordinates[1])));
        })
        .call(svgDrag)
    }

    /* D3 EVENT LISTENERS */

    onVertexMouseOver(vertex) {
        console.log('onVertexMouseOver called');
        this.currentMouseOnVertex = vertex;

        d3
        .select(vertex.svgElement)
        .attr('fill', this.props.vertexHighlightedColor)
        .attr('r', () => this.props.pointRadius*1.5)
    }

    onVertexMouseOut(vertex) {
        console.log('onVertexMouseOut called');
        this.currentMouseOnVertex = null;

        if (this.currentDragVertex !== vertex) {
            d3
            .select(vertex.svgElement)
            .attr('fill', this.props.vertexUnhighlightedColor)
            .attr('r', this.props.pointRadius);
        }
    }

    onVertexClick(vertex) {
        console.log('onVertexClick called');
        this.removeVertex(vertex);
    }

    onVertexDrag(vertex, index) {
        console.log('onVertexDrag called');
        var mouseX = d3.event.x;
        var mouseY = d3.event.y;

        d3
        .select(this.svgNode)
        .select('path#path' + vertex.x + '-' + vertex.y + '-' + index)
        .attr('d', this.edgeLineGenerator([[vertex.x, vertex.y], [mouseX, mouseY]]))
    }
    
    onVertexDragStart(vertex, index) {
        console.log('onVertexDragStart called');
        this.currentDragVertex = vertex;

        var mouseX = d3.event.x;
        var mouseY = d3.event.y;

        d3
        .select(this.svgNode)
        .append('path')
        .attr('id', 'path' + vertex.x + '-' + vertex.y + '-' + index)
        .attr('d', this.edgeLineGenerator([[vertex.x, vertex.y], [mouseX, mouseY]]))
        .attr('class', 'edge') 
    }
    
    onVertexDragEnd(vertex, index) {
        console.log('onVertexDragEnd called');
        this.currentDragVertex = null;

        console.log(this.currentMouseOnVertex);
        console.log(vertex);

        if (this.currentMouseOnVertex !== null && this.currentMouseOnVertex !== vertex) {
            // add a line between vertex and currentMouseOnVertex
            this.currentDragVertex.svgElement
            let edge = new Edge(this.currentDragVertex, vertex);

            // TODO:

            console.log(edge);
            // edge.addSvgElement(d3.select('path#path' + vertex.x + '-' + vertex.y + '-' + index))
        } else {
            d3
            .select('path#path' + vertex.x + '-' + vertex.y + '-' + index)
            .remove();
        }

        this.onVertexMouseOut(vertex);
        
    }

    /* */

    addVertex(vertex: Vertex) {
        console.log('addVertex Called');
        // add vertex to vertexSet
        this.vertexSet.push(vertex);

        // render this vertex
        d3
        .select(this.svgNode)
        .selectAll('circle')
        .data(this.vertexSet)
        .enter()
        .append('circle')
        .attr('dummy', function(vertex): number {
            // save the reference of the svg element
            // representing this vertex, used while running
            // the algorithm. Do not use () => {} function
            // syntax because the variable `this` needs to 
            // store refer to the element (the context from)
            // which this function was called
            vertex.addSvgElement(this as d3.ContainerElement);
            return -1;
        })
        .attr('class', 'vertex')
        .attr('cx', (vertex: Vertex) => vertex.x)
        .attr('cy', (vertex: Vertex) => vertex.y)
        .attr('r', this.props.pointRadius)
        .attr('fill', this.props.vertexUnhighlightedColor)
        .attr('stroke', 'black')
        // TODO:
        .call(this.vertexDrag)
        .on('mouseover', (vertex, index) => this.onVertexMouseOver.call(this, vertex))
        .on('mouseout', (vertex, index) => this.onVertexMouseOut.call(this, vertex))
        .on('click', (vertex, index) => this.onVertexClick.call(this, vertex))
    }

    removeVertex(vertex: Vertex) {
        console.log('removeVertex Called');
        this.vertexSet.splice(this.vertexSet.indexOf(vertex), 1);
        d3
        .select(vertex.svgElement)
        .remove();

        d3.event.stopPropagation();
    }
}
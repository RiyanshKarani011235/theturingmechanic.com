import * as React from 'react';
import d3 = require('d3');

export interface VertexProps {
    vertex: Vertex;
    unhighlightedRadius: number;
    unhighlightedColor: string;
    highlightedColor: string;
    onVertexDelete: (vertex: Vertex) => void;
    onVertexDragStart?: (vertex: Vertex) => void;
    onVertexDragEnd?: (vertex: Vertex) => void;
    onVertexDrag?: (vertex: Vertex) => void;
}

export interface VertexState {
    cx: number;
    cy: number;
    radius: number;
    color: string;
    svgNode;
}

export class Vertex {
    x: number;
    y: number;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

export class VertexComponent extends React.Component<VertexProps, VertexState> {
    vertexDrag;
    svgNode;
    isCurrentlyDragged: boolean;

    static defaultProps = {
        onVertexDragStart: () => {},
        onVertexDragEnd: () => {},
        onVertexDrag: () => {}
    }

    constructor(props) {
        super(props);

        // bind event listeners to this context
        this.onMouseOver = this.onMouseOver.bind(this);
        this.onMouseOut = this.onMouseOut.bind(this);
        this.onMouseClick = this.onMouseClick.bind(this);

        // initialize instance variables
        this.isCurrentlyDragged = false;

        this.vertexDrag = d3
        .drag()
        .on('start', () => {
            this.isCurrentlyDragged = true;
            this.props.onVertexDragStart(this.props.vertex);
        })
        .on('drag', () => this.props.onVertexDrag(this.props.vertex))
        .on('end', () => {
            this.isCurrentlyDragged = false;
            this.onMouseOut();
            return this.props.onVertexDragEnd(this.props.vertex);
        })
    }

    render() {
        return (
            <circle 
                cx={this.state.cx} 
                cy={this.state.cy} 
                r={this.state.radius} 
                fill={this.state.color}
                stroke='black'
                ref={node => this.svgNode = node}
            ></circle>
        )
    }

    componentDidMount() {
        d3
        .select(this.svgNode)
        .on('mouseover', this.onMouseOver)
        .on('mouseout', this.onMouseOut)
        .on('click', this.onMouseClick)
        .call(this.vertexDrag)
    }

    // React reuses a component whenever it can; the two cases where 
    // it doesn’t are if the component type changes or if the key changes.
    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            cx: nextProps.vertex.x,
            cy: nextProps.vertex.y,
            radius: nextProps.unhighlightedRadius,
            color: nextProps.unhighlightedColor,
            svgNode: null
        }
    }

    /* D3 EVENT LISTENERS */
    onMouseOver() {
        this.setState({
            color: this.props.highlightedColor,
            radius: this.props.unhighlightedRadius * 1.5
        })
    }

    onMouseOut() {
        if (!this.isCurrentlyDragged) {
            this.setState({
                color: this.props.unhighlightedColor,
                radius: this.props.unhighlightedRadius
            })
        }
    }

    onMouseClick() {
        this.props.onVertexDelete(this.props.vertex);
    }
}
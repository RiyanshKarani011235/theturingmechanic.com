import * as React from 'react';
import * as d3 from 'd3';

// import css
import '../css/Point.css';

export interface PointProps {
    id: string,
    cx?: number,
    cy?: number,
    mouseOutColor?: string,
    mouseOverColor?: string,
    mouseOutRadius?: number,
    mouseOverRadius?: number,
    strokeColor?: string,
    onPointDragStart?: (id: string) => void,
    onPointDragEnd?: (id: string) => void,
    onPointDrag?: (id: string) => void,
    onPointClick?: (id: string) => void
}

export interface PointState {
    cx: number,
    cy: number,
    radius: number,
    color: string,
    dragging: boolean
}

export class Point extends React.Component<PointProps, PointState> {
    private svgNode: SVGCircleElement | null;
    private vertexDrag: any /*d3.DragBehavior<Element, {}, {}>*/; // TODO: check types

    // DEFAULT PROPS
    static defaultProps = {
        cx: 0,
        cy: 0,
        mouseOutColor: 'rgb(230, 230, 230)',
        mouseOverColor: 'red',
        mouseOutRadius: 5,
        mouseOverRadius: 10,
        strokeColor: 'rgb(150, 150, 150)',
        onPointDragStart: (id: string) => {},
        onPointDragEnd: (id: string) => {},
        onPointDrag: (id: string) => {},
        onPointClick: (id: string) => {}
    }

    constructor(props: PointProps) {
        super(props);

        // initialize state
        this.state = {
            cx: this.props.cx as number,
            cy: this.props.cy as number,
            radius: this.props.mouseOutRadius as number,
            color: this.props.mouseOutColor as string,
            dragging: false
        }

        // bind
        this.onMouseOut = this.onMouseOut.bind(this);
        this.onMouseOver = this.onMouseOver.bind(this);
        this.onMouseClick = this.onMouseClick.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
        this.onDrag = this.onDrag.bind(this);

        // initialize instance variables
        this.vertexDrag = d3
        .drag()
        .on('start', this.onDragStart)
        .on('end', this.onDragEnd)
        .on('drag', this.onDrag);
    }

    render() {
        return (
            <circle
                id={this.props.id}
                cx={this.state.cx}
                cy={this.state.cy}
                r={this.state.radius}
                fill={this.state.color}
                stroke={this.props.strokeColor}
                ref={node => this.svgNode = node}
            >

            </circle>

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

    static getDerivedStateFromProps(nextProps: PointProps, prevState: PointState) {
        let newState = {};
        if (nextProps.cx !== prevState.cx) newState['cx'] = nextProps.cx;
        if (nextProps.cy !== prevState.cy) newState['cy'] = nextProps.cy;
        if (nextProps.mouseOutColor !== prevState.color) newState['color'] = nextProps.mouseOutColor;
        return newState;
    }

    onMouseOver() {
        this.setState({
            radius: this.props.mouseOverRadius as number,
            color: this.props.mouseOverColor as string
        })
    }

    onMouseOut() {
        this.setState({
            radius: this.state.dragging ? (this.props.mouseOverRadius as number) : (this.props.mouseOutRadius as number),
            color: this.state.dragging ? (this.props.mouseOverColor as string) : (this.props.mouseOutColor as string)
        })
    }

    onDragStart() {
        this.setState({dragging: true});
        (this.props.onPointDragStart as (...args: any[]) => {})(this.props.id);
    }

    onDragEnd() {
        this.setState({
            dragging: false,
            radius: (this.props.mouseOutRadius as number),
            color: (this.props.mouseOutColor as string)
        });
        (this.props.onPointDragEnd as (...args: any[]) => {})(this.props.id);
    }

    onDrag() {
        (this.props.onPointDrag as (...args: any[]) => {})(this.props.id);
    }

    onMouseClick() {
        (this.props.onPointClick as (...args: any[]) => {})(this.props.id);
    }
}
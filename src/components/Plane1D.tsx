import * as d3 from 'd3';
import {Plane, IPlaneProps} from './Plane';

// import css
import '../css/Plane1D.css';

export class Plane1D extends Plane {
    pointsYCoordinate: number;

    constructor(props: IPlaneProps) {
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
}
import * as React from 'react';
import d3 = require('d3');
import {Plane2D} from './Plane2D';
import {Vertex} from './Vertex';

export default class InteractivePlane2D extends Plane2D {
    onVertexDrag(vertex) {
        var mouseX = d3.event.x;
        var mouseY = d3.event.y;

        d3
        .select(this.svgNode)
        .select('path#path' + vertex.x + '-' + vertex.y + '-' )
        .attr('d', this.edgeLineGenerator([[vertex.x, vertex.y], [mouseX, mouseY]]))
    }
    
    onVertexDragStart(vertex) {
        this.currentDragVertex = vertex;

        var mouseX = d3.event.x;
        var mouseY = d3.event.y;

        d3
        .select(this.svgNode)
        .append('path')
        .attr('id', 'path' + vertex.x + '-' + vertex.y + '-')
        .attr('d', this.edgeLineGenerator([[vertex.x, vertex.y], [mouseX, mouseY]]))
        .attr('class', 'edge') 
    }
    
    onVertexDragEnd(vertex) {
        this.currentDragVertex = null;

        // if (this.currentMouseOnVertex !== null && this.currentMouseOnVertex !== vertex) {
        //     // add a line between vertex and currentMouseOnVertex
        //     let edge = new Edge(this.currentDragVertex, vertex);

        //     // TODO:

        //     console.log(edge);
        //     // edge.addSvgElement(d3.select('path#path' + vertex.x + '-' + vertex.y + '-' + index))
        // } else {
            d3
            .select('path#path' + vertex.x + '-' + vertex.y + '-' )
            .remove();
        // }
    }

    onClick() {
        var coordinates = d3.mouse(this.svgNode);
        this.addVertex(new Vertex(Math.floor(coordinates[0]), Math.floor(coordinates[1])));
    }
}
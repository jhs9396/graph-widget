import React, {useEffect, useRef, useState} from 'react'
import * as d3 from 'd3'

const GraphWidget = ({datum, options}) => {
    const [widgetValues, setWidgetValues] = useState({
        svg: null,
        simulation: null,
        nodeSvg: null,
        edgeSvg: null
    })

    const svgRef = useRef(null)
    const radius = !!options.node ? options.node.radius || 15 : 15
    const strokeWidth = !!options.edge ? options.edge.strokeWidth || 2 : 2
    const width = window.innerWidth, height = window.innerHeight

    useEffect(() => {
        const aborted = { stat: false }
        if (datum === undefined || aborted.stat) return
        if (widgetValues.svg) remove()

        setWidgetValues(wv => Object.assign({}, {
            ...wv,
            nodes: Object.keys(datum.nodes).map(key => datum.nodes[key]),
            edges: Object.keys(datum.edges).map(key => datum.edges[key]),
            svg: d3.select(svgRef.current)
        }))

        return () => { aborted.stat = true }
    }, [datum])

    useEffect(() => {
        const aborted = { stat: false }
        if (widgetValues.svg === null || aborted.stat) return

        widgetValues.svg.call(zoomHandler)
        draw()

        return () => { aborted.stat = true }
    }, [widgetValues.svg])

    useEffect(() => {
        const aborted = { stat: false }
        if (widgetValues.simulation === null || aborted.stat) return

        widgetValues.simulation
            .force("charge_force", d3.forceManyBody().strength(-60))
            .force('collide',      d3.forceCollide(10))
            .force("links",        d3.forceLink(widgetValues.edges).id(d => !!options.edge.id ? d[options.edge.id] : d.id))
        widgetValues.simulation.on('tick', tick)

        return () => { aborted.stat = true }
    }, [widgetValues.simulation])

    useEffect(() => {
        const aborted = { stat: false }

        if (widgetValues.edgeSvg === null || aborted.stat) return
        widgetValues.edgeSvg.append('path')
            .attr('d', 'm0 0')
            .attr('stroke-width', strokeWidth)
            .attr('stroke', !!options.edge ? options.edge.color || 'red' : 'red')
            .attr('marker-end', 'url(#arrowhead2)')

        return () => { aborted.stat = true }
    }, [widgetValues.edgeSvg])

    useEffect(() => {
        const aborted = { stat: false }
        if (widgetValues.nodeSvg === null || aborted.stat) return

        widgetValues.nodeSvg.append('circle')
            .attr('r', radius)
            .attr('fill', 'white')
            .attr('opacity', 1)
            .attr('stroke', 'black')

        widgetValues.nodeSvg
            .call(d3.drag()
                .on('start', (event, d) => {
                    if (!event.active) widgetValues.simulation.alphaTarget(0.3).restart()
                    d.fx = d.x
                    d.fy = d.y
                })
                .on('drag', (event, d) => {
                    d.fx = event.x
                    d.fy = event.y
                })
                .on('end', (event, d) => {
                    if (!event.active) widgetValues.simulation.alphaTarget(0)
                    d.fx = null
                    d.fy = null
                }))

        widgetValues.nodeSvg.append('use')
            .attr("xlink:xlink:href", d => '#icon_' + d.label)

        widgetValues.nodeSvg.append('text')
            .attr('x', 20)
            .attr('y', 5)
            .text(d => d.name)

        return () => { aborted.stat = true }
    }, [widgetValues.nodeSvg])

    const draw = () => {
        setWidgetValues(Object.assign({}, {
            ...widgetValues,
            simulation: d3.forceSimulation().nodes(widgetValues.nodes),
            edgeSvg: widgetValues.svg.select('.edges')
                .selectAll('g.edge')
                .data(widgetValues.edges)
                .enter()
                .append('g')
                .attr('class', 'edge'),
            nodeSvg: widgetValues.svg.select('.nodes')
                .selectAll('g.node')
                .data(widgetValues.nodes)
                .enter()
                .append('g')
                .attr('class', 'node')
        }))
    }

    const remove = () => {
        widgetValues.svg.selectAll('g.node').remove()
        widgetValues.svg.selectAll('g.edge').remove()
    }

    const tick = () => {
        widgetValues.nodeSvg
            .attr('transform', d => {
                d.x = Math.max(radius, Math.min(width - radius, d.x))
                d.y = Math.max(radius, Math.min(height - radius, d.y))
                return `translate(${d.x},${d.y})`
            })

        widgetValues.edgeSvg.attr('transform', d => `translate(${d.source.x},${d.source.y})`)
        widgetValues.edgeSvg.selectAll('path')
            .attr('d', d => makeEdgePathString(d.source, d.target))
    }

    const zoomHandler = d3.zoom()
        .on('zoom', event => {
            widgetValues.svg.select('g.main').attr('transform', event.transform)
        })

    const getPointAtLengthMinusNodeRadius = (pathString, radius, strokeWidth) => {
        const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        p.setAttribute('d', pathString);
        const totLen = p.getTotalLength();

        const l = totLen > radius ? totLen - radius - strokeWidth * 4 - 1 : totLen;
        return p.getPointAtLength(Math.abs(l));
    }

    const makeEdgePathString = (s, t) => {
        const dx = t.x - s.x;
        const dy = t.y - s.y;

        const endPoint = getPointAtLengthMinusNodeRadius(`m0 0 l${dx} ${dy}`, radius, strokeWidth);
        return `m0 0 l${endPoint.x} ${endPoint.y}`
    }

    return (
        <svg
            style={{
                width: '100%',
                height: !!options.height ? options.height || '100%' : '100%'
            }}
            xmlns="http://www.w3.org/2000/svg" ref={svgRef}
        >
            <g className={'main'}>
                <g className={'edges'} />
                <g className={'nodes'} />
            </g>
            <defs>
                <marker id="arrowhead2" refX="0" refY="2" orient="auto" markerUnits="strokeWidth" markerWidth="5"
                        markerHeight="4">
                    <path d="M 0,1 V 3 L3,2 Z" fill="#337" stroke="#337" />
                </marker>
                <g id="icon_path" />
            </defs>
        </svg>
    )
}

export {
    GraphWidget
}
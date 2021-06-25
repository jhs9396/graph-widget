import React, {useState, useEffect} from 'react'
import {datum as graphData} from '../util/dummy'
import '../css/widget.css'
import * as d3 from "d3";

const edgeColor = d3.scaleOrdinal(d3.schemeCategory10)

const WidgetArea = ({isExit, dragData}) => {
    const [widgets, setWidgets] = useState([])
    const [count, setCount] = useState(0)
    const [style, setStyle] = useState({})
    const [dataStore, setDataStore] = useState([])

    const makeData = () => {
        const obj = { nodes: {}, edges: {} }
        const copyData = JSON.parse(JSON.stringify(graphData))

        Object.keys(copyData).forEach(key => {
            copyData[key].forEach((data, i) => {
                if (key === 'nodes') obj.nodes[`${key}_${i}`] = data
                else obj.edges[`${key}_${i}`] = data
            })
        })

        return obj
    }

    useEffect(() => {
        if (dragData === undefined) return

        if (Object.keys(dragData).includes('x')) {
            setWidgets(w => [dragData].concat(w))

            const newStyle = {}
            newStyle[count] = {top: dragData.y, left: dragData.x, width: dragData.dragObject.width}
            setStyle(s => Object.assign({}, s, newStyle))
            setDataStore(ds => [makeData()].concat(ds))

            setCount(c => c + 1)
        }
    }, [dragData])

    const handleDragStart = (e) => {
        e.stopPropagation()
        const index = e.target.parentElement.getAttribute('num')
        const newStyle = {}
        newStyle[index] = {
            ...style[index],
            widthX: e.nativeEvent.clientX -150 - style[index].left
        }

        setStyle(Object.assign({}, style, newStyle))
    }

    const handleDragEnd = (e) => {
        const index = e.target.parentElement.getAttribute('num')
        const newStyle = {}
        newStyle[index] = {
            ...style[index],
            top: style[index].top + e.nativeEvent.offsetY,
            left: style[index].left + e.nativeEvent.offsetX - style[index].widthX
        }

        setStyle(Object.assign({}, style, newStyle))
    }

    const handleResizeStart = (e) => {
        const index = e.target.parentElement.getAttribute('num')
        const newStyle = {}

        newStyle[index] = {
            ...style[index],
            width: e.target.parentElement.offsetWidth,
            height: e.target.parentElement.offsetHeight,
            posX: e.nativeEvent.clientX,
            posY: e.nativeEvent.clientY
        }

        setStyle(Object.assign({}, style, newStyle))
    }

    const handleResizeEnd = (type, e) => {
        const index = e.target.parentElement.getAttribute('num')
        const header = e.target.parentElement.querySelector('.moving-div-header')
        const newStyle = {}

        switch (type) {
            case 'top':
                newStyle[index] = {
                    ...style[index],
                    top: style[index].top + e.nativeEvent.offsetY,
                    height: e.target.parentElement.offsetHeight - (e.nativeEvent.clientY - style[index].posY),
                    svgHeight: e.target.parentElement.offsetHeight - (e.nativeEvent.clientY - style[index].posY) - header.offsetHeight
                }
                break
            case 'bottom':
                newStyle[index] = {
                    ...style[index],
                    height: e.target.parentElement.offsetHeight + (e.nativeEvent.clientY - style[index].posY),
                    svgHeight: e.target.parentElement.offsetHeight + (e.nativeEvent.clientY - style[index].posY) - header.offsetHeight
                }
                break
            case 'left':
                newStyle[index] = {
                    ...style[index],
                    left: style[index].left + e.nativeEvent.offsetX,
                    width: e.target.parentElement.offsetWidth - (e.nativeEvent.clientX - style[index].posX)
                }
                break
            case 'right':
                newStyle[index] = {
                    ...style[index],
                    width: e.target.parentElement.offsetWidth + (e.nativeEvent.clientX - style[index].posX)
                }
                break
            case 'top-left':
                newStyle[index] = {
                    ...style[index],
                    top: style[index].top + e.nativeEvent.offsetY,
                    left: style[index].left + e.nativeEvent.offsetX,
                    width: e.target.parentElement.offsetWidth - (e.nativeEvent.clientX - style[index].posX),
                    height: e.target.parentElement.offsetHeight - (e.nativeEvent.clientY - style[index].posY),
                    svgHeight: e.target.parentElement.offsetHeight - (e.nativeEvent.clientY - style[index].posY) - header.offsetHeight
                }
                break
            case 'top-right':
                newStyle[index] = {
                    ...style[index],
                    top: style[index].top + e.nativeEvent.offsetY,
                    width: e.target.parentElement.offsetWidth + (e.nativeEvent.clientX - style[index].posX),
                    height: e.target.parentElement.offsetHeight - (e.nativeEvent.clientY - style[index].posY),
                    svgHeight: e.target.parentElement.offsetHeight - (e.nativeEvent.clientY - style[index].posY) - header.offsetHeight
                }
                break
            case 'bottom-left':
                newStyle[index] = {
                    ...style[index],
                    left: style[index].left + e.nativeEvent.offsetX,
                    width: e.target.parentElement.offsetWidth - (e.nativeEvent.clientX - style[index].posX),
                    height: e.target.parentElement.offsetHeight + (e.nativeEvent.clientY - style[index].posY),
                    svgHeight: e.target.parentElement.offsetHeight + (e.nativeEvent.clientY - style[index].posY) - header.offsetHeight
                }
                break
            case 'bottom-right':
                newStyle[index] = {
                    ...style[index],
                    height: e.target.parentElement.offsetHeight + (e.nativeEvent.clientY - style[index].posY),
                    svgHeight: e.target.parentElement.offsetHeight + (e.nativeEvent.clientY - style[index].posY) - header.offsetHeight,
                    width: e.target.parentElement.offsetWidth + (e.nativeEvent.clientX - style[index].posX)
                }
                break
            default:
                break
        }

        setStyle(Object.assign({}, style, newStyle))
    }

    return (
        <div className={'h-screen w-screen'}>
            {(widgets.length > 0 || isExit) && widgets.map((widget, i) => {
                const {Comp, name} = widget.dragObject
                let {height} = widget.dragObject

                return (
                    <div
                        className={'moving-div'}
                        key={i}
                        num={i}
                        style={{ ...style[i]}}
                    >
                        <div draggable={true} className={'moving-div-line moving-div-top-line'}
                             onDragStart={handleResizeStart}
                             onDragEnd={handleResizeEnd.bind(null, 'top')}
                        />
                        <div draggable={true} className={'moving-div-line moving-div-left-line'}
                             onDragStart={handleResizeStart}
                             onDragEnd={handleResizeEnd.bind(null, 'left')}
                        />
                        <div draggable={true} className={'moving-div-line moving-div-right-line'}
                             onDragStart={handleResizeStart}
                             onDragEnd={handleResizeEnd.bind(null, 'right')}
                        />
                        <div draggable={true} className={'moving-div-line moving-div-bottom-line'}
                             onDragStart={handleResizeStart}
                             onDragEnd={handleResizeEnd.bind(null, 'bottom')}
                        />
                        <div draggable={true} className={'moving-div-corner moving-div-top-left-corner'}
                             onDragStart={handleResizeStart}
                             onDragEnd={handleResizeEnd.bind(null, 'top-left')}
                        />
                        <div draggable={true} className={'moving-div-corner moving-div-top-right-corner'}
                             onDragStart={handleResizeStart}
                             onDragEnd={handleResizeEnd.bind(null, 'top-right')}
                        />
                        <div draggable={true} className={'moving-div-corner moving-div-bottom-left-corner'}
                             onDragStart={handleResizeStart}
                             onDragEnd={handleResizeEnd.bind(null, 'bottom-left')}
                        />
                        <div draggable={true} className={'moving-div-corner moving-div-bottom-right-corner'}
                             onDragStart={handleResizeStart}
                             onDragEnd={handleResizeEnd.bind(null, 'bottom-right')}
                        />
                        <div
                            draggable={true}
                            className={'moving-div-header'}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                        >{name}</div>
                        <Comp
                            datum={dataStore[i]}
                            options={{
                                height: style[i].svgHeight || height,
                                node: {
                                    radius: 15
                                },
                                edge: {
                                    color: edgeColor(i),
                                    strokeWidth: 2,
                                    id: 'name'
                                }
                            }}
                        />
                    </div>
                )
            })}
        </div>
    )
}

export {
    WidgetArea
}
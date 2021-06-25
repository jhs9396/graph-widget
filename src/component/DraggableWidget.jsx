import React from 'react'
import {Draggable} from "../behavior/Draggable";
import '../css/widget.css'

const DraggableWidget = ({ widgets, draggedData, setDragData, setIsExit }) => {

    const onDragStart = (dragData, e) => {
        setIsExit(false)
        setDragData(dragData)
    }

    const onDragEnd = (e) => {
        setIsExit(true)
        setDragData(Object.assign({}, draggedData, {x: e.nativeEvent.clientX-150, y: e.nativeEvent.clientY}))
    }

    return (
        <>
            <h2>&nbsp;드래그&드롭으로 위젯을 생성할 수 있습니다.</h2>
            <div className={'select-dragging-widgets'}>
                {!!widgets && widgets.map(widget => (
                    <Draggable
                        key={widget.name}
                        dragObject={widget}
                        onDragStart={onDragStart}
                        onDragEnd={onDragEnd}
                    >
                        <div title={'위젯을 Drag and Drop으로 생성할 수 있습니다.'} className={'widget'}>
                            {widget.name}
                        </div>
                    </Draggable>
                ))}
            </div>
        </>
    )
}

export {
    DraggableWidget
}
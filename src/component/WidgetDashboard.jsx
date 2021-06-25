import React, {useState} from 'react'
import {DraggableWidget} from "./DraggableWidget";
import {GraphWidget} from "./GraphWidget";
import {WidgetArea} from "./WidgetArea";

const widgetDict = [
    {
        Comp: GraphWidget,
        name: '그래프 위젯',
        width: '30%',
        height: '250px'
    }
]

const WidgetDashboard = () => {
    const [draggedData, setDraggedData] = useState()
    const [isExit, setIsExit] = useState(false)

    return (
        <div>
            <DraggableWidget widgets={widgetDict} draggedData={draggedData} setDragData={setDraggedData} setIsExit={setIsExit} />
            <WidgetArea
                isExit={isExit}
                dragData={draggedData}
            />
        </div>
    )
}

export {
    WidgetDashboard
}
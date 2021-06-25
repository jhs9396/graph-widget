# GraphWidget used to D3.js v6
 - Create components using drag & drop.
 - When creating a widget, data is defined in the following format.

```jsonpath
{
    "nodes": [
      {
        "node_key1": { ...properties } 
      },
      {
        "node_key2": { ...properties }
      },
      {
        "node_key3": { ...properties }
      },
      ...
    ],
    "edges": [
      {
        "edge_key1": { "source": "node_key1", "target": "node_key2" },
        "edge_key2": { "source": "node_key1", "target": "node_key3" },
        ...
      }
    ]
}
```

## How to use in source file.
```javascript
import React from 'react';
import {GraphWidget} from './GraphWidget';

...

const WidgetTest = () => {
    /* Create data wherever you wanta  */
    ...
    return (
        <div>
            <GraphWidget 
                datum={/* Objects saved in the format created above (nodes, edges) */}
                options={{
                    /* widget width */
                    width: '50%',
                    /* svg height inside widget */
                    height: '250px',
                    /* node options */
                    node: {
                        radius: 15           // node radius size
                    },
                    edge: {
                        color: 'red',        // edge color
                        strokeWidth: 2,      // edge stroke width size
                        id: 'name'           // edge attribute name to use as ID
                    }
                }}
            />
        </div>
    )
}
```
- The original purpose was to use it as a widget, but to show the component directly in the screen `<div />` area.
- Committed an example of moving or resizing a div to use it as a widget.

## Development list
 1. Create widgets by drag&drop. 
 2. Widgets can be moved.
 3. Widgets resizing


![](public/images/capture1.gif)

## Environment
- React.js 17.0.2
- create-react-app basic template
    ### `npm run start`
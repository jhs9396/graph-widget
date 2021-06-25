import {BrowserRouter, Link, Route, Switch} from "react-router-dom";
import React from "react";
import {WidgetDashboard} from "./component/WidgetDashboard";

const routes = [
  {
    path: '/',
    name: 'widget board',
    exact: false,
    main: WidgetDashboard
  },
]

const App = () => {
  return (
      <div className={'flex'}>
        <BrowserRouter>
          <div className={'flex-1'}>
            {routes.map((r, idx) => {
              return <Link key={`link_${idx}`} to={r.path}><div className={'menu'}>{r.name}</div></Link>
            })}
          </div>
          <div className='flex flex-col flex-9 h-full relative overflow-y-hidden' style={{background: "#fbf8f1"}}>
            <div className="flex flex-col flex-1 h-full relative">
              <Switch>
                {routes.map((r, idx) => {
                  return <Route
                      key={idx}
                      path={r.path}
                      exact={r.exact}
                      component={r.main}
                  />
                })}
              </Switch>
            </div>
          </div>
        </BrowserRouter>
      </div>
  )
}

export default App
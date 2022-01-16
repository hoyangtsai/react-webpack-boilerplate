import React from "react"
import Button from "./components/Button";

function App() {
  return (
    <div className="App">
      <h2>React App</h2>
      <Button className="app-button" onClick={() => window.open('//reactjs.org/')}>React Docs</Button>
      <Button className="app-button" onClick={() => window.open('//webpack.js.org/')}>Webpack Docs</Button>
    </div>
  )
}

export default App
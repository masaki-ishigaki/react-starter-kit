import React from "react"
import logo from "./logo.svg"
import "./App.scss"

export default function App(): JSX.Element {
  const testDescription = process.env.TEST

  return (
    <div className="App">
      <header className="App__header">
        <img src={logo} className="App_header__logo animation" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a className="Apo__header__link" href="https://reactjs.org" target="_blnak" rel="noopener noreferrer">
          Learn React
        </a>
        <p>{testDescription}</p>
      </header>
    </div>
  )
}

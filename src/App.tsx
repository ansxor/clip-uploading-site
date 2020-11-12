import React from "react";
import "./App.css";
import TestUserDisplay from "./components/TestUserDisplay";
import TestUserLogin from "./components/TestUserLogin";

function App() {
  return (
    <div className="App">
      <TestUserDisplay />
      <TestUserLogin />
    </div>
  );
}

export default App;

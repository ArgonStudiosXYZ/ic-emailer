import { emailer_backend } from "../../declarations/emailer_backend";
import React from "react";
import { createRoot } from "react-dom/client";
import { Home } from "./pages/Home";
import "./main.css";

class App extends React.Component {
  render() {
    return (
      <div>
        <Home />
      </div>
    );
  }
}

export default App;

const root = createRoot(document.getElementById("app"));
root.render(<App />);

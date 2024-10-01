import { BrowserRouter, Route } from "react-router-dom";
import CustomSwitch from "./components/custom-switch";
import Home from "./pages/home";
import About from "./pages/about";

const App = () => {
  return (
    <BrowserRouter>
      <CustomSwitch>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </CustomSwitch>
    </BrowserRouter>
  );
};

export default App;

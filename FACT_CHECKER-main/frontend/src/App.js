import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Components/Navigation"; 
import UrlContentFact from "./Components/UrlComponent";
import Validator from "./Pages/validator"; 
import Home from "./Pages/Home";



const App = () => {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} /> 
          <Route path="/validation" element={<Validator />} />
          <Route path="/urlContentValidation" element={<UrlContentFact/>}/>
          {/* <Route path="/news" element={<TopNewsSection />} />  */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;

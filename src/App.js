import "./App.css";
import React, { Suspense } from "react";
import CarpoolApplication from "./CarpoolApplication.js";
function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CarpoolApplication />
    </Suspense>
  );
}

export default App;

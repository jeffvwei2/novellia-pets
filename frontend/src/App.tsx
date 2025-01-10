import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from "./components/Home";
import PetDetail from "./components/PetDetail";
import ModifyPet from "./components/ModifyPet";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pets/new" element={<ModifyPet />} />
        <Route path="/pets/:id" element={<PetDetail />} />
        <Route path="/pets/:id/edit" element={<ModifyPet />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

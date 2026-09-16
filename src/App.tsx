import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/UndoToast';
import { AppShell } from './layouts/AppShell';
import { Hero } from './pages/Hero';
import { Inicio } from './pages/Inicio';
import { Escaneo } from './pages/Escaneo';
import { Evaluaciones } from './pages/Evaluaciones';
import { EvaluacionDetalle } from './pages/EvaluacionDetalle';
import { Logros } from './pages/Logros';
import { Feedback } from './pages/Feedback';
import { Curso } from './pages/Curso';
import { Intereses } from './pages/Intereses';
import { Ajustes } from './pages/Ajustes';

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Hero section (Part 1) */}
          <Route path="/landing" element={<Hero />} />
          <Route path="/hero" element={<Hero />} />

          {/* Internal App post-login (Part 2) */}
          <Route element={<AppShell />}>
            <Route path="/" element={<Inicio />} />
            <Route path="/escaneo" element={<Escaneo />} />
            <Route path="/evaluaciones" element={<Evaluaciones />} />
            <Route path="/evaluaciones/:id" element={<EvaluacionDetalle />} />
            <Route path="/logros" element={<Logros />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/curso" element={<Curso />} />
            <Route path="/curso/intereses" element={<Intereses />} />
            <Route path="/ajustes" element={<Ajustes />} />
          </Route>

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
};

export default App;

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { NobelPrizes } from './pages/NobelPrizes'
import { Tier1Awards } from './pages/Tier1Awards'
import { Awards } from './pages/Awards'
import { FrontierTopics } from './pages/FrontierTopics'
import { Institutions } from './pages/Institutions'
import { Schema } from './pages/Schema'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="nobel" element={<NobelPrizes />} />
          <Route path="tier1-awards" element={<Tier1Awards />} />
          <Route path="awards" element={<Awards />} />
          <Route path="frontier-topics" element={<FrontierTopics />} />
          <Route path="institutions" element={<Institutions />} />
          <Route path="schema" element={<Schema />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

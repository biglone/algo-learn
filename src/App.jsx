import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Learn from './pages/Learn'
import Algorithm from './pages/Algorithm'
import Complexity from './pages/Complexity'
import InterviewPlan from './pages/InterviewPlan'

export default function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <main className="page">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/learn" element={<Learn />} />
                    <Route path="/learn/:categoryId" element={<Learn />} />
                    <Route path="/algorithm/:id" element={<Algorithm />} />
                    <Route path="/complexity" element={<Complexity />} />
                    <Route path="/interview-plan" element={<InterviewPlan />} />
                </Routes>
            </main>
        </BrowserRouter>
    )
}

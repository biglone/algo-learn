import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const location = useLocation()

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handler)
        return () => window.removeEventListener('scroll', handler)
    }, [])

    const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/')

    return (
        <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
            <div className="navbar-inner">
                <Link to="/" className="navbar-logo">
                    <span className="logo-icon">⟨A⟩</span>
                    <span className="logo-text">AlgoLearn</span>
                </Link>

                <div className="navbar-links">
                    <Link to="/" className={`nav-link${location.pathname === '/' ? ' active' : ''}`}>首页</Link>
                    <Link to="/learn" className={`nav-link${isActive('/learn') || isActive('/algorithm') ? ' active' : ''}`}>学习</Link>
                    <Link to="/complexity" className={`nav-link${isActive('/complexity') ? ' active' : ''}`}>复杂度对比</Link>
                </div>

                <div className="navbar-actions">
                    <Link to="/learn" className="btn btn-primary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
                        开始学习 →
                    </Link>
                </div>
            </div>
        </nav>
    )
}

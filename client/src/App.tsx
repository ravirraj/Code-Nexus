import { Route, BrowserRouter as Router, Routes, Navigate } from "react-router-dom"
import Toast from "./components/toast/Toast"
import EditorPage from "./pages/EditorPage"
import HomePage from "./pages/HomePage"

const App = () => {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/editor" element={<Navigate to="/" replace />} />
                    <Route path="/editor/:roomId" element={<EditorPage />} />
                </Routes>
            </Router>
            <Toast /> {/* Toast component from react-hot-toast */}
        </>
    )
}

export default App

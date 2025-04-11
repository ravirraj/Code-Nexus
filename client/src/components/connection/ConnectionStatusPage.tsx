import { useNavigate } from "react-router-dom"
import { AlertCircle, RefreshCw, Home } from "lucide-react"

function ConnectionStatusPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4">
            <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-800/50 p-8 text-center shadow-xl backdrop-blur-sm">
                <ConnectionError />
            </div>
        </div>
    )
}

const ConnectionError = () => {
    const navigate = useNavigate()
    const reloadPage = () => {
        window.location.reload()
    }

    const gotoHomePage = () => {
        navigate("/")
    }

    return (
        <div className="space-y-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
                <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">Connection Error</h2>
                <p className="text-slate-400">
                    Oops! Something went wrong. Please try again or return to the homepage.
                </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <button
                    className="btn-primary flex items-center justify-center gap-2"
                    onClick={reloadPage}
                >
                    <RefreshCw className="h-4 w-4" />
                    Try Again
                </button>
                <button
                    className="btn-secondary flex items-center justify-center gap-2"
                    onClick={gotoHomePage}
                >
                    <Home className="h-4 w-4" />
                    Go to Homepage
                </button>
            </div>
        </div>
    )
}

export default ConnectionStatusPage

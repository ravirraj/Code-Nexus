import { useAppContext } from "@/context/AppContext"
import { useSocket } from "@/context/SocketContext"
import { SocketEvent } from "@/types/socket"
import { USER_STATUS } from "@/types/user"
import { ChangeEvent, useEffect, useRef } from "react"
import { toast } from "react-hot-toast"
import { useLocation, useNavigate } from "react-router-dom"
import { v4 as uuidv4 } from "uuid"
import { Sparkles, Users, ArrowRight, KeyRound } from "lucide-react"

const FormComponent = () => {
    const location = useLocation()
    const { currentUser, setCurrentUser, status, setStatus } = useAppContext()
    const { socket } = useSocket()

    const usernameRef = useRef<HTMLInputElement | null>(null)
    const navigate = useNavigate()

    const createNewRoomId = () => {
        setCurrentUser({ ...currentUser, roomId: uuidv4() })
        toast.success("Created a new Room Id")
        usernameRef.current?.focus()
    }

    const handleInputChanges = (e: ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name
        const value = e.target.value
        setCurrentUser({ ...currentUser, [name]: value })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        
        // Strict validation for username
        if (!currentUser.username || currentUser.username.trim().length < 3) {
            toast.error("Please enter a valid username (min 3 characters)")
            usernameRef.current?.focus()
            return
        }

        // Strict validation for roomId
        if (!currentUser.roomId || currentUser.roomId.trim().length < 5) {
            toast.error("Please enter or generate a valid room ID (min 5 characters)")
            return
        }

        if (status === USER_STATUS.ATTEMPTING_JOIN) return

        // Store username in session storage before joining
        sessionStorage.setItem("username", currentUser.username)
        
        toast.loading("Joining room...")
        setStatus(USER_STATUS.ATTEMPTING_JOIN)
        socket.emit(SocketEvent.JOIN_REQUEST, currentUser)
    }

    useEffect(() => {
        if (status === USER_STATUS.DISCONNECTED && !socket.connected) {
            socket.connect()
            return
        }

        const isRedirect = sessionStorage.getItem("redirect")
        const storedUsername = sessionStorage.getItem("username")

        if (status === USER_STATUS.JOINED && !isRedirect && storedUsername) {
            sessionStorage.setItem("redirect", "true")
            navigate(`/editor/${currentUser.roomId}`, {
                state: {
                    username: storedUsername
                },
            })
        } else if (status === USER_STATUS.JOINED && isRedirect) {
            sessionStorage.removeItem("redirect")
            sessionStorage.removeItem("username")
            setStatus(USER_STATUS.DISCONNECTED)
            socket.disconnect()
            socket.connect()
        }
    }, [currentUser, location.state?.redirect, navigate, setStatus, socket, status])

    useEffect(() => {
        if (currentUser.roomId.length > 0) return
        if (location.state?.roomId) {
            setCurrentUser({ ...currentUser, roomId: location.state.roomId })
            if (currentUser.username.length === 0) {
                toast.success("Enter your username")
            }
        }
    }, [currentUser, location.state?.roomId, setCurrentUser])

    return (
        <div className="w-full max-w-md rounded-xl sm:rounded-2xl border border-slate-700 bg-slate-800/50 p-4 sm:p-6 md:p-8 shadow-xl backdrop-blur-sm">
            <div className="mb-4 sm:mb-6 text-center">
                <div className="mx-auto mb-3 sm:mb-4 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-indigo-500/10">
                    <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-400" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Join CodeWithUs</h2>
                <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-slate-400">
                    Enter your details to start coding together
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="space-y-1 sm:space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-xs sm:text-sm font-medium text-slate-300">Room ID</label>
                        <button
                            type="button"
                            onClick={createNewRoomId}
                            className="flex items-center gap-1 sm:gap-2 rounded-lg bg-indigo-500/10 px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm text-indigo-400 hover:bg-indigo-500/20"
                        >
                            <KeyRound className="h-3 w-3 sm:h-4 sm:w-4" />
                            Generate ID
                        </button>
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            name="roomId"
                            placeholder="Enter room ID"
                            className="input-field w-full pl-8 sm:pl-10 text-xs sm:text-sm"
                            onChange={handleInputChanges}
                            value={currentUser.roomId}
                        />
                        <Users className="absolute left-2 sm:left-3 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-slate-400" />
                    </div>
                </div>

                <div className="space-y-1 sm:space-y-2">
                    <label className="text-xs sm:text-sm font-medium text-slate-300">Username</label>
                    <div className="relative">
                        <input
                            type="text"
                            name="username"
                            placeholder="Enter your username"
                            className="input-field w-full pl-8 sm:pl-10 text-xs sm:text-sm"
                            onChange={handleInputChanges}
                            value={currentUser.username}
                            ref={usernameRef}
                        />
                        <Sparkles className="absolute left-2 sm:left-3 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-slate-400" />
                    </div>
                </div>

                <button
                    type="submit"
                    className="btn-primary w-full text-xs sm:text-sm"
                    disabled={status === USER_STATUS.ATTEMPTING_JOIN}
                >
                    {status === USER_STATUS.ATTEMPTING_JOIN ? "Joining..." : "Join Room"}
                    <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
                </button>
            </form>
        </div>
    )
}

export default FormComponent

import { useAppContext } from "@/context/AppContext"
import { useChatRoom } from "@/context/ChatContext"
import { SyntheticEvent, useEffect, useRef } from "react"

function ChatList() {
    const {
        messages,
        isNewMessage,
        setIsNewMessage,
        lastScrollHeight,
        setLastScrollHeight,
    } = useChatRoom()
    const { currentUser } = useAppContext()
    const messagesContainerRef = useRef<HTMLDivElement | null>(null)

    const handleScroll = (e: SyntheticEvent) => {
        const container = e.target as HTMLDivElement
        setLastScrollHeight(container.scrollTop)
    }

    // Scroll to bottom when messages change
    useEffect(() => {
        if (!messagesContainerRef.current) return
        messagesContainerRef.current.scrollTop =
            messagesContainerRef.current.scrollHeight
    }, [messages])

    useEffect(() => {
        if (isNewMessage) {
            setIsNewMessage(false)
        }
        if (messagesContainerRef.current)
            messagesContainerRef.current.scrollTop = lastScrollHeight
    }, [isNewMessage, setIsNewMessage, lastScrollHeight])

    return (
        <div
            className="flex-grow overflow-auto rounded-md p-2"
            ref={messagesContainerRef}
            onScroll={handleScroll}
        >
            {/* Chat messages */}
            {messages.map((message, index) => {
                const isCurrentUser = message.username === currentUser.username;
                return (
                    <div
                        key={index}
                        className={`mb-2 w-[80%] max-w-[90%] self-end break-words rounded-md px-3 py-2 ${
                            isCurrentUser 
                                ? "ml-auto bg-indigo-500/10 border border-indigo-500/20" 
                                : "bg-slate-800/50 border border-slate-700/30"
                        }`}
                    >
                        <div className="flex justify-between">
                            <span className={`text-xs ${isCurrentUser ? "text-indigo-400" : "text-slate-400"}`}>
                                {message.username}
                            </span>
                            <span className="text-xs text-slate-400">
                                {message.timestamp}
                            </span>
                        </div>
                        <p className="py-1 text-slate-200">{message.message}</p>
                    </div>
                )
            })}
        </div>
    )
}

export default ChatList

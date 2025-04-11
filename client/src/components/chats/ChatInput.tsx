import { useAppContext } from "@/context/AppContext"
import { useChatRoom } from "@/context/ChatContext"
import { useSocket } from "@/context/SocketContext"
import { ChatMessage } from "@/types/chat"
import { SocketEvent } from "@/types/socket"
import { formatDate } from "@/utils/formateDate"
import { FormEvent, useRef } from "react"
import { LuSendHorizonal } from "react-icons/lu"
import { v4 as uuidV4 } from "uuid"
import useWindowDimensions from "@/hooks/useWindowDimensions"

function ChatInput() {
    const { currentUser } = useAppContext()
    const { socket } = useSocket()
    const { setMessages } = useChatRoom()
    const inputRef = useRef<HTMLInputElement | null>(null)
    const { isMobile } = useWindowDimensions()

    const handleSendMessage = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const inputVal = inputRef.current?.value.trim()

        if (inputVal && inputVal.length > 0) {
            const message: ChatMessage = {
                id: uuidV4(),
                message: inputVal,
                username: currentUser.username,
                timestamp: formatDate(new Date().toISOString()),
            }
            socket.emit(SocketEvent.SEND_MESSAGE, { message })
            setMessages((messages) => [...messages, message])

            if (inputRef.current) inputRef.current.value = ""
        }
    }

    return (
        <form
            onSubmit={handleSendMessage}
            className="flex justify-between rounded-md border border-slate-600 overflow-hidden shadow-lg"
        >
            <input
                type="text"
                className="w-full flex-grow rounded-l-md border-none bg-slate-800 p-3 text-white outline-none placeholder:text-slate-400 text-sm sm:text-base"
                placeholder="Type a message..."
                ref={inputRef}
                autoComplete="off"
                style={{
                    minHeight: "40px",
                    fontSize: isMobile ? "14px" : "16px"
                }}
            />
            <button
                className="flex items-center justify-center rounded-r-md bg-indigo-600 px-3 py-2 text-white hover:bg-indigo-700 transition-colors text-sm sm:text-base"
                type="submit"
                aria-label="Send message"
                style={{
                    minWidth: "50px",
                    height: "auto"
                }}
            >
                <LuSendHorizonal size={20} />
            </button>
        </form>
    )
}

export default ChatInput

import useWindowDimensions from "@/hooks/useWindowDimensions"
import ChatInput from "@/components/chats/ChatInput"
import ChatList from "@/components/chats/ChatList"
import { useChatRoom } from "@/context/ChatContext"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

const ChatsView = () => {
    const { isMobile } = useWindowDimensions()
    const { clearChat } = useChatRoom()

    // Set responsive input height
    const inputHeight = isMobile ? 100 : 40; // Smaller height for mobile

    return (
        <div
            className="flex flex-col gap-2 p-2 chat-container relative h-full min-w-[320px] overflow-hidden bg-transparent"
            data-active="CHATS"
            style={{ 
                height: '100%',
                paddingBottom: `${inputHeight}px` // Add padding for the input
            }}
        >
            <div className="flex items-center justify-between">
                <h1 className="view-title mb-2">Group Chat</h1>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-400 hover:text-red-400"
                    onClick={clearChat}
                    title="Clear chat history"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
            {/* Chat list */}
            <div 
                className="flex-grow overflow-y-auto pr-2 chat-messages"
                style={{ 
                    height: '100%', // Let it take full height within padded parent
                    maxHeight: '100%'
                }}
            >
                <ChatList />
            </div>
            {/* Chat input - positioned at bottom */}
            <div 
                className="chat-input-container bg-slate-900/95 backdrop-blur-sm p-3 border-t border-slate-700/50 w-full absolute bottom-0 left-0 right-0 z-10"
                style={{ height: `${inputHeight}px` }} // Set explicit height
            >
                <ChatInput />
            </div>
        </div>
    )
}

export default ChatsView

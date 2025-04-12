import useWindowDimensions from "@/hooks/useWindowDimensions"
import ChatInput from "@/components/chats/ChatInput"
import ChatList from "@/components/chats/ChatList"

const ChatsView = () => {
    const { isMobile } = useWindowDimensions()

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
            <h1 className="view-title mb-2">Group Chat</h1>
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

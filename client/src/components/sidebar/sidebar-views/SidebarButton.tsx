import { useChatRoom } from "@/context/ChatContext"
import { useViews } from "@/context/ViewContext"
import { VIEWS } from "@/types/view"
import { useState } from "react"
import { buttonStyles } from "../tooltipStyles"
import { ElementType } from "react"

interface ViewButtonProps {
    viewName: VIEWS
    icon: JSX.Element
    onClick?: () => void
    className?: string
}

const ViewButton = ({ viewName, icon, onClick, className }: ViewButtonProps) => {
    const { activeView, setActiveView, isSidebarOpen, setIsSidebarOpen } =
        useViews()
    const { isNewMessage } = useChatRoom()

    const handleViewClick = () => {
        if (onClick) {
            onClick()
            return
        }
        
        if (viewName === activeView) {
            setIsSidebarOpen(!isSidebarOpen)
        } else {
            setIsSidebarOpen(true)
            setActiveView(viewName)
        }
    }

    const Icon = icon as ElementType

    return (
        <div className="relative flex flex-col items-center">
            <button
                onClick={handleViewClick}
                className={`${buttonStyles.base} ${buttonStyles.hover} ${className || ''}`}
                data-active={viewName === activeView}
                data-view={viewName}
                aria-label={`View ${viewName}`}
            >
                <div className="flex items-center justify-center">{typeof icon === "function" ? <Icon /> : icon}</div>
                {/* Show dot for new message in chat View Button */}
                {viewName === VIEWS.CHATS && isNewMessage && (
                    <div className="absolute right-0 top-0 h-3 w-3 rounded-full bg-primary"></div>
                )}
            </button>
        </div>
    )
}

export default ViewButton

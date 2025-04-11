import SidebarButton from "@/components/sidebar/sidebar-views/SidebarButton"
import { useAppContext } from "@/context/AppContext"
import { useSocket } from "@/context/SocketContext"
import { useViews, VIEWS } from "@/context/ViewContext"
import useResponsive from "@/hooks/useResponsive"
import useWindowDimensions from "@/hooks/useWindowDimensions"
import { ACTIVITY_STATE } from "@/types/app"
import { SocketEvent } from "@/types/socket"
import { Code2, Pencil, X } from "lucide-react"
import { Tooltip } from 'react-tooltip'
import { useState, useEffect } from 'react'
import cn from "classnames"

function Sidebar() {
    const {
        activeView,
        isSidebarOpen,
        viewIcons,
        setIsSidebarOpen,
        setActiveView,
    } = useViews()
    const { minHeightReached } = useResponsive()
    const { activityState, setActivityState } = useAppContext()
    const { socket } = useSocket()
    const { isMobile, width } = useWindowDimensions()
    const [showTooltip, setShowTooltip] = useState(true)
    const [previousView, setPreviousView] = useState<VIEWS | null>(null)

    useEffect(() => {
        if (activeView !== previousView) {
            setPreviousView(activeView)
        }
    }, [activeView])

    useEffect(() => {
        if (width < 768 && isSidebarOpen) {
            setIsSidebarOpen(false);
        }
    }, [width]);

    const handleViewChange = (view: VIEWS) => {
        if (view === activeView) {
            setIsSidebarOpen(!isSidebarOpen)
        } else {
            setActiveView(view)
            setIsSidebarOpen(true)
        }
    }

    const changeState = () => {
        setShowTooltip(false)
        if (activityState === ACTIVITY_STATE.CODING) {
            setActivityState(ACTIVITY_STATE.DRAWING)
            socket.emit(SocketEvent.REQUEST_DRAWING)
        } else {
            setActivityState(ACTIVITY_STATE.CODING)
        }

        if (isMobile) {
            setIsSidebarOpen(false)
        }
    }

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    }

    const views = [
        { id: VIEWS.CHAT, label: "Chat" },
        { id: VIEWS.FILES, label: "Files" },
        { id: VIEWS.USERS, label: "Users" },
        { id: VIEWS.RUN, label: "Run" },
        { id: VIEWS.SETTINGS, label: "Settings" }
    ]

    const getMobileSidebarStyle = () => {
        if (isMobile) {
            const baseStyle = {
                height: 'calc(100% - 60px)',
                maxHeight: '100%',
                width: '100%',
                left: '0',
            };
            
            if (activeView === VIEWS.CHAT) {
                return {
                    ...baseStyle,
                    height: 'calc(100vh - 60px)',
                    maxHeight: 'calc(100vh - 60px)',
                    overflow: 'visible'
                };
            }
            
            return {
                ...baseStyle,
                overflow: 'auto'
            };
        }
        
        return {
            height: 'calc(100vh - 60px)',
            maxHeight: '100%',
            overflow: 'auto'
        };
    };

    return (
        <aside className="flex h-screen w-full md:h-full md:max-h-screen md:min-h-screen md:w-auto">
            <div
                className={cn(
                    "fixed left-0 top-[60px] z-50 flex h-[calc(100vh-60px)] w-[60px] min-w-[60px] flex-col justify-between border-r border-slate-700/50 bg-slate-900/95 backdrop-blur-md md:py-3",
                    {
                        hidden: minHeightReached,
                    },
                )}
                style={{
                    height: isMobile ? 'calc(100% - 60px)' : 'calc(100vh - 60px)',
                    maxHeight: '100%'
                }}
            >
                <div className="flex flex-col gap-1.5">
                    <div className="flex w-full flex-col gap-1.5 px-2">
                        {views.map((view) => (
                            <SidebarButton
                                key={view.id}
                                viewName={view.id}
                                icon={viewIcons[view.id]}
                                onClick={() => handleViewChange(view.id)}
                            />
                        ))}
                    </div>

                    <div className="my-1.5 hidden h-px w-full bg-gradient-to-r from-transparent via-slate-700/50 to-transparent px-2 md:block" />

                    <div className="mt-auto hidden w-full px-2 pb-3 md:block">
                        <button
                            className={cn(
                                "flex w-full items-center justify-center rounded-lg p-2.5 transition-all duration-200",
                                "hover:bg-indigo-500/10 hover:text-indigo-400",
                                "border border-transparent hover:border-indigo-500/20"
                            )}
                            onClick={changeState}
                            onMouseEnter={() => setShowTooltip(true)}
                            data-tooltip-id="activity-state-tooltip"
                            data-tooltip-content={
                                activityState === ACTIVITY_STATE.CODING
                                    ? "Switch to Drawing Mode"
                                    : "Switch to Coding Mode"
                            }
                        >
                            {activityState === ACTIVITY_STATE.CODING ? (
                                <Pencil className="h-5 w-5" />
                            ) : (
                                <Code2 className="h-5 w-5" />
                            )}
                        </button>
                    </div>

                    <div className="flex w-full flex-wrap justify-around gap-1 px-2 py-1 md:hidden">
                        {views.map((view) => (
                            <SidebarButton
                                key={view.id}
                                viewName={view.id}
                                icon={viewIcons[view.id]}
                                onClick={() => handleViewChange(view.id)}
                            />
                        ))}
                        <div className="relative">
                            <button
                                className={cn(
                                    "flex items-center justify-center rounded-lg p-2 transition-all duration-200",
                                    "hover:bg-indigo-500/10 hover:text-indigo-400",
                                    "border border-transparent hover:border-indigo-500/20"
                                )}
                                onClick={changeState}
                                data-tooltip-id="activity-state-tooltip"
                                data-tooltip-content={
                                    activityState === ACTIVITY_STATE.CODING
                                        ? "Switch to Drawing Mode"
                                        : "Switch to Coding Mode"
                                }
                            >
                                {activityState === ACTIVITY_STATE.CODING ? (
                                    <Pencil className="h-4 w-4 sm:h-5 sm:w-5" />
                                ) : (
                                    <Code2 className="h-4 w-4 sm:h-5 sm:w-5" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div
                className={cn(
                    "fixed left-[60px] top-[60px] z-30 w-[280px] sm:w-[320px] flex-col bg-slate-900/95 backdrop-blur-md transition-all duration-200 ease-in-out md:block",
                    {
                        "translate-x-0 opacity-100 fullscreen-mobile": isSidebarOpen,
                        "-translate-x-full opacity-0": !isSidebarOpen,
                    }
                )}
                style={getMobileSidebarStyle()}
            >
                <div className="flex items-center justify-between border-b border-slate-700/50 px-4 py-2 md:hidden">
                    <h2 className="text-lg font-semibold text-white">{activeView}</h2>
                    <button 
                        onClick={closeSidebar}
                        className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {showTooltip && (
                <Tooltip
                    id="activity-state-tooltip"
                    place="right"
                    offset={15}
                    className="!z-50"
                    style={{
                        backgroundColor: "rgb(30, 41, 59)",
                    }}
                />
            )}
        </aside>
    )
}

export default Sidebar

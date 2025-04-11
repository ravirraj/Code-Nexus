import { ReactNode } from "react"
import { AppContextProvider } from "./AppContext.js"
import { ChatContextProvider } from "./ChatContext.jsx"
import { FileContextProvider } from "./FileContext.jsx"
import { RunCodeContextProvider } from "./RunCodeContext.jsx"
import { SettingProvider } from "./SettingContext"
import { SocketProvider } from "./SocketContext"
import { ViewProvider } from "./ViewContext"

function AppProvider({ children }: { children: ReactNode }) {
    return (
        <AppContextProvider>
            <SocketProvider>
                <SettingProvider>
                    <ViewProvider>
                        <FileContextProvider>
                            <RunCodeContextProvider>
                                <ChatContextProvider>
                                    {children}
                                </ChatContextProvider>
                            </RunCodeContextProvider>
                        </FileContextProvider>
                    </ViewProvider>
                </SettingProvider>
            </SocketProvider>
        </AppContextProvider>
    )
}

export default AppProvider

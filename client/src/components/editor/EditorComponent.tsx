import { useFileSystem } from "@/context/FileContext"
import useResponsive from "@/hooks/useResponsive"
import useWindowDimensions from "@/hooks/useWindowDimensions"
import cn from "classnames"
import Editor from "./Editor"
import FileTab from "./FileTab"
import { useViews } from "@/context/ViewContext"

function EditorComponent() {
    const { openFiles } = useFileSystem()
    const { minHeightReached } = useResponsive()
    const { isMobile } = useWindowDimensions()
    const { isSidebarOpen } = useViews()

    if (openFiles.length <= 0) {
        return (
            <div className="flex h-full w-full items-center justify-center p-4 text-center">
                <h1 className="text-base sm:text-lg md:text-xl text-white">
                    No file is currently open.
                </h1>
            </div>
        )
    }

    return (
        <main
            className={cn(
                "flex w-full flex-col overflow-hidden relative", 
                {
                    "h-[calc(100vh-60px)]": !minHeightReached && !isMobile,
                    "h-[calc(100vh-110px)]": !minHeightReached && isMobile,
                    "h-full": minHeightReached,
                    "z-20": isMobile && isSidebarOpen
                }
            )}
            style={{
                maxHeight: isMobile ? 'calc(100% - 40px)' : undefined
            }}
        >
            <FileTab />
            <div className="relative flex-grow overflow-hidden">
                <Editor />
            </div>
        </main>
    )
}

export default EditorComponent

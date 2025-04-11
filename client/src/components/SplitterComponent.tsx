import { useViews } from "@/context/ViewContext"
import useLocalStorage from "@/hooks/useLocalStorage"
import useWindowDimensions from "@/hooks/useWindowDimensions"
import { ReactNode } from "react"
import Split from "react-split"

function SplitterComponent({ children }: { children: ReactNode }) {
    const { isSidebarOpen } = useViews()
    const { isMobile } = useWindowDimensions()
    const { setItem, getItem } = useLocalStorage()

    const getGutter = () => {
        const gutter = document.createElement("div")
        gutter.className = "h-full cursor-e-resize hidden md:block transition-colors hover:bg-indigo-500/20"
        gutter.style.backgroundColor = "rgba(30, 41, 59, 0.5)"
        return gutter
    }

    const getSizes = () => {
        if (isMobile) return [0, 100]
        const savedSizes = getItem("editorSizes")
        let sizes = [25, 75] // Wider initial sidebar size
        if (savedSizes) {
            const parsed = JSON.parse(savedSizes)
            // Ensure sizes are within bounds
            sizes = [
                Math.min(Math.max(parsed[0], 20), 40), // Min 20%, Max 40%
                Math.max(Math.min(parsed[1], 80), 60), // Min 60%, Max 80%
            ]
        }
        return isSidebarOpen ? sizes : [0, 100]
    }

    const getMinSizes = () => {
        if (isMobile) return [0, 100]
        return isSidebarOpen ? [250, 60] : [0, 100] // Wider minimum sidebar width
    }

    const getMaxSizes = () => {
        if (isMobile) return [0, 100]
        return isSidebarOpen ? [40, 100] : [0, 100] // Maximum sidebar width 40%
    }

    const handleGutterDrag = (sizes: number[]) => {
        // Ensure sizes are within bounds before saving
        const boundedSizes = [
            Math.min(Math.max(sizes[0], 20), 40), // Min 20%, Max 40%
            Math.max(Math.min(sizes[1], 80), 60), // Min 60%, Max 80%
        ]
        setItem("editorSizes", JSON.stringify(boundedSizes))
    }

    const getGutterStyle = () => ({
        width: "2px",
        display: isSidebarOpen && !isMobile ? "block" : "none",
    })

    return (
        <div className="flex h-full w-full overflow-hidden bg-slate-900">
            <Split
                sizes={getSizes()}
                minSize={getMinSizes()}
                gutter={getGutter}
                maxSize={getMaxSizes()}
                dragInterval={1}
                direction="horizontal"
                gutterAlign="center"
                cursor="e-resize"
                snapOffset={10}
                gutterStyle={getGutterStyle}
                onDrag={handleGutterDrag}
                className="flex h-full w-full items-stretch [&>*:first-child]:border-r [&>*:first-child]:border-slate-700/50 [&>*]:overflow-hidden"
            >
                {children}
            </Split>
        </div>
    )
}

export default SplitterComponent

import { useFileSystem } from "@/context/FileContext"
import { FileSystemItem } from "@/types/file"
import { BiArchiveIn } from "react-icons/bi"
import { TbFileUpload } from "react-icons/tb"
import { v4 as uuidV4 } from "uuid"
import toast from "react-hot-toast"
import { useState } from "react"
import { LuFile, LuFolder, LuFolderOpen } from "react-icons/lu"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export default function FilesView() {
    const { 
        downloadFilesAndFolders, 
        updateDirectory,
        fileStructure
    } = useFileSystem()
    const [isLoading, setIsLoading] = useState(false)
    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())

    const handleOpenDirectory = async () => {
        try {
            setIsLoading(true)

            // Check for modern API support
            if ("showDirectoryPicker" in window) {
                const directoryHandle = await window.showDirectoryPicker()
                await processDirectoryHandle(directoryHandle)
                return
            }

            // Fallback for browsers without `showDirectoryPicker`
            if ("webkitdirectory" in HTMLInputElement.prototype) {
                const fileInput = document.createElement("input")
                fileInput.type = "file"
                fileInput.webkitdirectory = true

                fileInput.onchange = async (e) => {
                    const files = (e.target as HTMLInputElement).files
                    if (files) {
                        const structure = await readFileList(files)
                        updateDirectory("", structure)
                    }
                }

                fileInput.click()
                return
            }

            // Notify if neither API is supported
            toast.error("Your browser does not support directory selection.")
        } catch (error) {
            console.error("Error opening directory:", error)
            toast.error("Failed to open directory")
        } finally {
            setIsLoading(false)
        }
    }

    const processDirectoryHandle = async (
        directoryHandle: FileSystemDirectoryHandle
    ) => {
        try {
            toast.loading("Getting files and folders...")
            const structure = await readDirectory(directoryHandle)
            updateDirectory("", structure)
            toast.dismiss()
            toast.success("Directory loaded successfully")
        } catch (error) {
            console.error("Error processing directory:", error)
            toast.error("Failed to process directory")
        }
    }

    const readDirectory = async (
        directoryHandle: FileSystemDirectoryHandle
    ): Promise<FileSystemItem[]> => {
        const children: FileSystemItem[] = []
        const blackList = ["node_modules", ".git", ".vscode", ".next"]

        for await (const entry of directoryHandle.values()) {
            if (entry.kind === "file") {
                const file = await entry.getFile()
                const newFile: FileSystemItem = {
                    id: uuidV4(),
                    name: entry.name,
                    type: "file",
                    content: await readFileContent(file),
                }
                children.push(newFile)
            } else if (entry.kind === "directory") {
                if (blackList.includes(entry.name)) continue

                const newDirectory: FileSystemItem = {
                    id: uuidV4(),
                    name: entry.name,
                    type: "directory",
                    children: await readDirectory(entry),
                    isOpen: false,
                }
                children.push(newDirectory)
            }
        }
        return children
    }

    const readFileList = async (files: FileList): Promise<FileSystemItem[]> => {
        const children: FileSystemItem[] = []
        const blackList = ["node_modules", ".git", ".vscode", ".next"]

        for (let i = 0; i < files.length; i++) {
            const file = files[i]
            const pathParts = file.webkitRelativePath.split("/")

            if (pathParts.some((part) => blackList.includes(part))) continue

            if (pathParts.length > 1) {
                const directoryPath = pathParts.slice(0, -1).join("/")
                const directoryIndex = children.findIndex(
                    (item) =>
                        item.name === directoryPath && item.type === "directory"
                )

                if (directoryIndex === -1) {
                    const newDirectory: FileSystemItem = {
                        id: uuidV4(),
                        name: directoryPath,
                        type: "directory",
                        children: [],
                        isOpen: false,
                    }
                    children.push(newDirectory)
                }

                const newFile: FileSystemItem = {
                    id: uuidV4(),
                    name: file.name,
                    type: "file",
                    content: await readFileContent(file),
                }

                const targetDirectory = children.find(
                    (item) =>
                        item.name === directoryPath && item.type === "directory"
                )
                if (targetDirectory && targetDirectory.children) {
                    targetDirectory.children.push(newFile)
                }
            } else {
                const newFile: FileSystemItem = {
                    id: uuidV4(),
                    name: file.name,
                    type: "file",
                    content: await readFileContent(file),
                }
                children.push(newFile)
            }
        }
        return children
    }

    const readFileContent = async (file: File): Promise<string> => {
        const MAX_FILE_SIZE = 1024 * 1024; // 1MB limit

        if (file.size > MAX_FILE_SIZE) {
            return `File too large: ${file.name} (${Math.round(
                file.size / 1024
            )}KB)`
        }

        try {
            return await file.text()
        } catch (error) {
            console.error(`Error reading file ${file.name}:`, error)
            return `Error reading file: ${file.name}`
        }
    }

    const toggleFolder = (folderId: string) => {
        setExpandedFolders((prev) => {
            const newSet = new Set(prev)
            if (newSet.has(folderId)) {
                newSet.delete(folderId)
            } else {
                newSet.add(folderId)
            }
            return newSet
        })
    }

    const renderFileItem = (file: FileSystemItem) => (
        <div key={file.id} className="flex items-center gap-2 px-4 py-1 hover:bg-gray-100">
            <LuFile className="h-4 w-4 text-gray-500" />
            <span className="flex-1 text-sm">{file.name}</span>
        </div>
    )

    const renderFolderItem = (folder: FileSystemItem) => (
        <div key={folder.id}>
            <div
                className={twMerge(
                    clsx(
                        "flex cursor-pointer items-center gap-2 px-4 py-1 hover:bg-gray-100",
                        expandedFolders.has(folder.id) && "bg-gray-50"
                    )
                )}
                onClick={() => toggleFolder(folder.id)}
            >
                {expandedFolders.has(folder.id) ? (
                    <LuFolderOpen className="h-4 w-4 text-gray-500" />
                ) : (
                    <LuFolder className="h-4 w-4 text-gray-500" />
                )}
                <span className="flex-1 text-sm">{folder.name}</span>
            </div>
            {expandedFolders.has(folder.id) && folder.children && (
                <div className="ml-4">
                    {folder.children.map((child) => 
                        child.type === "directory" 
                            ? renderFolderItem(child)
                            : renderFileItem(child)
                    )}
                </div>
            )}
        </div>
    )

    return (
        <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-gray-200 p-4">
                <h2 className="text-lg font-semibold">Files</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
                {Array.isArray(fileStructure) && fileStructure.map(renderFolderItem)}
            </div>
            <div className="flex flex-col gap-2 border-t border-gray-200 p-4">
                <button
                    className="flex w-full items-center justify-start rounded-md p-2 text-gray-700 hover:bg-gray-100"
                    onClick={handleOpenDirectory}
                    disabled={isLoading}
                >
                    <TbFileUpload className="mr-2 h-5 w-5" />
                    {isLoading ? "Loading..." : "Open File/Folder"}
                </button>
                <button
                    className="flex w-full items-center justify-start rounded-md p-2 text-gray-700 hover:bg-gray-100"
                    onClick={downloadFilesAndFolders}
                >
                    <BiArchiveIn className="mr-2 h-5 w-5" />
                    Download Code
                </button>
            </div>
        </div>
    )
}
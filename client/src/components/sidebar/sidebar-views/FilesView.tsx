import { useFileSystem } from "@/context/FileContext"
import { FileSystemItem } from "@/types/file"
import { BiArchiveIn } from "react-icons/bi"
import { TbFileUpload } from "react-icons/tb"
import { v4 as uuidV4 } from "uuid"
import toast from "react-hot-toast"
import { useState } from "react"
import { LuFolder, LuFolderOpen, LuPlus, LuX } from "react-icons/lu"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import getFileIcon from "@/utils/getFileIcon"

export default function FilesView() {
    const { 
        downloadFilesAndFolders, 
        updateDirectory,
        fileStructure,
        createFile,
        openFiles,
        activeFile,
        closeFile,
        openFile
    } = useFileSystem()
    const [isLoading, setIsLoading] = useState(false)
    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
    const [showNewFileDialog, setShowNewFileDialog] = useState(false)
    const [newFileName, setNewFileName] = useState("")
    const [selectedFolderId, setSelectedFolderId] = useState<string>("")

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
        const directoryMap = new Map<string, FileSystemItem>()

        for (let i = 0; i < files.length; i++) {
            const file = files[i]
            const pathParts = file.webkitRelativePath.split("/")

            if (pathParts.some((part) => blackList.includes(part))) continue

            if (pathParts.length > 1) {
                // Handle nested directories
                let currentPath = ""
                for (let j = 0; j < pathParts.length - 1; j++) {
                    currentPath = currentPath ? `${currentPath}/${pathParts[j]}` : pathParts[j]
                    
                    if (!directoryMap.has(currentPath)) {
                        const newDirectory: FileSystemItem = {
                            id: uuidV4(),
                            name: pathParts[j],
                            type: "directory",
                            children: [],
                            isOpen: false,
                        }
                        directoryMap.set(currentPath, newDirectory)
                        
                        if (j === 0) {
                            children.push(newDirectory)
                        } else {
                            const parentPath = currentPath.substring(0, currentPath.lastIndexOf("/"))
                            const parentDir = directoryMap.get(parentPath)
                            if (parentDir && parentDir.children) {
                                parentDir.children.push(newDirectory)
                            }
                        }
                    }
                }

                // Add file to its parent directory
                const parentPath = pathParts.slice(0, -1).join("/")
                const parentDir = directoryMap.get(parentPath)
                if (parentDir && parentDir.children) {
                    const newFile: FileSystemItem = {
                        id: uuidV4(),
                        name: file.name,
                        type: "file",
                        content: await readFileContent(file),
                    }
                    parentDir.children.push(newFile)
                }
            } else {
                // Handle root level files
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

    const handleCreateNewFile = () => {
        if (!newFileName.trim()) {
            toast.error("Please enter a file name")
            return
        }

        // Create the file in the selected folder or root
        const parentId = selectedFolderId || fileStructure.id
        createFile(parentId, newFileName)
        
        // Reset state
        setNewFileName("")
        setShowNewFileDialog(false)
        setSelectedFolderId("")
        
        toast.success(`File ${newFileName} created successfully`)
    }

    const openNewFileDialog = (folderId: string = "") => {
        setSelectedFolderId(folderId)
        setShowNewFileDialog(true)
        setTimeout(() => {
            const input = document.getElementById('fileName') as HTMLInputElement
            if (input) {
                input.focus()
            }
        }, 0)
    }

    const renderFileItem = (file: FileSystemItem) => (
        <div key={file.id} className="flex items-center gap-2 px-4 py-1 hover:bg-slate-800/50">
            {getFileIcon(file.name)}
            <span className="flex-1 text-sm text-slate-300">{file.name}</span>
        </div>
    )

    const renderFolderItem = (folder: FileSystemItem) => (
        <div key={folder.id}>
            <div
                className={twMerge(
                    clsx(
                        "flex cursor-pointer items-center gap-2 px-4 py-1 hover:bg-slate-800/50",
                        expandedFolders.has(folder.id) && "bg-slate-800/30"
                    )
                )}
                onClick={() => toggleFolder(folder.id)}
            >
                {expandedFolders.has(folder.id) ? (
                    <LuFolderOpen className="h-4 w-4 text-slate-400" />
                ) : (
                    <LuFolder className="h-4 w-4 text-slate-400" />
                )}
                <span className="flex-1 text-sm text-slate-300">{folder.name}</span>
                <button 
                    className="ml-auto rounded-md p-1 text-slate-400 hover:bg-slate-700/50 hover:text-white"
                    onClick={(e) => {
                        e.stopPropagation();
                        openNewFileDialog(folder.id);
                    }}
                >
                    <LuPlus className="h-3 w-3" />
                </button>
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

    const renderOpenedFiles = () => {
        if (!openFiles.length) return null;

        return (
            <div className="mb-4">
                <h3 className="mb-2 px-4 text-sm font-medium text-slate-400">Opened Files</h3>
                <div className="space-y-1">
                    {openFiles.map((file) => (
                        <div
                            key={file.id}
                            className={twMerge(
                                "flex cursor-pointer items-center gap-2 px-4 py-1.5 hover:bg-slate-800/50",
                                activeFile?.id === file.id && "bg-slate-800/30"
                            )}
                            onClick={() => openFile(file.id)}
                        >
                            {getFileIcon(file.name)}
                            <span className="flex-1 text-sm text-slate-300">{file.name}</span>
                            <button
                                className="rounded-md p-1 text-slate-400 hover:bg-slate-700/50 hover:text-white"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    closeFile(file.id);
                                }}
                            >
                                <LuX className="h-3 w-3" />
                            </button>
                        </div>
                    ))}
                </div>
                <div className="my-2 h-px w-full bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />
            </div>
        );
    };

    return (
        <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-slate-700/50 p-4">
                <h2 className="text-lg font-semibold text-white">Files</h2>
                <button 
                    className="rounded-md p-1 text-slate-400 hover:bg-slate-700/50 hover:text-white"
                    onClick={() => openNewFileDialog()}
                >
                    <LuPlus className="h-5 w-5" />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
                {renderOpenedFiles()}
                {fileStructure.children && fileStructure.children.length > 0 ? (
                    fileStructure.children.map(renderFolderItem)
                ) : openFiles.length === 0 ? (
                    <div className="flex h-full items-center justify-center p-4 text-center">
                        <p className="text-sm text-slate-400">No files loaded yet. Open a folder to get started.</p>
                    </div>
                ) : null}
            </div>
            <div className="flex flex-col gap-2 border-t border-slate-700/50 p-4">
                <button
                    className="flex w-full items-center justify-start rounded-md p-2 text-slate-300 hover:bg-slate-800/50"
                    onClick={handleOpenDirectory}
                    disabled={isLoading}
                >
                    <TbFileUpload className="mr-2 h-5 w-5" />
                    {isLoading ? "Loading..." : "Open File/Folder"}
                </button>
                <button
                    className="flex w-full items-center justify-start rounded-md p-2 text-slate-300 hover:bg-slate-800/50"
                    onClick={downloadFilesAndFolders}
                >
                    <BiArchiveIn className="mr-2 h-5 w-5" />
                    Download Files
                </button>
            </div>

            {/* New File Dialog */}
            {showNewFileDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                    <div className="w-full max-w-md rounded-lg bg-slate-800 p-6 shadow-lg">
                        <h3 className="mb-4 text-lg font-medium text-white">Create New File</h3>
                        <div className="mb-4">
                            <label htmlFor="fileName" className="mb-2 block text-sm font-medium text-slate-300">
                                File Name
                            </label>
                            <input
                                type="text"
                                id="fileName"
                                className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                                placeholder="index.cpp"
                                value={newFileName}
                                onChange={(e) => setNewFileName(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                className="rounded-md bg-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-600"
                                onClick={() => setShowNewFileDialog(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600"
                                onClick={handleCreateNewFile}
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
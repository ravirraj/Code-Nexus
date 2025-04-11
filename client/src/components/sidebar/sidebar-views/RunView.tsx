import { useRunCode } from "@/context/RunCodeContext"
import { ChangeEvent } from "react"
import toast from "react-hot-toast"
import { LuCopy } from "react-icons/lu"
import { PiCaretDownBold } from "react-icons/pi"

function RunView() {
    const {
        setInput,
        output,
        isRunning,
        supportedLanguages,
        selectedLanguage,
        setSelectedLanguage,
        runCode,
    } = useRunCode()

    const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const lang = JSON.parse(e.target.value)
        setSelectedLanguage(lang)
    }

    const copyOutput = () => {
        navigator.clipboard.writeText(output)
        toast.success("Output copied to clipboard")
    }

    return (
        <div
            className="flex h-full flex-col items-center gap-2 p-4"
        >
            <h1 className="view-title mb-2">Run Code</h1>
            {/* Controls Area */}
            <div className="flex w-full flex-col items-end gap-2">
                <div className="relative w-full">
                    <select
                        className="w-full rounded-md border-none bg-darkHover px-4 py-2 text-white outline-none appearance-none"
                        value={JSON.stringify(selectedLanguage)}
                        onChange={handleLanguageChange}
                    >
                        {supportedLanguages
                            .sort((a, b) => (a.language > b.language ? 1 : -1))
                            .map((lang, i) => {
                                return (
                                    <option
                                        key={i}
                                        value={JSON.stringify(lang)}
                                    >
                                        {lang.language +
                                            (lang.version
                                                ? ` (${lang.version})`
                                                : "")}
                                    </option>
                                )
                            })}
                    </select>
                    <PiCaretDownBold
                        size={16}
                        className="absolute bottom-3 right-4 z-10 text-white pointer-events-none"
                    />
                </div>
                <textarea
                    className="min-h-[80px] w-full resize-none rounded-md border-none bg-darkHover p-2 text-white outline-none"
                    placeholder="Write you input here..."
                    onChange={(e) => setInput(e.target.value)}
                />
                <button
                    className="flex w-full justify-center rounded-md bg-primary p-2 font-bold text-black outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={runCode}
                    disabled={isRunning}
                >
                    {isRunning ? "Running..." : "Run"}
                </button>
            </div>
            
            {/* Output Area */}
            <div className="w-full flex flex-grow flex-col border-t border-slate-700 pt-2 mt-2">
                <label className="flex w-full justify-between pb-1">
                    <span>Output:</span>
                    <button onClick={copyOutput} title="Copy Output">
                        <LuCopy
                            size={16}
                            className="cursor-pointer text-white hover:text-primary transition-colors"
                        />
                    </button>
                </label>
                <div className="w-full flex-grow resize-none overflow-y-auto rounded-md bg-darkHover p-2 text-white outline-none pr-2">
                    <pre className="text-wrap whitespace-pre-wrap break-words text-sm">
                        {output || <span className="text-slate-500">Output will appear here...</span>}
                    </pre>
                </div>
            </div>
        </div>
    )
}

export default RunView

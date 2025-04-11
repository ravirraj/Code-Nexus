import Select from "@/components/common/Select"
import { useSettings } from "@/context/SettingContext"
import useResponsive from "@/hooks/useResponsive"
import { editorFonts } from "@/resources/Fonts"
import { editorThemes } from "@/resources/Themes"
import { langNames } from "@uiw/codemirror-extensions-langs"
import { ChangeEvent, useEffect } from "react"

function SettingsView() {
    const {
        theme,
        setTheme,
        language,
        setLanguage,
        fontSize,
        setFontSize,
        fontFamily,
        setFontFamily,
        resetSettings,
    } = useSettings()

    const handleFontFamilyChange = (e: ChangeEvent<HTMLSelectElement>) =>
        setFontFamily(e.target.value)
    const handleThemeChange = (e: ChangeEvent<HTMLSelectElement>) =>
        setTheme(e.target.value)
    const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>) =>
        setLanguage(e.target.value)
    const handleFontSizeChange = (e: ChangeEvent<HTMLSelectElement>) =>
        setFontSize(parseInt(e.target.value))

    useEffect(() => {
        // Set editor font family
        const editor = document.querySelector(
            ".cm-editor > .cm-scroller",
        ) as HTMLElement
        if (editor !== null) {
            editor.style.fontFamily = `${fontFamily}, monospace`
        }
    }, [fontFamily])

    return (
        <div className="flex h-full flex-col items-center gap-2 p-4">
            <h1 className="view-title mb-2">Settings</h1>
            {/* Scrollable Settings Area */}
            <div className="w-full flex-grow space-y-4 overflow-y-auto pr-2">
                {/* Choose Font Family option */}
                <div className="flex w-full items-end gap-2">
                    <Select
                        onChange={handleFontFamilyChange}
                        value={fontFamily}
                        options={editorFonts}
                        title="Font Family"
                    />
                    {/* Choose font size option */}
                    <select
                        value={fontSize}
                        onChange={handleFontSizeChange}
                        className="rounded-md border-none bg-darkHover px-4 py-2 text-white outline-none"
                        title="Font Size"
                    >
                        {[...Array(13).keys()].map((size) => {
                            return (
                                <option key={size} value={size + 12}>
                                    {size + 12}
                                </option>
                            )
                        })}
                    </select>
                </div>
                {/* Choose theme option */}
                <Select
                    onChange={handleThemeChange}
                    value={theme}
                    options={Object.keys(editorThemes)}
                    title="Theme"
                />
                {/* Choose language option */}
                <Select
                    onChange={handleLanguageChange}
                    value={language}
                    options={langNames}
                    title="Language"
                />
            </div>
            {/* Reset Button Area */}
            <div className="mt-2 w-full border-t border-slate-700 pt-4">
                <button
                    className="w-full rounded-md border-none bg-darkHover px-4 py-2 text-white outline-none transition-colors hover:bg-red-800/50"
                    onClick={resetSettings}
                >
                    Reset to default
                </button>
            </div>
        </div>
    )
}

export default SettingsView

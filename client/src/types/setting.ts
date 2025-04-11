export interface Settings {
    theme: string
    language: string
    fontSize: number
    fontFamily: string
}

export interface SettingContextType {
    theme: string
    setTheme: (theme: string) => void
    language: string
    setLanguage: (language: string) => void
    fontSize: number
    setFontSize: (fontSize: number) => void
    fontFamily: string
    setFontFamily: (fontFamily: string) => void
}

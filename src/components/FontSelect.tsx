import { ALargeSmall } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTypingStore, type FontTheme } from "@/store/typing-store"

export function FontSelect() {
    const { fontTheme, setFontTheme } = useTypingStore()

    const fonts: { value: FontTheme; label: string }[] = [
        { value: 'serif', label: 'Serif' },
        { value: 'sans', label: 'Sans' },
        { value: 'mono', label: 'Mono' },
        { value: 'merriweather', label: 'Merriweather' },
        { value: 'roboto', label: 'Roboto Mono' },
        { value: 'fira', label: 'Fira Code' },
    ]

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <ALargeSmall className="h-[1.2rem] w-[1.2rem] text-primary" />
                    <span className="sr-only">Select font</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {fonts.map((font) => (
                    <DropdownMenuItem
                        key={font.value}
                        onClick={() => setFontTheme(font.value)}
                        className={fontTheme === font.value ? "bg-accent" : ""}
                    >
                        {font.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

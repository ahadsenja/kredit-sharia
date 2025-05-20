import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Menu, LogOut } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export function AppNavbar() {
    const { signOut } = useAuth()

    return (
        <div className="w-full flex justify-between md:justify-end items-center border-b border-gray-200 p-4 sm:px-4 sm:py-2">
            <div className="flex md:hidden">
                <Menu />
            </div>

            <DropdownMenu>
                <DropdownMenuTrigger className="cursor-pointer">
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="absolute right-0 top-1">
                    <DropdownMenuItem className="cursor-pointer" onClick={() => signOut()}>
                        <LogOut />
                        Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
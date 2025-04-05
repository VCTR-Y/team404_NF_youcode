import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useEffect, useState } from 'react'
import { ModeToggle } from './mode-toggle'

export function Navbar() {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUserEmail(user?.email ?? null)
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    location.href = '/'
  }

  return (
    <nav className="border-b px-4 py-3">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-xl font-bold">Dashboard</div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <ModeToggle />
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
              <DropdownMenuTrigger>
                <Button variant="ghost" className="p-0">
                  <Avatar>
                    <AvatarImage src="/path/to/avatar.jpg" alt={userEmail ?? 'User'} />
                    <AvatarFallback>{userEmail?.[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => alert('Settings clicked')}>
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  )
}

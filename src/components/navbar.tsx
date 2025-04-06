import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import { Link } from 'react-router-dom'


export function Navbar() {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [address, setAddress] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUserEmail(user?.email ?? null)
      
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('address, phone_number')
          .eq('id', user.id)
          .single()
          
        if (data) {
          setAddress(data.address || '')
          setPhoneNumber(data.phone_number || '')
        }
      }
    }
    getUser()
  }, [])

  const updateProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        address,
        phone_number: phoneNumber,
        updated_at: new Date().toISOString(),
      })

    if (error) {
      toast.error('Failed to update profile')
      return
    }

    toast.success('Profile updated successfully')
    setShowSettings(false)
  }

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
          <Button>
              <Link
                to='/donate'>
                Donate!
              </Link>
            </Button>
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
                <DropdownMenuItem onClick={() => setShowSettings(true)}>
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

      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className='bg-white dark:bg-black'>
          <DialogHeader>
            <DialogTitle>Update Profile</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                placeholder="Enter your address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <Button onClick={updateProfile}>Save changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </nav>
  )
}

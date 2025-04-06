import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import { Dropzone, DropzoneContent, DropzoneEmptyState } from "./dropzone"
import { useSupabaseUpload } from '@/hooks/use-supabase-upload'
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { useState } from "react"


export function DonateForm() {
    const props = useSupabaseUpload({
        bucketName: 'food_images',
        path: '/',
        allowedMimeTypes: ['image/*'],
        maxFiles: 1,
        maxFileSize: 1000 * 1000 * 10, // 10MB,
    })

    const [name, setName] = useState("");
    const [foodType, setFoodType] = useState("");
    const [quantity, setQuantity] = useState(null);
    const [date, setDate] = useState<Date>();

    const submitForm = async (e: React.FormEvent) => {
        e.preventDefault();
        if (foodType === "") {
            alert("Please select a food type.");
            return;
        }

        if (date === undefined) {
            alert("Please select a date.");
            return;
        }

        if (props.files.length === 0) {
            alert("Please upload an image.");
            return;
        }
        
        // handle form submission logic here

    }

    return (
        <Card className="w-full max-w-[400px] px-4 py-8">
            <CardHeader>
                <CardTitle>Donate a Food</CardTitle>
            </CardHeader>
            <CardContent>
            <form onSubmit={submitForm} className="space-y-4">  
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Name of your Food" value={name} onChange={(e) => setName(e.target.value)} required/>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="type">Food Type</Label>
              <Select value={foodType} onValueChange={setFoodType} required>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dairy">Dairy and Eggs</SelectItem>
                  <SelectItem value="meat">Meat</SelectItem>
                  <SelectItem value="vegetables">Vegatables</SelectItem>
                  <SelectItem value="fruits">Fruits</SelectItem>
                  <SelectItem value="grains">Grains</SelectItem>
                  <SelectItem value="beverages">Beverages</SelectItem>
                  <SelectItem value="snacks">Snacks</SelectItem>
                  <SelectItem value="condiments">Condiments</SelectItem>
                  <SelectItem value="leftovers">Leftovers</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-1.5">
                <Label htmlFor="quantity">Quantity</Label>
                <Input id="quantity" placeholder="Quantity" type="number" min={1} onChange={(e) => setQuantity(Number(e.target.value))} required/>
            </div>
            <div className="flex flex-col space-y-1.5">
            <Label>Upload Image</Label>
            <Dropzone {...props}>
                <DropzoneEmptyState />
                <DropzoneContent />
            </Dropzone>
            </div>
            <div>
            <Label className="mb-4">Expiry Date</Label>
            <Popover>
                <PopoverTrigger>
                    <Button
                    variant={"outline"}
                    type="button"
                    className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                    )}
                    >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    />
                </PopoverContent>
                </Popover>
            </div>
            <Button type="submit" className="w-full" >
                Submit
            </Button>
          </div>
        </form>
            </CardContent>
        </Card>
    )
}
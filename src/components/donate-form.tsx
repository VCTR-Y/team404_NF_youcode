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
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useNavigate } from "react-router-dom";
import { analyzeFoodImage } from "@/lib/food-analysis/service";


export function DonateForm() {
    const bucketName = 'food_images';
    const uploadPath = '/';

    const props = useSupabaseUpload({
        bucketName: bucketName,
        path: uploadPath,
        allowedMimeTypes: ['image/*'],
        maxFiles: 1,
        maxFileSize: 1000 * 1000 * 10,
    })

    const [name, setName] = useState("");
    const [foodType, setFoodType] = useState("");
    const [quantity, setQuantity] = useState<number | null>(null);
    const [date, setDate] = useState<Date | undefined>();
    const [isSubmitting, setIsSubmitting] = useState(false); 
    const supabase = createClient();
    const navigate = useNavigate();

    const submitForm = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (props.files.length === 0) {
                alert("Please upload an image.");
                setIsSubmitting(false);
                return;
            }

            let expiryDate = date;
            if (expiryDate === undefined) {
                try {
                    const analysis = await analyzeFoodImage(props.files[0]);
                    
                    if (analysis.qualityState === 'expired') {
                        alert("The AI analysis indicates this food item appears to be expired. Please verify and try again with fresh food.");
                        setIsSubmitting(false);
                        return;
                    }

                    expiryDate = new Date(analysis.predictedExpiryDate);
                    setDate(expiryDate);
                } catch (error: unknown) {
                    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
                    console.error("AI Analysis error:", errorMessage);
                    alert("Failed to analyze food image. Please manually select an expiry date.");
                    setIsSubmitting(false);
                    return;
                }
            }

            await props.onUpload();

            // if (props.errors.length > 0) {
            //     alert(`Upload failed: ${props.errors[0].message}`);
            //     setIsSubmitting(false);
            //     return;
            // }

            // if (props.successes.length === 0) {
            //     alert("Upload did not complete successfully. Please try again.");
            //     setIsSubmitting(false);
            //     return;
            // }

            if (foodType === "") {
                alert("Please select a food type.");
                setIsSubmitting(false);
                return;
            }


            const uploadedFile = props.files[0];
            const filePath = `${uploadPath || ''}/${uploadedFile.name}`.replace(/^\/+/, '');
            const { data: urlData } = supabase.storage
                .from(bucketName)
                .getPublicUrl(filePath);

            if (!urlData?.publicUrl) {
                throw new Error("Could not get public URL for the uploaded image.");
            }
            const imageUrl = urlData.publicUrl;

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                throw new Error("User not authenticated.");
            }
            const userId = user.id;

            const { error: insertError } = await supabase
                .from('food_items')
                .insert([
                    {
                        name: name,
                        category: foodType,
                        quantity: quantity,
                        expiry_date: expiryDate.toISOString(),
                        image_url: imageUrl,
                        user_id: userId,
                    }
                ]);

            if (insertError) {
                throw insertError;
            }

            alert("Food item donated successfully!");
            // Reset form state (optional, depends on desired UX)
            // setName("");
            // setFoodType("");
            // setQuantity(null);
            // setDate(undefined);
            // props.setFiles([]); // Clear uploaded files from dropzone state
            // props.setErrors([]); // Clear any previous errors
            // props.successes = []; // Reset successes - might need a setter in the hook
            navigate('/dashboard'); // Redirect to dashboard or another relevant page

        } catch (error: unknown) { // Change type from any to Error
            console.error("Donation error:", error);
            console.log(error);
            alert(`An error occurred: ${error || 'Please try again.'}`);
        } finally {
            setIsSubmitting(false); // Reset submitting state regardless of outcome
        }
    };

    return (
        <div className="flex h-screen items-center justify-center p-6 md:p-10">
            <Card className="w-full max-w-[800px] px-4 py-8">
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
                  <SelectItem value="dairy_and_eggs">Dairy and Eggs</SelectItem>
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
            <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </form>
            </CardContent>
        </Card>
        </div>
    )
}

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { createClient } from '../lib/supabase/client';
import { Navbar } from './navbar';


type FoodItemDetail = {
  id: string;
  name: string;
  expiry_date: string;
  category: string;
  quantity: number;
  image_url?: string;
  user_id: string;
};

type UserProfile = {
  id: string;
  full_name?: string;
  email?: string;
};

export function FoodDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [foodItem, setFoodItem] = useState<FoodItemDetail | null>(null);
  const [poster, setPoster] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    async function fetchDetails() {
      if (!id) {
        setError('Food item ID is missing.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      const { data: itemData, error: itemError } = await supabase
        .from('food_items')
        .select('*')
        .eq('id', id)
        .single();

      if (itemError || !itemData) {
        console.error('Error fetching food item:', itemError);
        setError('Failed to load food item details.');
        setFoodItem(null);
        setPoster(null);
        setLoading(false);
        return;
      }

      setFoodItem(itemData as FoodItemDetail);

      if (itemData.user_id) {
        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .select('id, full_name, email')
          .eq('id', itemData.user_id)
          .single();

        if (profileError) {
          console.error('Error fetching user profile:', profileError);
          setError('Failed to load poster information.');
          setPoster(null);
        } else {
          setPoster(profileData as UserProfile);
        }
      } else {
        setPoster(null);
      }

      setLoading(false);
    }

    fetchDetails();
  }, [id]);

  function formatCategory(category: string): string {
    return category
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  return (
    <div className="h-full">
      <Navbar />
      <main className="container mx-auto py-8">
        {loading && <p>Loading details...</p>}
        {error && <p className="text-red-500">{error}</p>}
        
        {foodItem && !loading && (
          <div className="rounded-lg border bg-card p-6 shadow-sm max-w-2xl mx-auto">
            {foodItem.image_url && (
              <div className="mb-4">
                <img 
                  src={foodItem.image_url} 
                  alt={foodItem.name}
                  className="w-full h-64 object-cover rounded-md"
                />
              </div>
            )}
            <h2 className="text-2xl font-semibold mb-4">{foodItem.name}</h2>
            <div className="space-y-2 text-muted-foreground mb-6">
              <p><strong>Category:</strong> {formatCategory(foodItem.category)}</p>
              <p><strong>Quantity:</strong> {foodItem.quantity}</p>
              <p><strong>Expires:</strong> {new Date(foodItem.expiry_date).toLocaleDateString()}</p>
            </div>

            {poster && (
              <div className="border-t pt-4 mt-4">
                <h3 className="text-lg font-medium mb-2">Posted By:</h3>
                <p><strong>Name:</strong> {poster.full_name || 'N/A'}</p>
                <p><strong>Contact:</strong> {poster.email || 'Not available'}</p> 
              </div>
            )}
            {!poster && foodItem.user_id && !loading && (
                 <p className="text-sm text-muted-foreground mt-4">Could not load poster information.</p>
            )}
             {!poster && !foodItem.user_id && !loading && (
                 <p className="text-sm text-muted-foreground mt-4">Poster information not available for this item.</p>
            )}
          </div>
        )}
        {!foodItem && !loading && !error && (
             <p>Food item not found.</p>
        )}
      </main>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface Donation {
  id: string;
  food_name: string;
  description: string;
  quantity: number;
  expiry_date: string;
  image_url: string;
  user_id: string;
  created_at: string;
}

export function MyPostings() {
  const [postings, setPostings] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchUserAndPostings = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const { data, error } = await supabase
          .from('food_items')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching postings:', error);
          toast.error('Failed to fetch your postings.');
        } else {
          setPostings(data || []);
        }
      } else {
        toast.error('You need to be logged in to view your postings.');
      }
      setLoading(false);
    };

    fetchUserAndPostings();
  }, []);

  const handleDelete = async (postId: string) => {
    if (!userId) return;

    // Optional: Add a confirmation dialog here

    const { error } = await supabase
      .from('donations')
      .delete()
      .match({ id: postId, user_id: userId });

    if (error) {
      console.error('Error deleting posting:', error);
      toast.error('Failed to delete posting.');
    } else {
      setPostings(postings.filter(post => post.id !== postId));
      toast.success('Posting deleted successfully.');
    }
  };

  if (loading) {
    return <div>Loading your postings...</div>;
  }

  if (!userId) {
    return <div>Please log in to see your postings.</div>; 
  }

  if (postings.length === 0) {
    return <div>You haven't made any postings yet.</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">My Postings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {postings.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <CardTitle>{post.food_name}</CardTitle>
            </CardHeader>
            <CardContent>
              {post.image_url && (
                <img src={post.image_url} alt={post.food_name} className="w-full h-48 object-cover mb-4 rounded" />
              )}
              <p className="mb-2"><strong>Description:</strong> {post.description}</p>
              <p className="mb-2"><strong>Quantity:</strong> {post.quantity}</p>
              <p className="mb-2"><strong>Expiry Date:</strong> {new Date(post.expiry_date).toLocaleDateString()}</p>
              <p className="text-sm text-gray-500">Posted on: {new Date(post.created_at).toLocaleDateString()}</p>
            </CardContent>
            <CardFooter>
              <Button variant="destructive" onClick={() => handleDelete(post.id)}>
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

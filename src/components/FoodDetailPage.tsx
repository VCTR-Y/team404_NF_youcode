import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { createClient } from "../lib/supabase/client";
import { Navbar } from "./navbar";
import { generateRecipes } from "../lib/food-analysis/service";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

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
  first_name?: string;
  last_name?: string;
  address?: string;
  phone_number?: string;
};

export function FoodDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [foodItem, setFoodItem] = useState<FoodItemDetail | null>(null);
  const [poster, setPoster] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recipes, setRecipes] = useState<string[] | null>(null); // State for recipes
  const [recipeLoading, setRecipeLoading] = useState(false); // State for recipe loading
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  const supabase = createClient();

  useEffect(() => {
    async function fetchDetails() {
      if (!id) {
        setError("Food item ID is missing.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      const { data: itemData, error: itemError } = await supabase
        .from("food_items")
        .select("*")
        .eq("id", id)
        .single();

      if (itemError || !itemData) {
        console.error("Error fetching food item:", itemError);
        setError("Failed to load food item details.");
        setFoodItem(null);
        setPoster(null);
        setLoading(false);
        return;
      }

      setFoodItem(itemData as FoodItemDetail);

      if (itemData.user_id) {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("id, first_name, last_name, address, phone_number")
          .eq("id", itemData.user_id)
          .single();

        if (profileError) {
          console.error("Error fetching user profile:", profileError);
          setError("Failed to load poster information.");
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
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  async function fetchRecipes() {
    if (!foodItem) return;

    setRecipeLoading(true);
    setRecipes(null);

    try {
      const recipe = await generateRecipes(foodItem.name);
      setRecipes([recipe]); // Wrap the single recipe in an array for consistency
      setIsModalOpen(true); // Open the modal when the recipe is fetched
    } catch (err) {
      console.error(err);
      setRecipes([]);
    } finally {
      setRecipeLoading(false);
    }
  }

  return (
    <div className="h-full">
      <Navbar />
      <main className="container mx-auto py-8">
        {loading && <p>Loading details...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {foodItem && !loading && (
          <div className="rounded-lg border bg-card p-6 shadow-sm max-w-2xl mx-auto">
            <Button className="absolute top-18 right-4">
                <Link to="/dashboard">Back</Link>
            </Button>
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
              <p>
                <strong>Category:</strong> {formatCategory(foodItem.category)}
              </p>
              <p>
                <strong>Quantity:</strong> {foodItem.quantity}
              </p>
              <p>
                <strong>Expires:</strong>{" "}
                {new Date(foodItem.expiry_date).toLocaleDateString()}
              </p>
            </div>

            {poster && (
              <div className="border-t pt-4 mt-4">
                <h3 className="text-lg font-medium mb-2">Posted By:</h3>
                <p>
                  <strong>Name:</strong> {poster.first_name || "N/A"}{" "}
                  {poster.last_name || "N/A"}{" "}
                </p>
                <p>
                  <strong>Contact (phone number):</strong>{" "}
                  {poster.phone_number || "Not available"}
                </p>
                <p>
                  <strong>Address:</strong> {poster.address || "Not available"}
                </p>
              </div>
            )}
            {!poster && foodItem.user_id && !loading && (
              <p className="text-sm text-muted-foreground mt-4">
                Could not load poster information.
              </p>
            )}
            {!poster && !foodItem.user_id && !loading && (
              <p className="text-sm text-muted-foreground mt-4">
                Poster information not available for this item.
              </p>
            )}

            {/* Recipe Section */}
            <div className="mt-6">
              <button
                onClick={fetchRecipes}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                disabled={recipeLoading}
              >
                {recipeLoading ? "Generating Recipe..." : "Get Recipe Idea"}
              </button>
            </div>
          </div>
        )}
        {!foodItem && !loading && !error && <p>Food item not found.</p>}

        {/* Modal for Recipes */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-white dark:bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-background rounded-lg p-8 max-w-2xl w-full h-auto">
              <h3 className="text-xl font-medium mb-4 text-black dark:text-white">Recipe Idea</h3>
              {recipes && recipes.length > 0 ? (
                <p className="text-black dark:text-white">{recipes[0]}</p>
              ) : (
                <p className="text-black dark:text-white">No recipe found.</p>
              )}
              <button
                onClick={() => setIsModalOpen(false)}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

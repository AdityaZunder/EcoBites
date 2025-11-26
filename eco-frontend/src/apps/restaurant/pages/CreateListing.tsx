import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/shared/contexts/AuthContext';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Badge } from '@/shared/components/ui/badge';
import { Textarea } from '@/shared/components/ui/textarea';
import { Card } from '@/shared/components/ui/card';
import { ThemeToggle } from '@/shared/components/ThemeToggle';
import { Leaf, ArrowLeft, Upload, Loader2 } from 'lucide-react';
import { useToast } from '@/shared/hooks/use-toast';
import { Switch } from '@/shared/components/ui/switch';
import { uploadImage, createListing } from '@/shared/services/api';

const CreateListing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    originalPrice: '',
    discountedPrice: '',
    quantity: '',
    expiresInHours: '3',
    isPriorityAccess: false,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);

    try {
      let imageUrl = '';
      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile);
      }

      // TODO: Get real restaurant ID from user context or backend
      // For now, using a placeholder or user.id if user is restaurant
      const restaurantId = 'restaurant-1'; // Replace with actual logic

      await createListing({
        restaurantId: restaurantId, // This needs to be dynamic
        ...formData,
        imageUrl,
        originalPrice: parseFloat(formData.originalPrice),
        discountedPrice: parseFloat(formData.discountedPrice),
        quantity: parseInt(formData.quantity),
        expiresInHours: parseInt(formData.expiresInHours),
      });

      toast({
        title: 'Listing Created! 🎉',
        description: 'Your listing is now live and visible to customers',
      });

      setTimeout(() => {
        navigate('/restaurant/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Failed to create listing:', error);
      toast({
        title: 'Error',
        description: 'Failed to create listing. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!user || user.role !== 'restaurant') {
    navigate('/login?role=restaurant');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full gradient-eco flex items-center justify-center">
              <Leaf className="h-6 w-6 text-eco-foreground" />
            </div>
            <h1 className="text-2xl font-bold">EcoBites</h1>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/restaurant/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <Card className="p-8">
          <h1 className="text-3xl font-bold mb-6">Create New Listing</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Item Photo</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="max-h-48 mx-auto rounded-md" />
                ) : (
                  <>
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG up to 5MB
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Item Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Fresh Garden Salad Bowl"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your item... what's included, ingredients, etc."
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
                required
              />
            </div>

            {/* Pricing */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="originalPrice">Original Price ($) *</Label>
                <Input
                  id="originalPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="12.99"
                  value={formData.originalPrice}
                  onChange={(e) => handleChange('originalPrice', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="discountedPrice">Discounted Price ($) *</Label>
                <Input
                  id="discountedPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="5.99"
                  value={formData.discountedPrice}
                  onChange={(e) => handleChange('discountedPrice', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Discount Preview */}
            {formData.originalPrice && formData.discountedPrice && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium">
                  Discount: {Math.round(((parseFloat(formData.originalPrice) - parseFloat(formData.discountedPrice)) / parseFloat(formData.originalPrice)) * 100)}% off
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Customers save ${(parseFloat(formData.originalPrice) - parseFloat(formData.discountedPrice)).toFixed(2)}
                </p>
              </div>
            )}

            {/* Quantity & Expiry */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Available Quantity *</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  placeholder="10"
                  value={formData.quantity}
                  onChange={(e) => handleChange('quantity', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiresInHours">Expires In (Hours) *</Label>
                <Input
                  id="expiresInHours"
                  type="number"
                  min="1"
                  max="24"
                  placeholder="3"
                  value={formData.expiresInHours}
                  onChange={(e) => handleChange('expiresInHours', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Priority Access */}
            <div className={`flex items-center justify-between p-4 border rounded-lg ${(user?.dailyPriorityItemsAddedToday || 0) >= 3
              ? 'bg-muted border-muted-foreground/20'
              : 'border-border'
              }`}>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Label htmlFor="priority" className="cursor-pointer font-semibold">Priority Access</Label>
                  <Badge variant="outline" className="text-xs">
                    {3 - (user?.dailyPriorityItemsAddedToday || 0)} remaining today
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Show this listing first to priority members.
                  <span className="block mt-1 text-xs text-primary">
                    Benefit: 2x more visibility, faster sales, more earnings.
                  </span>
                </p>
              </div>
              <Switch
                id="priority"
                checked={formData.isPriorityAccess}
                onCheckedChange={(checked) => {
                  if (checked && (user?.dailyPriorityItemsAddedToday || 0) >= 3) {
                    toast({
                      title: "Daily Limit Reached",
                      description: "You can only mark 3 items as Priority Deals per day.",
                      variant: "destructive"
                    });
                    return;
                  }
                  handleChange('isPriorityAccess', checked);
                }}
                disabled={(user?.dailyPriorityItemsAddedToday || 0) >= 3}
              />
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Listing'
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/restaurant/dashboard')}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default CreateListing;

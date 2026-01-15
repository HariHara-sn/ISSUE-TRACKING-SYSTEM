import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, X, CheckCircle2, Sparkles } from 'lucide-react';
import { issueCategories } from '@/data/mockData';

const categoryTitles: Record<string, string> = {
  cleanliness: 'Cleanliness Issue',
  hostel: 'Hostel Issue',
  wifi: 'WiFi Issue',
  transport: 'Transport Issue',
  academy: 'Academy Issue',
  canteen: 'Canteen Issue',
  restroom: 'Restroom Issue',
  other: 'Other Issue',
};

export default function IssueFormPage() {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  
  const defaultTitle = categoryTitles[category || 'other'] || 'Issue';
  
  const [formData, setFormData] = useState({
    title: defaultTitle,
    description: '',
    priority: 'low',
    image: null as File | null,
    imagePreview: '',
    // Hostel specific
    roomNo: '',
    cotNo: '',
    foodQuality: '',
    // WiFi specific
    name: '',
    email: '',
    macAddress: '',
    otherIssue: '',
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({
        ...formData,
        image: file,
        imagePreview: URL.createObjectURL(file),
      });
    }
  };

  const removeImage = () => {
    setFormData({
      ...formData,
      image: null,
      imagePreview: '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
    
    // Navigate to dashboard after 4 seconds
    setTimeout(() => {
      navigate('/student');
    }, 4000);
  };

  if (showSuccess) {
    return (
      <DashboardLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center animate-fade-in">
            <div className="relative mb-8">
              {/* Animated circles */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-40 h-40 rounded-full bg-primary/20 animate-ping" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-primary/30 animate-pulse" />
              </div>
              <div className="relative flex items-center justify-center w-40 h-40 mx-auto">
                <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center shadow-elegant">
                  <CheckCircle2 className="w-12 h-12 text-primary-foreground animate-bounce" />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-foreground animate-fade-in">
                Thank You! 🎉
              </h1>
              <p className="text-xl text-muted-foreground animate-fade-in" style={{ animationDelay: '0.2s' }}>
                Your complaint has been submitted successfully
              </p>
              <p className="text-muted-foreground animate-fade-in" style={{ animationDelay: '0.4s' }}>
                We will resolve it shortly. Redirecting to dashboard...
              </p>
              
              {/* Animated dots */}
              <div className="flex items-center justify-center gap-2 mt-6">
                <div className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0s' }} />
                <div className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const categoryInfo = issueCategories.find(c => c.id === category);

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Report {categoryInfo?.name || 'Issue'}</h1>
            <p className="text-muted-foreground">Fill in the details below to submit your complaint</p>
          </div>
        </div>

        <Card className="border-border shadow-elegant">
          <CardHeader>
            <CardTitle>Issue Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Issue Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter issue title"
                  className="bg-background"
                />
                <p className="text-xs text-muted-foreground">You can edit the title to be more specific</p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the issue in detail..."
                  className="min-h-[120px] bg-background"
                  required
                />
              </div>

              {/* Priority */}
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData({ ...formData, priority: value })}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Hostel-specific fields */}
              {category === 'hostel' && (
                <div className="space-y-4 p-4 rounded-lg bg-muted/50 border border-border">
                  <h3 className="font-semibold text-foreground">Hostel Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="roomNo">Room No</Label>
                      <Input
                        id="roomNo"
                        value={formData.roomNo}
                        onChange={(e) => setFormData({ ...formData, roomNo: e.target.value })}
                        placeholder="e.g., 305"
                        className="bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cotNo">Cot No</Label>
                      <Input
                        id="cotNo"
                        value={formData.cotNo}
                        onChange={(e) => setFormData({ ...formData, cotNo: e.target.value })}
                        placeholder="e.g., 2"
                        className="bg-background"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="foodQuality">Quality of Food (if applicable)</Label>
                    <Select
                      value={formData.foodQuality}
                      onValueChange={(value) => setFormData({ ...formData, foodQuality: value })}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Select food quality" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="poor">Poor</SelectItem>
                        <SelectItem value="average">Average</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="na">Not Applicable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* WiFi-specific fields */}
              {category === 'wifi' && (
                <div className="space-y-4 p-4 rounded-lg bg-muted/50 border border-border">
                  <h3 className="font-semibold text-foreground">WiFi Issue Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter your name"
                        className="bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email ID</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your.email@university.edu"
                        className="bg-background"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="macAddress">MAC Address</Label>
                    <Input
                      id="macAddress"
                      value={formData.macAddress}
                      onChange={(e) => setFormData({ ...formData, macAddress: e.target.value })}
                      placeholder="e.g., 00:1A:2B:3C:4D:5E"
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="otherIssue">Other Issue Details</Label>
                    <Textarea
                      id="otherIssue"
                      value={formData.otherIssue}
                      onChange={(e) => setFormData({ ...formData, otherIssue: e.target.value })}
                      placeholder="Any additional WiFi-related issue details..."
                      className="min-h-[80px] bg-background"
                    />
                  </div>
                </div>
              )}

              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Upload Image (Optional)</Label>
                {formData.imagePreview ? (
                  <div className="relative inline-block">
                    <img
                      src={formData.imagePreview}
                      alt="Preview"
                      className="w-full max-w-xs rounded-lg border border-border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 w-6 h-6"
                      onClick={removeImage}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">PNG, JPG or GIF</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/student/report')}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Submit Complaint
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

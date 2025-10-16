import React, { useEffect, useState } from 'react';
import { mockAPI, Claim, CreateClaimData } from '@/lib/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, FileText, Calendar, MapPin, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Claims: React.FC = () => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNewClaimDialog, setShowNewClaimDialog] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const [newClaim, setNewClaim] = useState<CreateClaimData>({
    crop_type: '',
    area_affected: 0,
    damage_description: '',
    estimated_loss: 0,
    date_of_loss: '',
    location: '',
  });

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      const data = await mockAPI.getClaims();
      setClaims(data);
    } catch (error) {
      console.error('Error fetching claims:', error);
      toast({
        title: "Error",
        description: "Failed to load claims. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setNewClaim({
      ...newClaim,
      [name]: type === 'number' ? Number(value) : value,
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const data = await mockAPI.createClaim(newClaim);
      setClaims([data, ...claims]);
      setShowNewClaimDialog(false);
      setNewClaim({
        crop_type: '',
        area_affected: 0,
        damage_description: '',
        estimated_loss: 0,
        date_of_loss: '',
        location: '',
      });
      toast({
        title: "Claim submitted successfully",
        description: "Your claim has been submitted for review.",
      });
    } catch (err: any) {
      setError(err.message || 'Failed to submit claim. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'rejected':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Insurance Claims</h1>
            <p className="text-muted-foreground">
              Manage your crop insurance claims and track their status
            </p>
          </div>
          
          <Dialog open={showNewClaimDialog} onOpenChange={setShowNewClaimDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Submit New Claim</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Submit New Insurance Claim</DialogTitle>
                <DialogDescription>
                  Fill out the form below to submit a new crop insurance claim
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="crop_type">Crop Type</Label>
                    <Input
                      id="crop_type"
                      name="crop_type"
                      value={newClaim.crop_type}
                      onChange={handleInputChange}
                      placeholder="e.g., Wheat, Corn, Rice"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="area_affected">Area Affected (acres)</Label>
                    <Input
                      id="area_affected"
                      name="area_affected"
                      type="number"
                      step="0.1"
                      value={newClaim.area_affected}
                      onChange={handleInputChange}
                      placeholder="0.0"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="estimated_loss">Estimated Loss ($)</Label>
                    <Input
                      id="estimated_loss"
                      name="estimated_loss"
                      type="number"
                      step="0.01"
                      value={newClaim.estimated_loss}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date_of_loss">Date of Loss</Label>
                    <Input
                      id="date_of_loss"
                      name="date_of_loss"
                      type="date"
                      value={newClaim.date_of_loss}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={newClaim.location}
                    onChange={handleInputChange}
                    placeholder="Field location or coordinates"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="damage_description">Damage Description</Label>
                  <Textarea
                    id="damage_description"
                    name="damage_description"
                    value={newClaim.damage_description}
                    onChange={handleInputChange}
                    placeholder="Describe the damage to your crops in detail..."
                    rows={4}
                    required
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowNewClaimDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Claim'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Claims List */}
        {claims.length > 0 ? (
          <div className="grid gap-6">
            {claims.map((claim) => (
              <Card key={claim.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <FileText className="h-5 w-5" />
                        <span>{claim.crop_type} - Claim #{claim.id}</span>
                      </CardTitle>
                      <CardDescription>
                        Submitted on {formatDate(claim.created_at)}
                      </CardDescription>
                    </div>
                    <Badge variant={getStatusColor(claim.status)}>
                      {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Estimated Loss</p>
                        <p className="font-medium">${claim.estimated_loss.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Date of Loss</p>
                        <p className="font-medium">{formatDate(claim.date_of_loss)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p className="font-medium">{claim.location}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground mb-1">Area Affected</p>
                    <p className="font-medium">{claim.area_affected} acres</p>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground mb-1">Damage Description</p>
                    <p className="text-sm">{claim.damage_description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No claims submitted yet</h3>
              <p className="text-muted-foreground mb-6">
                Get started by submitting your first insurance claim
              </p>
              <Button onClick={() => setShowNewClaimDialog(true)}>
                Submit Your First Claim
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Claims;
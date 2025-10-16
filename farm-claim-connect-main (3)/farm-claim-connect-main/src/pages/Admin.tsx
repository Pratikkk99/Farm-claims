import React, { useEffect, useState } from 'react';
import { mockAPI, Claim } from '@/lib/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText, CheckCircle, XCircle, Clock, DollarSign, Calendar, MapPin, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Admin: React.FC = () => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

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

  const updateClaimStatus = async (claimId: number, status: 'approved' | 'rejected') => {
    setIsUpdating(true);
    try {
      await mockAPI.updateClaimStatus(claimId, status);
      setClaims(claims.map(claim => 
        claim.id === claimId ? { ...claim, status } : claim
      ));
      toast({
        title: "Status updated",
        description: `Claim has been ${status}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update claim status.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
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
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getClaimStats = () => {
    const totalClaims = claims.length;
    const pendingClaims = claims.filter(claim => claim.status === 'pending').length;
    const approvedClaims = claims.filter(claim => claim.status === 'approved').length;
    const rejectedClaims = claims.filter(claim => claim.status === 'rejected').length;
    const totalValue = claims.reduce((sum, claim) => sum + claim.estimated_loss, 0);
    
    return { totalClaims, pendingClaims, approvedClaims, rejectedClaims, totalValue };
  };

  const { totalClaims, pendingClaims, approvedClaims, rejectedClaims, totalValue } = getClaimStats();

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage insurance claims and review farmer submissions
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Claims</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalClaims}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{pendingClaims}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{approvedClaims}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{rejectedClaims}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Claims List */}
        <Card>
          <CardHeader>
            <CardTitle>Claims Management</CardTitle>
            <CardDescription>
              Review and manage farmer insurance claims
            </CardDescription>
          </CardHeader>
          <CardContent>
            {claims.length > 0 ? (
              <div className="space-y-4">
                {claims.map((claim) => (
                  <div key={claim.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <h3 className="font-medium">
                            {claim.crop_type} - Claim #{claim.id}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Submitted {formatDate(claim.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={getStatusColor(claim.status)}>
                          {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                        </Badge>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedClaim(claim)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Review
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>
                                Claim #{claim.id} - {claim.crop_type}
                              </DialogTitle>
                              <DialogDescription>
                                Review claim details and update status
                              </DialogDescription>
                            </DialogHeader>
                            
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <p className="text-sm font-medium">Estimated Loss</p>
                                  <p className="text-2xl font-bold text-primary">
                                    ${claim.estimated_loss.toLocaleString()}
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm font-medium">Area Affected</p>
                                  <p className="text-lg font-medium">{claim.area_affected} acres</p>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
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

                              <div>
                                <p className="text-sm font-medium mb-2">Damage Description</p>
                                <div className="p-3 bg-muted rounded-lg">
                                  <p className="text-sm">{claim.damage_description}</p>
                                </div>
                              </div>

                              {claim.status === 'pending' && (
                                <div className="flex justify-end space-x-2 pt-4">
                                  <Button
                                    variant="destructive"
                                    onClick={() => updateClaimStatus(claim.id, 'rejected')}
                                    disabled={isUpdating}
                                  >
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Reject
                                  </Button>
                                  <Button
                                    variant="success"
                                    onClick={() => updateClaimStatus(claim.id, 'approved')}
                                    disabled={isUpdating}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Approve
                                  </Button>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Estimated Loss</p>
                        <p className="font-medium">${claim.estimated_loss.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Area Affected</p>
                        <p className="font-medium">{claim.area_affected} acres</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Date of Loss</p>
                        <p className="font-medium">{formatDate(claim.date_of_loss)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Location</p>
                        <p className="font-medium">{claim.location}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No claims to review</h3>
                <p className="text-muted-foreground">
                  Claims submitted by farmers will appear here for review
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
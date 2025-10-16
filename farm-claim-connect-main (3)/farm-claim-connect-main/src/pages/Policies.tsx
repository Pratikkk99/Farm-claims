import React, { useEffect, useState } from 'react';
import { mockAPI, Policy } from '@/lib/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, DollarSign, Calendar, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Policies: React.FC = () => {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const data = await mockAPI.getPolicies();
      setPolicies(data);
    } catch (error) {
      console.error('Error fetching policies:', error);
      toast({
        title: "Error",
        description: "Failed to load policies. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Insurance Policies</h1>
          <p className="text-muted-foreground">
            Explore our comprehensive crop insurance coverage options
          </p>
        </div>

        {/* Policies Grid */}
        {policies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {policies.map((policy) => (
              <Card key={policy.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-6 w-6 text-primary" />
                      <CardTitle className="text-lg">{policy.name}</CardTitle>
                    </div>
                    {policy.is_active && (
                      <Badge variant="default" className="bg-success">
                        Active
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="text-sm">
                    {policy.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Coverage Amount */}
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Coverage</span>
                    </div>
                    <span className="font-bold text-lg">
                      {formatCurrency(policy.coverage_amount)}
                    </span>
                  </div>

                  {/* Premium */}
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Monthly Premium</span>
                    </div>
                    <span className="font-bold">
                      {formatCurrency(policy.premium_amount)}
                    </span>
                  </div>

                  {/* Duration */}
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Duration</span>
                    </div>
                    <span className="font-bold">
                      {policy.duration_months} months
                    </span>
                  </div>

                  {/* Covered Crops */}
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center space-x-1">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span>Covered Crops</span>
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {policy.crop_types.map((crop, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {crop}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Terms and Conditions Preview */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Terms & Conditions</h4>
                    <p className="text-xs text-muted-foreground line-clamp-3">
                      {policy.terms_and_conditions}
                    </p>
                  </div>

                  {/* Policy Details */}
                  <div className="pt-4 border-t">
                    <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                      <div>
                        <p className="font-medium">Created</p>
                        <p>{new Date(policy.created_at).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="font-medium">Updated</p>
                        <p>{new Date(policy.updated_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No policies available</h3>
              <p className="text-muted-foreground">
                Insurance policies will appear here when they become available
              </p>
            </CardContent>
          </Card>
        )}

        {/* Information Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How Crop Insurance Works</CardTitle>
            <CardDescription>
              Understanding your coverage and benefits
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium mb-2">Choose Your Policy</h3>
              <p className="text-sm text-muted-foreground">
                Select the insurance policy that best fits your crop types and coverage needs
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium mb-2">Pay Your Premium</h3>
              <p className="text-sm text-muted-foreground">
                Make regular premium payments to maintain your coverage and protection
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium mb-2">File Claims</h3>
              <p className="text-sm text-muted-foreground">
                Submit claims for covered losses and receive compensation for eligible damages
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Policies;
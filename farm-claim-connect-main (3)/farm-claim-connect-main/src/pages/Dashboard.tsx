import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Shield, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockAPI, Claim, Policy } from '@/lib/mockData';
import heroImage from '@/assets/hero-agriculture.jpg';

const Dashboard: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [claimsData, policiesData] = await Promise.all([
          mockAPI.getClaims(),
          mockAPI.getPolicies(),
        ]);
        setClaims(claimsData);
        setPolicies(policiesData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getClaimStats = () => {
    const totalClaims = claims.length;
    const pendingClaims = claims.filter(claim => claim.status === 'pending').length;
    const approvedClaims = claims.filter(claim => claim.status === 'approved').length;
    const rejectedClaims = claims.filter(claim => claim.status === 'rejected').length;
    
    return { totalClaims, pendingClaims, approvedClaims, rejectedClaims };
  };

  const { totalClaims, pendingClaims, approvedClaims, rejectedClaims } = getClaimStats();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-64 bg-gradient-to-r from-primary to-primary-hover overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-4xl font-bold mb-2">
              Welcome back, {user?.first_name}!
            </h1>
            <p className="text-xl opacity-90">
              {isAdmin ? 'Manage insurance claims and policies' : 'Manage your crop insurance claims'}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Claims</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalClaims}</div>
              <p className="text-xs text-muted-foreground">
                All your insurance claims
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{pendingClaims}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting review
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{approvedClaims}</div>
              <p className="text-xs text-muted-foreground">
                Successfully approved
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{rejectedClaims}</div>
              <p className="text-xs text-muted-foreground">
                Needs attention
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Claims */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Claims</CardTitle>
              <CardDescription>Your latest insurance claims</CardDescription>
            </CardHeader>
            <CardContent>
              {claims.length > 0 ? (
                <div className="space-y-4">
                  {claims.slice(0, 5).map((claim) => (
                    <div key={claim.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <p className="font-medium">{claim.crop_type}</p>
                        <p className="text-sm text-muted-foreground">
                          ${claim.estimated_loss.toLocaleString()}
                        </p>
                      </div>
                      <Badge 
                        variant={
                          claim.status === 'approved' ? 'default' : 
                          claim.status === 'pending' ? 'secondary' : 
                          'destructive'
                        }
                      >
                        {claim.status}
                      </Badge>
                    </div>
                  ))}
                  <Link to="/claims">
                    <Button variant="outline" className="w-full">
                      View All Claims
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No claims submitted yet</p>
                  <Link to="/claims">
                    <Button>Submit Your First Claim</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Available Policies */}
          <Card>
            <CardHeader>
              <CardTitle>Available Policies</CardTitle>
              <CardDescription>Insurance coverage options</CardDescription>
            </CardHeader>
            <CardContent>
              {policies.length > 0 ? (
                <div className="space-y-4">
                  {policies.slice(0, 3).map((policy) => (
                    <div key={policy.id} className="p-3 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{policy.name}</h4>
                        <Badge variant="outline">
                          ${policy.coverage_amount.toLocaleString()}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {policy.description}
                      </p>
                      <p className="text-sm font-medium text-primary">
                        Premium: ${policy.premium_amount}/month
                      </p>
                    </div>
                  ))}
                  <Link to="/policies">
                    <Button variant="outline" className="w-full">
                      View All Policies
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No policies available</p>
                  <Link to="/policies">
                    <Button variant="outline">Browse Policies</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks you can perform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link to="/claims">
                <Button variant="outline" className="w-full h-16 flex-col">
                  <FileText className="h-6 w-6 mb-2" />
                  Submit New Claim
                </Button>
              </Link>
              <Link to="/policies">
                <Button variant="outline" className="w-full h-16 flex-col">
                  <Shield className="h-6 w-6 mb-2" />
                  Browse Policies
                </Button>
              </Link>
              {isAdmin && (
                <Link to="/admin">
                  <Button variant="outline" className="w-full h-16 flex-col">
                    <TrendingUp className="h-6 w-6 mb-2" />
                    Admin Dashboard
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
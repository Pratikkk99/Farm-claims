// Mock data for frontend testing

export interface Claim {
  id: number;
  farmer: number;
  crop_type: string;
  area_affected: number;
  damage_description: string;
  estimated_loss: number;
  date_of_loss: string;
  location: string;
  status: 'pending' | 'approved' | 'rejected';
  documents?: string[];
  created_at: string;
  updated_at: string;
}

export interface Policy {
  id: number;
  name: string;
  description: string;
  coverage_amount: number;
  premium_amount: number;
  duration_months: number;
  crop_types: string[];
  terms_and_conditions: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateClaimData {
  crop_type: string;
  area_affected: number;
  damage_description: string;
  estimated_loss: number;
  date_of_loss: string;
  location: string;
  documents?: File[];
}

// Mock data
export const mockClaims: Claim[] = [
  {
    id: 1,
    farmer: 1,
    crop_type: 'Wheat',
    area_affected: 5.2,
    damage_description: 'Hail damage to wheat crops during storm',
    estimated_loss: 12000,
    date_of_loss: '2024-01-15',
    location: 'Field A - North Section',
    status: 'pending',
    created_at: '2024-01-16T10:00:00Z',
    updated_at: '2024-01-16T10:00:00Z'
  },
  {
    id: 2,
    farmer: 1,
    crop_type: 'Corn',
    area_affected: 8.7,
    damage_description: 'Drought damage affecting corn yield',
    estimated_loss: 18500,
    date_of_loss: '2024-01-10',
    location: 'Field B - South Section',
    status: 'approved',
    created_at: '2024-01-11T14:30:00Z',
    updated_at: '2024-01-12T09:15:00Z'
  }
];

export const mockPolicies: Policy[] = [
  {
    id: 1,
    name: 'Basic Crop Insurance',
    description: 'Comprehensive coverage for major crop failures',
    coverage_amount: 50000,
    premium_amount: 2500,
    duration_months: 12,
    crop_types: ['Wheat', 'Corn', 'Soybean'],
    terms_and_conditions: 'Standard terms and conditions apply',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    name: 'Premium Crop Insurance',
    description: 'Enhanced coverage with weather protection',
    coverage_amount: 100000,
    premium_amount: 4500,
    duration_months: 12,
    crop_types: ['Wheat', 'Corn', 'Soybean', 'Rice'],
    terms_and_conditions: 'Enhanced coverage terms apply',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

// Mock API functions
export const mockAPI = {
  // Claims API
  getClaims: async (): Promise<Claim[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockClaims), 500);
    });
  },

  getClaimById: async (id: number): Promise<Claim> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const claim = mockClaims.find(c => c.id === id);
        if (claim) resolve(claim);
        else reject(new Error('Claim not found'));
      }, 300);
    });
  },

  createClaim: async (claimData: CreateClaimData): Promise<Claim> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newClaim: Claim = {
          id: mockClaims.length + 1,
          farmer: 1,
          crop_type: claimData.crop_type,
          area_affected: claimData.area_affected,
          damage_description: claimData.damage_description,
          estimated_loss: claimData.estimated_loss,
          date_of_loss: claimData.date_of_loss,
          location: claimData.location,
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        mockClaims.push(newClaim);
        resolve(newClaim);
      }, 800);
    });
  },

  updateClaimStatus: async (id: number, status: 'approved' | 'rejected'): Promise<Claim> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const claimIndex = mockClaims.findIndex(c => c.id === id);
        if (claimIndex !== -1) {
          mockClaims[claimIndex].status = status;
          mockClaims[claimIndex].updated_at = new Date().toISOString();
          resolve(mockClaims[claimIndex]);
        } else {
          reject(new Error('Claim not found'));
        }
      }, 500);
    });
  },

  deleteClaim: async (id: number): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockClaims.findIndex(c => c.id === id);
        if (index !== -1) {
          mockClaims.splice(index, 1);
        }
        resolve();
      }, 300);
    });
  },

  // Policies API
  getPolicies: async (): Promise<Policy[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockPolicies), 400);
    });
  },

  getPolicyById: async (id: number): Promise<Policy> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const policy = mockPolicies.find(p => p.id === id);
        if (policy) resolve(policy);
        else reject(new Error('Policy not found'));
      }, 300);
    });
  },

  createPolicy: async (policyData: Omit<Policy, 'id' | 'created_at' | 'updated_at'>): Promise<Policy> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newPolicy: Policy = {
          id: mockPolicies.length + 1,
          ...policyData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        mockPolicies.push(newPolicy);
        resolve(newPolicy);
      }, 600);
    });
  },

  updatePolicy: async (id: number, policyData: Partial<Policy>): Promise<Policy> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const policyIndex = mockPolicies.findIndex(p => p.id === id);
        if (policyIndex !== -1) {
          mockPolicies[policyIndex] = { 
            ...mockPolicies[policyIndex], 
            ...policyData, 
            updated_at: new Date().toISOString() 
          };
          resolve(mockPolicies[policyIndex]);
        } else {
          reject(new Error('Policy not found'));
        }
      }, 500);
    });
  },

  deletePolicy: async (id: number): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockPolicies.findIndex(p => p.id === id);
        if (index !== -1) {
          mockPolicies.splice(index, 1);
        }
        resolve();
      }, 300);
    });
  }
};

import React from 'react';
import { Card } from '@/components/ui/card';

const ResultSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#fffaf7] p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header skeleton with brand logo */}
        <Card className="p-6 mb-6 bg-white relative overflow-hidden">
          <div className="flex flex-col items-center gap-5">
            <div className="w-48 h-20 relative flex justify-center items-center">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse rounded-md"></div>
              <div className="flex justify-center w-full">
                <img 
                  src="https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp"
                  alt="Gisele Galvão"
                  className="h-16 relative z-10 opacity-70 mx-auto"
                  loading="eager"
                  fetchPriority="high"
                />
              </div>
            </div>
            <div className="w-full max-w-md h-8 bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse rounded-md" />
          </div>
        </Card>
        
        {/* Main content skeleton */}
        <Card className="p-6 mb-10 bg-white relative overflow-hidden">
          <div className="flex flex-col gap-6 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/40 animate-pulse z-0"></div>
            
            <div className="w-full h-8 bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse rounded-md relative z-10" />
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4 relative z-10">
                <div className="w-full h-32 bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse rounded-md" />
                <div className="w-full h-24 bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse rounded-md" />
              </div>
              <div className="flex justify-center relative z-10">
                <div className="w-64 h-80 bg-gradient-to-b from-[#aa6b5d]/10 to-[#B89B7A]/10 animate-pulse rounded-md shadow-sm" />
              </div>
            </div>
          </div>
        </Card>
        
        {/* Before-after transformation skeleton */}
        <Card className="p-6 mb-10 bg-white relative overflow-hidden">
          <div className="flex flex-col gap-6">
            <div className="text-center">
              <div className="w-3/4 h-8 bg-gradient-to-r from-[#aa6b5d]/20 to-gray-100 animate-pulse rounded-md mx-auto mb-4" />
              <div className="w-2/3 h-4 bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse rounded-md mx-auto" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="space-y-2">
                <div className="h-4 w-16 bg-gradient-to-r from-[#aa6b5d]/20 to-gray-100 animate-pulse rounded-md mx-auto" />
                <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-[#aa6b5d]/5 animate-pulse rounded-md" />
              </div>
              
              <div className="space-y-2">
                <div className="h-4 w-16 bg-gradient-to-r from-[#aa6b5d]/20 to-gray-100 animate-pulse rounded-md mx-auto" />
                <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-[#B89B7A]/10 animate-pulse rounded-md" />
              </div>
            </div>
            
            <div className="flex justify-center gap-2 mt-4">
              {[1, 2, 3].map(i => (
                <div key={i} className={`w-2 h-2 rounded-full ${i === 1 ? 'bg-[#aa6b5d]/50' : 'bg-gray-200'}`} />
              ))}
            </div>
          </div>
        </Card>
        
        {/* Additional sections skeleton */}
        <div className="space-y-8">
          {[1, 2].map(i => (
            <Card key={i} className="p-6 bg-white">
              <div className="w-full h-8 bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse rounded-md mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map(j => (
                  <div key={j} className="h-32 bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse rounded-md" />
                ))}
              </div>
            </Card>
          ))}
        </div>
        
        {/* CTA skeleton */}
        <Card className="p-6 mt-8 bg-white">
          <div className="flex flex-col items-center space-y-6">
            <div className="w-3/4 h-10 bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse rounded-md" />
            <div className="w-1/2 h-16 bg-gradient-to-r from-[#4CAF50]/20 to-[#45a049]/20 animate-pulse rounded-md" />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ResultSkeleton;

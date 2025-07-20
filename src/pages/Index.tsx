import HeartDiseaseForm from '@/components/HeartDiseaseForm';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

interface IndexProps {
  onLogout: () => void;
}

const Index = ({ onLogout }: IndexProps) => {
  return (
    <div className="relative">
      {/* Logout Button */}
      <div className="absolute top-4 right-4 z-50">
        <Button
          onClick={onLogout}
          variant="outline"
          size="sm"
          className="bg-white/90 backdrop-blur-sm border-gray-200 hover:bg-white"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
      
      <HeartDiseaseForm />
    </div>
  );
};

export default Index;
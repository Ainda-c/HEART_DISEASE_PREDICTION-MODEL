import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Heart, Activity, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FormData {
  age: string;
  sex: string;
  cp: string;
  trestbps: string;
  chol: string;
  fbs: string;
  restecg: string;
  thalch: string;
  exang: string;
  oldpeak: string;
}

interface PredictionResult {
  status: string;
  prediction: number;
  probability: number;
  message?: string;
}

const HeartDiseaseForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    age: '',
    sex: '',
    cp: '',
    trestbps: '',
    chol: '',
    fbs: '',
    restecg: '',
    thalch: '',
    exang: '',
    oldpeak: ''
  });

  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.age || parseInt(formData.age) < 1 || parseInt(formData.age) > 120) {
      newErrors.age = 'Age must be between 1 and 120';
    }
    if (!formData.trestbps || parseInt(formData.trestbps) < 50 || parseInt(formData.trestbps) > 300) {
      newErrors.trestbps = 'Blood pressure must be between 50-300 mmHg';
    }
    if (!formData.chol || parseInt(formData.chol) < 100 || parseInt(formData.chol) > 600) {
      newErrors.chol = 'Cholesterol must be between 100-600 mg/dl';
    }
    if (!formData.thalch || parseInt(formData.thalch) < 60 || parseInt(formData.thalch) > 220) {
      newErrors.thalch = 'Heart rate must be between 60-220 bpm';
    }
    if (!formData.oldpeak || parseFloat(formData.oldpeak) < 0 || parseFloat(formData.oldpeak) > 10) {
      newErrors.oldpeak = 'ST Depression must be between 0-10';
    }

    // Check required select fields
    const requiredSelects = ['sex', 'cp', 'fbs', 'restecg', 'exang'];
    requiredSelects.forEach(field => {
      if (!formData[field as keyof FormData]) {
        newErrors[field as keyof FormData] = 'This field is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields correctly.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const data = {
        age: parseFloat(formData.age),
        sex: parseFloat(formData.sex),
        cp: parseFloat(formData.cp),
        trestbps: parseFloat(formData.trestbps),
        chol: parseFloat(formData.chol),
        fbs: parseFloat(formData.fbs),
        restecg: parseFloat(formData.restecg),
        thalch: parseFloat(formData.thalch),
        exang: parseFloat(formData.exang),
        oldpeak: parseFloat(formData.oldpeak)
      };

      const response = await fetch('/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result: PredictionResult = await response.json();
      setResult(result);

      if (result.status === 'success') {
        toast({
          title: "Prediction Complete",
          description: "Heart disease risk assessment completed successfully.",
        });
      }
    } catch (error) {
      const errorResult: PredictionResult = {
        status: 'error',
        prediction: 0,
        probability: 0,
        message: error instanceof Error ? error.message : 'Network error occurred'
      };
      setResult(errorResult);
      
      toast({
        title: "Error",
        description: "Failed to get prediction. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle py-8 px-4 flex flex-col items-center">
      <div className="mx-auto max-w-2xl w-full px-0">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-[#2bb6f6] p-3 rounded-full shadow-glow">
              <Heart className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-[#2bb6f6] mb-2">
            Heart Disease Prediction
          </h1>
          <p className="text-gray-600 text-lg">
            Advanced AI-powered cardiovascular risk assessment
          </p>
        </div>

        <Card className="rounded-2xl shadow-lg border-0 bg-white w-full p-0">
          <CardHeader className="rounded-t-2xl bg-[#2bb6f6] text-white text-left">
            <CardTitle className="flex items-center gap-2 font-bold text-xl justify-start">
              <Activity className="h-5 w-5" />
              Patient Information
            </CardTitle>
            <CardDescription className="text-white/90">
              Please provide accurate medical information for assessment
            </CardDescription>
          </CardHeader>
          
          <CardContent className="px-6 pb-6 pt-0">
            <form onSubmit={handleSubmit} className="w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 overflow-visible items-start w-full text-left">
                {/* Age */}
                <div className="space-y-1">
                  <Label htmlFor="age" className="text-sm font-medium text-left">Age (years)</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    placeholder="Enter age (1-120)"
                    min="1"
                    max="120"
                    className={`w-full py-2 text-sm ${errors.age ? 'border-destructive focus:ring-destructive' : ''}`}
                  />
                  {errors.age && <p className="text-xs text-destructive">{errors.age}</p>}
                </div>

                {/* Sex */}
                <div className="space-y-1">
                  <Label htmlFor="sex" className="text-sm font-medium text-left">Sex</Label>
                  <Select onValueChange={(value) => handleInputChange('sex', value)} value={formData.sex} >
                    <SelectTrigger className={`w-full py-2 text-sm ${errors.sex ? 'border-destructive' : ''}`}>
                      <SelectValue placeholder="Select sex" />
                    </SelectTrigger>
                    <SelectContent side="top" className="z-50 bg-white">
                      <SelectItem value="0" className="hover:bg-gray-100">Female</SelectItem>
                      <SelectItem value="1" className="hover:bg-gray-100">Male</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.sex && <p className="text-xs text-destructive">{errors.sex}</p>}
                </div>

                {/* Chest Pain Type */}
                <div className="space-y-1">
                  <Label htmlFor="cp" className="text-sm font-medium text-left">Chest Pain Type</Label>
                  <Select onValueChange={(value) => handleInputChange('cp', value)} value={formData.cp}>
                    <SelectTrigger className={`w-full py-2 text-sm ${errors.cp ? 'border-destructive' : ''}`}>
                      <SelectValue placeholder="Select chest pain type" />
                    </SelectTrigger>
                    <SelectContent side="top" className="z-50 bg-white">
                      <SelectItem value="0" className="hover:bg-gray-100">Typical Angina</SelectItem>
                      <SelectItem value="1" className="hover:bg-gray-100">Atypical Angina</SelectItem>
                      <SelectItem value="2" className="hover:bg-gray-100">Non-Anginal Pain</SelectItem>
                      <SelectItem value="3" className="hover:bg-gray-100">Asymptomatic</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.cp && <p className="text-xs text-destructive">{errors.cp}</p>}
                </div>

                {/* Blood Pressure */}
                <div className="space-y-1">
                  <Label htmlFor="trestbps" className="text-sm font-medium text-left">Resting Blood Pressure (mmHg)</Label>
                  <Input
                    id="trestbps"
                    type="number"
                    value={formData.trestbps}
                    onChange={(e) => handleInputChange('trestbps', e.target.value)}
                    placeholder="e.g., 120"
                    min="50"
                    max="300"
                    className={`w-full py-2 text-sm ${errors.trestbps ? 'border-destructive focus:ring-destructive' : ''}`}
                  />
                  {errors.trestbps && <p className="text-xs text-destructive">{errors.trestbps}</p>}
                </div>

                {/* Cholesterol */}
                <div className="space-y-1">
                  <Label htmlFor="chol" className="text-sm font-medium text-left">Cholesterol (mg/dl)</Label>
                  <Input
                    id="chol"
                    type="number"
                    value={formData.chol}
                    onChange={(e) => handleInputChange('chol', e.target.value)}
                    placeholder="e.g., 200"
                    min="100"
                    max="600"
                    className={`w-full py-2 text-sm ${errors.chol ? 'border-destructive focus:ring-destructive' : ''}`}
                  />
                  {errors.chol && <p className="text-xs text-destructive">{errors.chol}</p>}
                </div>

                {/* Fasting Blood Sugar */}
                <div className="space-y-1">
                  <Label htmlFor="fbs" className="text-sm font-medium text-left">Fasting Blood Sugar</Label>
                  <Select onValueChange={(value) => handleInputChange('fbs', value)} value={formData.fbs}>
                    <SelectTrigger className={`w-full py-2 text-sm ${errors.fbs ? 'border-destructive' : ''}`}>
                      <SelectValue placeholder="Select blood sugar level" />
                    </SelectTrigger>
                    <SelectContent side="top" className="z-50 bg-white">
                      <SelectItem value="0" className="hover:bg-gray-100">{'< 120 mg/dl (Normal)'}</SelectItem>
                      <SelectItem value="1" className="hover:bg-gray-100">{'> 120 mg/dl (High)'}</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.fbs && <p className="text-xs text-destructive">{errors.fbs}</p>}
                </div>

                {/* Resting ECG */}
                <div className="space-y-1">
                  <Label htmlFor="restecg" className="text-sm font-medium text-left">Resting ECG Results</Label>
                  <Select onValueChange={(value) => handleInputChange('restecg', value)} value={formData.restecg}>
                    <SelectTrigger className={`w-full py-2 text-sm ${errors.restecg ? 'border-destructive' : ''}`}>
                      <SelectValue placeholder="Select ECG result" />
                    </SelectTrigger>
                    <SelectContent side="top" className="z-50 bg-white">
                      <SelectItem value="0" className="hover:bg-gray-100">Normal</SelectItem>
                      <SelectItem value="1" className="hover:bg-gray-100">ST-T Wave Abnormality</SelectItem>
                      <SelectItem value="2" className="hover:bg-gray-100">Left Ventricular Hypertrophy</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.restecg && <p className="text-xs text-destructive">{errors.restecg}</p>}
                </div>

                {/* Max Heart Rate */}
                <div className="space-y-1">
                  <Label htmlFor="thalch" className="text-sm font-medium text-left">Maximum Heart Rate (bpm)</Label>
                  <Input
                    id="thalch"
                    type="number"
                    value={formData.thalch}
                    onChange={(e) => handleInputChange('thalch', e.target.value)}
                    placeholder="e.g., 150"
                    min="60"
                    max="220"
                    className={`w-full py-2 text-sm ${errors.thalch ? 'border-destructive focus:ring-destructive' : ''}`}
                  />
                  {errors.thalch && <p className="text-xs text-destructive">{errors.thalch}</p>}
                </div>

                {/* Exercise Induced Angina */}
                <div className="space-y-1">
                  <Label htmlFor="exang" className="text-sm font-medium text-left">Exercise-Induced Angina</Label>
                  <Select onValueChange={(value) => handleInputChange('exang', value)} value={formData.exang}>
                    <SelectTrigger className={`w-full py-2 text-sm ${errors.exang ? 'border-destructive' : ''}`}>
                      <SelectValue placeholder="Select angina status" />
                    </SelectTrigger>
                    <SelectContent side="top" className="z-50 bg-white">
                      <SelectItem value="0" className="hover:bg-gray-100">No</SelectItem>
                      <SelectItem value="1" className="hover:bg-gray-100">Yes</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.exang && <p className="text-xs text-destructive">{errors.exang}</p>}
                </div>

                {/* ST Depression */}
                <div className="space-y-1 md:col-span-2">
                  <Label htmlFor="oldpeak" className="text-sm font-medium text-left">ST Depression (Oldpeak)</Label>
                  <Input
                    id="oldpeak"
                    type="number"
                    step="0.1"
                    value={formData.oldpeak}
                    onChange={(e) => handleInputChange('oldpeak', e.target.value)}
                    placeholder="e.g., 1.5"
                    min="0"
                    max="10"
                    className={`w-full py-2 text-sm ${errors.oldpeak ? 'border-destructive focus:ring-destructive' : ''}`}
                  />
                  {errors.oldpeak && <p className="text-xs text-destructive">{errors.oldpeak}</p>}
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
                disabled={isLoading}
                size="lg"
                
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Activity className="w-4 h-4 mr-2"/>
                    Predict Heart Disease Risk
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <Card className="mt-6 shadow-elegant border-0 animate-fade-in">
            <CardContent className="p-6">
              {result.status === 'success' ? (
                <div className="text-center space-y-4">
                  <div className={`flex items-center justify-center w-16 h-16 mx-auto rounded-full ${
                    result.prediction === 1 ? 'bg-destructive/10' : 'bg-success/10'
                  }`}>
                    {result.prediction === 1 ? (
                      <AlertCircle className="w-8 h-8 text-destructive" />
                    ) : (
                      <CheckCircle2 className="w-8 h-8 text-success" />
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold mb-2">
                      {result.prediction === 1 ? 'Heart Disease Risk Detected' : 'Low Heart Disease Risk'}
                    </h3>
                    
                    <Badge 
                      variant={result.prediction === 1 ? 'destructive' : 'default'}
                      className={`text-sm px-4 py-2 ${
                        result.prediction === 1 ? '' : 'bg-success text-success-foreground'
                      }`}
                    >
                      Risk Probability: {(result.probability * 100).toFixed(1)}%
                    </Badge>
                  </div>

                  <Alert className={result.prediction === 1 ? 'border-destructive' : 'border-success'}>
                    <AlertDescription className="text-sm">
                      {result.prediction === 1 
                        ? 'This assessment indicates elevated risk factors. Please consult with a healthcare professional for proper medical evaluation and treatment recommendations.'
                        : 'This assessment suggests lower risk factors. Continue maintaining a healthy lifestyle and regular medical check-ups.'
                      }
                    </AlertDescription>
                  </Alert>
                </div>
              ) : (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Error: {result.message || 'An error occurred during prediction'}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        {/* Disclaimer */}
        <div className="mt-8 text-center">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>Medical Disclaimer:</strong> This tool is for educational purposes only and should not replace professional medical advice. 
              Always consult with qualified healthcare providers for medical decisions.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
};

export default HeartDiseaseForm;
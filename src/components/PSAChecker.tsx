import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Shield, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PSAChecker = () => {
  const [apiKey, setApiKey] = useState("");
  const [certNumber, setCertNumber] = useState("");
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Load saved values from localStorage on mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem("psa-api-key");
    const savedCertNumber = localStorage.getItem("psa-cert-number");
    
    if (savedApiKey) setApiKey(savedApiKey);
    if (savedCertNumber) setCertNumber(savedCertNumber);
  }, []);

  // Save API key to localStorage when it changes
  const handleApiKeyChange = (value: string) => {
    setApiKey(value);
    localStorage.setItem("psa-api-key", value);
  };

  // Save cert number to localStorage when it changes
  const handleCertNumberChange = (value: string) => {
    setCertNumber(value);
    localStorage.setItem("psa-cert-number", value);
  };

  // Make API call to PSA
  const fetchPSAData = async () => {
    if (!apiKey || !certNumber) {
      toast({
        title: "Missing Information",
        description: "Please enter both API key and certificate number",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const response = await fetch(
        `https://api.psacard.com/publicapi/cert/GetByCertNumber/${certNumber}`,
        {
          method: 'GET',
          headers: {
            'authorization': `bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setResponse(data);
      toast({
        title: "Success!",
        description: "PSA data retrieved successfully",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch PSA data';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">PSA API Checker</h1>
          </div>
          <p className="text-muted-foreground">
            Enter your API key and certificate number, then click Check API
          </p>
        </div>

        {/* API Key Input */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              API Configuration
            </CardTitle>
            <CardDescription>
              Enter your PSA API bearer token
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apikey">API Key (Bearer Token)</Label>
              <Textarea
                id="apikey"
                placeholder="Paste your PSA API bearer token here..."
                value={apiKey}
                onChange={(e) => handleApiKeyChange(e.target.value)}
                className="min-h-[100px] font-mono text-sm"
              />
            </div>
          </CardContent>
        </Card>

        {/* Certificate Number Input */}
        <Card>
          <CardHeader>
            <CardTitle>Certificate Number</CardTitle>
            <CardDescription>
              Enter a PSA certificate number to check
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="certnumber">Certificate Number</Label>
              <Input
                id="certnumber"
                type="text"
                placeholder="Enter certificate number..."
                value={certNumber}
                onChange={(e) => handleCertNumberChange(e.target.value)}
                className="font-mono"
              />
            </div>
            <Button 
              onClick={fetchPSAData}
              disabled={loading || !apiKey || !certNumber}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Checking API...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Check API
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* API Response */}
        {(loading || response || error) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {loading && <Loader2 className="h-5 w-5 animate-spin" />}
                PSA Certificate Data
              </CardTitle>
              <CardDescription>
                {loading ? "Fetching certificate data..." : "API response from PSA"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}
              
              {error && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md">
                  <p className="text-destructive font-medium">Error:</p>
                  <p className="text-destructive/80 text-sm mt-1">{error}</p>
                </div>
              )}
              
              {response && (
                <div className="p-4 bg-muted rounded-md">
                  <pre className="text-sm font-mono overflow-x-auto whitespace-pre-wrap">
                    {JSON.stringify(response, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PSAChecker;
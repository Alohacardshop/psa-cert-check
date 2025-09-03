import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Shield, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PSAResult {
  certNumber: string;
  status: string;
  grade?: string;
  card?: string;
  year?: string;
  brand?: string;
  variety?: string;
  [key: string]: any;
}

const PSAChecker = () => {
  const [apiKey, setApiKey] = useState("");
  const [certNumber, setCertNumber] = useState("79909125");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PSAResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const checkCertificate = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your PSA API key",
        variant: "destructive",
      });
      return;
    }

    if (!certNumber.trim()) {
      toast({
        title: "Certificate Number Required",
        description: "Please enter a certificate number",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Following the jQuery structure from the image
      const settings = {
        async: true,
        crossDomain: true,
        url: `https://api.psacard.com/publicapi/cert/GetByCertNumber/${certNumber}`,
        method: "GET",
        headers: {
          authorization: `bearer ${apiKey}`,
        },
      };

      const response = await fetch(settings.url, {
        method: settings.method,
        headers: settings.headers,
        mode: 'cors',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
      
      toast({
        title: "Certificate Found",
        description: `Successfully retrieved data for cert #${certNumber}`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to check certificate";
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
            <h1 className="text-3xl font-bold text-foreground">PSA Certificate Checker</h1>
          </div>
          <p className="text-muted-foreground">
            Verify PSA graded card certificates using the official API
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
              Enter your PSA API bearer token to authenticate requests
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apikey">API Key (Bearer Token)</Label>
              <Textarea
                id="apikey"
                placeholder="Paste your PSA API bearer token here..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="min-h-[100px] font-mono text-sm"
              />
            </div>
          </CardContent>
        </Card>

        {/* Certificate Checker */}
        <Card>
          <CardHeader>
            <CardTitle>Certificate Lookup</CardTitle>
            <CardDescription>
              Enter a PSA certificate number to verify its authenticity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 space-y-2">
                <Label htmlFor="certnumber">Certificate Number</Label>
                <Input
                  id="certnumber"
                  placeholder="Enter certificate number..."
                  value={certNumber}
                  onChange={(e) => setCertNumber(e.target.value)}
                  className="font-mono"
                />
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={checkCertificate}
                  disabled={loading}
                  className="min-w-[120px]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    "Check Certificate"
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Request Preview */}
        {apiKey && certNumber && (
          <Card className="border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🔍 Request Preview
              </CardTitle>
              <CardDescription>
                Exact request that will be sent to PSA API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Method</Label>
                  <div className="p-2 bg-muted rounded-md">
                    <Badge variant="secondary">GET</Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Content-Type</Label>
                  <div className="p-2 bg-muted rounded-md">
                    <span className="text-sm">application/json</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">URL</Label>
                <div className="p-2 bg-muted rounded-md break-all">
                  <span className="text-sm font-mono">
                    https://api.psacard.com/publicapi/cert/GetByCertNumber/{certNumber}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Headers</Label>
                <div className="p-3 bg-muted rounded-md">
                  <pre className="text-sm font-mono">
{`{
  "authorization": "bearer ${apiKey.substring(0, 20)}...${apiKey.substring(apiKey.length - 10)}",
  "Accept": "application/json",
  "Content-Type": "application/json"
}`}
                  </pre>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Full Fetch Request</Label>
                <div className="p-3 bg-muted rounded-md">
                  <pre className="text-sm font-mono overflow-x-auto">
{`fetch("https://api.psacard.com/publicapi/cert/GetByCertNumber/${certNumber}", {
  method: "GET",
  headers: {
    "authorization": "bearer ${apiKey.substring(0, 20)}...${apiKey.substring(apiKey.length - 10)}",
    "Accept": "application/json",
    "Content-Type": "application/json"
  },
  mode: "cors"
})`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {error && (
          <Card className="border-error">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-error">
                <XCircle className="h-5 w-5" />
                <span className="font-medium">Error: {error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {result && (
          <Card className="border-success">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-success">
                <CheckCircle className="h-5 w-5" />
                Certificate Verified
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(result).map(([key, value]) => (
                  <div key={key} className="space-y-1">
                    <Label className="text-sm font-medium capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </Label>
                    <div className="p-2 bg-muted rounded-md">
                      {typeof value === 'string' || typeof value === 'number' ? (
                        <span className="text-sm">{value}</span>
                      ) : (
                        <Badge variant="secondary">
                          {JSON.stringify(value)}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* API Structure Display */}
        <Card>
          <CardHeader>
            <CardTitle>API Call Structure</CardTitle>
            <CardDescription>
              Current configuration based on your input
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-md text-sm font-mono overflow-x-auto">
{`var settings = {
  "async": true,
  "crossDomain": true,
  "url": "https://api.psacard.com/publicapi/cert/GetByCertNumber/${certNumber || 'CERT_NUMBER'}",
  "method": "GET",
  "headers": {
    "authorization": "bearer ${apiKey ? '[API_KEY_SET]' : '[API_KEY_REQUIRED]'}"
  }
};

$.ajax(settings).done(function (response) {
  console.log(response);
});`}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PSAChecker;
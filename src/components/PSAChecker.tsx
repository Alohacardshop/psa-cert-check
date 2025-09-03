import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Shield, CheckCircle, XCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

        {/* API Testing Options */}
        <Card>
          <CardHeader>
            <CardTitle>Test API with Multiple Methods</CardTitle>
            <CardDescription>
              Choose how you want to test the PSA API - browser, terminal, or server-side
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="fetch" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="fetch">JavaScript</TabsTrigger>
                <TabsTrigger value="jquery">jQuery</TabsTrigger>
                <TabsTrigger value="curl">Terminal cURL</TabsTrigger>
                <TabsTrigger value="php">PHP cURL</TabsTrigger>
              </TabsList>
              
              <TabsContent value="fetch" className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">JavaScript Fetch (Browser)</Label>
                  <div className="p-4 bg-muted rounded-md">
                    <pre className="text-sm font-mono overflow-x-auto">
{`// Modern JavaScript Fetch API
const response = await fetch("https://api.psacard.com/publicapi/cert/GetByCertNumber/${certNumber || 'CERT_NUMBER'}", {
  method: "GET",
  headers: {
    "authorization": "bearer ${apiKey ? apiKey.substring(0, 20) + '...' : 'YOUR_API_KEY'}",
    "Accept": "application/json",
    "Content-Type": "application/json"
  },
  mode: "cors"
});

const data = await response.json();
console.log(data);`}
                    </pre>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="jquery" className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">jQuery AJAX (Browser)</Label>
                  <div className="p-4 bg-muted rounded-md">
                    <pre className="text-sm font-mono overflow-x-auto">
{`// jQuery AJAX (from your image)
var settings = {
  "async": true,
  "crossDomain": true,
  "url": "https://api.psacard.com/publicapi/cert/GetByCertNumber/${certNumber || 'CERT_NUMBER'}",
  "method": "GET",
  "headers": {
    "authorization": "bearer ${apiKey ? apiKey.substring(0, 20) + '...' : 'YOUR_API_KEY'}"
  }
};

$.ajax(settings).done(function (response) {
  console.log(response);
});`}
                    </pre>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="curl" className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Terminal cURL Command</Label>
                  <div className="p-4 bg-muted rounded-md">
                    <pre className="text-sm font-mono overflow-x-auto">
{`# Copy and paste this in your terminal
curl -X GET \\
  "https://api.psacard.com/publicapi/cert/GetByCertNumber/${certNumber || 'CERT_NUMBER'}" \\
  -H "Authorization: bearer ${apiKey ? apiKey.substring(0, 20) + '...' : 'YOUR_API_KEY'}" \\
  -H "Accept: application/json" \\
  -H "Content-Type: application/json"`}
                    </pre>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    💡 Replace the token with your full API key when running in terminal
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="php" className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">PHP cURL (Server-side)</Label>
                  <div className="p-4 bg-muted rounded-md">
                    <pre className="text-sm font-mono overflow-x-auto">
{`<?php
// PHP cURL implementation (like your example)
$curl = curl_init();

curl_setopt($curl, CURLOPT_URL, "https://api.psacard.com/publicapi/cert/GetByCertNumber/${certNumber || 'CERT_NUMBER'}");
$authorization = "Authorization: bearer ${apiKey ? apiKey.substring(0, 20) + '...' : 'YOUR_API_KEY'}";

curl_setopt($curl, CURLOPT_HTTPHEADER, array(
    'Content-Type: application/json',
    $authorization
));

curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_HTTPGET, true);

$result = curl_exec($curl);
$httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);

curl_close($curl);

echo "HTTP Code: " . $httpCode . "\\n";
echo "Response: " . $result;
?>`}
                    </pre>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PSAChecker;
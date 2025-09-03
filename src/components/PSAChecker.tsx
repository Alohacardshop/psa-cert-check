import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PSAChecker = () => {
  const [apiKey, setApiKey] = useState("");
  const [certNumber, setCertNumber] = useState("79909125");
  const { toast } = useToast();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">PSA jQuery Code Generator</h1>
          </div>
          <p className="text-muted-foreground">
            Generate jQuery AJAX code for PSA API testing
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
                onChange={(e) => setApiKey(e.target.value)}
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
              Enter a PSA certificate number for the jQuery code
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="certnumber">Certificate Number</Label>
              <Input
                id="certnumber"
                placeholder="Enter certificate number..."
                value={certNumber}
                onChange={(e) => setCertNumber(e.target.value)}
                className="font-mono"
              />
            </div>
          </CardContent>
        </Card>

        {/* jQuery Code */}
        {apiKey && certNumber && (
          <Card>
            <CardHeader>
              <CardTitle>jQuery AJAX Code</CardTitle>
              <CardDescription>
                Copy this jQuery code to test the PSA API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-md">
                <pre className="text-sm font-mono overflow-x-auto">
{`var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://api.psacard.com/publicapi/cert/GetByCertNumber/${certNumber}",
    "method": "GET",
    "headers": {
          "authorization": "bearer ${apiKey}"
    }
}
$.ajax(settings).done(function (response) {
    console.log(response);
});`}
                </pre>
              </div>
              <Button 
                onClick={() => {
                  const script = `var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://api.psacard.com/publicapi/cert/GetByCertNumber/${certNumber}",
    "method": "GET",
    "headers": {
          "authorization": "bearer ${apiKey}"
    }
}
$.ajax(settings).done(function (response) {
    console.log(response);
});`;
                  navigator.clipboard.writeText(script);
                  toast({
                    title: "Copied!",
                    description: "jQuery code copied to clipboard",
                  });
                }}
                className="w-full"
              >
                📋 Copy jQuery Code to Clipboard
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PSAChecker;
import PSAChecker from "@/components/PSAChecker";

const Index = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-4">PSA Certificate Checker</h1>
        <p className="text-lg text-muted-foreground mb-8">Testing if the app renders...</p>
        <div className="bg-card p-6 rounded-lg border">
          <p className="text-card-foreground">If you can see this, React is working!</p>
        </div>
      </div>
    </div>
  );
};

export default Index;

import DashboardLayout from "@/components/layout/DashboardLayout";

export default function SendPackageSimple() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-2xl font-bold mb-4">Send Package (Test)</h1>
        <div className="bg-white p-6 rounded-lg border">
          <p>This is a simplified test version of the Send Package page.</p>
          <p>If you can see this, the basic routing works and the issue is with the complex SendPackage component.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
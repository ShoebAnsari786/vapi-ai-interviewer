import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TechnicalScreeningTable from "../components/TechnicalScreeningTable";
import ATSResultsTable from "../components/ATSResultsTable";

export default function Admin() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <Tabs defaultValue="ats" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="ats">ATS Results</TabsTrigger>
          <TabsTrigger value="screening">Technical Screening</TabsTrigger>
        </TabsList>

        <TabsContent value="ats">
          <ATSResultsTable />
        </TabsContent>

        <TabsContent value="screening">
          <TechnicalScreeningTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}

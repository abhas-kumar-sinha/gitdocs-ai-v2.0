import Sidebar from "@/components/layout/Sidebar";
import AuraBackground from "@/components/animated-backgrounds/AuraBackground";

const DashboardPage = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <div className="relative flex-1 overflow-hidden">
        <AuraBackground source="dashboard" />
      </div>
    </div>
  );
};

export default DashboardPage;

import DashboardLayout from '@/components/layouts/DepartamentLayout';
import DashboardComponent from '@/components/ResidentsComponent';

export default function Home() {
  return (
    <DashboardLayout>
      <DashboardComponent />
    </DashboardLayout>
  );
}
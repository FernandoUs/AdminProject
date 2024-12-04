import DashboardLayout from '@/components/layouts/DepartamentLayout';
import DashboardComponent from '@/components/DepartamentsComponent';

export default function Home() {
  return (
    <DashboardLayout>
      <DashboardComponent />
    </DashboardLayout>
  );
}
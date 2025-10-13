import StatsCard from '../StatsCard';
import { Package } from 'lucide-react';

export default function StatsCardExample() {
  return (
    <div className="max-w-sm">
      <StatsCard 
        title="Total de Produtos"
        value={156}
        icon={Package}
        trend={{ value: "+12% este mês", positive: true }}
      />
    </div>
  );
}

import DataTable from '../DataTable';

export default function DataTableExample() {
  const columns = [
    { key: 'name', label: 'Nome' },
    { key: 'category', label: 'Categoria' },
    { key: 'price', label: 'Preço' },
    { key: 'status', label: 'Status' }
  ];
  
  const data = [
    { id: '1', name: 'Persiana Blackout', category: 'Blackout', price: 'R$ 299,90', status: 'Ativo' },
    { id: '2', name: 'Persiana Rolô', category: 'Rolô', price: 'R$ 249,90', status: 'Ativo' },
    { id: '3', name: 'Persiana Vertical', category: 'Vertical', price: 'R$ 349,90', status: 'Inativo' }
  ];
  
  return (
    <DataTable 
      title="Produtos"
      columns={columns}
      data={data}
      onEdit={(id) => console.log('Edit', id)}
      onDelete={(id) => console.log('Delete', id)}
    />
  );
}

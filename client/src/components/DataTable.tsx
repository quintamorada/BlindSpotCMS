import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Trash2, Search } from "lucide-react";
import { useState } from "react";

interface Column {
  key: string;
  label: string;
}

interface DataTableProps {
  title: string;
  columns: Column[];
  data: Record<string, any>[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function DataTable({ title, columns, data, onEdit, onDelete }: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredData = data.filter(row =>
    Object.values(row).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
        <CardTitle>{title}</CardTitle>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
            data-testid="input-table-search"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                {columns.map((column) => (
                  <th key={column.key} className="text-left p-3 text-sm font-semibold">
                    {column.label}
                  </th>
                ))}
                <th className="text-right p-3 text-sm font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, index) => (
                <tr 
                  key={row.id || index} 
                  className="border-b even:bg-muted/20 hover-elevate"
                  data-testid={`row-${row.id}`}
                >
                  {columns.map((column) => (
                    <td key={column.key} className="p-3 text-sm">
                      {row[column.key]}
                    </td>
                  ))}
                  <td className="p-3 text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onEdit?.(row.id)}
                        data-testid={`button-edit-${row.id}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onDelete?.(row.id)}
                        data-testid={`button-delete-${row.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

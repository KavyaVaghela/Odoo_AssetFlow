import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/store/useStore';
import { Plus, Settings2, Trash2 } from 'lucide-react';

export default function Categories() {
  const { categories } = useStore();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Asset Categories</h1>
          <p className="text-muted-foreground">Manage and organize your asset inventory classification.</p>
        </div>
        <Button><Plus className="mr-2 h-4 w-4" /> Create Category</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categories.map((cat) => (
          <Card key={cat.id} className="glass flex flex-col group transition-all hover:shadow-md hover:border-primary/50">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="text-4xl">{cat.icon}</div>
                <Badge variant={cat.status === 'Active' ? 'success' : 'secondary'}>{cat.status}</Badge>
              </div>
              <CardTitle className="mt-4">{cat.name}</CardTitle>
              <CardDescription className="line-clamp-2 min-h-[40px]">{cat.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-3">
              <div className="text-sm font-medium">
                <span className="text-2xl font-bold">{cat.count}</span> Assets
              </div>
            </CardContent>
            <CardFooter className="pt-3 border-t bg-muted/20 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                <Settings2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

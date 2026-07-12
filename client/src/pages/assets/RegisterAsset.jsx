import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { UploadCloud, CheckCircle2, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';

export default function RegisterAsset() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const onSubmit = (data) => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => navigate('/inventory'), 2000);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] animate-in zoom-in duration-300">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Asset Registered Successfully!</h2>
        <p className="text-muted-foreground mb-6">QR Code generated and asset added to inventory.</p>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => setIsSuccess(false)}>Register Another</Button>
          <Button onClick={() => navigate('/inventory')}>View Inventory</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Register New Asset</h1>
        <p className="text-muted-foreground text-sm">Fill in the details to add a new asset to the system.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="glass overflow-hidden border-t-4 border-t-primary">
          <CardHeader>
            <CardTitle className="text-lg">Asset Details</CardTitle>
            <CardDescription>Primary identification and classification.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Asset Name *</Label>
                <Input id="name" placeholder="e.g. MacBook Pro 16" {...register("name", { required: true })} />
                {errors.name && <span className="text-xs text-destructive">This field is required</span>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Asset Code (Auto-generated if empty)</Label>
                <div className="flex gap-2">
                  <Input id="code" placeholder="LAP-001" {...register("code")} />
                  <Button type="button" variant="outline" className="px-3" title="Generate Code">
                    <QrCode size={16} />
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <select id="category" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" {...register("category", { required: true })}>
                  <option value="">Select...</option>
                  <option value="Laptop">Laptop</option>
                  <option value="Mobile">Mobile</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Accessory">Accessory</option>
                </select>
                {errors.category && <span className="text-xs text-destructive">Required</span>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <select id="department" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" {...register("department")}>
                  <option value="">Select...</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Sales">Sales</option>
                  <option value="Design">Design</option>
                  <option value="HR">HR</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="condition">Initial Condition</Label>
                <select id="condition" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" {...register("condition")}>
                  <option value="New">New</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                </select>
              </div>
            </div>

            {/* Hardware Specific */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="serial">Serial Number</Label>
                <Input id="serial" placeholder="S/N..." {...register("serial")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand">Brand / Model</Label>
                <Input id="brand" placeholder="Apple / M2 Max" {...register("brand")} />
              </div>
            </div>

            {/* Procurement Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t">
              <div className="space-y-2">
                <Label htmlFor="purchaseDate">Purchase Date</Label>
                <Input type="date" id="purchaseDate" {...register("purchaseDate")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cost">Purchase Cost ($)</Label>
                <Input type="number" id="cost" placeholder="0.00" {...register("cost")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vendor">Vendor</Label>
                <Input id="vendor" placeholder="Supplier name" {...register("vendor")} />
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t">
              <Label>Asset Image (Optional)</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-10 flex flex-col items-center justify-center hover:bg-muted/50 transition-colors cursor-pointer">
                <UploadCloud className="w-10 h-10 text-muted-foreground mb-4" />
                <p className="text-sm font-medium text-foreground">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Registering...' : 'Save & Generate QR'}
              </Button>
            </div>

          </CardContent>
        </Card>
      </form>
    </div>
  );
}

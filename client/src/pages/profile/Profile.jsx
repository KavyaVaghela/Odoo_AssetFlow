import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Mail, Phone, Calendar, Building, ShieldCheck, Edit, 
  X, CheckCircle2, Package, UserCheck, HardDrive, Key
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useStore } from '@/store/useStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export default function Profile() {
  const { profile, myAssets, updateProfile } = useStore();

  const [editOpen, setEditOpen] = useState(false);
  const [profileName, setProfileName] = useState(profile.name);
  const [profileEmail, setProfileEmail] = useState(profile.email);
  const [profilePhone, setProfilePhone] = useState(profile.phone);
  const [toastMessage, setToastMessage] = useState("");

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!profileName.trim() || !profileEmail.trim() || !profilePhone.trim()) return;

    updateProfile({
      name: profileName,
      email: profileEmail,
      phone: profilePhone
    });

    setEditOpen(false);
    setToastMessage("Profile settings updated successfully!");
    setTimeout(() => setToastMessage(""), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 relative">
      
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 flex items-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl border border-emerald-500 animate-in slide-in-from-bottom-6 duration-300">
          <CheckCircle2 size={16} />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground">Manage your identity settings, contact coordinates, and asset agreements.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        
        {/* Profile Card Info */}
        <Card className="lg:col-span-5 glass border-border/50 overflow-hidden h-fit">
          <div className="h-28 bg-gradient-to-r from-blue-600 to-indigo-600 relative" />
          <CardContent className="p-6 relative pt-0">
            {/* Avatar positioning */}
            <div className="flex justify-between items-end -mt-16 mb-4">
              <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
                <AvatarImage src={profile.photo} />
                <AvatarFallback>{profile.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
              </Avatar>
              <Button 
                onClick={() => {
                  setProfileName(profile.name);
                  setProfileEmail(profile.email);
                  setProfilePhone(profile.phone);
                  setEditOpen(true);
                }}
                variant="outline" 
                size="sm" 
                className="h-8 gap-1.5 font-semibold text-xs border-border"
              >
                <Edit size={12} />
                Edit Profile
              </Button>
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-1.5">
                {profile.name}
                <UserCheck size={16} className="text-primary" />
              </h2>
              <p className="text-xs text-muted-foreground font-mono">{profile.employeeId}</p>
              <p className="text-sm font-semibold text-foreground mt-2">{profile.designation}</p>
            </div>

            {/* Structured details list */}
            <div className="mt-6 space-y-4 border-t pt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-3">
                <Building size={16} className="text-muted-foreground shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider block text-muted-foreground/60 leading-none">Department</span>
                  <span className="text-foreground font-medium mt-1 inline-block">{profile.department}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-muted-foreground shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider block text-muted-foreground/60 leading-none">Corporate Email</span>
                  <span className="text-foreground font-medium mt-1 inline-block">{profile.email}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-muted-foreground shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider block text-muted-foreground/60 leading-none">Phone Contact</span>
                  <span className="text-foreground font-medium mt-1 inline-block">{profile.phone}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar size={16} className="text-muted-foreground shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider block text-muted-foreground/60 leading-none">Joining Date</span>
                  <span className="text-foreground font-medium mt-1 inline-block">{profile.joiningDate}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assigned assets list column */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="glass border-border/50">
            <CardHeader className="pb-3 flex flex-row justify-between items-center">
              <div>
                <CardTitle className="text-base font-bold">Assigned Equipment Agreement</CardTitle>
                <CardDescription>Devices allocated to your profile contract</CardDescription>
              </div>
              <Package size={20} className="text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-4">
              {myAssets.map((asset) => (
                <div key={asset.id} className="flex gap-4 items-center justify-between p-3.5 border rounded-xl bg-card/40 hover:bg-card transition-colors">
                  <div className="flex gap-3 items-center min-w-0">
                    <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                      <HardDrive size={16} className="text-primary" />
                    </div>
                    <div className="min-w-0">
                      <span className="font-bold text-xs text-foreground block truncate">{asset.name}</span>
                      <span className="text-[10px] text-muted-foreground font-mono mt-0.5 block">{asset.code}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-muted-foreground block">Allocation Date</span>
                    <span className="font-bold text-xs text-foreground mt-0.5 block">{asset.allocationDate}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="glass border-border/50">
            <CardHeader className="pb-3 flex flex-row justify-between items-center">
              <div>
                <CardTitle className="text-base font-bold">Security Credentials</CardTitle>
                <CardDescription>Authentication and platform credentials status</CardDescription>
              </div>
              <Key size={20} className="text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-3.5 text-xs text-muted-foreground">
              <div className="flex justify-between items-center border-b pb-2">
                <span>Account Role Access</span>
                <Badge variant="outline" className="text-[10px] font-bold tracking-wider uppercase bg-primary/10 text-primary border-primary/20">
                  {profile.role} (Standard Portal Access)
                </Badge>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span>Single Sign-On (SSO) Status</span>
                <span className="font-semibold text-emerald-500">Connected via Corporate SSO</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Last Security Audit Verification</span>
                <span className="font-semibold text-foreground">June 12, 2026</span>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>

      {/* Edit Profile Dialog */}
      {editOpen && (
        <Dialog open={editOpen} onOpenChange={() => setEditOpen(false)}>
          <DialogContent className="sm:max-w-[440px] rounded-2xl glass border border-border/80 p-0 overflow-hidden">
            <div className="bg-primary/5 p-6 border-b flex justify-between items-start">
              <div>
                <DialogTitle className="text-lg font-bold text-foreground">Edit Profile Information</DialogTitle>
                <DialogDescription className="text-xs mt-0.5">Modify contact info for database update</DialogDescription>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => setEditOpen(false)}>
                <X size={16} />
              </Button>
            </div>
            
            <form onSubmit={handleEditSubmit}>
              <div className="p-6 space-y-4">
                {/* Full Name */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Full Name</label>
                  <Input 
                    required 
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="rounded-lg border-border"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Email Address</label>
                  <Input 
                    type="email"
                    required 
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="rounded-lg border-border"
                  />
                </div>

                {/* Phone Contact */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Phone Number</label>
                  <Input 
                    required 
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="rounded-lg border-border"
                  />
                </div>

                <div className="p-3 bg-muted/50 border rounded-xl flex gap-2 items-start text-[11px] text-muted-foreground leading-relaxed">
                  <ShieldCheck size={16} className="text-primary mt-0.5 shrink-0" />
                  <span>
                    Note: Department, Employee ID, and Joining Date modifications are restricted. To correct hiring data discrepancies, contact HR administration.
                  </span>
                </div>
              </div>

              <div className="p-4 bg-muted/30 border-t flex justify-end gap-2 shrink-0">
                <Button type="button" variant="outline" size="sm" onClick={() => setEditOpen(false)}>Cancel</Button>
                <Button type="submit" size="sm" className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold">Save Changes</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}

    </div>
  );
}

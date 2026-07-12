import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { User, Phone, Mail, Calendar, UserCheck, Shield, Edit3, Building, Award, CheckCircle2 } from 'lucide-react';

export default function ProfileSummary() {
  const { profile, updateProfile } = useStore();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form states
  const [fullName, setFullName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone);
  const [email, setEmail] = useState(profile.email);

  const handleOpenEdit = () => {
    setFullName(profile.name);
    setPhone(profile.phone);
    setEmail(profile.email);
    setIsSuccess(false);
    setIsEditOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !email.trim()) return;

    updateProfile({
      name: fullName,
      phone: phone,
      email: email,
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsEditOpen(false);
      setIsSuccess(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">Employee Profile</h1>
        <p className="text-muted-foreground">Manage your identity credentials, contact details, and organization role assignment.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Card: Avatar and quick details */}
        <Card className="md:col-span-1 rounded-2xl border-border/50 glass overflow-hidden text-center p-6 flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20 shadow-md">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="object-cover w-full h-full"
              />
            </div>
            <Badge className="absolute bottom-0 right-2 bg-primary hover:bg-primary text-white border-2 border-background text-[10px] px-2 py-0.5 rounded-full uppercase">
              {profile.role}
            </Badge>
          </div>

          <div>
            <h2 className="text-xl font-bold text-foreground">{profile.name}</h2>
            <p className="text-xs text-muted-foreground font-semibold">{profile.designation}</p>
            <p className="text-[10px] text-muted-foreground/80 font-mono mt-1">{profile.id}</p>
          </div>

          <Button 
            onClick={handleOpenEdit}
            className="w-full rounded-xl bg-primary hover:bg-blue-700 text-white text-xs gap-1.5 cursor-pointer h-9 shadow-sm"
          >
            <Edit3 className="w-4 h-4" />
            Edit Profile Details
          </Button>
        </Card>

        {/* Right Card: Full specifications table */}
        <Card className="md:col-span-2 rounded-2xl border-border/50 glass overflow-hidden">
          <CardHeader className="p-5 border-b bg-muted/20">
            <CardTitle className="text-sm font-bold flex items-center gap-1.5">
              <Building className="w-4 h-4 text-primary" />
              Corporate Identity & Credentials
            </CardTitle>
            <CardDescription className="text-xs">Your operational role parameters in the company ledger.</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-y-4 gap-x-6 sm:grid-cols-2 text-sm">
              <div className="flex flex-col gap-0.5 border-b pb-2 sm:border-none sm:pb-0">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <User className="w-3.5 h-3.5" /> Full Name
                </span>
                <span className="font-semibold text-foreground">{profile.name}</span>
              </div>

              <div className="flex flex-col gap-0.5 border-b pb-2 sm:border-none sm:pb-0">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> Designation
                </span>
                <span className="font-semibold text-foreground">{profile.designation}</span>
              </div>

              <div className="flex flex-col gap-0.5 border-b pb-2 sm:border-none sm:pb-0">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Building className="w-3.5 h-3.5" /> Department
                </span>
                <span className="font-semibold text-foreground">{profile.department}</span>
              </div>

              <div className="flex flex-col gap-0.5 border-b pb-2 sm:border-none sm:pb-0">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5" /> Manager / Supervisor
                </span>
                <span className="font-semibold text-foreground">{profile.manager}</span>
              </div>

              <div className="flex flex-col gap-0.5 border-b pb-2 sm:border-none sm:pb-0">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" /> Corporate Email
                </span>
                <span className="font-semibold text-foreground break-all">{profile.email}</span>
              </div>

              <div className="flex flex-col gap-0.5 border-b pb-2 sm:border-none sm:pb-0">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" /> Phone Extension
                </span>
                <span className="font-semibold text-foreground">{profile.phone}</span>
              </div>

              <div className="flex flex-col gap-0.5 border-b pb-2 sm:border-none sm:pb-0">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Date of Joining
                </span>
                <span className="font-semibold text-foreground">{profile.joiningDate}</span>
              </div>

              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5" /> Security Clearance
                </span>
                <span className="font-semibold text-foreground">Standard Employee Access</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-primary" />
              Edit Profile Information
            </DialogTitle>
            <DialogDescription>Submit changes to your local user credentials.</DialogDescription>
          </DialogHeader>
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.form 
                onSubmit={handleEditSubmit} 
                className="space-y-4"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="space-y-1">
                  <label className="text-xs font-semibold">Full Name</label>
                  <Input
                    required
                    placeholder="Enter full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="rounded-xl focus-visible:ring-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold">Corporate Email</label>
                  <Input
                    required
                    type="email"
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-xl focus-visible:ring-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold">Phone Extension</label>
                  <Input
                    required
                    placeholder="Enter phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="rounded-xl focus-visible:ring-primary"
                  />
                </div>

                <DialogFooter className="pt-2">
                  <Button type="button" variant="outline" className="rounded-xl" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                  <Button type="submit" className="bg-primary hover:bg-blue-700 text-white rounded-xl">Save Changes</Button>
                </DialogFooter>
              </motion.form>
            ) : (
              <motion.div 
                className="flex flex-col items-center justify-center py-8 space-y-3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="p-3 bg-emerald-500/10 rounded-full text-emerald-500 border border-emerald-500/20">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-lg text-foreground text-center">Changes Saved Successfully</h3>
                <p className="text-xs text-muted-foreground text-center max-w-xs">Your corporate directory profile has been updated locally.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </div>
  );
}

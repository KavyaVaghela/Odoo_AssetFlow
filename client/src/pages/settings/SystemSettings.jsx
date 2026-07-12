import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, Bell, Shield, Laptop, Moon, Sun, Globe, 
  Save, CheckCircle2, ChevronRight, Volume2, Key
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function SystemSettings() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [systemSound, setSystemSound] = useState(false);
  const [dashboardLang, setDashboardLang] = useState("English");
  const [toastMessage, setToastMessage] = useState("");

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setToastMessage("System settings saved successfully!");
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
        <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
        <p className="text-muted-foreground">Customize your dashboard display preferences, alert notifications, and user localization.</p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6 max-w-4xl">
        
        {/* Layout: Alerts & Preferences */}
        <div className="grid gap-6 md:grid-cols-2">
          
          {/* Notifications Preferences */}
          <Card className="glass border-border/50">
            <CardHeader className="pb-3 flex flex-row justify-between items-center">
              <div>
                <CardTitle className="text-base font-bold">Alert Preferences</CardTitle>
                <CardDescription>Configure how you receive ticket and booking updates.</CardDescription>
              </div>
              <Bell size={18} className="text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Option 1 */}
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/40 transition-colors">
                <div>
                  <span className="text-xs font-bold text-foreground block">Email Notifications</span>
                  <span className="text-[10px] text-muted-foreground">Receive digest of return alerts & approvals in email inbox.</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary/45 cursor-pointer"
                />
              </div>

              {/* Option 2 */}
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/40 transition-colors">
                <div>
                  <span className="text-xs font-bold text-foreground block">Push Alerts</span>
                  <span className="text-[10px] text-muted-foreground">Get notified immediately on status check approvals.</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={pushAlerts}
                  onChange={(e) => setPushAlerts(e.target.checked)}
                  className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary/45 cursor-pointer"
                />
              </div>

              {/* Option 3 */}
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/40 transition-colors">
                <div>
                  <span className="text-xs font-bold text-foreground block">System Alert Tones</span>
                  <span className="text-[10px] text-muted-foreground">Play a subtle audio trigger when a new notification arrives.</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={systemSound}
                  onChange={(e) => setSystemSound(e.target.checked)}
                  className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary/45 cursor-pointer"
                />
              </div>
            </CardContent>
          </Card>

          {/* Localization Preferences */}
          <Card className="glass border-border/50">
            <CardHeader className="pb-3 flex flex-row justify-between items-center">
              <div>
                <CardTitle className="text-base font-bold">Localization</CardTitle>
                <CardDescription>Adjust localization settings for language and zone.</CardDescription>
              </div>
              <Globe size={18} className="text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Language Selection */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Language</label>
                <Select value={dashboardLang} onValueChange={setDashboardLang}>
                  <SelectTrigger className="w-full rounded-lg border-border bg-background/50">
                    <SelectValue placeholder="Choose language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English (United States)</SelectItem>
                    <SelectItem value="Spanish">Español (Spanish)</SelectItem>
                    <SelectItem value="French">Français (French)</SelectItem>
                    <SelectItem value="German">Deutsch (German)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Time Zone Indicator */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Time Zone</label>
                <div className="p-3 rounded-lg border bg-muted/40 text-xs flex justify-between items-center text-foreground font-semibold">
                  <span>GMT+05:30 (India Standard Time)</span>
                  <Badge variant="outline" className="text-[9px] bg-background">Auto-detected</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Security Summary Panel */}
        <Card className="glass border-border/50">
          <CardHeader className="pb-3 flex flex-row justify-between items-center">
            <div>
              <CardTitle className="text-base font-bold">Security Preferences</CardTitle>
              <CardDescription>Authentication and active session configurations.</CardDescription>
            </div>
            <Shield size={18} className="text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-3.5 text-xs text-muted-foreground">
            <div className="flex justify-between items-center border-b pb-2">
              <span>Two-Factor Authentication (2FA)</span>
              <span className="font-semibold text-foreground">Enforced by Admin</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span>Active Portal Session</span>
              <span className="font-semibold text-emerald-500">Secure Session Verified</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Security Logs Audit</span>
              <span className="font-semibold text-foreground">Verified by System Security</span>
            </div>
          </CardContent>
        </Card>

        {/* Action Controls */}
        <div className="flex justify-end pt-2">
          <Button type="submit" className="h-10 px-6 gap-2 rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-semibold shadow-lg shadow-primary/10">
            <Save size={16} />
            Save Preferences
          </Button>
        </div>

      </form>

    </div>
  );
}

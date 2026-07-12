import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings as SettingsIcon, Bell, Eye, Lock, Globe, Volume2, Save, Sparkles } from 'lucide-react';

export default function Settings() {
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [soundAlert, setSoundAlert] = useState(false);
  const [language, setLanguage] = useState('en');
  const [scaling, setScaling] = useState('100');
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveSettings = () => {
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">System Settings</h1>
          <p className="text-muted-foreground">Adjust system preferences, notification frequencies, and interface scaling options.</p>
        </div>
      </div>

      <div className="grid gap-6 max-w-4xl">
        {/* Notifications Section */}
        <Card className="rounded-2xl border-border/50 glass">
          <CardHeader className="p-5 border-b">
            <CardTitle className="text-sm font-bold flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-primary" />
              Notification Frequency Preferences
            </CardTitle>
            <CardDescription className="text-xs">Adjust how and when you receive asset alerts.</CardDescription>
          </CardHeader>
          <CardContent className="p-5 space-y-4 text-sm">
            <div className="flex items-center justify-between py-2 border-b">
              <div>
                <p className="font-semibold">Email Alerts</p>
                <p className="text-xs text-muted-foreground">Receive daily summaries of asset returns and scheduled bookings.</p>
              </div>
              <input 
                type="checkbox" 
                checked={emailNotif} 
                onChange={(e) => setEmailNotif(e.target.checked)} 
                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between py-2 border-b">
              <div>
                <p className="font-semibold">Push Notifications</p>
                <p className="text-xs text-muted-foreground">Receive instant desktop alerts when a ticket is approved or completed.</p>
              </div>
              <input 
                type="checkbox" 
                checked={pushNotif} 
                onChange={(e) => setPushNotif(e.target.checked)} 
                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-semibold">Sound Notifications</p>
                <p className="text-xs text-muted-foreground">Play a subtle alert chime when a new request is assigned to support.</p>
              </div>
              <input 
                type="checkbox" 
                checked={soundAlert} 
                onChange={(e) => setSoundAlert(e.target.checked)} 
                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
              />
            </div>
          </CardContent>
        </Card>

        {/* Display & Layout Settings */}
        <Card className="rounded-2xl border-border/50 glass">
          <CardHeader className="p-5 border-b">
            <CardTitle className="text-sm font-bold flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-primary" />
              Interface Display Options
            </CardTitle>
            <CardDescription className="text-xs">Customize the appearance scales and localization settings.</CardDescription>
          </CardHeader>
          <CardContent className="p-5 space-y-4 text-sm">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                  Preferred Language
                </label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="rounded-xl focus-visible:ring-primary h-9.5 text-xs">
                    <SelectValue placeholder="Language Selection" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl text-xs">
                    <SelectItem value="en">English (United States)</SelectItem>
                    <SelectItem value="es">Español (España)</SelectItem>
                    <SelectItem value="fr">Français (France)</SelectItem>
                    <SelectItem value="de">Deutsch (Deutschland)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-muted-foreground" />
                  User Interface Scaling
                </label>
                <Select value={scaling} onValueChange={setScaling}>
                  <SelectTrigger className="rounded-xl focus-visible:ring-primary h-9.5 text-xs">
                    <SelectValue placeholder="Scale Selection" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl text-xs">
                    <SelectItem value="90">90% - Compact Density</SelectItem>
                    <SelectItem value="100">100% - Default scale</SelectItem>
                    <SelectItem value="110">110% - Larger size</SelectItem>
                    <SelectItem value="120">120% - Accessibility view</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save button */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Version check: v1.0.0 (Production Core)</p>
          <div className="flex gap-2 items-center">
            {isSaved && (
              <span className="text-xs text-emerald-600 font-bold animate-pulse">✓ Settings saved successfully</span>
            )}
            <Button 
              onClick={handleSaveSettings}
              className="bg-primary hover:bg-blue-700 text-white rounded-xl h-10 px-6 gap-1.5 shadow-md cursor-pointer text-xs font-semibold"
            >
              <Save className="w-4 h-4" />
              Save Preferences
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

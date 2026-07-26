"use client";

import { motion } from "motion/react";
import { User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <h1 className="text-3xl font-bold mb-8">Profile</h1>

        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                <User className="h-10 w-10 text-muted-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{user?.full_name}</h2>
                <p className="text-muted-foreground">@{user?.username}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Full Name</label>
                <Input defaultValue={user?.full_name} className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input defaultValue={user?.email} type="email" disabled className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Bio</label>
                <Input defaultValue={user?.bio || ""} placeholder="Tell us about yourself" className="mt-1" />
              </div>
              <Button>Save Changes</Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

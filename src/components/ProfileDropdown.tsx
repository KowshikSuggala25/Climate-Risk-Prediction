import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { settingsService } from "@/services/settingsService";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { User, Upload, LogOut, Settings } from "lucide-react";
import { Link } from "react-router-dom";

export const ProfileDropdown = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [profileData, setProfileData] = useState({
    full_name: "",
    email: "",
    mobile_number: "",
    profile_photo_url: "",
  });
  const [uploading, setUploading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load profile data when dialog opens
  const handleDialogOpen = async (open: boolean) => {
    setDialogOpen(open);
    if (open && user) {
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (profile) {
          setProfileData({
            full_name: profile.full_name || "",
            email: profile.email || "",
            mobile_number: profile.mobile_number || "",
            profile_photo_url: "", // fallback to empty string since column does not exist
          });
          setProfilePhoto(""); // fallback to empty string since column does not exist
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
      }
    }
  };

  const handlePhotoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "File size must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Error",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const photoUrl = await settingsService.uploadProfilePhoto(file);
      setProfilePhoto(photoUrl);
      setProfileData((prev) => ({ ...prev, profile_photo_url: photoUrl }));

      // Save to database
      await settingsService.updateProfile({ profile_photo_url: photoUrl });

      toast({
        title: "Success",
        description: "Profile photo updated successfully",
      });
    } catch (error) {
      console.error("Failed to upload photo:", error);
      toast({
        title: "Error",
        description: "Failed to upload photo",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      await settingsService.updateProfile(profileData);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      setDialogOpen(false);
    } catch (error) {
      console.error("Failed to save profile:", error);
      toast({
        title: "Error",
        description: "Failed to save profile",
        variant: "destructive",
      });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={profileData.profile_photo_url || profilePhoto || ""}
              alt="Profile"
            />
            <AvatarFallback>
              {profileData.full_name
                ? getInitials(profileData.full_name)
                : user?.email
                ? getInitials(user.email)
                : "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-80 p-4 bg-background border z-50"
        align="end"
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={profileData.profile_photo_url || profilePhoto || ""}
                  alt="Profile"
                />
                <AvatarFallback>
                  {profileData.full_name
                    ? getInitials(profileData.full_name)
                    : user?.email
                    ? getInitials(user.email)
                    : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="text-sm font-medium leading-none">
                  {profileData.full_name || "User"}
                </p>
                <p className="text-xs leading-none text-muted-foreground mt-1">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <Dialog open={dialogOpen} onOpenChange={handleDialogOpen}>
          <DialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile Details</span>
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Profile Details</DialogTitle>
              <DialogDescription>
                Update your profile information and photo.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex flex-col items-center space-y-2">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profilePhoto || ""} alt="Profile" />
                  <AvatarFallback>
                    {profileData.full_name
                      ? getInitials(profileData.full_name)
                      : "U"}
                  </AvatarFallback>
                </Avatar>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {uploading ? "Uploading..." : "Upload Photo"}
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profileData.full_name}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      full_name: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) =>
                    setProfileData({ ...profileData, email: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input
                  id="mobile"
                  value={profileData.mobile_number}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      mobile_number: e.target.value,
                    })
                  }
                />
              </div>

              <Button onClick={handleSaveProfile} className="w-full">
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Link to="/settings">
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </Link>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={signOut} className="text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

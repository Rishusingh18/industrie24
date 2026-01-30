"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { User, Loader2, Pencil, MapPin, Phone, Mail, Building2 } from "lucide-react"
import Image from "next/image"

interface ProfileFormProps {
    user: any
}

interface ProfileData {
    full_name: string
    company_name: string
    address: string
    city?: string
    state?: string
    zip_code?: string
    phone: string
}

export function ProfileForm({ user }: ProfileFormProps) {
    const supabase = createClient()
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [profile, setProfile] = useState<ProfileData>({
        full_name: "",
        company_name: "",
        address: "",
        city: "",
        state: "",
        zip_code: "",
        phone: "",
    })

    // Initialize with user metadata if available
    useEffect(() => {
        if (user?.user_metadata?.full_name) {
            setProfile(prev => ({ ...prev, full_name: user.user_metadata.full_name }))
        }
        fetchProfile()
    }, [user])

    const fetchProfile = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single()

            if (error && error.code !== 'PGRST116') {
                console.error('Error fetching profile:', error)
            }

            // Get latest user metadata to ensure we have the extra fields
            const { data: { user: latestUser } } = await supabase.auth.getUser()
            const metadata = latestUser?.user_metadata || {}

            if (data || metadata) {
                setProfile({
                    full_name: data?.full_name || metadata?.full_name || "",
                    company_name: data?.company_name || "",
                    address: data?.address || "",
                    city: metadata?.city || "",
                    state: metadata?.state || "",
                    zip_code: metadata?.zip_code || "",
                    phone: data?.phone || "",
                })
                // Only switch to view mode if we have at least a name
                if (data?.full_name || metadata?.full_name) {
                    setIsEditing(false)
                }
            } else {
                setIsEditing(true)
            }
        } catch (error) {
            console.error('Error loading user data:', error)
        } finally {
            setFetching(false)
        }
    }

    const updateProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            // 1. Update core profile data in 'profiles' table
            const { error: profileError } = await supabase.from('profiles').upsert({
                id: user.id,
                full_name: profile.full_name,
                company_name: profile.company_name,
                address: profile.address, // Keeping this as Street Address
                phone: profile.phone,
                updated_at: new Date().toISOString(),
            })

            if (profileError) throw profileError

            // 2. Update extra address details in user_metadata
            const { error: metadataError } = await supabase.auth.updateUser({
                data: {
                    city: profile.city,
                    state: profile.state,
                    zip_code: profile.zip_code,
                    // We can also sync full name here if we want
                    full_name: profile.full_name,
                }
            })

            if (metadataError) throw metadataError

            toast.success("Profile updated successfully")
            setIsEditing(false)
        } catch (error: any) {
            console.error('Error updating profile:', error)
            toast.error("Error updating profile: " + (error.message || "Unknown error"))
        } finally {
            setLoading(false)
        }
    }

    if (fetching) {
        return (
            <Card className="md:col-span-1 h-fit">
                <CardContent className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </CardContent>
            </Card>
        )
    }

    // View Mode (Bento Grid)
    if (!isEditing) {
        return (
            <div className="grid gap-4 md:col-span-1 h-fit">
                {/* Main Profile Card */}
                <Card className="overflow-hidden border-none shadow-md">
                    <div className="h-28 bg-gradient-to-r from-teal-600 to-emerald-600 relative">
                        <Button
                            variant="secondary"
                            size="icon"
                            className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/20 hover:bg-white/40 text-white border-none backdrop-blur-sm transition-all"
                            onClick={() => setIsEditing(true)}
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>
                    </div>
                    <CardContent className="pt-0 pb-6">
                        <div className="flex flex-col items-center -mt-14 mb-4">
                            <div className="h-28 w-28 rounded-full border-4 border-white bg-white overflow-hidden shadow-lg z-10">
                                <Image
                                    src="/default-avatar.png"
                                    alt="Profile"
                                    width={112}
                                    height={112}
                                    className="object-cover h-full w-full"
                                />
                            </div>
                            <h2 className="text-2xl font-bold mt-3 text-center text-gray-800">{profile.full_name || "User"}</h2>
                            <div className="flex flex-col items-center gap-1 mt-1">
                                <p className="text-sm text-gray-500 flex items-center gap-1.5">
                                    <Mail className="h-3.5 w-3.5" /> {user.email}
                                </p>
                                {profile.company_name && (
                                    <p className="text-sm font-semibold text-teal-700 bg-teal-50 px-3 py-0.5 rounded-full flex items-center gap-1.5 border border-teal-100">
                                        <Building2 className="h-3.5 w-3.5" /> {profile.company_name}
                                    </p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                    {/* Phone Card */}
                    <Card className="border-none shadow-sm hover:shadow-md transition-shadow group">
                        <CardHeader className="p-4 pb-2">
                            <CardTitle className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                <Phone className="h-3.5 w-3.5 text-teal-600" /> Phone
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-1">
                            <p className="font-medium text-gray-700 group-hover:text-teal-700 transition-colors">{profile.phone || "Not set"}</p>
                        </CardContent>
                    </Card>

                    {/* Address Card */}
                    <Card className="border-none shadow-sm hover:shadow-md transition-shadow group">
                        <CardHeader className="p-4 pb-2">
                            <CardTitle className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                <MapPin className="h-3.5 w-3.5 text-teal-600" /> Address
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-1">
                            <div className="font-medium text-gray-700 group-hover:text-teal-700 transition-colors">
                                <p className="truncate" title={profile.address}>{profile.address || "Street Address Not set"}</p>
                                {(profile.city || profile.state || profile.zip_code) && (
                                    <p className="text-sm text-gray-500 mt-1">
                                        {[profile.city, profile.state, profile.zip_code].filter(Boolean).join(", ")}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Member Since / Stats Card (New) */}
                    <Card className="col-span-2 border-none shadow-sm bg-gradient-to-r from-gray-50 to-white">
                        <CardContent className="p-4 flex justify-between items-center">
                            <div>
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Member Status</p>
                                <p className="font-bold text-teal-700 text-lg flex items-center gap-2">
                                    Active <span className="h-2 w-2 rounded-full bg-teal-500 animate-pulse"></span>
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Joined</p>
                                <p className="font-medium text-gray-700">{new Date(user.created_at || Date.now()).toLocaleDateString()}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    // Edit Mode (Form)
    return (
        <Card className="md:col-span-1 h-fit border-none shadow-md">
            <CardHeader className="bg-gray-50/50 border-b">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center">
                            <User className="h-6 w-6 text-teal-600" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">Edit Profile</CardTitle>
                            <CardDescription className="break-all">Update your information</CardDescription>
                        </div>
                    </div>
                    {/* Cancel button if we have existing data to fall back to */}
                    {profile.full_name && (
                        <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                            Cancel
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <form onSubmit={updateProfile} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                value={profile.full_name.split(' ')[0] || ''}
                                onChange={(e) => {
                                    const lastName = profile.full_name.split(' ').slice(1).join(' ') || ''
                                    setProfile({ ...profile, full_name: `${e.target.value} ${lastName}`.trim() })
                                }}
                                placeholder="John"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                value={profile.full_name.split(' ').slice(1).join(' ') || ''}
                                onChange={(e) => {
                                    const firstName = profile.full_name.split(' ')[0] || ''
                                    setProfile({ ...profile, full_name: `${firstName} ${e.target.value}`.trim() })
                                }}
                                placeholder="Doe"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="companyName">Company Name</Label>
                        <Input
                            id="companyName"
                            value={profile.company_name}
                            onChange={(e) => setProfile({ ...profile, company_name: e.target.value })}
                            placeholder="Your Company Name"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address">Street Address</Label>
                        <Input
                            id="address"
                            value={profile.address}
                            onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                            placeholder="123 Main St"
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input
                                id="city"
                                value={profile.city || ''}
                                onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                                placeholder="New York"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="state">State</Label>
                            <Input
                                id="state"
                                value={profile.state || ''}
                                onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                                placeholder="NY"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="zipCode">Zip Code</Label>
                            <Input
                                id="zipCode"
                                value={profile.zip_code || ''}
                                onChange={(e) => setProfile({ ...profile, zip_code: e.target.value })}
                                placeholder="10001"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="flex gap-2">
                            <Select
                                value={profile.phone.split(' ')[0] || "+1"}
                                onValueChange={(value) => {
                                    const number = profile.phone.split(' ').slice(1).join(' ')
                                    setProfile({ ...profile, phone: `${value} ${number}` })
                                }}
                            >
                                <SelectTrigger className="w-[120px] h-9 text-base md:text-sm px-3 py-1">
                                    <SelectValue placeholder="Code" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="+1">🇺🇸 +1</SelectItem>
                                    <SelectItem value="+44">🇬🇧 +44</SelectItem>
                                    <SelectItem value="+91">🇮🇳 +91</SelectItem>
                                    <SelectItem value="+49">🇩🇪 +49</SelectItem>
                                    <SelectItem value="+33">🇫🇷 +33</SelectItem>
                                    <SelectItem value="+81">🇯🇵 +81</SelectItem>
                                </SelectContent>
                            </Select>
                            <Input
                                id="phone"
                                value={profile.phone.split(' ').slice(1).join(' ')}
                                onChange={(e) => {
                                    const code = profile.phone.split(' ')[0] || "+1"
                                    setProfile({ ...profile, phone: `${code} ${e.target.value}` })
                                }}
                                placeholder="123 456 7890"
                                className="flex-1"
                            />
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button type="submit" className="flex-1 bg-teal-600 hover:bg-teal-700" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {loading ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}

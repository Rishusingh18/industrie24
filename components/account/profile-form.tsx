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
import { User, Loader2 } from "lucide-react"

interface ProfileFormProps {
    user: any
}

interface ProfileData {
    full_name: string
    company_name: string
    address: string
    phone: string
}

export function ProfileForm({ user }: ProfileFormProps) {
    const supabase = createClient()
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [profile, setProfile] = useState<ProfileData>({
        full_name: "",
        company_name: "",
        address: "",
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

            if (data) {
                setProfile({
                    full_name: data.full_name || user?.user_metadata?.full_name || "",
                    company_name: data.company_name || "",
                    address: data.address || "",
                    phone: data.phone || "",
                })
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
            const { error } = await supabase.from('profiles').upsert({
                id: user.id,
                ...profile,
                updated_at: new Date().toISOString(),
            })

            if (error) throw error
            toast.success("Profile updated successfully")
        } catch (error) {
            console.error('Error updating profile:', error)
            toast.error("Error updating profile")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="md:col-span-1 h-fit">
            <CardHeader>
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center">
                        <User className="h-6 w-6 text-teal-600" />
                    </div>
                    <div>
                        <CardTitle className="text-lg">User Profile</CardTitle>
                        <CardDescription className="break-all">{user.email}</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {fetching ? (
                    <div className="flex justify-center py-4">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <form onSubmit={updateProfile} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input
                                id="fullName"
                                value={profile.full_name}
                                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                                placeholder="John Doe"
                            />
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
                            <Label htmlFor="address">Address</Label>
                            <Input
                                id="address"
                                value={profile.address}
                                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                                placeholder="Your Address"
                            />
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

                        <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {loading ? "Saving..." : "Save Profile"}
                        </Button>
                    </form>
                )}
            </CardContent>
        </Card>
    )
}

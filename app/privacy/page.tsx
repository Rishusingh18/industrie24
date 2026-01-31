import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Privacy Policy | Unispare",
    description: "Privacy Policy for Unispare - Learn how we collect, use, and protect your personal information.",
}

export default function PrivacyPage() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6 text-[#0F1111]">Privacy Policy</h1>
            <div className="prose max-w-none text-[#0F1111]">
                <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>

                <p className="mb-6">
                    At Unispare, accessible from https://unispare.in, one of our main priorities is the privacy of our visitors.
                    This Privacy Policy document contains types of information that is collected and recorded by Unispare and how we use it.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-4">Google User Data</h2>
                <p className="mb-4">
                    If you choose to sign in using your Google account ("Google Auth"), Unispare accesses certain personal information from your Google profile, specifically:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Your name</li>
                    <li>Your email address</li>
                    <li>Your profile picture</li>
                </ul>
                <p className="mb-4">
                    We use this data solely for the purpose of:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>Creating and managing your user account on Unispare.</li>
                    <li>Authenticating your identity to provide secure access to our services.</li>
                    <li>Displaying your profile information within your account dashboard.</li>
                </ul>
                <p className="mb-6">
                    Unispare stores this data securely in our database. We do not share your Google user data with any third parties, except as required by law.
                    Our use of information received from Google APIs will adhere to the <a href="https://developers.google.com/terms/api-services-user-data-policy#additional_requirements_for_specific_api_scopes" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google API Services User Data Policy</a>, including the Limited Use requirements.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-4">Log Files</h2>
                <p className="mb-4">
                    Unispare follows a standard procedure of using log files. These files log visitors when they visit websites.
                    All hosting companies do this and a part of hosting services' analytics. The information collected by log files
                    include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp,
                    referring/exit pages, and possibly the number of clicks. These are not linked to any information that is
                    personally identifiable. The purpose of the information is for analyzing trends, administering the site,
                    tracking users' movement on the website, and gathering demographic information.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-4">Cookies and Web Beacons</h2>
                <p className="mb-4">
                    Like any other website, Unispare uses 'cookies'. These cookies are used to store information including
                    visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is
                    used to optimize the users' experience by customizing our web page content based on visitors' browser type
                    and/or other information.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-4">Privacy Policies</h2>
                <p className="mb-4">
                    You may consult this list to find the Privacy Policy for each of the advertising partners of Unispare.
                </p>
                <p className="mb-4">
                    Third-party ad servers or ad networks use technologies like cookies, JavaScript, or Web Beacons that are used
                    in their respective advertisements and links that appear on Unispare, which are sent directly to users'
                    browser. They automatically receive your IP address when this occurs. These technologies are used to measure
                    the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see
                    on websites that you visit.
                </p>
                <p className="mb-6">
                    Note that Unispare has no access to or control over these cookies that are used by third-party advertisers.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-4">Third Party Privacy Policies</h2>
                <p className="mb-4">
                    Unispare's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to
                    consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may
                    include their practices and instructions about how to opt-out of certain options.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-4">Consent</h2>
                <p className="mb-4">
                    By using our website, you hereby consent to our Privacy Policy and agree to its Terms and Conditions.
                </p>
            </div>
        </div >
    )
}

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
                    Unispare is committed to safeguarding your privacy. Please read the following privacy statement to understand how your personal information will be treated when you use or register on the Unispare site, speak to a member of our customer services, or otherwise interact with Unispare.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-4">What personal information does Unispare collect?</h2>
                <p className="mb-4">
                    Unispare collects personal information from you when you provide it to us directly, or through your use of our website, for example:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>
                        <strong>Account Information:</strong> Information about yourself and the company you work for, when you register for an account with us. This may include your name, contact details, company name, and your role.
                    </li>
                    <li>
                        <strong>Transaction Information:</strong> Billing and delivery information if you make a purchase with us.
                    </li>
                    <li>
                        <strong>Interactions:</strong> Records of your interactions with us, e.g., if you send email feedback, ask a technical question, or report a problem.
                    </li>
                    <li>
                        <strong>Website Usage:</strong> We may record details of how you use our website, such as your IP address, operating system, products you search for, and products you purchase. We use this to improve our performance and tailor our services to you.
                    </li>
                </ul>

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

                <h2 className="text-2xl font-semibold mt-8 mb-4">How does Unispare use my personal information?</h2>
                <p className="mb-4">
                    Depending on how you use the Unispare site, your interactions with us, and the permissions you give us, we will use your personal information for:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li><strong>Order Fulfilment:</strong> To fulfil your orders and provide you with services.</li>
                    <li><strong>Account Management:</strong> To register you as a customer and maintain your account.</li>
                    <li><strong>Customer Support:</strong> To manage and respond to any queries or complaints you may have.</li>
                    <li><strong>Personalization:</strong> To personalize the Unispare site to you and show you content we think you will be most interested in.</li>
                    <li><strong>Security:</strong> To investigate fraud and, where necessary, to protect ourselves and third parties.</li>
                </ul>

                <h2 className="text-2xl font-semibold mt-8 mb-4">With whom does Unispare share my personal information?</h2>
                <p className="mb-4">
                    Unispare may share information with certain selected third parties in order to operate our business:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li><strong>Service Providers:</strong> We provide information to our service providers acting on our behalf (for example, companies that provide digital marketing services, or payment processors) and to those involved in the delivery chain (freight forwarders, couriers).</li>
                    <li><strong>Government Authorities:</strong> We may share personal information with law enforcement or other governmental authorities, e.g., to report fraud or in response to a lawful request.</li>
                    <li><strong>Business Sale:</strong> In the event that we sell any business assets, the personal information of our customers may be disclosed to a potential buyer.</li>
                </ul>

                <h2 className="text-2xl font-semibold mt-8 mb-4">Security</h2>
                <p className="mb-4">
                    Unispare always aims to deliver the highest level of service and security to our customers. We use SSL encryption technology to protect your data during transactions. Your Unispare account information is password-protected so that only you have access to this personal information.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-4">Your Rights</h2>
                <p className="mb-4">
                    Under data protection law, you have the right to access, correct, request erasure, or object to our processing of your personal data. You can view and edit your Personal Profile information at any time through your account settings. If you have any unresolved concerns, please contact us.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
                <p className="mb-4">
                    For questions regarding this privacy notice or how we use your personal data, please contact us at support@unispare.in.
                </p>
            </div>
        </div>
    )
}

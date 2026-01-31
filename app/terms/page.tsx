import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Terms of Service | Unispare",
    description: "Terms of Service for Unispare - Read our terms and conditions for using our website and services.",
}

export default function TermsPage() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6 text-[#0F1111]">Terms of Service</h1>
            <div className="prose max-w-none text-[#0F1111]">
                <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>

                <h2 className="text-2xl font-semibold mt-8 mb-4">1. Agreement to Terms</h2>
                <p className="mb-4">
                    By accessing our website at https://unispare.in, you agree to be bound by these terms of service, all
                    applicable laws and regulations, and agree that you are responsible for compliance with any applicable local
                    laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-4">2. Use License</h2>
                <p className="mb-4">
                    Permission is granted to temporarily download one copy of the materials (information or software) on
                    Unispare's website for personal, non-commercial transitory viewing only. This is the grant of a license, not
                    a transfer of title, and under this license you may not:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>modify or copy the materials;</li>
                    <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
                    <li>attempt to decompile or reverse engineer any software contained on Unispare's website;</li>
                    <li>remove any copyright or other proprietary notations from the materials; or</li>
                    <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
                </ul>
                <p className="mb-6">
                    This license shall automatically terminate if you violate any of these restrictions and may be terminated by
                    Unispare at any time. Upon terminating your viewing of these materials or upon the termination of this
                    license, you must destroy any downloaded materials in your possession whether in electronic or printed
                    format.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-4">3. Disclaimer</h2>
                <p className="mb-4">
                    The materials on Unispare's website are provided on an 'as is' basis. Unispare makes no warranties,
                    expressed or implied, and hereby disclaims and negates all other warranties including, without limitation,
                    implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement
                    of intellectual property or other violation of rights.
                </p>
                <p className="mb-6">
                    Further, Unispare does not warrant or make any representations concerning the accuracy, likely results, or
                    reliability of the use of the materials on its website or otherwise relating to such materials or on any
                    sites linked to this site.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-4">4. Limitations</h2>
                <p className="mb-6">
                    In no event shall Unispare or its suppliers be liable for any damages (including, without limitation,
                    damages for loss of data or profit, or due to business interruption) arising out of the use or inability to
                    use the materials on Unispare's website, even if Unispare or a Unispare authorized representative has been
                    notified orally or in writing of the possibility of such damage. Because some jurisdictions do not allow
                    limitations on implied warranties, or limitations of liability for consequential or incidental damages,
                    these limitations may not apply to you.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-4">5. Accuracy of Materials</h2>
                <p className="mb-6">
                    The materials appearing on Unispare's website could include technical, typographical, or photographic
                    errors. Unispare does not warrant that any of the materials on its website are accurate, complete or
                    current. Unispare may make changes to the materials contained on its website at any time without notice.
                    However Unispare does not make any commitment to update the materials.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-4">6. Links</h2>
                <p className="mb-6">
                    Unispare has not reviewed all of the sites linked to its website and is not responsible for the contents of
                    any such linked site. The inclusion of any link does not imply endorsement by Unispare of the site. Use of
                    any such linked website is at the user's own risk.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-4">7. Modifications</h2>
                <p className="mb-6">
                    Unispare may revise these terms of service for its website at any time without notice. By using this
                    website you are agreeing to be bound by the then current version of these terms of service.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-4">8. Governing Law</h2>
                <p className="mb-6">
                    These terms and conditions are governed by and construed in accordance with the laws of India and you
                    irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
                </p>
            </div>
        </div>
    )
}

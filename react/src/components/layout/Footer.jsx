import logo from '@assets/images/logo.png'
import MainLayout from '@components/layout/MainLayout'

function Footer() {
    const linkSections = [
        {
            title: 'Quick Links',
            links: [
                'Home',
                'Best Sellers',
                'Offers & Deals',
                'Contact Us',
                'FAQs',
            ],
        },
        {
            title: 'Need Help?',
            links: [
                'Delivery Information',
                'Return & Refund Policy',
                'Payment Methods',
                'Track your Order',
                'Contact Us',
            ],
        },
        {
            title: 'Follow Us',
            links: ['Instagram', 'Twitter', 'Facebook', 'YouTube'],
        },
    ]

    return (
        <div className="mt-10 border-t border-gray-200 bg-secondary">
            <MainLayout>
                <div className="flex flex-col items-start justify-between gap-10 py-10 text-gray-500 border-b md:flex-row border-gray-500/30">
                    <div>
                        <img
                            className="w-34 md:w-32"
                            src={logo}
                            alt="logo"
                            width={100}
                        />
                        <p className="max-w-[410px] mt-6">
                            Lorem ipsum dolor sit amet consectetur, adipisicing
                            elit. Rerum unde quaerat eveniet cumque accusamus
                            atque qui error quo enim fugiat?
                        </p>
                    </div>
                    <div className="flex flex-wrap justify-between w-full md:w-[45%] gap-5">
                        {linkSections.map((section, index) => (
                            <div key={index}>
                                <h3 className="mb-2 text-base font-semibold text-gray-900 md:mb-5">
                                    {section.title}
                                </h3>
                                <ul className="space-y-1 text-sm">
                                    {section.links.map((link, i) => (
                                        <li key={i}>
                                            <a
                                                href="#"
                                                className="transition hover:underline"
                                            >
                                                {link}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
                <p className="py-4 text-sm text-center md:text-base text-gray-500/80">
                    © 2025 Ecomall. All rights reserved.
                </p>
            </MainLayout>
        </div>
    )
}

export default Footer

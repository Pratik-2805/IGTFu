"use client";

export function Footer() {
    return (
        <footer className="py-12 px-4 bg-foreground text-background">
            <div className="max-w-6xl mx-auto">
                {/* Top Section */}
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
                    {/* Column 1: About */}
                    <div>
                        <h4 className="font-serif text-xl sm:text-2xl mb-4 font-bold">
                            Indo Global Trade Fair
                        </h4>
                        <p className="text-sm text-background/80 leading-relaxed">
                            Connecting Indian Enterprise with the World through strategic B2B
                            trade platforms.
                        </p>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm sm:text-base text-background/80">
                            <li>
                                <a
                                    href="/about"
                                    className="hover:text-background transition-colors"
                                >
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/exhibition"
                                    className="hover:text-background transition-colors"
                                >
                                    Exhibition
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/categories"
                                    className="hover:text-background transition-colors"
                                >
                                    Categories
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/gallery"
                                    className="hover:text-background transition-colors"
                                >
                                    Gallery
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Contact */}
                    <div>
                        <h4 className="font-semibold text-lg mb-4">Contact</h4>
                        <div className="space-y-2 text-sm sm:text-base text-background/80">
                            <p>Email: support@indoglobaltradefair.com</p>
                            <p>Phone: +91 91373 44068</p>
                            <a
                                href="/career"
                                className="hover:text-background transition-colors"
                            >
                                Career Opportunities
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="text-center pt-8 border-t border-background/20 text-background/70 text-sm">
                    <p>© 2025 Indo Global Trade Fair. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

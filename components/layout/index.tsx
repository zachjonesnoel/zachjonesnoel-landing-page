import Meta from "./meta";
import { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import useScroll from "@/lib/hooks/use-scroll";
import { Inter } from '@next/font/google'
const inter = Inter({ subsets: ['latin'] })
import styles from '@/styles/page.module.css'

export default function Layout({
    meta,
    children,
}: {
    meta?: {
        title?: string;
        description?: string;
        image?: string;
    };
    children: ReactNode;
}) {
    const scrolled = useScroll(50);

    return (
        <>
            <Meta {...meta} />
            <div className="fixed h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-cyan-100" />
            <div
                className={`fixed top-0 w-full ${scrolled
                    ? "border-b border-gray-200 bg-white/50 backdrop-blur-xl"
                    : "bg-white/0"
                    } z-30 transition-all`}
            >
                <div className="mx-5 flex h-16 max-w-screen-xl items-center justify-between xl:mx-auto">
                        <Link href="/" className="flex items-center font-display text-2xl">
                            <Image
                                src="/favicon.ico"
                                alt="zachjonesnoel"
                                width="30"
                                height="30"
                                className="mr-2 rounded-sm"
                            ></Image>
                            <p>zachjonesnoel</p>
                        </Link>
                    <div>
                    </div>
                </div>
            </div>
            <main className="flex w-full flex-col items-center justify-center py-32">
                {children}
            </main>
            <div className="absolute w-full border-t border-gray-200 bg-white py-5 text-center">
                <div className="mx-auto flex items-center justify-center space-x-5 px-5">
                    <div className={styles.grid}>

                        <a
                            href="https://portfolio.zachjonesnoel.com/#/"
                            className="flex max-w-fit items-center justify-center space-x-2 mt-2 mb-2 rounded-full border border-gray-300 bg-white px-5 py-2 text-sm text-gray-600 shadow-md transition-colors hover:border-gray-800"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <p className={inter.className}>
                                Portfolio
                            </p>
                        </a>

                        <a
                            href="https://twitter.com/zachjonesnoel"
                            className="flex max-w-fit items-center justify-center space-x-2 mt-2 mb-2 rounded-full border border-gray-300 bg-white px-5 py-2 text-sm text-gray-600 shadow-md transition-colors hover:border-gray-800"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <p className={inter.className}>
                                Twitter
                            </p>
                        </a>

                        <a
                            href="https://www.linkedin.com/in/jones-zachariah-noel-n"
                            className="flex max-w-fit items-center justify-center space-x-2 mt-2 mb-2 rounded-full border border-gray-300 bg-white px-5 py-2 text-sm text-gray-600 shadow-md transition-colors hover:border-gray-800"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <p className={inter.className}>
                                LinkedIn
                            </p>
                        </a>

                        <a
                            href="https://github.com/zachjonesnoel"
                            className="flex max-w-fit items-center justify-center space-x-2 mt-2 mb-2 rounded-full border border-gray-300 bg-white px-5 py-2 text-sm text-gray-600 shadow-md transition-colors hover:border-gray-800"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <p className={inter.className}>
                                GitHub
                            </p>
                        </a>

                        <a
                            href="https://dev.to/zachjonesnoel"
                            className="flex max-w-fit items-center justify-center space-x-2 mt-2 mb-2 rounded-full border border-gray-300 bg-white px-5 py-2 text-sm text-gray-600 shadow-md transition-colors hover:border-gray-800"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <p className={inter.className}>
                                Dev.To
                            </p>
                        </a>

                        <a
                            href="https://www.instagram.com/zachariah_jones_noel/"
                            className="flex max-w-fit items-center justify-center space-x-2 mt-2 mb-2 rounded-full border border-gray-300 bg-white px-5 py-2 text-sm text-gray-600 shadow-md transition-colors hover:border-gray-800"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <p className={inter.className}>
                                Instagram
                            </p>
                        </a>
                    </div>
                </div>
                &nbsp;
                &nbsp;
                <p className="text-gray-500">
                    Built with Next.js, Tailwind and AWS Amplify 😍 😎
                    <a
                        className="font-medium text-gray-800 underline transition-colors"
                        href="https://twitter.com/zachjonesnoel"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        @zachjonesnoel
                    </a>
                </p>
            </div>
        </>
    );
}
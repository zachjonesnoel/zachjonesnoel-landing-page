import React from "react";

const Footer = () => {
    return (
        <div className="mt-12 lg:mt-18 sm:pb-36 sm:py-12 py-6">
            <div className="max-w-4xl px-4 mx-auto text-gray-800 dark:text-white">
                <div className="pb-8 mb-2 border-t-2 border-gray-300 dark:border-white-300"></div>
                <div className="flex flex-col justify-between lg:flex-row items-center">
                    <p>Built with Next.js, Tailwind and Amplify 😍😎</p>
                    <div className="flex flex-wrap pt-2 sm:space-x-4 space-x-2 font-medium lg:pt-0">
                        <a
                            href="https://portfolio.zachjonesnoel.com/#/"
                            className={"transition-colors hover:text-red-500"}
                            target="_blank"
                            rel="noreferrer"
                        >
                            Portfolio
                        </a>
                        <a
                            href="https://twitter.com/ZachjNOEL"
                            className={"transition-colors hover:text-red-500"}
                            target="_blank"
                            rel="noreferrer"
                        >
                            Twitter
                        </a>
                        <a
                            href="https://www.linkedin.com/in/jones-zachariah-noel-n"
                            className={"transition-colors hover:text-red-500"}
                            target="_blank"
                            rel="noreferrer"
                        >
                            LinkedIn
                        </a>
                        <a
                            href="https://github.com/zachjonesnoel"
                            className={"transition-colors hover:text-red-500"}
                            target="_blank"
                            rel="noreferrer"
                        >
                            GitHub
                        </a>
                        <a
                            href="https://dev.to/zachjonesnoel"
                            className={"transition-colors hover:text-red-500"}
                            target="_blank"
                            rel="noreferrer"
                        >
                            DEV.to
                        </a>
                        <a
                            href="https://www.instagram.com/zachariah_jones_noel/"
                            className={"transition-colors hover:text-red-500"}
                            target="_blank"
                            rel="noreferrer"
                        >
                            Instagram
                        </a>
                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer;
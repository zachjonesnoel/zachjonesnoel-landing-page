import React from "react"
import Image from "next/image"
import profile from "../public/profile1.png"
import Link from 'next/link'

const About = () => {
    return (
        <div className="container px-4 mx-auto">
            <div className="lg:space-x-5 lg:flex lg:flex-row item-center lg:-mx-4 flex flex-col-reverse text-center lg:text-left">
                <div className="lg:px-4 lg:mt-12 ">
                    <h1 className="text-2xl font-bold text-gray-900 lg:text-5xl dark:text-white">
                        Hey there,
                    </h1>
                    <div className="mt-6 text-gray-800 dark:text-white">
                        <p className="title">
                          I'm  <span className="mb-4 font-bold"> Jones Zachariah Noel N</span > a.k.a <span className="mb-4 font-bold"> zachjonesnoel</span>
                        </p>
                        <p className="mb-4">
                           AWS Serverless Architect | Developer | Technical Writer | Home Chef | Photographer
                        </p>
                        <p className="mb-4">
                           Currently AWS Architect - Serverless / Developer @ <b>Mobil80 Solutions and Services Pvt Ltd.</b> And contributor for <b>AWS ASEAN Community</b>.
                        </p>
                        <p className="mb-4 description">
                           Get in touch with me on <a href="https://www.linkedin.com/in/jones-zachariah-noel-n">LinkedIn</a>, <a href="https://twitter.com/ZachjNOEL">Twitter </a> 
                           if you are looking for AWS brainstroming, solution architecting with AWS serverless tech stack, Open source projects with AWS, VueJS, ReactJS.
                        </p>
                        
                        <div className="flex flex-row align-center justify-center rounded-md mt-6 shadow">
                                <a
                                  href="https://www.buymeacoffee.com/zachjonesnoel"
                                  className=" flex items-center justify-center px-8 py-3 bg-red-400 hover:bg-red-400 rounded-md mr-1"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {' '}
                                  <img src="https://cdn.buymeacoffee.com/buttons/v2/default-red.png" alt="Buy Me A Coffee" className="logo" />
                                </a>
                            
                              <a href="https://portfolio.zachjonesnoel.com/#/"  target="_blank" className="flex items-center ml-1 justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-400 hover:bg-red-400 md:py-4 md:text-lg md:px-10">
                                Portfolio
                              </a>
                            
                        </div>
                    </div>
                </div>
                <div className="flex-shrink-0 lg:mt-12 lg:px-4 mb-10">
                    <Image
                        src={profile}
                        alt="Profile"
                        priority={true}
                        className="rounded-full"
                        width={250}
                        height={250}
                        placeholder="blur"
                    />
                </div>
            </div>
            <style jsx>{`
                .description a {
                    color: #0070f3;
                    text-decoration: none;
                }
                .logo {
                    height: 5em;
                    text-align: center;
                    display: block;
                    justify-content: center;
                    align-items: center;
                    margin: auto;
                }
            `}</style>
        </div>
        
    )
}

export default About;
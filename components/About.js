import React from "react"
import Image from "next/image"
import profile from "../public/profile1.png"
import Link from 'next/link'

const About = () => {
    return (
        <div className="container px-4 mx-auto">
            <div className="lg:space-x-5 lg:flex lg:flex-row item-center lg:-mx-4 flex flex-col-reverse text-center lg:text-left ">
                <div className="lg:px-4 lg:mt-12 ">
                    <h1 className="text-2xl font-bold text-gray-900 lg:text-5xl dark:text-white">
                        👋 Hey there,
                    </h1>
                    <div className="mt-6 text-gray-800 dark:text-white">
                        <p className="title">
                          I'm  <span className="mb-4 font-bold"> Jones Zachariah Noel N</span > a.k.a <span className="mb-4 font-bold"> zachjonesnoel</span>.
                        </p>
                        <p className="mb-4 text-center">
                           Developer Relations | AWS Community Builder 🚀 | AWS Serverless Architect ⚡ | Serverless Advocacy 🥑 | Full-Stack Cloud Developer 👨‍💻 | Technical Writer 📜 | Home Chef 👨‍🍳 | Photographer 📷 
                        </p>
                        <p className="mb-4 description">
                        A <b>Senior Developer Advocate</b> experiencing DevRel ecospace at <b><a href="https://www.freshworks.com/">Freshworks</a></b>. Previous being part of the start-up Mobil80 Solutions based in Bengaluru, India enjoyed and learnt a lot with the multiple caps that I got to wear transitioning from a full-stack developer to Cloud Architect for Serverless! 
                        <br/>
                        An AWS Community Builder who loves to interact with community which has helped me learn and share my knowledge. I write about AWS Serverless and also talk about new features and announcements from AWS.
                        <br/>
                        Speaker and contributor at various AWS forums - <b>AWS UGs, AWS re:Skill, AWS Community Day, AWS Summit India</b> boosting about Serverless. 
                        <br/>
                        Feel free to reach out to me for anything, would love to chat about AWS, Serverless, technology, football and everything else. 
                        </p>
                        <p className="mb-4 description">
                           Get in touch with me on <a href="https://www.linkedin.com/in/jones-zachariah-noel-n">LinkedIn</a>, <a href="https://twitter.com/ZachjNOEL">Twitter </a> 
                           if you are looking for AWS brainstroming, solution architecting with AWS serverless tech stack, Open source projects with AWS, VueJS, ReactJS. And I'm open for collaborations!
                        </p>
                        <p className="mb-4 description">
                            Do subscribe to my <a href="https://www.getrevue.co/profile/zachjonesnoel">Newsletter : "<b>Everything AWS, Serverless and Architectures ☁️🚀👨‍💻</b></a> if you want to stay on top of latest happenings in <i>AWS, Serverless and different architecture patterns</i>; the issues are scheduled for the mid of the month and end of the month.
                        </p>
                        
                        <div className="flex flex-row align-center justify-center rounded-md mt-6 shadow">
                                <a
                                  href="https://www.buymeacoffee.com/zachjonesnoel"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {' '}
                                  <img src="https://cdn.buymeacoffee.com/buttons/v2/default-red.png" alt="Buy Me A Coffee" className="logo" />
                                </a>
                            
                              {/* <a href="https://portfolio.zachjonesnoel.com/#/"  target="_blank" className="flex items-center ml-1 justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-400 hover:bg-red-400 md:py-4 md:text-lg md:px-10">
                                Portfolio
                              </a> */}
                            
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
                    color: #ff5f5f;
                    text-decoration: none;
                    font-weight: bolder
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
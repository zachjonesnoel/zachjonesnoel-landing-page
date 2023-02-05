import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/page.module.css'
import Layout from "@/components/layout";
import { motion } from "framer-motion";
import { FADE_DOWN_ANIMATION_VARIANTS } from "@/lib/constants";
import Balancer from "react-wrap-balancer";

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <Layout>
      <motion.div
        className="max-w-xl px-5 xl:px-0"
        initial="hidden"
        whileInView="show"
        animate="show"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: 0.15,
            },
          },
        }}
      >
        <motion.h1
          className="bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent drop-shadow-sm md:text-7xl md:leading-[5rem]"
          variants={FADE_DOWN_ANIMATION_VARIANTS}
        >
          <Balancer>👋 Hey there!</Balancer>
        </motion.h1>
      </motion.div>
      <div className={styles.main}>
        <div className={styles.gridCenter}>
          <div className={styles.center}>
            <Image
              src="/zachjonesnoel headshot.png"
              alt="zachjonesnoel"
              width={580}
              height={337}
              priority
            />
          </div>
          <div className={styles.card}>
            <div className={inter.className}>
              <b>Jones Zachariah Noel N</b> a.k.a <b>zachjonesnoel</b> here!
            </div>
            &nbsp;
            <motion.div
              className="max-w-xl px-5 xl:px-0"
              initial="hidden"
              whileInView="show"
              animate="show"
              viewport={{ once: true }}
              variants={{
                hidden: {},
                show: {
                  transition: {
                    staggerChildren: 0.15,
                  },
                },
              }}
            >
              <motion.h1
                className="bg-gradient-to-br from-black to-stone-500 bg-clip-text  font-display font-bold tracking-[-0.02em] text-transparent drop-shadow-sm"
                variants={FADE_DOWN_ANIMATION_VARIANTS}
              >
                <Balancer>🥑 Developer Relations @ Freshworks</Balancer>
              </motion.h1>
              &nbsp;
              <motion.h1
                className="bg-gradient-to-br from-black to-stone-500 bg-clip-text  font-display font-bold tracking-[-0.02em] text-transparent drop-shadow-sm"
                variants={FADE_DOWN_ANIMATION_VARIANTS}
              >
                <Balancer>🦸‍♂️ AWS Serverless Hero</Balancer>
              </motion.h1>
              &nbsp;
              <motion.h1
                className="bg-gradient-to-br from-black to-stone-500 bg-clip-text  font-display font-bold tracking-[-0.02em] text-transparent drop-shadow-sm"
                variants={FADE_DOWN_ANIMATION_VARIANTS}
              >
                <Balancer>☁️ AWS Serverless Architect</Balancer>
              </motion.h1>
              &nbsp;
              <motion.h1
                className="bg-gradient-to-br from-black to-stone-500 bg-clip-text  font-display font-bold tracking-[-0.02em] text-transparent drop-shadow-sm"
                variants={FADE_DOWN_ANIMATION_VARIANTS}
              >
                <Balancer>🥑 Serverless Advocacy</Balancer>
              </motion.h1>
              &nbsp;
              <motion.h1
                className="bg-gradient-to-br from-black to-stone-500 bg-clip-text  font-display font-bold tracking-[-0.02em] text-transparent drop-shadow-sm"
                variants={FADE_DOWN_ANIMATION_VARIANTS}
              >
                <Balancer>👨‍💻 Full-Stack Cloud Developer</Balancer>
              </motion.h1>
              &nbsp;
              <motion.h1
                className="bg-gradient-to-br from-black to-stone-500 bg-clip-text  font-display font-bold tracking-[-0.02em] text-transparent drop-shadow-sm"
                variants={FADE_DOWN_ANIMATION_VARIANTS}
              >
                <Balancer>🚀 AWS UG Bengaluru Co-organizer</Balancer>
              </motion.h1>
              &nbsp;
              <motion.h1
                className="bg-gradient-to-br from-black to-stone-500 bg-clip-text  font-display font-bold tracking-[-0.02em] text-transparent drop-shadow-sm"
                variants={FADE_DOWN_ANIMATION_VARIANTS}
              >
                <Balancer>📜 Technical Writer</Balancer>
              </motion.h1>
              &nbsp;
              <motion.h1
                className="bg-gradient-to-br from-black to-stone-500 bg-clip-text  font-display font-bold tracking-[-0.02em] text-transparent drop-shadow-sm"
                variants={FADE_DOWN_ANIMATION_VARIANTS}
              >
                <Balancer>🎙️ Speaker</Balancer>
              </motion.h1>
              &nbsp;
              <motion.h1
                className="bg-gradient-to-br from-black to-stone-500 bg-clip-text  font-display font-bold tracking-[-0.02em] text-transparent drop-shadow-sm"
                variants={FADE_DOWN_ANIMATION_VARIANTS}
              >
                <Balancer>👨‍🍳 Home Chef</Balancer>
              </motion.h1>
              &nbsp;
              <motion.h1
                className="bg-gradient-to-br from-black to-stone-500 bg-clip-text  font-display font-bold tracking-[-0.02em] text-transparent drop-shadow-sm"
                variants={FADE_DOWN_ANIMATION_VARIANTS}
              >
                <Balancer>📷 Photographer</Balancer>
              </motion.h1>
            </motion.div>
          </div>
        </div>
        <div className={styles.card}>
        <div className={styles.cardCenter}>
          <div className={styles.longDescription}>
            <p >
              A Senior Developer Advocate experiencing DevRel ecospace at <a href="https://www.freshworks.com/" target="_blank" rel="noopener noreferrer" >Freshworks</a>. Previous being part of the start-up Mobil80 Solutions based in Bengaluru, India enjoyed and learnt a lot with the multiple caps that I got to wear transitioning from a full-stack developer to Cloud Architect for Serverless!
            </p>
            &nbsp;
            <p>
              An <a href="https://aws.amazon.com/developer/community/heroes/jones-zachariah-noel/" target="_blank" rel="noopener noreferrer">AWS Serverless Hero</a> and <a href="https://aws.amazon.com/developer/community/community-builders/community-builders-directory/?cb-cards.sort-by=item.additionalFields.cbName&cb-cards.sort-order=asc&awsf.builder-category=*all&awsf.location=*all&awsf.year=*all&cb-cards.q=jones%2Bzachariah%2Bnoel&cb-cards.q_operator=AND" target="_blank" rel="noopener noreferrer">AWS Community Builder</a> alumni who loves to interact with community which has helped me learn and share my knowledge. I write about AWS Serverless and also talk about new features and announcements from AWS.
              Speaker and contributor at various AWS forums - <b>AWS UGs, AWS re:Skill, AWS Community Day, AWS Summit India</b> boosting about Serverless.
            </p>
            &nbsp;
            <p>
              Do subscribe to my Newsletter : <a href="https://everythingawsserverless.substack.com/" target="_blank" rel="noopener noreferrer">The Serverless Terminal - Everything AWS, Serverless and Architectures ☁️🚀👨‍💻 </a>if you want to stay on top of latest happenings in AWS, Serverless and different architecture patterns; the issues are scheduled for the mid of the month and end of the month.
            </p>
            &nbsp;
            <p>
            Feel free to reach out to me for anything, would love to chat about AWS, Serverless, technology, football and everything else.
            </p>
          </div>
        </div>
        </div>
      </div>
    </Layout>
  )
}

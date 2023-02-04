import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from './page.module.css'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p>
          zachjonesnoel
        </p>
        <div>
        <Image
            src="/favicon.ico"
            alt="zachjonesnoel"
            width={50}
            height={50}
            priority
          />
        </div>
      </div>
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
          <h2>
            👋 Hey there!
          </h2>
          <div className={inter.className}>
            <b>Jones Zachariah Noel N</b> a.k.a <b>zachjonesnoel</b> here!
          </div>
          &nbsp;
          <div className={styles.description}>
            <h3>🥑 Developer Relations </h3> &nbsp;
            <h3>🦸‍♂️ AWS Serverless Hero  </h3> &nbsp;
            <h3>☁️ AWS Serverless Architect </h3> &nbsp;
            <h3>🥑 Serverless Advocacy </h3>&nbsp;
            <h3>👨‍💻 Full-Stack Cloud Developer </h3> &nbsp;
            <h3>🚀 AWS UG Bengaluru Co-organizer </h3> &nbsp;
            <h3>📜 Technical Writer  </h3>&nbsp;
            <h3>🎙️ Speaker </h3>&nbsp;
            <h3>👨‍🍳 Home Chef  </h3>&nbsp;
            <h3>📷 Photographer </h3>
          </div>
        </div>
      </div>
      <div className={styles.center}>
        <div
          className={styles.cardCenter}
        >
          <div
            className={styles.longDescription}
          >
            <p >
              A Senior Developer Advocate experiencing DevRel ecospace at <a href="https://www.freshworks.com/">Freshworks</a>. Previous being part of the start-up Mobil80 Solutions based in Bengaluru, India enjoyed and learnt a lot with the multiple caps that I got to wear transitioning from a full-stack developer to Cloud Architect for Serverless!
            </p>
            &nbsp;
            <p>
              An <a href="https://aws.amazon.com/developer/community/heroes/jones-zachariah-noel/">AWS Serverless Hero</a> and <a href="https://aws.amazon.com/developer/community/community-builders/community-builders-directory/?cb-cards.sort-by=item.additionalFields.cbName&cb-cards.sort-order=asc&awsf.builder-category=*all&awsf.location=*all&awsf.year=*all&cb-cards.q=jones%2Bzachariah%2Bnoel&cb-cards.q_operator=AND">AWS Community Builder</a> alumni who loves to interact with community which has helped me learn and share my knowledge. I write about AWS Serverless and also talk about new features and announcements from AWS.
              Speaker and contributor at various AWS forums - <b>AWS UGs, AWS re:Skill, AWS Community Day, AWS Summit India</b> boosting about Serverless.
              Feel free to reach out to me for anything, would love to chat about AWS, Serverless, technology, football and everything else.
            </p>
            &nbsp;
            <p>
            Do subscribe to my Newsletter : <a href="https://everythingawsserverless.substack.com/">The Serverless Terminal - Everything AWS, Serverless and Architectures ☁️🚀👨‍💻 </a>if you want to stay on top of latest happenings in AWS, Serverless and different architecture patterns; the issues are scheduled for the mid of the month and end of the month.
            </p>
          </div>
        </div>
      </div>
      <div className={styles.center}>
        Built with Next.js, Tailwind and AWS Amplify 😍😎
      </div>
      <div className={styles.grid}>
        <a
          href="https://portfolio.zachjonesnoel.com/#/"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={inter.className}>
            Portfolio <span>-&gt;</span>
          </h2>
        </a>

        <a
          href="https://twitter.com/zachjonesnoel"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={inter.className}>
            Twitter <span>-&gt;</span>
          </h2>
        </a>

        <a
          href="https://www.linkedin.com/in/jones-zachariah-noel-n"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={inter.className}>
            LinkedIn <span>-&gt;</span>
          </h2>
        </a>

        <a
          href="https://github.com/zachjonesnoel"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={inter.className}>
            GitHub <span>-&gt;</span>
          </h2>
        </a>

        <a
          href="https://dev.to/zachjonesnoel"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={inter.className}>
            Dev.To <span>-&gt;</span>
          </h2>
        </a>

        <a
          href="https://www.instagram.com/zachariah_jones_noel/"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={inter.className}>
            Instagram <span>-&gt;</span>
          </h2>
        </a>

        {/* <a
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={inter.className}>
            Deploy <span>-&gt;</span>
          </h2>
          <p className={inter.className}>
            Instantly deploy your Next.js site to a shareable URL with Vercel.
          </p>
        </a> */}
      </div>
    </main>
  )
}

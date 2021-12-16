import Head from 'next/head'
import About from "../components/About";
import Contact from "../components/Contact";
import IntroBackground from "../components/IntroBackground";
import AnimatedBackground from "../components/AnimatedBackground";

export default function Home() {
  return (
    <div className="space-y-14 lg:space-y-24">
      <Head>
        <title>zachjonesnoel</title>
        <link rel="icon" href="/favicon.ico" />
        <script type="text/javascript" src="/public/rum.js"></script>
      </Head>
      <AnimatedBackground/>
      <main className="max-w-4xl mx-auto mt-16 antialiased">
        <IntroBackground/>
        <About/>
      </main>
    </div>
  )
}

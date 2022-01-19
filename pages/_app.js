
import 'tailwindcss/tailwind.css'
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
// import Image from "next/image"
// import wave from "../public/wave.svg"
import { ThemeProvider } from 'next-themes'

function MyApp({ Component, pageProps }) {
  return <>
    <ThemeProvider attribute="class" enableSystem={false}>
      <Navigation />
      <Component {...pageProps} />
      {/* <Image
        src={wave}
        layout="responsive"
        objectFit="cover"
        quality={100}
      /> */}
      <Footer />
    </ThemeProvider>
  </>
}

export default MyApp
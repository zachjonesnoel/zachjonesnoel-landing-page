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
        {/* <script type="text/javascript" src="/public/rum.js"></script> */}
        <script
                    type='text/javascript'
                    dangerouslySetInnerHTML={{ __html: `
                    (function(n,i,v,r,s,c,x,z){x=window.AwsRumClient={q:[],n:n,i:i,v:v,r:r,c:c};window[n]=function(c,p){x.q.push({c:c,p:p});};z=document.createElement('script');z.async=true;z.src=s;document.head.insertBefore(z,document.getElementsByTagName('script')[0]);})('cwr','55b0ca8b-d756-4c7a-9880-e1a7a0232da7','1.0.0','us-east-1','https://client.rum.us-east-1.amazonaws.com/1.0.2/cwr.js',{sessionSampleRate:1,guestRoleArn:"arn:aws:iam::228628157461:role/RUM-Monitor-us-east-1-228628157461-6340433669361-Unauth",identityPoolId:"us-east-1:1068a686-9ff4-4c47-b2ad-577d860ceb9d",endpoint:"https://dataplane.rum.us-east-1.amazonaws.com",telemetries:["performance","errors","http"],allowCookies:true,enableXRay:false});
                  ` }}
                />
      </Head>
      <AnimatedBackground/>
      <main className="max-w-4xl mx-auto mt-16 antialiased">
        <IntroBackground/>
        <About/>
      </main>
    </div>
  )
}

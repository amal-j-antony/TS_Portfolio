import { Button } from "@/components/ui/button"
import GradientWaves from "./GradientWaves"
import { useNavigate } from "react-router"
import Dock from "./Dock"
import SocialsMenu from "./Socials"




function Home() {
    const nav = useNavigate()



    return (
        <>

            <main className="w-full min-h-screen h-full flex flex-col items-center justify-center">
                {/* <section className="fixed left-10 inset-y-0 my-50 rounded-2xl bg-primary/5 p-5">
                    s
                </section> */}
                <section className="fixed top-0 w-full h-full">
                    <GradientWaves
                        horizonColor="#5227FF"
                        waveColor="#FF9FFC"
                        crestColor="#FFFFFF"
                        speed={0.4}
                        amplitude={2.5}
                        waveScale={0.6}
                        waveRatio={0.9}
                        swell={35}
                        turbulence={20}
                        tilt={1.11}
                        zoom={1}
                        height={5.5}
                        fogDepth={15}
                        detail="medium"
                        brightness={1}
                        opacity={1}
                        mouseInteraction={false}
                        parallaxStrength={0.5}
                        grain
                        grainIntensity={0.05}
                    />
                </section>

                <section className="z-1 w-full  flex-col flex gap-3 justify-center items-center ">
                    <h1 className="text-5xl font-bold">Amal.j</h1>
                    <span className="text-xl font-bold">Full Stack Developer</span>
                    <div className="grid grid-cols-3 gap-5 mt-10">
                        <Button onClick={() => nav('/blog')} variant={"outline"} size={"xl"} className="">Blog</Button>
                        <Button onClick={() => nav('/projects')} variant={"outline"} size={"xl"} className="">Projects</Button>
                        <Button variant={'outline'} size={'xl'} >Socials</Button>
                    </div>

                </section>

                <SocialsMenu />
                <Dock />
            </main>
        </>
    )
}

export default Home


{/* {
                        toggle.toggles.socials && <SocialsMenu />
                    } */}
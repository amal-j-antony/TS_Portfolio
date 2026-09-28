import { FaGithub } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";


export default function SocialsMenu(){

    return(
        <main className="mt-10 rounded-xl flex gap-5 justify-center z-1">
            <a href="https://github.com/amal-j-antony" target="_blank" className="text-4xl cursor-pointer hover:animate-pulse  p-2" >
               <FaGithub />
            </a>
            <a href="https://www.linkedin.com/in/amal-j-antony/" target="_blank" className="text-4xl cursor-pointer hover:animate-pulse  p-2" >
               <FaLinkedinIn />
            </a>
            <button className="text-4xl cursor-pointer hover:animate-pulse  p-2" >
               <FaSquareXTwitter />
            </button>
        </main>
    )
}
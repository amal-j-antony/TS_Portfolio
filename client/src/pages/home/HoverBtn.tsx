import { FaBookAtlas, FaLink } from "react-icons/fa6";
import { HoverCard, HoverCardTrigger } from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button";
import { MdOutlineContactEmergency } from "react-icons/md";
import { TbInfoHexagonFilled } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

const buttonIcons = {
    bookList: {
        icon: FaBookAtlas,
        text: "Book List",
        navigation: ""
    },
    linkArchive: {
        icon: FaLink,
        text: "Link Archive",
        navigation: "link-archive"
    },
    contacts: {
        icon: MdOutlineContactEmergency,
        text: "Contacts",
        navigation: ""
    },
    about: {
        icon: TbInfoHexagonFilled,
        text: "About",
        navigation: ""
    }
}



type ButtonName = keyof typeof buttonIcons

interface HoverBtnProps{
    buttonName: ButtonName
}

export function HoverBtn({
    buttonName
}:HoverBtnProps) {
    const nav = useNavigate()
    const Icon = buttonIcons[buttonName].icon
    const Text = buttonIcons[buttonName].text
    const navigation = buttonIcons[buttonName].navigation
    
    return (
        <HoverCardTrigger>
            <Button onClick={()=> nav(`/${navigation}`)} variant={'transparent'} size={'iconLg'} ><Icon className="size-7" /></Button>
            <HoverCard>
                {Text}
            </HoverCard>
        </HoverCardTrigger>
    )
}
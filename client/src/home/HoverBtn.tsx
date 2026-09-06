import { FaBookAtlas, FaLink } from "react-icons/fa6";
import { HoverCard, HoverCardTrigger } from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button";
import { MdOutlineContactEmergency } from "react-icons/md";
import { TbInfoHexagonFilled } from "react-icons/tb";

const buttonIcons = {
    bookList: {
        icon: FaBookAtlas,
        text: "Book List"
    },
    linkArchive: {
        icon: FaLink,
        text: "Link Archive"
    },
    contacts: {
        icon: MdOutlineContactEmergency,
        text: "Contacts"
    },
    about: {
        icon: TbInfoHexagonFilled,
        text: "About"
    }
}



type ButtonName = keyof typeof buttonIcons

interface HoverBtnProps{
    buttonName: ButtonName
}

export function HoverBtn({
    buttonName
}:HoverBtnProps) {

    const Icon = buttonIcons[buttonName].icon
    const Text = buttonIcons[buttonName].text
    
    return (
        <HoverCardTrigger>
            <Button variant={'transparent'} size={'iconLg'} ><Icon className="size-7" /></Button>
            <HoverCard>
                {Text}
            </HoverCard>
        </HoverCardTrigger>
    )
}
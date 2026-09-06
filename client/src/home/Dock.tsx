
import { HoverBtn } from "./HoverBtn"


export default function Dock() {
    return (
        <section className="fixed bottom-10 inset-x-0 flex justify-center ">
            <div className="grid grid-cols-4 gap-5 bg-primary/10 border rounded-2xl p-2">
                <HoverBtn buttonName="bookList" />
                <HoverBtn buttonName="linkArchive" />                
                <HoverBtn buttonName="contacts" />   
                <HoverBtn buttonName="about" />   
            </div>
        </section>
    )
}


{/* <Button variant={'transparent'} size={'lg'} >Contact</Button>
                <Button variant={'transparent'} size={'lg'} >About</Button> */}
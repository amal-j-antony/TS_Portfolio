import { Button } from "./ui/button";

export default function Header() {
    return (
        <section className="fixed bottom-10 inset-x-0 flex justify-center ">
            <div className="grid lg:grid-cols-4 gap-10 bg-primary/10 border rounded-2xl p-2">
                <Button variant={'transparent'} size={'lg'} >Book List</Button>
                <Button variant={'transparent'} size={'lg'} >Link Archive</Button>
                <Button variant={'transparent'} size={'lg'} >Contact</Button>
                <Button variant={'transparent'} size={'lg'} >About</Button>
            </div>
        </section>
    )
}
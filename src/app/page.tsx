import Authenticated from "./authenticated/page";

export default function Home() {
    return (
        <Authenticated>
            <h1>Home</h1>
        </Authenticated>
    );
}

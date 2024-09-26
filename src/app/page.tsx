import { redirect } from "next/navigation";
import Authenticated from "./authenticated/page";

export default function Home() {
    // Redirigir a /dashboard directamente desde el servidor
    redirect("/dashboard");

    return (
        <Authenticated>
            <h1>Home</h1>
        </Authenticated>
    );
}

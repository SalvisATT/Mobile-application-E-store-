import { useEffect } from "react";
import { Slot, router } from "expo-router";

export default function RootLayout() {
    useEffect(() => {
        router.replace("/login"); // Redirect to login
    }, []);

    return <Slot />;
}

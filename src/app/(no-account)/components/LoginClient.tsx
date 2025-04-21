"use client";

import { useEffect } from "react";

export default function LoginClient() {
    async function loadingTest() {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return "Victor";
    }

    useEffect(() => {
        loadingTest();
    }, []);

    return (
        <div>
            <span>LOGIN PAGE</span>
        </div>
    );
}

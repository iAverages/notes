import { Spinner } from "@chakra-ui/react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { type ReactNode, useEffect } from "react";

const publicRoutes = ["/login", "/error"] as const;

const isPublicRoute = (currentRoute: string) => {
    for (const route of publicRoutes) {
        if (currentRoute.startsWith(route)) return true;
    }
    return false;
};

const OnlyAuthenticated: React.FC<{ children: ReactNode }> = ({ children }) => {
    const session = useSession();
    const router = useRouter();

    useEffect(() => {
        if (!router.isReady || isPublicRoute(router.pathname)) return;
        if (session.status === "unauthenticated") {
            signIn();
        }
    }, [session.status, router]);

    if ((session.status === "unauthenticated" || session.status === "loading") && !isPublicRoute(router.pathname))
        return <Spinner />;

    return <>{children}</>;
};

export default OnlyAuthenticated;

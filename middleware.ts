import { authMiddleware } from "@clerk/nextjs";

// TODO: add auth for rest api
export default authMiddleware({
	publicRoutes: ["/", "/api/(.*)"],
});

export const config = {
	matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};

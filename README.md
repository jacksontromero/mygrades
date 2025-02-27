# TODO
## Feature Planning
2. Small visual tweaks, force bucket width, "Add a New Class" dialog is weirdly tall
3. Walk through! Probably gonna use shepard [shepard](https://github.com/shipshapecode/shepherd)
4. Improve search
    - Default name+number search
    - Pagination
    - Rank by # users and # inaccurate
    - Include created at date
    - Constrain "University/School" options? Think about this more
5. Create shareable template links for a published course
6. Allow users to delete their created courses, no edits unfortunately

## Collected User Feedback
- Did my edit change it for everyone else?
- Combo course name + number search (maybe as default)
- Show something when > 100% (allow it but visually show it)
- Walk Through for the whole website
- kofi
- Show why "Published Class" is greyed out - not logged in or already published/pulled from published
- Force bucket width even with zero classes, ugly as is
- Out of sync pop-up after publish class? Likely due to router.refresh() and server/client disagreeing on class.published
- Edit class number broken? Like just not saving/not showing in sidebar
- First user tour of interface - MOST NECESSARY THING
- Search similar classes after publishing, popup if potential duplicates
- Include "created at" date in search to solve outdated schema issue
- Users should be able to delete published classes but can't edit

# Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Drizzle](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.

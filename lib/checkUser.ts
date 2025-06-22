import { currentUser } from "@clerk/nextjs/server"
import { db } from "./db";
import { getUserByClerkId } from "./actions/user";

export const checkUser = async() => {
    const user = await currentUser();

    if (!user ) return null;

    try {
            const loggedInUser = await getUserByClerkId(user.id)

              if (loggedInUser) {
                return loggedInUser;
              }


              const name = `${user.firstName} ${user.lastName}`;

              const newUser = await db.user.create({
                data: {
                  clerkUserId: user.id,
                  name,
                  imageUrl: user.imageUrl,
                  email: user.emailAddresses[0].emailAddress,
                },
              });

              return newUser;
    } catch (error : any) {
        console.log(error.message);
      }

}
import { createThirdwebClient } from "thirdweb";

export const thirdwebclient = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
});

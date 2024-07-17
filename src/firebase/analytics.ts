import { getAnalytics } from "firebase/analytics";

import { app } from "./app";

export const analytics = getAnalytics(app);

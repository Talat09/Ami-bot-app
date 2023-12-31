import { createBrowserRouter } from "react-router-dom";

import Home from "../component/Home/Home";
import Answer from "../component/Answer/Answer";
import Main from "../layout/Main";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main></Main>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "/answer",
        element: <Answer></Answer>,
      },
    ],
  },
]);

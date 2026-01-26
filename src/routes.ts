import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/RootLayout";
import { ProductConfigurator } from "./components/ProductConfigurator";
import { OverviewPage } from "./components/OverviewPage";
import { CheckoutPage } from "./components/CheckoutPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: ProductConfigurator },
      { path: "overview", Component: OverviewPage },
      { path: "checkout", Component: CheckoutPage },
    ],
  },
]);

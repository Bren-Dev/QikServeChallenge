"use client"
import { Provider } from "react-redux";
import Navbar from "./components/navBar";
import Menu from "./components/menu";
import store from "./redux/store";

export default function Home() {
  return (
    <div>
      <Provider store={store}>
        <main>
          <Navbar />
          <Menu />
        </main>
      </Provider>
    </div>
  );
}

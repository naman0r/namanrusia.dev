import { useLayoutEffect, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import Terminal from "../components/Terminal";
import TopNav from "../components/TopNav";
import MyPicture from "../components/MyPicture";
import FooterMainPage from "../components/FooterMainPage";
import "../styles/App.css";

const DEST = "https://www.namanrusia.dev/";

const App = () => {
  const comp = useRef(null);
  useLayoutEffect(() => {
    window.scroll(0, 0);
  }, []);

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const redirectParam = searchParams.get("redirect");
    console.log("Redirect param:", redirectParam);

    // If redirect parameter is not "false", redirect to new website
    if (redirectParam == "nevergoingtohappen") {
      window.location.href = DEST;
    }
  }, [searchParams]);

  return (
    <div className="relative" ref={comp}>
      {/* <div
        id="intro-slider"
        class="h-screen p-10 absolute top-0 left-0 font-spaceGrotesk z-10 w-full flex flex-col gap-10 tracking-tight"
      >
        <h1 id="title-1" className="text-9xl">
          Student
        </h1>
        <h1 id="title-2" className="text-9xl">
          Software Enthusiast
        </h1>
        <h1 id="title-3" className="text-9xl">
          Aspiring Entrepreneur
        </h1>
      </div> */}
      <div
        className="h-screen flex bg-gray-950 justify-center place-items-center greeting"
        id="main-screen-1"
      >
        <h1 className="text-9xl font-bold font-spaceGrotesk blinking-cursor">
          &gt;Hi, I'm Naman.
        </h1>
        <p>📍 Boston, MA. Raised in 🇸🇬🇮🇳🇺🇸</p>

        {/*<p>Located in Boston, MA; Raised in Singapore, Singapore</p> */}
      </div>

      <div>
        {" "}
        <p className="flex justify-center items-center text-amber-800 font-extralight fade-in-text">
          Type in and mess around with the terminal! type 'help' to see
          available commands, and minimize or maximize it too.
        </p>
      </div>
      <div>
        <TopNav fadeIn={false} />
      </div>

      <div>
        <Terminal />
      </div>

      <div>
        <MyPicture />
      </div>
      <div>
        <FooterMainPage />
      </div>
    </div>
  );
};

export default App;

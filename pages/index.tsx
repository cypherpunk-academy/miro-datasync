import "dotenv/config";
import { GetServerSideProps } from "next";
import { useEffect } from "react";
import initMiro from "../services/initMiro";
import apiCall from "../services/apiCall";

export const getServerSideProps: GetServerSideProps =
  async function getServerSideProps({ req }) {
    const { miro } = initMiro(req);

    // redirect to auth url if user has not authorized the app
    if (!(await miro.isAuthorized(""))) {
      return {
        props: {
          boards: [],
          authUrl: miro.getAuthUrl(),
        },
      };
    }

    const api = miro.as("");

    const boards: string[] = [];

    for await (const board of api.getAllBoards()) {
      boards.push(board.name || "");
    }

    return {
      props: {
        boards,
      },
    };
  };

const createImageWithSdk = async () => {
  await window.miro.board.createImage({
    title: "This is an image",
    url: "https://mloxw9ne171q.i.optimole.com/cb:7qoA.3ae47/w:500/h:349/q:mauto/dpr:2.0/f:best/https://www.resolution.de/wp-content/uploads/2023/01/Out_Of_Office_Overview_Benefits_1.png",
    x: 0,
    y: 0,
    width: 800,
    rotation: 3,
  });
};

const getImageWithLink = async () => {
  console.log(11.21);
  const item = await apiCall("get", "/api/restRequest");

  console.log(11.22, { item });
};

export default function Main({
  boards,
  authUrl,
}: {
  boards: string[];
  authUrl?: string;
}) {
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has("panel")) return;

    window.miro.board.ui.on("icon:click", async () => {
      window.miro.board.ui.openPanel({
        url: `/?panel=1`,
      });
    });
  }, []);

  if (authUrl) {
    return (
      <div className="grid wrapper">
        <div className="cs1 ce12">
          <a className="button button-primary" href={authUrl}>
            Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="grid wrapper">
      <div className="cs1 ce12">
        <h1>Congratulations!</h1>
        <p>You've just created your first Miro app!</p>
        <p>This is a list of all the boards that your user has access to:</p>

        <ul>
          {boards.map((board, idx) => (
            <li key={idx}>{board}</li>
          ))}
        </ul>

        <p>
          To explore more and build your own app, see the Miro Developer
          Platform do cumentation.
        </p>
      </div>
      getImageWithLink
      <div className="cs1 ce12">
        <button className="button button-primary" onClick={createImageWithSdk}>
          Create an image
        </button>
        <button className="button button-primary" onClick={getImageWithLink}>
          Load url of image
        </button>
      </div>
    </div>
  );
}

import { STUDIO_SESSION, studioFetch } from "./net.js"

export const test = async () => {
  const response = await studioFetch(STUDIO_SESSION);
  const data = await response.json();
  console.log(data);
}

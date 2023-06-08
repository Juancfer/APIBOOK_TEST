import { app } from "./server";

const PORT = 3000;
export const appInstance = app.listen(PORT, () => {
  console.log(`Server levantado en el puerto ${PORT}`);
});

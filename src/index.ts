import { app } from "./app";
import { server } from "./server";

import { genKeyPair } from './generateToken'
 
    genKeyPair()
server(app);

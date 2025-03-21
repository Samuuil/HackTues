import { sdk } from "./src";

import { RoomsService } from "./src/services/implementations/Room";


console.log(await new RoomsService().getMemberByUsernameAndRoom("ff","huhu76"))
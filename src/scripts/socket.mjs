import CONSTANTS from "./constants.js";
import API from "./api.js";
import { debug } from "./lib/lib.js";
import { setSocket } from "../main.js";

// export let tokenFactionsSocket;

// export function registerSocket() {
// 	debug("Registered tokenFactionsSocket");
// 	if (tokenFactionsSocket) {
// 		return tokenFactionsSocket;
// 	}
// 	//@ts-ignore
// 	tokenFactionsSocket = socketlib.registerModule(CONSTANTS.MODULE_NAME);

// 	tokenFactionsSocket.register("clearGridFaction", (...args) => API.clearGridFactionArr(...args));

// 	setSocket(tokenFactionsSocket);
// 	return tokenFactionsSocket;
// }

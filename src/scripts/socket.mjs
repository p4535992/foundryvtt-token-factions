import CONSTANTS from "./constants.mjs";
import API from "./api.mjs";
import { debug } from "./lib/lib.mjs";
import { setSocket } from "../main.mjs";

// export let tokenFactionsSocket;

// export function registerSocket() {
// 	debug("Registered tokenFactionsSocket");
// 	if (tokenFactionsSocket) {
// 		return tokenFactionsSocket;
// 	}
//
// 	tokenFactionsSocket = socketlib.registerModule(CONSTANTS.MODULE_ID);

// 	tokenFactionsSocket.register("clearGridFaction", (...args) => API.clearGridFactionArr(...args));

// 	setSocket(tokenFactionsSocket);
// 	return tokenFactionsSocket;
// }

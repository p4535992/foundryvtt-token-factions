import CONSTANTS from "./constants";
import API from "./api";
import { debug } from "./lib/lib";
import { setSocket } from "../main";

export let tokenFactionsSocket;

export function registerSocket() {
	debug("Registered tokenFactionsSocket");
	if (tokenFactionsSocket) {
		return tokenFactionsSocket;
	}
	//@ts-ignore
	tokenFactionsSocket = socketlib.registerModule(CONSTANTS.MODULE_NAME);

	tokenFactionsSocket.register("clearGridFaction", (...args) => API.clearGridFactionArr(...args));

	setSocket(tokenFactionsSocket);
	return tokenFactionsSocket;
}

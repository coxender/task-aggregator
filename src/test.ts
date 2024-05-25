import { html } from "lit";
import { showDialog } from "./challenge";
let result = await showDialog("Test", html`<p>this is a test</p>`, [{ text: "pick me", value: "1" }]);
console.log(result);


import { html, render } from "lit";
import {v4 as uuidv4} from 'uuid';

/**
 * Creates a dialog, displays it to the user, waits for the user to press a button, deletes the dialog, and returns the button the pressed.
 * @param title The title of the dialog.
 * @param body The main body of the dialog. This can be anything that can be put into a lit template.
 * @param buttons A list of buttons and there associated values
 * @returns The value associated with the button the user clicked or undefined of the pressed escape to close the dialog.
 * @example
 * if (
 *   await showDialog(
 *     "Delete Files?",
 *     html`<p>
 *       Are you sure you want to delete ${selectedFiles.length} files?<br />
 *       They will be lost <strong>forever</strong>
 *     </p>`,
 *     [
 *       { text: "Cancel", value: false },
 *       { text: "Delete", value: true },
 *     ]
 *   )
 * ) {
 *   deleteSelectedFiles();
 * }
 */

async function showDialog<T>(
  title: string,
  body: unknown,
  buttons: { text: string; value: T }[]
): Promise<T | undefined> {
  let buttons_info = map(buttons, (button)=>{
    return {"id":"#${button.text}${uuid4()}}",
            "text": button.text,
            "value": button.value,
        }
  })
  return new Promise((resolve, reject) => {
    let template = html`<dialog>
      <h1>${title}</h1>
      <div>${body}</div>
      ${buttons_info.map((info) => html`<button id="${info.id}" value="${(info.value)}"> ${info.text} </button>`)}
    </dialog>`;
  render(template, document.body,);
  
  buttons_info.forEach(button => {
    
    button = document.getElementById(info.id)
    return button.addEventListener("onclick", (event) => button.value)
  });
})


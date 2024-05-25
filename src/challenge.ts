import { html, render } from "lit";
import { v4 as uuidv4 } from "uuid";

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

export async function showDialog<T>(
  title: string,
  body: unknown,
  buttons: { text: string; value: T }[]
): Promise<T | undefined> {
  // get buttons in one data structure wiht an id to reference later.
  // TODO: make this a type or class
  let buttons_info = buttons.map((button) => {
    let id = "#" + button.text + "-" + uuidv4();
    return { id: id, text: button.text, value: button.value };
  });
  return new Promise((resolve, reject) => {
    // create a dialog with a uuid to reference later to avoid collisions
    let dialogID = "#dialog-" + uuidv4();
    let template = html`<dialog id="${dialogID}" style="display:grid">
      <h1>${title}</h1>
      <div>${body}</div>
      ${buttons_info.map(
        (info) => html`<button id="${info.id}" value=${JSON.stringify(info.value)}>${info.text}</button>`
      )}
    </dialog>`;
    render(template, document.body);

    // get dialog and open it
    let dialog = document.getElementById(dialogID) as HTMLDialogElement;
    console.log(dialog);
    dialog.showModal();
    buttons_info.forEach((info) => {
      let buttonElement = document.getElementById(info.id) as HTMLButtonElement;
      buttonElement.addEventListener("onclick", () => {
        console.log("I was clicked");
        dialog.close();
        resolve(buttonElement.value as T);
      });
    });
  });
}

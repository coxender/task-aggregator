if ("launchQueue" in window && "files" in LaunchParams.prototype) {
  window.launchQueue.setConsumer((launchParams) => {
    // Nothing to do when the queue is empty.
    if (launchParams.files.length == 0) {
      return;
    }
    openFile(launchParams.files[0]);
  });
}

function openFile(fileHandle: FileSystemHandle) {
  console.log(fileHandle);
  // TODO
}

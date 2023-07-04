interface Window {
  launchQueue: LaunchQueue;
}

interface LaunchQueue {
  setConsumer(callback: (launchParams: LaunchParams) => void);
}

class LaunchParams {
  readonly files: FileSystemHandle[];
  readonly targetURL: string;
}

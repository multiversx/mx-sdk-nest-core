import { exec } from 'child_process';
import * as util from 'util';

const execPromise = util.promisify(exec);

export class StopAppsCommand {
  static async execute(): Promise<void> {
    const tmuxSessionName = 'nestjs-apps';

    try {
      await execPromise(`tmux has-session -t ${tmuxSessionName}`);
      console.log(`Session ${tmuxSessionName} exists. Stopping the session...`);

      await execPromise(`tmux kill-session -t ${tmuxSessionName}`);
      console.log(`Session ${tmuxSessionName} stopped successfully.`);
    } catch (error) {
      const err = error as Error;
      if (err.message.includes('no server running')) {
        console.log(`Session ${tmuxSessionName} does not exist.`);
      } else {
        console.error('Failed to stop the session:', err.message);
        process.exit(1);
      }
    }
  }
}

import * as MonoUtils from "@fermuch/monoutils";
import { getUrgentNotification, setUrgentNotification } from "./tools";

// based on settingsSchema @ package.json
type Config = {
  minutes: number;
  tags: string[];
  title: string;
  message?: string;
  action: string;
}

const conf = new MonoUtils.config.Config<Config>();
const OK_ACTION = 'alerta-manutencao:ok' as const;

function anyTagMatches(tags: string[], matchToTags: string[]): boolean {
  for (const tag of tags) {
    if (matchToTags.includes(tag)) {
      return true;
    }
  }

  return false;
}

let lastNotification = 0;

messages.on('onPeriodic', function() {
  if (getUrgentNotification()) {
    return;
  }

  const myId = MonoUtils.myID();
  const myLogin = MonoUtils.currentLogin() || '';
  const myTasks = env.project?.tasksManager?.pendingTasks?.filter(
    (t) =>
          [myId, myLogin, ''].includes(t.assignedTo)
      &&  anyTagMatches(t.tags || [], conf.get('tags', []))
  );

  const lastNotificationMinsSince = (Date.now() - lastNotification) / 1000 / 60;
  if (myTasks.length > 0 && lastNotificationMinsSince >= conf.get('minutes', 5)) {
    lastNotification = Date.now();
    setUrgentNotification({
      title: conf.get('title', 'Tarefa pendente'),
      message: conf.get('message', ''),
      urgent: true,
      actions: [{
        action: OK_ACTION,
        name: conf.get('action', 'OK'),
        payload: ''
      }]
    });
  }
});

messages.on('onCall', (id, _payload) => {
  if (id !== OK_ACTION) return;
  lastNotification = Date.now();
});

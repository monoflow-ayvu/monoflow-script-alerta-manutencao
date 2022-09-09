const read = require('fs').readFileSync;
const join = require('path').join;

function loadScript() {
  // import global script
  const script = read(join(__dirname, '..', 'dist', 'bundle.js')).toString('utf-8');
  eval(script);
}

const testTask = {
  $modelType: "telematree/Tasks/Task",
  $modelId: "fea818c1-c584-493d-96f4-4aa9d42ee365",
  updatedAt: 1661526754622,
  icon: "activity",
  show: true,
  iconType: "feather",
  createdAt: 1661526754615,
  order: 1000,
  quickActions: [],
  formId: "",
  tags: [
    "activity"
  ],
  done: false,
  assignedTo: "TEST",
  description: "",
  metadata: {},
  name: "Finalizar Movimentação de Materiais",
  webhooks: []
}

jest.useFakeTimers();

describe("onInit", () => {
  // clean listeners
  afterEach(() => {
    messages.removeAllListeners();
  });

  it('runs without errors', () => {
    loadScript();
    messages.emit('onInit');
  });

  it('shows a notification if there is a pending task assigned to us with matching tags', () => {
    getSettings = () => ({
      tags: ['activity'],
    });
    (env.project as any) = {
      tasksManager: {
        pendingTasks: [testTask],
      },
    };
    platform.setUrgentNotification = jest.fn();

    loadScript();
    messages.emit('onPeriodic');
    expect(platform.setUrgentNotification).toBeCalledTimes(1);
    expect((platform.setUrgentNotification as jest.Mock).mock.calls[0][0]).toBeTruthy();
  });

  it('shows notification again after 5 minutes of user pressing OK', () => {
    getSettings = () => ({
      tags: ['activity'],
    });
    (env.project as any) = {
      tasksManager: {
        pendingTasks: [testTask],
      },
    };
    platform.setUrgentNotification = jest.fn();

    loadScript();
    jest.setSystemTime(new Date('2022-09-09 00:00:00'));
    messages.emit('onPeriodic');
    expect(platform.setUrgentNotification).toBeCalledTimes(1);
    expect((platform.setUrgentNotification as jest.Mock).mock.calls[0][0]).toBeTruthy();

    // not enough time to show another (needs 5 min by default)
    jest.setSystemTime(new Date('2022-09-09 00:01:00'));
    messages.emit('onPeriodic');
    expect(platform.setUrgentNotification).toBeCalledTimes(1);

    // now it should!
    jest.setSystemTime(new Date('2022-09-09 00:05:01'));
    messages.emit('onPeriodic');
    expect(platform.setUrgentNotification).toBeCalledTimes(2);
  });

  it('only matches if the tags match', () => {
    getSettings = () => ({
      tags: ['not-activity'],
    });
    (env.project as any) = {
      tasksManager: {
        pendingTasks: [testTask],
      },
    };
    platform.setUrgentNotification = jest.fn();

    loadScript();
    messages.emit('onPeriodic');
    expect(platform.setUrgentNotification).toBeCalledTimes(0);
  });

  it('only matches if the assignedTo matches', () => {
    getSettings = () => ({
      tags: ['activity'],
    });
    (env.project as any) = {
      tasksManager: {
        pendingTasks: [{
          ...testTask,
          assignedTo: 'NOT-TEST'
        }],
      },
    };
    platform.setUrgentNotification = jest.fn();

    loadScript();
    messages.emit('onPeriodic');
    expect(platform.setUrgentNotification).toBeCalledTimes(0);
  });
});
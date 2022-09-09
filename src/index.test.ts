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

describe("onInit", () => {
  // clean listeners
  afterEach(() => {
    messages.removeAllListeners();
  });

  it('runs without errors', () => {
    loadScript();
    messages.emit('onInit');
  });

  xit('shows a notification if there is a pending task assigned to us with matching tags', () => { });
  xit('shows notification again after 5 minutes of user pressing OK', () => { });

  xit('only matches if the tags match', () => { });
  xit('only matches if the assignedTo matches', () => { });
  xit('only works if there is no notification', () => { });
});
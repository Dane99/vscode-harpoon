import { beforeEach } from "mocha";
import ActiveProjectService from "../../../service/active-project-service";
import WorkspaceService from "../../../service/workspace-service";
import * as assert from "assert";

suite("workspace service", () => {
  let workspaceService: WorkspaceService;
  let activeProjectService: ActiveProjectService;
  beforeEach(() => {
    activeProjectService = new ActiveProjectService();
    workspaceService = new WorkspaceService(activeProjectService);
  });

  test("can change editor", async () => {
    // const expected = "/home/tobiasz/dev/js/vscode/vscode-harpoon/package.json";
    const expected = `${process.cwd()}/package.json`;
    activeProjectService.addEditor({ fileName: expected, lastLine: 1 });
    const doc = await workspaceService.changeEditor(1)!;
    assert.strictEqual(doc.document.fileName, expected);
  });

  test("can change back and forth between editors", async () => {
    const packageJson = `${process.cwd()}/package.json`;
    const gitIgnore = `${process.cwd()}/.gitignore`;

    activeProjectService.addEditor({ fileName: packageJson, lastLine: 1 });
    const firstDoc = await workspaceService.changeEditor(1)!;
    const firstWorkspace = firstDoc.document.fileName;

    activeProjectService.addEditor({ fileName: gitIgnore, lastLine: 1 });
    const secondDoc = await workspaceService.changeEditor(2)!;
    const secondWorkspace = secondDoc.document.fileName;

    assert.strictEqual(secondWorkspace, gitIgnore);
    assert.notStrictEqual(firstWorkspace, secondWorkspace);
  });
});
